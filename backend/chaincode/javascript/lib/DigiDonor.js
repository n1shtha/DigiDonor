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
                    reqID: "R1",
                    recipient: "testuser",
                    amount: 100,
                    purpose: "meal",
                    donor: "",
                    pledgeID: "",
                    tokensPledged: [],
                    status: "open",
                },
                {
                    reqID: "R2",
                    recipient: "testuser",
                    amount: 1000,
                    purpose: "stationary",
                    donor: "",
                    pledgeID: "",
                    tokensPledged: [],
                    status: "open",
                },
                {
                    reqID: "R3",
                    recipient: "testuser",
                    amount: 250,
                    purpose: "meal",
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

    /** 
    // [TO-DO] DonorDonates Function to create tokens for a donor upon registration, based on a certain amount

    async GenerateToken(username) {
        // Calculate the number of tokens based on the amount (assuming each token is worth 10 units)

        const numberOfTokens = Math.floor(amount / 10);

        // Array to hold the tokens
        const tokens = [];

        // Generate tokens
        for (let i = 0; i < numberOfTokens; i++) {
            // Generate a random token ID
            const tokenID = Math.floor(Math.random() * 1000000);
            console.log(tokenID);

            // Create the token object
            const token = {
                ID: tokenID,
                donor: username,
                amount: 10, // Q: won't we have to change this to another var, units?
            };

            console.log(token);

            // Add the token to the array
            tokens.push(token);
        }

        return username;
    }
    */

    // [TO-DO] BrowsePrevDon Function to list closed donation requests that have a token and donor associated to them

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

    // [DONE] BrowsePrevReq Function to list open donation requests that don't have a token and donor associated to them

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

    // [DONE] ListOpenRequests Function to list open donation requests

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

    // [DONE] RaiseRequest Function to create a donation request from a student

    async RaiseRequest(ctx, reqID, username, amount, purpose) {
        try {
            // Create the request object
            const request = {
                reqID: reqID,
                recipient: username,
                amount: amount,
                purpose: purpose,
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

    // [DONE] LoginUser Function log in users and donors based on values stored in dictionary

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

    // [DONE] RegisterUser Function to register users and donors based on userType

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

    // StudentExists checks if student is already registered
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

    /** 
    // Update request with pledge details
    async PledgeGenerated(ctx, pledge) {
        try {
            // Retrieve the asset from the ledger
            const reqID = "ID_ykb8qif7y";
            console.log(pledge);
            const reqBytes = await ctx.stub.getState(reqID);
            const request = JSON.parse(reqBytes.toString());

            console.log(`request before update:`, request);

            request.donor = "testdonor";
            request.pledgeID = "1234";
            request.tokensPledged = [];
            request.status = "pledged";

            /** 
            request.donor = pledge.username;
            request.pledgeID = pledge.pledgeID;
            request.tokensPledged = pledge.pledgedTokens;
            request.status = "pledged";


            console.log(`request after update:`, request);

            /** 
            // Create the request object
            const updatedRequest = {
                reqID: request.reqID,
                recipient: request.username, // should we remove this?
                amount: request.amount,
                purpose: request.purpose,
                donor: pledge.username,
                pledgeID: pledge.pledgeID,
                tokensPledged: pledge.pledgedTokens,
                status: "pledged",
            };
            

            // Insert into the ledger
            await ctx.stub.putState(
                reqID,
                Buffer.from(JSON.stringify(request))
            );

            return JSON.stringify(request);
            // return JSON.parse(request);
            // return request;
        } catch (error) {
            return `Error raising request: ${error.message}`;
        }
    }
*/
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

            console.log(`request before update:`, request);

            Object.assign(request, updatedFields);

            // Insert into the ledger
            await ctx.stub.putState(
                reqID,
                Buffer.from(JSON.stringify(request))
            );

            console.log(`request after update:`, request);

            return request;
        } catch (error) {
            return `Error raising request: ${error.message}`;
        }
    }

    async Redeem(ctx, pledgeID, username, item, outlet) {
        // Perform checks
        try {
            outletExists = await this.OutletExists(outlet);

            if (!outletExists) {
                throw new Error(`Outlet ${outlet} is not registered.`);
            }

            reqAsBytes = await ctx.stub.getState(pledgeID);
            const request = JSON.parse(reqBytes.toString());

            if (request.recipient === username) {
                return `Success! The money has been transferred to ${outlet} and the ${item} has been purchased! Enjoy and thank you for using DigiDonor`;
            }
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

    // CreateReward issues a new reward to the world state with given details if the owner is the university
    // called in listRewards.js (client)
    async CreateReward(ctx, id, owner, date, item, outlet, value, isVerified) {
        try {
            // Query the ledger to see if the reward already exists
            const AssetExists = await this.AssetExists(ctx, id);
            if (AssetExists) {
                throw new Error(`The reward ${id} already exists`);
            }

            // Ensure the user trying to create the reward is a registered university
            const UniversityExists = await this.UniversityExists(owner);
            if (!UniversityExists) {
                throw new Error(
                    "Only registered university users can create rewards."
                );
            }

            // Create reward
            const reward = {
                ID: id,
                Owner: owner,
                Date: date,
                Reward: "yes", // set to 'yes' since it is a reward
                Item: item,
                Outlet: outlet,
                Value: value,
                Verified: isVerified,
            };

            // Insert into the ledger
            await ctx.stub.putState(id, Buffer.from(JSON.stringify(reward)));

            return JSON.stringify(reward);
        } catch (error) {
            return `Error creating reward: ${error.message}`;
        }
    }

    // GetAllAssets function returns all assets found in the world state.
    // called in ListRewards
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

    // ListRewards retrives all assets from world state, filters the rewards into an array, and also returns it as JSON string, for a given registered university
    // Called in listRewards.js (client)
    async ListRewards(ctx, owner) {
        try {
            // Call GetAllAssets to retrieve all assets from the world state
            const allAssetsJSON = await this.GetAllAssets(ctx);
            const allAssets = JSON.parse(allAssetsJSON);

            // Call UniversityExists to check if the owner is a registered university
            const universityExists = await this.UniversityExists(owner);
            if (!universityExists) {
                throw new Error(
                    `The user ${owner} is not a registered university and does not have any listed rewards.`
                );
            }

            // Filter all assets with "Reward": "yes" and "Owner" : owner
            // Store resulting rewards in the global reward array
            rewards = allAssets
                .filter(
                    (asset) => asset.Reward === "yes" && asset.Owner === owner
                )
                .map((reward) => JSON.stringify(reward));

            // Return the filtered rewards array as JSON strings
            return rewards.join("\n");
        } catch (error) {
            return `Error listing rewards: ${error.message}`;
        }
    }

    // RegisterPurchase function to allow users make transactions in order to register purchases
    // Called in registerPurchase.js (client)
    async RegisterPurchase(ctx, id, owner, date, item, outlet) {
        try {
            // Check if the user is registered
            const userExists = await this.UserExists(owner);
            if (!userExists) {
                throw new Error(`User with ID ${owner} is not registered.`);
            }

            // Check if the outlet is registered
            const outletExists = await this.OutletExists(outlet);
            if (!outletExists) {
                throw new Error(`Outlet with ID ${outlet} is not registered.`);
            }

            // Check if the asset already exists
            const assetExists = await this.AssetExists(ctx, id);
            if (assetExists) {
                throw new Error(`Asset with ID ${id} already exists.`);
            }

            // Create asset (transaction)
            const asset = {
                ID: id,
                Owner: owner,
                Date: date,
                Reward: "no", // 'no' indicates a purchase
                Item: item,
                Outlet: outlet,
                Verified: "no", // initialised to 'no'
            };

            // Insert the new asset into the ledger
            await ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));

            return JSON.stringify(asset);
        } catch (error) {
            return `Error registering purchase: ${error.message}`;
        }
    }

    // VerifyPurchase function to allow outlets to update transactions to verify a purchase made by a user
    // Called in verifyPurchase.js (client)
    async VerifyPurchase(ctx, id, owner, outlet) {
        try {
            // Check if the user is registered and the asset exists
            const userExists = await this.UserExists(owner);
            const assetExists = await this.AssetExists(ctx, id);

            if (!userExists) {
                throw new Error(`User ${owner} does not exist.`);
            }

            if (!assetExists) {
                throw new Error(`Asset with ID ${id} does not exist.`);
            }

            // Retrieve the asset from the ledger
            const assetBytes = await ctx.stub.getState(id);
            const asset = JSON.parse(assetBytes.toString());

            // Check if the outlet mentioned in the transaction (user purchase) is from a registered outlet
            const outletExists = await this.OutletExists(outlet);
            if (!outletExists) {
                throw new Error(`Outlet ${outlet} does not exist.`);
            }

            // Check if the asset belongs to the user
            if (asset.Owner !== owner) {
                throw new Error(
                    `Asset with ID ${id} does not belong to user ${owner}.`
                );
            }

            // Check if outlet mentioned in the transaction details and outlet verifying the given transaction are consistent
            if (asset.Outlet !== outlet) {
                throw new Error(
                    `Outlet with ID ${outlet} is not the same as the one in the registered asset, which is ${asset.Outlet}.`
                );
            }

            // Verify the asset
            asset.Verified = "yes";

            // Update the asset in the ledger
            await ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));

            return JSON.stringify(asset);
        } catch (error) {
            return `Error verifying purchase: ${error.message}`;
        }
    }

    // RedeemReward function to first validate if a user is eligible for reward
    // Call TransferReward to transfer a random listed reward to the user if eligible
    async CheckEligibility(ctx, userID) {
        try {
            // Check if user is registered
            const userExists = await this.UserExists(userID);
            if (!userExists) {
                throw new Error(`User ${userID} is not registered.`);
            }

            // Query string for finding assets for the user, ensuring the queried assets are verified purchases of 'juice'
            const queryString = {
                selector: {
                    Owner: userID,
                    Item: "juice",
                    Verified: "yes",
                },
            };

            // Query the assets based on the query string
            const queryResults = await this.queryWithQueryString(
                ctx,
                JSON.stringify(queryString)
            );
            const assets = JSON.parse(queryResults);

            // Sort the queried assets based on dates
            assets.sort((a, b) => {
                const dateAParts = a.Date.split("/").reverse().join("-");
                const dateBParts = b.Date.split("/").reverse().join("-");
                return new Date(dateAParts) - new Date(dateBParts);
            });

            // Check if user has 7 consecutive 'juice' purchases
            let consecutiveCount = 0;
            for (let i = 0; i < assets.length - 1; i++) {
                const currentDateParts = assets[i].Date.split("/");
                const nextDateParts = assets[i + 1].Date.split("/");

                const currentDate = new Date(
                    `${currentDateParts[2]}-${currentDateParts[1]}-${currentDateParts[0]}`
                );
                const nextDate = new Date(
                    `${nextDateParts[2]}-${nextDateParts[1]}-${nextDateParts[0]}`
                );

                const timeDifference = Math.abs(nextDate - currentDate);
                const daysDifference = Math.ceil(
                    timeDifference / (1000 * 60 * 60 * 24)
                );

                if (daysDifference === 1) {
                    consecutiveCount++;
                } else {
                    consecutiveCount = 0;
                }
                if (consecutiveCount === 6) {
                    // User is eligible for reward

                    // Generate a random index from the rewards array, which will contain those rewards as listed by a university
                    const index = Math.floor(Math.random() * rewards.length);
                    const reward = JSON.parse(rewards[index]);

                    // Move claimed reward to claims array
                    claims.push(reward);
                    rewards = rewards.filter((_, i) => i !== index);

                    return reward.ID;
                }
            }
            return false;
        } catch (error) {
            return `Error checking eligiblity: ${error.message}`;
        }
    }

    // Helper function to query assets based on a query string
    async queryWithQueryString(ctx, queryString) {
        const iterator = await ctx.stub.getQueryResult(queryString);
        const results = [];
        let result = await iterator.next();
        while (!result.done) {
            results.push(JSON.parse(result.value.value.toString("utf8")));
            result = await iterator.next();
        }
        return JSON.stringify(results);
    }

    // TransferReward function to transfer reward to a user
    // Called in redeemReward.js (client)
    async TransferReward(ctx, userID, rewardID) {
        try {
            // Check if the user is registered
            const userExists = await this.UserExists(userID);
            if (!userExists) {
                throw new Error(`User ${userID} is not registered.`);
            }

            // Check if the reward exists
            const rewardExists = await this.AssetExists(ctx, rewardID);
            if (!rewardExists) {
                throw new Error(`Reward ${rewardID} does not exist.`);
            }

            // Get the reward from the ledger
            const rewardAsBytes = await ctx.stub.getState(rewardID);
            const reward = JSON.parse(rewardAsBytes.toString());

            // Check if the reward is owned by a registered university
            const universityExists = await this.UniversityExists(reward.Owner);
            if (!universityExists) {
                throw new Error(
                    `The selected reward cannot be transferred as the owner ${reward.Owner} is not a registered university.`
                );
            }

            // Update the owner of the reward to the user
            reward.Owner = userID;

            // Update the reward on the ledger
            await ctx.stub.putState(
                rewardID,
                Buffer.from(JSON.stringify(reward))
            );

            return JSON.stringify(reward);
        } catch (error) {
            return `Error transferring reward: ${error.message}`;
        }
    }

    // // OutletExists checks if outlet is already registered
    // // called in RegisterUser function
    // async OutletExists(outletID) {
    //     // Check if the outlet is in outlets array
    //     return outlets.outletID;
    // }

    /** 
    // GetUserType Function to get the user type based on username
    async GetUserType(ctx, username) {
        try {
            const studentExists = await this.StudentExists(username);
            const donorExists = await this.DonorExists(username);

            if (studentExists) {
                const userType = "student";
                return userType
            } else if (donorExists) {
                const userType = "donor";
                return userType
            } else {
                console.log("Invalid username.");
            }
        } catch (error) {
            return `Error in getting user type: ${error.message}`;
        }
    }
    */
}

module.exports = DigiDonor;
