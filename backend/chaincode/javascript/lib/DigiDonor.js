/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

// importing modules from Fabric Contract API
const { Contract } = require("fabric-contract-api");

// Other imports

// Creating necessary data structures

// list of users
var students = [
    {
        username: "",
        password: "",
        userType: "student",
    },
];
// list of donors
var donors = [
    {
        username: "",
        password: "",
        userType: "donor",
    },
];
// // list of outlets
var outlets = [
    {
        name: "",
        type: "",
    },
];

// extending the Fabric Contract
class DigiDonor extends Contract {
    // initLedger function to set up initial state of the ledger
    // called where? enrollAdmin? new file?
    async initLedger(ctx) {
        try {
            const initialAssets = [
                {
                    reqID: "Req_74e304adv",
                    recipient: "nishthadas",
                    amount: 100,
                    purpose: "meal",
                    outlet: "rasananda",
                    donor: "",
                    pledgeID: "",
                    tokensPledged: [],
                    status: "open",
                },
                {
                    reqID: "Req_wkvfagesy",
                    recipient: "nishthadas",
                    amount: 1000,
                    purpose: "stationary",
                    outlet: "stationary",
                    donor: "",
                    pledgeID: "",
                    tokensPledged: [],
                    status: "open",
                },
                {
                    reqID: "Req_n7iadfrme",
                    recipient: "nishthadas",
                    amount: 250,
                    purpose: "meal",
                    outlet: "fuelzone",
                    donor: "",
                    pledgeID: "",
                    tokensPledged: [],
                    status: "open",
                },
            ];

            // Iterate through assets and add them to the ledger
            for (const asset of initialAssets) {
                // Insert data into the world state
                await ctx.stub.putState(
                    asset.reqID,
                    Buffer.from(JSON.stringify(asset))
                );
            }
            return "Ledger initialized.";
        } catch (error) {
            return `Error initializing ledger: ${error.message}`;
        }
    }

    // StudentExists checks if student is already registered
    // called in RegisterUser function
    async StudentExists(username) {
        // Check if the user is in users dict
        const exists = students.some(
            (student) => student.username === username
        );
        return exists;
    }

    // DonorExists checks if donor is already registered
    // called in RegisterUser function
    async DonorExists(username) {
        // Check if the donor is in donors dict
        const exists = donors.some((donor) => donor.username === username);
        return exists;
    }

    // BrowsePrevDon Function to list closed donation requests that have a token and donor associated to them

    async BrowsePrevDon(ctx, username) {
        try {
            // Call GetAllAssets to retrieve all assets from the world state
            const allAssetsJSON = await this.GetAllAssets(ctx);
            const allAssets = JSON.parse(allAssetsJSON);

            let donor_donations = [];
            // Filter all requests with "status": "open" and "recipient" : username
            // Store resulting rewards in a user_requests array
            donor_donations = allAssets.filter(
                (asset) =>
                    asset.status === "pledged" && asset.donor === username // status changes to pledged once tokens have been pledged, can make this "closed" also? donor is appended to our initial request upon successful funding of a request
            );
            //.map((request) => JSON.stringify(request));

            // Return the filtered array
            return donor_donations;
        } catch (error) {
            return `Error listing previous donations: ${error.message}`;
        }
    }

    // BrowsePrevReq Function to list open donation requests that don't have a token and donor associated to them

    async BrowsePrevReq(ctx, username) {
        try {
            // Call GetAllAssets to retrieve all assets from the world state
            const allAssetsJSON = await this.GetAllAssets(ctx);
            const allAssets = JSON.parse(allAssetsJSON);

            let user_requests = [];
            // Filter all requests with "status": "open" and "recipient" : username
            // Store resulting rewards in a user_requests array
            user_requests = allAssets.filter(
                (asset) => asset.recipient === username // Q: students should be able to see both open and closed?
            );
            //.map((request) => JSON.stringify(request));

            // Return the filtered array
            return user_requests;
        } catch (error) {
            return `Error listing previous requests: ${error.message}`;
        }
    }

    // ListOpenRequests Function to list open donation requests

    async ListOpenRequests(ctx) {
        let open_requests = [];
        try {
            // Call GetAllAssets to retrieve all assets from the world state
            const allAssetsJSON = await this.GetAllAssets(ctx);
            const allAssets = JSON.parse(allAssetsJSON);

            // Filter all assets with "status": "open"
            // Store resulting rewards in the requests array
            open_requests = allAssets.filter(
                (asset) => asset.status === "open"
            );
            //.map((request) => JSON.stringify(request));

            // Return the filtered requests array
            return open_requests;
        } catch (error) {
            return `Error listing requests: ${error.message}`;
        }
    }

    // RaiseRequest Function to create a donation request from a student

    async RaiseRequest(ctx, reqID, username, amount, purpose, outlet) {
        try {
            // Create the request object
            const request = {
                reqID: reqID,
                recipient: username,
                amount: amount,
                purpose: purpose,
                outlet: outlet,
                status: "open",
            };

            // Insert into the ledger
            await ctx.stub.putState(
                reqID,
                Buffer.from(JSON.stringify(request))
            );
            return JSON.stringify(request);
        } catch (error) {
            return `Error raising request: ${error.message}`;
        }
    }

    // LoginUser Function log in users and donors based on values stored in dictionary

