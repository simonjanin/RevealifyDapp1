pragma solidity ^0.4.0;

contract Revealify {
    event Print(string str);

	struct UserData {
		// FIXED PARAMETERS
		uint balance;
		bytes32 merkleTreeRoot;
		bytes32 merkleTreeFileHash;
		bytes32 commitment;
	}
	
    mapping(address => UserData) public contractState;

	// Commands
	
	function createUser() {
        UserData memory userData = UserData({
    		balance:0,
    		merkleTreeRoot:0,
    		merkleTreeFileHash:0,
    		commitment:0
	    });
	    
	    contractState[msg.sender] = userData;
	}

    function setMerkleTree(bytes32 merkleTreeRoot, bytes32 merkleTreeFileHash) {
        contractState[msg.sender].merkleTreeRoot = merkleTreeRoot;
        contractState[msg.sender].merkleTreeFileHash = merkleTreeFileHash;
    }

function withdraw() {
uint amount = contractState[msg.sender].balance;
contractState[msg.sender].balance = 0;
msg.sender.transfer(amount);
}
	
	function sendMoney() payable returns (bool) {
	    contractState[msg.sender].balance += msg.value;
	}

	// Getters
	function getBalance() returns (uint) {
	    return contractState[msg.sender].balance;
	}

}


