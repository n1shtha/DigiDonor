/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Gateway, Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const fs = require("fs");
const path = require("path");

async function registerOutlet(name, type) {
    try {
        // load the network configuration
        const ccpPath = path.resolve(
            __dirname,
            "..",
            "..",
            "..",
            "test-network",
            "organizations",
            "peerOrganizations",
            "org1.example.com",
            "connection-org1.json"
        );
        const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities["ca.org1.example.com"].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check to see if we've already enrolled the user.
        const outletIdentity = await wallet.get(name);
        if (outletIdentity) {
            console.log(
                `An identity for the outlet ${name} already exists in the wallet`
            );
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet.get("admin");
        if (!adminIdentity) {
            console.log(
                'An identity for the admin user "admin" does not exist in the wallet'
            );
            console.log("Run the enrollAdmin.js application before retrying");
            return;
        }

        // build a user object for authenticating with the CA
        const provider = wallet
            .getProviderRegistry()
            .getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, "admin");

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register(
            {
                // affiliation: affiliation,
                enrollmentID: name,
                role: "client",
            },
            adminUser
        );
        const enrollment = await ca.enroll({
            enrollmentID: name,
            enrollmentSecret: secret,
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: "Org1MSP",
            type: "X.509",
        };
        await wallet.put(name, x509Identity);
        //console.log(`Successfully registered user ${userID} and imported it into the wallet`);

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: name,
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannel");

        // Get the contract from the network.
        const contract = network.getContract("DigiDonor");

        // Register the user such that it reflects in the chaincode
        const registerOutletResponse = await contract.submitTransaction(
            "RegisterOutlet",
            name,
            type
        );

        if (registerOutletResponse) {
            console.log(
                `Successfully registered outlet ${name} of type ${type} and imported into the wallet.`
            );
        } else {
            console.log(registerOutletResponse.toString());
        }
        // Disconnect from the gateway after executing registration
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to register outlet ${name}: ${error}`);
        process.exit(1);
    }
}

module.exports = registerOutlet;
