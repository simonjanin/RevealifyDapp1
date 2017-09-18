pragma solidity ^0.4.0;

contract Revealify {
    event Print(string str);
	event Alert(bool value);
     bool alert;
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

function createAlert() {
   Alert(true);
  }
	
	function sendMoney() payable returns (bool) {
	    contractState[msg.sender].balance += msg.value;
	}

	// Getters
	function getBalance() returns (uint) {
	    return contractState[msg.sender].balance;
	}

	function checkProof(bytes proof, bytes32 root, bytes32 hash) constant returns (bool) {
    bytes32 el;
    bytes32 h = hash;

    for (uint256 i = 32; i <= proof.length; i += 32) {
        assembly {
            el := mload(add(proof, i))
        }

        if (h < el) {
            h = sha3(h, el);
        } else {
            h = sha3(el, h);
        }
    }

    return h == root;
  }

  // from StorJ -- https://github.com/nginnever/storj-audit-verifier/blob/master/contracts/MerkleVerifyv3.sol
  function checkProofOrdered(bytes proof, bytes32 root, bytes32 hash, uint256 index) constant returns (bool) {
    // use the index to determine the node ordering
    // index ranges 1 to n

    bytes32 el;
    bytes32 h = hash;
    uint256 remaining;

    for (uint256 j = 32; j <= proof.length; j += 32) {
      assembly {
        el := mload(add(proof, j))
      }

      // calculate remaining elements in proof
      remaining = (proof.length - j + 32) / 32;

      // we don't assume that the tree is padded to a power of 2
      // if the index is odd then the proof will start with a hash at a higher
      // layer, so we have to adjust the index to be the index at that layer
      while (remaining > 0 && index % 2 == 1 && index > 2 ** remaining) {
        index = uint(index) / 2 + 1;
      }

      if (index % 2 == 0) {
        h = sha3(el, h);
        index = index / 2;
      } else {
        h = sha3(h, el);
        index = uint(index) / 2 + 1;
      }
    }

    return h == root;
  }

}


