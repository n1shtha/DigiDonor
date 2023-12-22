const express = require('express');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const registerUser = require('./registerUser.js');

const app = express();
app.use(cors());

const PORT = 8080;


app.use(bodyParser.json());

// const ccpPath = path.resolve(__dirname, '..', 'connection.json');
// const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
// const ccp = JSON.parse(ccpJSON);

// const gateway = new Gateway();
// await gateway.connect(ccp, {
//     wallet: await Wallets.newFileSystemWallet('./wallet'),
//     identity: 'user1',
//     discovery: { enabled: true, asLocalhost: true }
// });

// const network = await gateway.getNetwork('mychannel');

app.use(express.json());

app.post('/signup', async (req, res) => {
    const { firstName, lastName, password, userType } = req.body;
    try {
        await registerUser(firstName, lastName, password, userType);
        //await contract.submitTransaction('registerUser', username, password, userType);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});