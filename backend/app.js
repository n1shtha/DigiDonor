const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Gateway, Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());

const ccpPath = path.resolve(__dirname, '..', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

const gateway = new Gateway();
await gateway.connect(ccp, {
    wallet: await Wallets.newFileSystemWallet('./wallet'),
    identity: 'user1',
    discovery: { enabled: true, asLocalhost: true }
});

const network = await gateway.getNetwork('mychannel');

app.post('/signup', async (req, res) => {
    const { username, password, userType } = req.body;
    try {
        await contract.submitTransaction('registerUser', username, password, userType);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(8080, () => {
    console.log('Server running on http://localhost:8080');
});