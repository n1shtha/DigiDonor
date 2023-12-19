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

// // modifying command line arguments allowed
// let userID, userType;
// process.argv.forEach(function (val, index, array) {
//     if (index === 2) userID = val;
//     if (index === 3) userType = val; // 'user', 'university', or 'outlet'
// });

async function registerUser(username, password, userType) {
    try {
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

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities["ca.org1.example.com"].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check to see if we've already enrolled the user.
        const userIdentity = await wallet.get(userID);
        if (userIdentity) {
            console.log(
                `An identity for the user ${userID} already exists in the wallet`
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
                enrollmentID: userID,
                role: "client",
            },
            adminUser
        );
        const enrollment = await ca.enroll({
            enrollmentID: userID,
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
        await wallet.put(userID, x509Identity);
        //console.log(`Successfully registered user ${userID} and imported it into the wallet`);

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: userID,
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannel");

        // Get the contract from the network.
        const contract = network.getContract("DigiDonor");

        // Register the user such that it reflects in the chaincode
        const registerUserResponse = await contract.submitTransaction( "RegisterUser", username, password, userType);

        if (registerUserResponse) {
            console.log(
                `Successfully registered user ${userID} of type ${userType} and imported into the wallet.`
            );
        } else {
            console.log(registerUserResponse.toString());
        }
        // Disconnect from the gateway after executing registration
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to register user ${userID}: ${error}`);
        process.exit(1);
    }
}

module.exports = registerUser;