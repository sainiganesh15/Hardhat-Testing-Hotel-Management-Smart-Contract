// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract HotelManagement {
    // Global variable

    address payable public Owner;
    address public receiptionist;

    address[] public soloCustomers; // To keep the records for the solo customer
    address[] public duoCustomers; // To keep the records for the duo customer
    address[] public familyCustomers; // To keep the records for the family customer
    mapping(address => uint256) public customerRoomType;
    mapping(uint256 => mapping(address => uint256)) public CustomerRecords;
    mapping(uint256 => uint256) public roomRent;

    struct Rooms {
        string roomType;
        uint256 roomTypeCode;
        uint256 availableRoom;
        uint256 price;
        uint256 rentPerHours;
    }

    Rooms public soloRooms = Rooms("Solo", 1, 15, 1 ether, 100 wei);
    Rooms public duoRooms = Rooms("Duo", 2, 10, 2 ether, 200 wei);
    Rooms public familyRooms = Rooms("Family", 3, 5, 3 ether, 300 wei);

    constructor (address _setReceptionist) {
        Owner = payable(msg.sender);
        receiptionist = _setReceptionist;
        roomRent[1] = 100;
        roomRent[2] = 200;
        roomRent[3] = 300;
    }

    // ####################    Modifiers      ###################
    modifier onlyOwner(){
        require(msg.sender == Owner, "Only Owner can access this function");
        _;
    }

    modifier onlyCustomer(){
        require(customerRoomType[msg.sender]==1 || customerRoomType[msg.sender]==2 ||customerRoomType[msg.sender]==1,"Only Customer can access this" );
        _;
    }

    modifier onlyReceptionist(){
        require(msg.sender == receiptionist);
        _;
    }

    // ########################     Functions        #################

    function availableRoom() public view returns(uint256 SoloRooms, uint256 DuoRooms, uint256 FamilyRooms){
        return(soloRooms.availableRoom, duoRooms.availableRoom, familyRooms.availableRoom);
    }

    function checkIn(uint256 _roomTypeCode) public payable{
        if(_roomTypeCode == 1)
        {
            require(soloRooms.availableRoom > 0,"No Rooms available for this type, Please Check Other Type of Rooms");
            require(msg.value == soloRooms.price, "Please enter a Valid amount, Solo Room cost 1 Ether");
            customerRoomType[msg.sender] = _roomTypeCode;
            CustomerRecords[_roomTypeCode][msg.sender] = block.timestamp;
            soloCustomers.push(msg.sender);
            soloRooms.availableRoom --;
        }
        
        else if(_roomTypeCode == 2)
        {
            require(duoRooms.availableRoom > 0,"No Rooms available for this type, Please Check Other Type of Rooms");
            require(msg.value == duoRooms.price, "Please enter a Valid amount, duo Room cost 2 Ether");
            customerRoomType[msg.sender] = _roomTypeCode;
            CustomerRecords[_roomTypeCode][msg.sender] = block.timestamp;
            duoCustomers.push(msg.sender);
            duoRooms.availableRoom --;
        }

        else if(_roomTypeCode == 3)
        {
            require(familyRooms.availableRoom > 0,"No Rooms available for this type, Please Check Other Type of Rooms");
            require(msg.value == familyRooms.price, "Please enter a Valid amount, family Room cost 3 Ether");
            customerRoomType[msg.sender] = _roomTypeCode;
            CustomerRecords[_roomTypeCode][msg.sender] = block.timestamp;
            familyCustomers.push(msg.sender);
            familyRooms.availableRoom --;
        }
    }

    // View Rent for the customer
    function viewRent() public onlyCustomer view returns(uint _RENT)
    {
        //             this will evaluate     1/2/3
        // block.timsestamp - [typePfRoom][address] => the time they checkedIn
        uint totalHoursCheckedin = block.timestamp - CustomerRecords[customerRoomType[msg.sender]][msg.sender]; 
        uint payableHours = totalHoursCheckedin / 3600;
        uint totalRent = roomRent[customerRoomType[msg.sender]] * payableHours;
        return totalRent;
    }

    function checkOut() public payable onlyCustomer
    {
        if(customerRoomType[msg.sender] == 1)
        {
            uint rent = viewRent();
            require(msg.value == rent,"Please check your rent and then pay the amount eligible");
            soloRooms.availableRoom ++;
        }
        else if(customerRoomType[msg.sender] == 2)
        {
            uint rent = viewRent();
            require(msg.value == rent,"Please check your rent and then pay the amount eligible");
            soloRooms.availableRoom ++;
        }
        else if(customerRoomType[msg.sender] == 2)
        {
            uint rent = viewRent();
            require(msg.value == rent,"Please check your rent and then pay the amount eligible");
            soloRooms.availableRoom ++;
        }
    }

    // View Rent of Customers for the receptionist
    function viewRent(address _addressOfCustomer) public view onlyReceptionist returns(uint _rentOfTheCustomer)
    {
        //      this will evaluate to       1/2/3
        uint totalHoursCheckedin = block.timestamp - CustomerRecords[customerRoomType[_addressOfCustomer]][_addressOfCustomer];   // block.timestamp - [typeOfRoom][address] => the time they checkedIn ;
        uint payableHours = totalHoursCheckedin / 3600;
        uint totalRent = roomRent[customerRoomType[_addressOfCustomer]] * payableHours;
        return totalRent;
    }

    //function to view revenue collected
    function viewRevenue() public view onlyOwner returns(uint _revenue)
    {
        return address(this).balance;
    }

    // function to withdraw revenue and it can be called only by the owner
    function withdrawRevenue() public payable onlyOwner
    {
        uint totalRevenue = address(this).balance;
        Owner.transfer(totalRevenue);
    }

    // change receptionists and this can be done by owner only
    function changeReceptionist(address _newReceptionist) public onlyOwner
    {
        receiptionist = _newReceptionist;
    }
}
