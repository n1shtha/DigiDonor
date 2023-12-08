/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

// modifying command line arguments allowed
let userID;
process.argv.forEach(function (val, index, array) {
    if (index === 2) userID = val;
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

    console.log('============= START : Checking Eligibility for Reward for User ===========');
    try {
        // Call CheckEligibility to validate if a particular registered user is eligible for a reward
        const RedeemRewardResponse = await contract.evaluateTransaction('CheckEligibility', userID);

        // If this returns false, user is not eligible according to the necessary conditions
        if (RedeemRewardResponse.toString() === 'false') {
            console.log(`User ${userID} is not eligible for a reward.`);
        } else {
            // User is eligible, proceed with transferring the reward
            const TransferReward = await contract.submitTransaction('TransferReward', userID, RedeemRewardResponse.toString());
            
            // const TransferReward = await contract.submitTransaction('TransferReward', userID, RedeemRewardResponse.toString());
            console.log(`User ${userID} is eligible for a reward.\n Reward ${TransferReward.toString()} has been transferred to the user from the university.`);
        }
       
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to redeem reward: ${error}`);
        process.exit(1);
    } 
    console.log('============= END : Checking Eligibility for Reward for User ===========');
}

main();
