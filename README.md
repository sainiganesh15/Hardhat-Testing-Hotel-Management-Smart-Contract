# Hardhat Testing (Hotel Management Smart Contract)

The contract is a **Hotel Management** smart contract that allows customers to book a room, check-in, view their rent, and checkout. The contract has an owner who can access all the functions, a receptionist who can view the rent of customers, and customers who can access specific functions.

The contract has global variables such as Owner, Receptionist, soloCustomers, duoCustomers, familyCustomers, customerRoomType, CustomerRecords, roomRent, and Rooms. The Rooms struct has properties like roomType, roomTypeCode, availableRoom, price, and rentPerHours.

## Prerequisites

Before you can run the tests, make sure you have the following installed:

- Node.js
- Hardhat

## Installation

1. For Hardhat Installation
``` 
npm init --yes
npm install --save-dev hardhat
```

2. For running hardhat sample project install these dependencies:
```
npm install --save-dev @nomiclabs/hardhat-ethers@^2.0.5 @nomiclabs/hardhat-waffle@^2.0.3 
npm install --save-dev chai@^4.3.6 ethereum-waffle@^3.4.4 ethers@^5.6.2 hardhat@^2.9.2
```

## Deploying Smart Contract to Localhost

1. Write your smart contract in Solidity and save it in the `contracts/` folder.

2. In the `hardhat.config.js` file, configure your local development network by adding the following:

```
require("@nomiclabs/hardhat-waffle")


module.exports = {
    solidity: "0.8.9",
    networks: {
      hardhat: {
        chainId: 1337,
      },
    },
  };
  ```

  3. In the `scripts/` folder, create a new script to deploy your contract to the local network:
  ```
 const { ethers } = require("hardhat");

async function main(){
    // here we are getting the instance of the contract
    const [deployer] = await ethers.getSigners();  //is used to get an array of signer objects

    const receptionistAddress = deployer.address;


    const Hotel = await ethers.getContractFactory("HotelManagement");
    const hotel = await Hotel.deploy(receptionistAddress);
    console.log("Hotel Management Smart Contract Address:", hotel.address);
}

main().then(()=>process.exit(0))
.catch((error)=>{
    console.error(error);
    process.exit(1);
})
```
4. Compile and deploy the smart contract using Hardhat

```
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost

``` 

This will deploy your smart contract to the local development network.
## Running the Tests

To run the tests, use the following command:

`npx hardhat test
`

This will run all the tests in the `test` folder.

## Tests
The tests are located in the `test` folder and cover the following scenarios:

Deployment
- should the the owner of the hotel
- should the the receptionist of the hotel
- Should set the room rents correctly
Rooms Availability
- should allow a customer to check in to a solo room 
- should allow a customer to check in to a duo room 
- should allow a customer to check in to a duo room
- should not allow tourist to chekIn if soloRooms is unavailable
- should not allow tourist to book solo room if he does not have enough balance 
- should not allow tourist to chekIn if duoRooms is unavailable
- should not allow tourist to book solo room if he does not have enough balance
- should not allow tourist to chekIn if familyRooms is unavailable
- should not allow tourist to book solo room if he does not have enough balance
- should update the record of tourist if he books solo room 
- should update the record of tourist if he books duo room 
- should update the record of tourist if he books family room 
View renvenue
-  total earning of the owner 
Withdraw Revenue
- transfer the totalRevenue in the owner contract (74can transfer the amount in his account
Change the receptionist      
- Only Manager can change the receptionist

## Conclusion
Writing unit tests for smart contracts is an essential part of the development process. Hardhat makes it easy to write and run tests, and can be used with a variety of testing frameworks.

In this repository, we have demonstrated how to write unit tests for a sample smart contract called **Hotel Management**.
