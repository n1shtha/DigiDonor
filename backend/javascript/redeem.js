/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");

async function redeem(pledgeID, username, item, outlet) {
    // load the network configuration
    const ccpPath = path.resolve(
        __dirname,
        "..",
        "..",
        "test-network",
        "organizations",
        "peerOrganizations",
        "org1.example.com",
        "connection-org1.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(username);
    if (!identity) {
        console.log(
            `An identity for the user ${username} does not exist in the wallet`
        );
        console.log("Run the registerUser.js application before retrying");
        return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: username,
        discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork("mychannel");

    // Get the contract from the network.
    const contract = network.getContract("DigiDonor");

    try {
        const redeemResponse = await contract.submitTransaction(
            "Redeem",
            pledgeID,
            username,
            item,
            outlet
        );

        if (redeemResponse) {
            console.log(
                `Successfully redeemed the pledge with ID ${pledgeID}.`
            );
            return redeemResponse;
        } else {
            console.log(redeemResponse.toString());
        }

        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to redeem: ${error}`);
        process.exit(1);
    }
}

module.exports = redeem;
