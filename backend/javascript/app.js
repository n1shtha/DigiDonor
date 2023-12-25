const express = require("express");
const { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const registerUser = require("./registerUser.js");
const registerOutlet = require("./registerOutlet.js");
const loginUser = require("./loginUser.js");
const getAllAssets = require("./getAllAssets.js");
const browsePrevReq = require("./browsePrevReq.js");
const raiseRequest = require("./raiseRequest.js");
const generateToken = require("./generateToken.js");
const listOpenRequests = require("./listOpenRequests.js");
const browsePrevDon = require("./browsePrevDon.js");
const genPledge = require("./pledgeGenerated.js");
const redeem = require("./redeem.js");

const app = express();
app.use(cors());
const PORT = 8080;

// var jsonParser = bodyParser.json();
// var textParser = app.use(bodyParser.text({ type: 'text/*' }));

app.use(bodyParser.json());
app.use(express.json());

app.get("/", async (req, res) => {
    try {
        await res.render("index", {});
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/signup", async (req, res) => {
    const { firstName, lastName, password } = req.body;
    try {
        await registerUser(firstName, lastName, password);
        //await contract.submitTransaction('registerUser', username, password, userType);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/login", async (req, res) => {
    const { username, password, userType } = req.body;
    try {
        await loginUser(username, password, userType);
        //await contract.submitTransaction('registerUser', username, password, userType);
        res.json({ success: true });
    } catch (error) {
        res.status(500).send({ message: error.toString() });
    }
});

app.post("/allassets", async (req, res) => {
    const { username } = req.body;
    try {
        const allAssetsData = await getAllAssets(username);
        //await contract.submitTransaction('registerUser', username, password, userType);
        res.json({ allAssetsData });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/previousrequests", async (req, res) => {
    const { username } = req.body;
    try {
        const prevRequestsData = await browsePrevReq(username);
        // console.log(JSON.parse(prevRequestsData)); Q: should we parse or not?
        res.json(JSON.parse(prevRequestsData));
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/allopenrequests", async (req, res) => {
    const { username } = req.body;
    try {
        const allOpenRequestsData = await listOpenRequests(username);
        // console.log(JSON.parse(prevRequestsData)); Q: should we parse or not?
        res.json(JSON.parse(allOpenRequestsData));
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/previousdonations", async (req, res) => {
    const { username } = req.body;
    try {
        const prevDonationsData = await browsePrevDon(username);
        // console.log(JSON.parse(prevRequestsData)); Q: should we parse or not?
        res.json(JSON.parse(prevDonationsData));
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/newrequest", async (req, res) => {
    const { reqID, username, amount, purpose } = req.body;
    try {
        const newRequest = await raiseRequest(reqID, username, amount, purpose);
        // res.json({ success: true });
        res.json({ newRequest });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/outletregistration", async (req, res) => {
    const { name, type } = req.body;
    try {
        await registerOutlet(name, type);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/generatetoken", async (req, res) => {
    const { username, amount } = req.body;
    try {
        const generatedTokens = await generateToken(username, amount);
        res.json({ generatedTokens });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/pledge", async (req, res) => {
    const { pledge, username } = req.body;
    console.log(pledge)
    try {
        const pledgeResponse = await genPledge(pledge, username);
        res.json(JSON.parse(pledgeResponse));
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/redeem", async (req, res) => {
    const { pledgeID, item, username, outlet } = req.body;
    
    try {
      const redeemResponse = await redeem(pledgeID, item, username, outlet);
      if (redeemResponse){
        res.json({ success: true, message: redeemResponse });
      }
      else{
        throw new Error(`Error redeeming pledge with ID ${pledgeID}.${JSON.parse(redeemResponse)}`);
      }
    } catch (error) {
      res.status(500).send({ message: error.toString() });
    }
  });

/** 

app.get('/users', textParser, async (req, res) => {
    console.log("Entered get request.");
    var username = req.body;
    console.log(username);
    res.send("true");
});

app.post('/users', textParser, async (req, res) => {
    console.log("Entered post request.");
    var username = req.body;
    console.log(username);
    try {
        var userType = await getUserType(username);
        console.log(userType);
        res.json(userType);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

*/

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
