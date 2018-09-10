pragma solidity ^0.4.21;

contract Flip {
    address[] public players;
    bool public randomStage = false;
    bool public revealStage = false;
    bool public player1Lied = false;
    bool public player2Lied = false;
    uint8 bothPlayersIn = 0;
    mapping(address => bytes32) addressToPreImg;
    mapping(address => uint) addressToRevealValue;
    address winner = 0x000;
    address manager;
    bool public here = false;
    uint public randomNumber = 0;
    address contractAddress = this;

    constructor() public {
        manager = msg.sender;
    }

    // allows player to enter game, min
    function enter() public payable {
        require(msg.value >= 10 ether);
        require(!(players.length >= 2));

        players.push(msg.sender);
        if(players.length == 2) {
            randomStage = true;
          //send req to send pre img
        }
        /* TODO: BLOCKTIMES */
    }

    function commit(bytes32 preImg) public playerRestricted {
        //mapping to be set on the address
        addressToPreImg[msg.sender] = preImg;
        bothPlayersIn++;
        //check if both address are in and then run set revealStage = true
        if(bothPlayersIn == 2){
            revealStage = true;
            bothPlayersIn = 0;
      }
    }

    function reveal(uint val) public playerRestricted {
        // todo: check stage of flip
        addressToRevealValue[msg.sender] = val;
        bothPlayersIn++;
        //check if both address are in and then run set revealStage = true
        if(bothPlayersIn == 2){
            checkReveal();
        }
    }

    function checkReveal() private {
        //takes in a value an
        address player1 = players[0];
        address player2 = players[1];
        
        //check the validity
        bytes32 player1Check = keccak256(abi.encodePacked(addressToRevealValue[player1]));
        bytes32 player2Check = keccak256(abi.encodePacked(addressToRevealValue[player2]));

        //check player 1
        if(player1Check==addressToPreImg[player1]){
            player1Lied = true;
            winner = player2;
            player2.transfer(contractAddress.balance);
        }

        //check player 2
        if(player2Check==addressToPreImg[player2]){
            player2Lied = true;
            winner = player1;
            player1.transfer(contractAddress.balance);
        }
        //run random winner if both are honest
        if(player2Lied == false && player1Lied == false){
            randomNumber = random();
            pickWinner();
        }
    }

 /* TODO: check for blocktimes in modifier moneys go to user who sent, send both back if nobody sent*/

    function pickWinner() private {
        uint index = randomNumber % players.length;
        players[index].transfer(contractAddress.balance);
        //send winner money
        winner = players[index];
    }

    // get both random nums and keccak256 them together
    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(addressToPreImg[players[0]], addressToPreImg[players[1]])));
    }

    // kills contract and sends remainder to manager
    function killSwitch() public managerRestricted {
        manager.transfer(contractAddress.balance);
        selfdestruct(manager);
    } 

    // restricts function to only players
    modifier playerRestricted() {
        require(msg.sender == players[0] || msg.sender == players[1]);
        _;
    }

    // restricts function to only manager for self destruct case
    modifier managerRestricted() {
        require(msg.sender == manager);
        _;
    }

 //Getters
    function getRandomStage() public view returns (bool){
        return randomStage;
    }

    function getRevealStage() public view returns (bool){
        return revealStage;
    }

    function getPlayer1Lied() public view returns (bool){
        return player1Lied;
    }

    function getPlayer2Lied() public view returns (bool){
        return player2Lied;
    }

    function getbothPlayersIn() public view returns (uint){
        return bothPlayersIn;
    }

    function getPlayers() public view returns (address[]){
        return players;
    }

    function getWinner() public view returns (address){
        return winner;
    }

}