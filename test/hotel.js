const { expect } = require("chai");
const { ethers } = require("hardhat");

// to run test write npx hardhat test

describe("HotelManagement Smart contract", function () {
  let Hotel;
  let hotel;
  let owner;
  let receptionist;
  let receptionist1
  let tourist1;
  let tourist2;
  let tourist3;
  let tourists;
  let soloRooms;
  let duoRooms;
  let familyRooms;

  beforeEach(async function () {
    Hotel = await ethers.getContractFactory("HotelManagement");
    [owner, receptionist, tourist1, tourist2, tourist3,receptionist1, ...tourists] =
      await ethers.getSigners();

    // Initialize room types
    soloRooms = {
      roomType: "Solo",
      roomTypeCode: 1,
      availableRoom: 15,
      price: ethers.utils.parseEther("1"),
      rentPerHours: ethers.utils.parseUnits("100", "wei"),
    };
    duoRooms = {
      roomType: "Duo",
      roomTypeCode: 2,
      availableRoom: 10,
      price: ethers.utils.parseEther("2"),
      rentPerHours: ethers.utils.parseUnits("200", "wei"),
    };
    familyRooms = {
      roomType: "Family",
      roomTypeCode: 3,
      availableRoom: 5,
      price: ethers.utils.parseEther("3"),
      rentPerHours: ethers.utils.parseUnits("300", "wei"),
    };

    hotel = await Hotel.connect(owner).deploy(receptionist.address);
  });
  describe("Deployment", function () {
    it("should the the owner of the hotel", async function () {
      expect(await hotel.Owner()).to.equal(owner.address);
    });
    it("should the the receptionist of the hotel", async function () {
      expect(await hotel.receiptionist()).to.equal(receptionist.address);
    });
    it("Should set the room rents correctly", async function () {
      const soloRent = ethers.utils.parseUnits("100", "wei");
      const duoRent = ethers.utils.parseUnits("200", "wei");
      const familiyRent = ethers.utils.parseUnits("300", "wei");
      expect(await hotel.roomRent(1)).to.equal(soloRent);
      expect(await hotel.roomRent(2)).to.equal(duoRent);
      expect(await hotel.roomRent(3)).to.equal(familiyRent);
    });
  });

  describe("Rooms Availability", function () {
    it("should allow a customer to check in to a solo room", async function () {
      // Check in a guest to a solo room
      await hotel
        .connect(tourist1)
        .checkIn(soloRooms.roomTypeCode, { value: soloRooms.price });

      // Check that the guest's room type and guest were recorded
      const guestRoomType = await hotel.customerRoomType(tourist1.address);
      const guestrecord = await hotel.CustomerRecords(
        soloRooms.roomTypeCode,
        tourist1.address
      );
      expect(guestRoomType).to.equal(soloRooms.roomTypeCode);
      expect(guestrecord).to.not.equal(0);
    });

    it("should allow a customer to check in to a duo room", async function () {
      // Check in a guest to a solo room
      await hotel
        .connect(tourist2)
        .checkIn(duoRooms.roomTypeCode, { value: duoRooms.price });

      // Check that the guest's room type and guest were recorded
      const guestRoomType = await hotel.customerRoomType(tourist2.address);
      const guestrecord = await hotel.CustomerRecords(
        duoRooms.roomTypeCode,
        tourist2.address
      );
      expect(guestRoomType).to.equal(duoRooms.roomTypeCode);
      expect(guestrecord).to.not.equal(0);
    });

    it("should allow a customer to check in to a duo room", async function () {
      // Check in a guest to a solo room
      await hotel
        .connect(tourist3)
        .checkIn(familyRooms.roomTypeCode, { value: familyRooms.price });

      // Check that the guest's room type and guest were recorded
      const guestRoomType = await hotel.customerRoomType(tourist3.address);
      const guestrecord = await hotel.CustomerRecords(
        familyRooms.roomTypeCode,
        tourist3.address
      );
      expect(guestRoomType).to.equal(familyRooms.roomTypeCode);
      expect(guestrecord).to.not.equal(0);
    });

    it("should not allow tourist to chekIn if soloRooms is unavailable", async function(){
        //const availableRoom1 = 0;
        await hotel.connect(tourist1).checkIn(soloRooms.roomTypeCode, { value: soloRooms.price })
        //expect(soloRooms.availableRoom1).to.be.revertedWith("No Rooms available for this type, Please Check Other Type of Rooms");
        expect(hotel.connect(tourist1).checkIn(soloRooms.roomTypeCode, { value: soloRooms.price })).to.be.revertedWith("No Rooms available for this type, Please Check Other Type of Rooms");

    })

    it("should not allow tourist to book solo room if he does not have enough balance", async function(){
        const price = ethers.utils.parseEther("0.5");
        await expect(hotel.connect(tourist1).checkIn(soloRooms.roomTypeCode, { value: price })).to.be.revertedWith("Please enter a Valid amount, Solo Room cost 1 Ether");
    })

    it("should not allow tourist to chekIn if duoRooms is unavailable", async function(){
        await hotel.connect(tourist2).checkIn(duoRooms.roomTypeCode, { value: duoRooms.price })
        expect(hotel.connect(tourist2).checkIn(duoRooms.roomTypeCode, { value: duoRooms.price })).to.be.revertedWith("No Rooms available for this type, Please Check Other Type of Rooms");

    })

    it("should not allow tourist to book solo room if he does not have enough balance", async function(){
        const price = ethers.utils.parseEther("1");
        await expect(hotel.connect(tourist2).checkIn(duoRooms.roomTypeCode, { value: price })).to.be.revertedWith("Please enter a Valid amount, duo Room cost 2 Ether");
    })

    it("should not allow tourist to chekIn if familyRooms is unavailable", async function(){
        await hotel.connect(tourist3).checkIn(familyRooms.roomTypeCode, { value: familyRooms.price })
        expect(hotel.connect(tourist3).checkIn(familyRooms.roomTypeCode, { value: familyRooms.price })).to.be.revertedWith("No Rooms available for this type, Please Check Other Type of Rooms");

    })

    it("should not allow tourist to book solo room if he does not have enough balance", async function(){
        const price = ethers.utils.parseEther("2");
        await expect(hotel.connect(tourist3).checkIn(familyRooms.roomTypeCode, { value: price })).to.be.revertedWith("Please enter a Valid amount, family Room cost 3 Ether");
    })

    it("should update the record of tourist if he books solo room", async function() {
        const initialCustomerRecords = await hotel.CustomerRecords(1, tourist1.address);
        const initialCustomerRoomType = await hotel.customerRoomType(tourist1.address);
        await hotel.connect(tourist1).checkIn(1, { value: ethers.utils.parseEther("1") });
        const updatedCustomerRecords = await hotel.CustomerRecords(1, tourist1.address);
        const updatedCustomerRoomType = await hotel.customerRoomType(tourist1.address);
        expect(initialCustomerRecords).to.equal(0);
        expect(updatedCustomerRecords).to.not.equal(0);
        expect(initialCustomerRoomType).to.equal(0);
        expect(updatedCustomerRoomType).to.equal(1);
      });

      it("should update the record of tourist if he books duo room", async function() {
        const initialCustomerRecords = await hotel.CustomerRecords(1, tourist2.address);
        const initialCustomerRoomType = await hotel.customerRoomType(tourist2.address);
        await hotel.connect(tourist2).checkIn(2, { value: ethers.utils.parseEther("2") });
        const updatedCustomerRecords = await hotel.CustomerRecords(2, tourist2.address);
        const updatedCustomerRoomType = await hotel.customerRoomType(tourist2.address);
        expect(initialCustomerRecords).to.equal(0);
        expect(updatedCustomerRecords).to.not.equal(0);
        expect(initialCustomerRoomType).to.equal(0);
        expect(updatedCustomerRoomType).to.equal(2);
      });

    it("should update the record of tourist if he books family room", async function() {
        const initialCustomerRecords = await hotel.CustomerRecords(1, tourist3.address);
        const initialCustomerRoomType = await hotel.customerRoomType(tourist3.address);
        await hotel.connect(tourist3).checkIn(3, { value: ethers.utils.parseEther("3") });
        const updatedCustomerRecords = await hotel.CustomerRecords(3, tourist3.address);
        const updatedCustomerRoomType = await hotel.customerRoomType(tourist3.address);
        expect(initialCustomerRecords).to.equal(0);
        expect(updatedCustomerRecords).to.not.equal(0);
        expect(initialCustomerRoomType).to.equal(0);
        expect(updatedCustomerRoomType).to.equal(3);
      });
  });

  describe("View renvenue", function(){
    it("total earning of the owner", async function(){
        await hotel.connect(tourist1).checkIn(1, { value: ethers.utils.parseEther("1") });
        await hotel.connect(tourist2).checkIn(2, { value: ethers.utils.parseEther("2") });
        await hotel.connect(tourist3).checkIn(3, { value: ethers.utils.parseEther("3") });
        totalrevenue = ethers.utils.parseEther("6");
        expect(await hotel.connect(owner).viewRevenue()).to.equal(totalrevenue);
    })

    it("Only owner can see the revenue", async function(){
        await expect(hotel.connect(tourist1).viewRevenue()).to.be.revertedWith("Only Owner can access this function");
    })
  })

  describe("Withdraw Revenue", function(){

    it("transfer the totalRevenue in the owner contract", async function(){
        await hotel.connect(tourist1).checkIn(1, { value: ethers.utils.parseEther("1") });
        await hotel.connect(tourist2).checkIn(2, { value: ethers.utils.parseEther("2") });
        await hotel.connect(tourist3).checkIn(3, { value: ethers.utils.parseEther("3") });
        totalrevenue = ethers.utils.parseEther("6");
        await hotel.connect(owner).withdrawRevenue();
        //await expect(hotel.connect(owner).viewRevenue()).to.equal(totalrevenue);

    })

    it("Only owner of the contract can transfer the amount in his account", async function(){
        await expect(hotel.connect(tourist1).withdrawRevenue()).to.be.revertedWith("Only Owner can access this function");
    })
  })


  describe("Change the receptionist", function(){
    it("Only Manager can change the receptionist", async function(){
        await expect(hotel.connect(tourist1).changeReceptionist(receptionist1)).to.be.revertedWith("");
    })
  })
});
