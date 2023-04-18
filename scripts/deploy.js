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