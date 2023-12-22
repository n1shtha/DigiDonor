const express = require('express');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const registerUser = require('./registerUser.js');
const loginUser = require('./loginUser.js');
// const getUserType = require('./getUserType.js');

const app = express();
app.use(cors());

const PORT = 8080;


var jsonParser = bodyParser.json();
var textParser = app.use(bodyParser.text({ type: 'text/*' }));

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


app.get('/', async (req, res) => {
    try {
        await res.render('index', {});
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/signup', async (req, res) => {
    const { firstName, lastName, password } = req.body;
    try {
        await registerUser(firstName, lastName, password);
        //await contract.submitTransaction('registerUser', username, password, userType);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { username, password, userType } = req.body;
    try {
        await loginUser(username, password, userType);
        //await contract.submitTransaction('registerUser', username, password, userType);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
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