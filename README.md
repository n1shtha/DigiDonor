# DigiDonor

A blockchain-based donation matching platform, built on the use case of Ashoka University.

The contributors of this project are Chanchal Bajoria and Nishtha Das.

# Project Description

The humanitarian sector suffers from critical challenges when it comes to aid/donation transactions. Transparency is often lacking in the management of donations, which has led to a commonly recurring pattern of misallocation, fraud and inefficiency. Donors usually have no way of verifying first-hand whether their funds are being used for the purpose they had intended. A large part of this is due to the centralisation of management, where an aid organisation or other middle-man routes all communication between donors and recipients. Blockchain-based solutions propose significant potential for improvement in donation management by carrying out secure and decentralised transactions. With our platform, DigiDonor, we aim to transform donation systems and improve transparency by removing the role of middle-men organisations, purpose-specific donations, real-time tracking and anonymity.

# Steps to run DigiDonor locally

1. Clone our repository here and shift its contents (blockchain-final-project) into your local fabric-samples directory
2. Run `bash networkDown.sh` in `fabric-samples/blockchain-final-project/backend` - if you were running a network earlier
3. Run `bash startFaric.sh` in `fabric-samples/blockchain-final-project/backend` to start up the network + docker containers and deploy chaincode
4. Run `node app.js` in `fabric-samples/blockchain-final-project/backend/javascript` to start up our backend client node server
5. Run `npm start` in `fabric-samples/blockchain-final-project/frontend` to start up our frontend client application
6. The application should be up and running, have fun and thank you for using Digidonor!
