const express = require('express');
const fs = require('fs');
const cors = require('cors');

const registerUser = require('./registerUser.js');
const loginUser = require('./loginUser.js');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

app.get('/', function(req, res){
    res.send("Hello from the root application URL");
});

app.get('/test', function(req, res){
    res.send("Hello from the 'test' URL");
});

// app.use(express.json());

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
    const { username, password } = req.body;
    try {
        await loginUser(username, password);
        //await contract.submitTransaction('registerUser', username, password, userType);

        if (result) {
            res.send({ message: 'User registered successfully' });
          } else {
            res.status(409).send({ message: 'User already exists' });
          }
       } catch (error) {
          res.status(500).send({ message: error.toString() });
       }
      });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});