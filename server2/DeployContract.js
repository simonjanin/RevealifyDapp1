const fs = require("fs");
const solc = require("solc");
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const input = fs.readFileSync("Revealify.sol");
const output = solc.compile(input.toString(), 1);
const bytecode = output.contracts[":Revealify"].bytecode;
const abi = JSON.parse(output.contracts[":Revealify"].interface);
const contract = web3.eth.contract(abi);
let contractAddress;
let contractABI;

const contractInstance = contract.new(
  {
    data: "0x" + bytecode,
    from: web3.eth.accounts[0],
    gas: 90000 * 5
  },
  (err, res) => {
    if (err) {
      console.log(err);
      return;
    }

    // If we have an address property, the contract was deployed
    if (res.address) {
      console.log(`\{\"address\":"${res.address}"\}`);
      contractAddress = res.address
      contractABI = res.abi
      console.log("******Revealify has been deployed!******")
      // Let's test the deployed contract
    }
  }
);
module.exports=function getAddress(){
  return {contractAddress, contractABI}
}
