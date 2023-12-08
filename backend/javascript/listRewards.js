/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

let userID;
process.argv.forEach(function (val, index, array) {
    userID = array[2];
});

async function main() {
    // load the network configuration
    const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(userID);
    if (!identity) {
        console.log(`An identity for the user ${userID} does not exist in the wallet`);
        console.log('Run the registerUser.js application before retrying');
        return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: userID, discovery: { enabled: true, asLocalhost: true } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('BPHR');

    console.log('============= START : Listing Rewards ===========');
    try {
        // Create rewards
        console.log('============= START : Creating Rewards ===========');

        // Create upto 5 rewards
        const number = Math.floor(Math.random() * 5);

        // Create and log rewards
        for (let i = 0; i < number; i++){
            const rewardID = `reward${i}`;
            const createRewardResponse = await contract.submitTransaction('CreateReward', rewardID, userID, '12/10/2023', 'item', 'outlet', '100', 'isVerified');
            console.log(`Creating Reward ${rewardID}:`, createRewardResponse.toString());
        }

        console.log('============= START : Creating Rewards ===========');

        // List rewards created by this university
        const listRewardsResponse = await contract.evaluateTransaction('ListRewards', userID);
        console.log(`Listing Rewards for ${userID} university:\n`, listRewardsResponse.toString());

        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to list rewards: ${error}`);
        process.exit(1);
    } 
    console.log('============= END : Listing Rewards ===========');
}

main();
