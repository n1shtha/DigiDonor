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
let id, owner, outlet;
process.argv.forEach(function (val, index, array) {
    id = array[2];
    owner = array[3];
    outlet = array[4];
});

async function main() {
    // load the network configuration
    const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(owner);
    if (!identity) {
        console.log(`An identity for the user ${owner} does not exist in the wallet`);
        console.log('Run the registerUser.js application before retrying');
        return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: owner, discovery: { enabled: true, asLocalhost: true } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('DigiDonor');

    console.log('============= START : Verifying Purchase  ===========');
    try {
        // Verify the purchase made by user
        const verifyPurchase = await contract.submitTransaction('VerifyPurchase', id, owner, outlet);
        console.log(`Outlet ${outlet} is verifying purchase ${id} made by user ${owner}:\n`, verifyPurchase.toString());

        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to verify purchase: ${error}`);
        process.exit(1);
    } 
    console.log('============= END : Verifying Purchase ===========');
}

main();