    async LoginUser(ctx, username, password, userType) {
        try {
            if (userType === "student") {
                const studentExists = await this.StudentExists(username);

                if (studentExists) {
                    // Check if login details are correct
                    const studentAuthenticated = students.find(
                        (student) =>
                            student.username === username &&
                            student.password === password
                    );

                    if (studentAuthenticated) {
                        console.log("Student authentication successful.");
                        // then we push student dashboard [TO-DO]
                    } else {
                        console.log(
                            "Student authentication failed. Please try again"
                        );
                    }
                } else {
                    console.log("Student record doesn't exist.");
                }
            } else if (userType === "donor") {
                const donorExists = await this.DonorExists(username);

                if (donorExists) {
                    // Check if login details are correct
                    const donorAuthenticated = donors.find(
                        (donor) =>
                            donor.username === username &&
                            donor.password === password
                    );

                    if (donorAuthenticated) {
                        console.log("Donor authentication successful.");
                        // then we push student dashboard [TO-DO]
                    } else {
                        console.log(
                            "Donor authentication failed. Please try again"
                        );
                    }
                } else {
                    console.log("Donor record doesn't exist.");
                }
            }
        } catch (error) {
            return `Error authenticating user: ${error.message}`;
        }
    }

    // RegisterUser Function to register users and donors based on userType

    async RegisterUser(ctx, username, password, userType) {
        try {
            if (userType === "student") {
                // Check if the student already exists
                const studentExists = await this.StudentExists(username);

                if (!studentExists) {
                    // Register the student
                    const newStudent = {
                        username: username,
                        password: password,
                        userType: userType,
                    };

                    students.push(newStudent);
                }
            } else if (userType === "donor") {
                // Check if the donor already exists
                const donorExists = await this.DonorExists(username);

                if (!donorExists) {
                    // Register the student
                    const newDonor = {
                        username: username,
                        password: password,
                        userType: userType,
                    };

                    donors.push(newDonor);
                }
            }
            const exists = studentExists || donorExists;

            // Throw a new error if the student/donor is already registered
            if (exists) {
                throw new Error(
                    `A user of ${userType} type with username ${username} already exists.`
                );
            }

            // Return ! of exists (if user does not exist, gives a "true" so the client function can go ahead)
            return !exists;
        } catch (error) {
            return `Error registering user: ${error.message}`;
        }
    }

    // OutletExists checks if outlet is already registered
    // called in RegisterOutlet function
    async OutletExists(name) {
        // Check if the user is in users dict
        const exists = outlets.some((outlet) => outlet.name === name);
        return exists;
    }

    // RegisterOutlet function
    async RegisterOutlet(ctx, name, type) {
        try {
            // Check if the user already exists (either as user or as an outlet or as an university)
            const outletExists = await this.OutletExists(name);

            if (!outletExists) {
                // Register the outlet
                const newOutlet = {
                    name: name,
                    type: type,
                };

                outlets.push(newOutlet);
            }

            // Throw a new error if the outlet is already registered
            if (outletExists) {
                throw new Error(
                    `An outlet with the name ${name} already exists.`
                );
            }

            // Return true if the outlet doesn't exist (successful registration)
            return !outletExists;
        } catch (error) {
            throw new Error(`Error registering outlet: ${error.message}`);
        }
    }

    // Update request with pledge details
    async PledgeGenerated(ctx, reqID, username, pledgeID, pledgedTokens) {
        // note: might have to parse pledgedTokens a certain way
        try {
            console.log(reqID);
            const reqBytes = await ctx.stub.getState(reqID);
            const request = JSON.parse(reqBytes.toString());

            const updatedFields = {
                donor: username,
                pledgeID: pledgeID,
                tokensPledged: pledgedTokens,
                status: "pledged",
            };

            Object.assign(request, updatedFields);

            // Insert into the ledger
            await ctx.stub.putState(
                reqID,
                Buffer.from(JSON.stringify(request))
            );

            return request;
        } catch (error) {
            return `Error raising request: ${error.message}`;
        }
    }

    async Redeem(ctx, pledgeID, username, item, outlet) {
        // Perform checks
        try {
            const outletExists = await this.OutletExists(outlet);

            const updatedFields = {
                status: "closed",
            };

            if (!outletExists) {
                throw new Error(`Outlet ${outlet} is not registered.`);
            }

            reqAsBytes = await ctx.stub.getState(pledgeID);
            const request = JSON.parse(reqBytes.toString());

            if (request.recipient === username) {

                Object.assign(request, updatedFields); // update status to closed
                return `Success! The money has been transferred to ${outlet} and the ${item} has been purchased! Enjoy and thank you for using DigiDonor`;
            }

            // Insert into the ledger
            await ctx.stub.putState(
                pledgeID,
                Buffer.from(JSON.stringify(request))
            );

        } catch (error) {
            return `Error redeem: ${error.message}`;
        }
    }

    // AssetExists function to check if an asset exists in the ledger based on its ID
    // called in CreateReward function
    async AssetExists(ctx, id) {
        const assetAsBytes = await ctx.stub.getState(id);
        return assetAsBytes && assetAsBytes.length > 0;
    }

    // GetAllAssets function returns all assets found in the world state.
    // called in ListRequests
    async GetAllAssets(ctx) {
        // Array of all assets in the ledger
        const allResponses = [];

        // Range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange("", "");
        let result = await iterator.next();

        // Iterate through the entire state of assets
        while (!result.done) {
            const strValue = Buffer.from(
                result.value.value.toString()
            ).toString("utf8");
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResponses.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResponses);
    }
}

module.exports = DigiDonor;
