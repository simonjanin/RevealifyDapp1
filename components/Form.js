import React, { Component } from "react";
import AsyncButton from "react-async-button";
import ReactDOM from "react-dom";
import axios from "axios";

import SendEtherUI from "./SendEtherUI";
import MerkelUI from "./MerkelUI";
import CreateUser from "./CreateUser";
import WithdrawFunds from "./WithdrawFunds";

import MerkleTree, {
  checkProof,
  merkleRoot,
  checkProofSolidityFactory
} from "merkle-tree-solidity";
import { sha3 } from "ethereumjs-util";

import Select from "react-select";
import "react-select/dist/react-select.css";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      string: "",

      selectedInterface: "attacker"
    };
    this.withDrawMoney = this.withDrawMoney.bind(this);
    this.sendMoney = this.sendMoney.bind(this);
    this.createUser = this.createUser.bind(this);
    this.processSecretEgg = this.processSecretEgg.bind(this);
    this.logChange = this.logChange.bind(this);
    this.sendMerkleProof = this.sendMerkleProof.bind(this);
    this.createAlert = this.createAlert.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
    this.address;
    this.abi;
  }

  componentDidMount() {
    if (typeof web3 !== "undefined") {
      web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    (async () => {
      const fetchaddress = await axios.get(
        "http://localhost:8680/AddressandABI"
      );

      return fetchaddress;
    })().then(address => {
      console.log(address.data.contractABI, "fetchaddress");
      this.address = address.data.contractAddress;
      this.abi = address.data.contractABI;
    });

    let componentMounting = true;

    setTimeout(() => {
      const deployedContract = web3.eth.contract(this.abi).at(this.address);
      deployedContract.Alert().watch((err, response) => {
        if (!componentMounting) {
          this.sendEmail();
        }
        componentMounting = false;
      });
      deployedContract.getBalance.call((err, res) => {
        ReactDOM.findDOMNode(this.refs.userBalance).innerHTML = `${web3.fromWei(
          res.toString(),
          "ether"
        )} ethers`;
      });
    }, 3000);
  }

  sendMoney(etherValue, resolve, reject) {
    const deployedContract = web3.eth.contract(this.abi).at(this.address);

    deployedContract.sendMoney(
      {
        value: web3.toWei(etherValue, "ether"),
        gas: 3000000
      },
      (err, txHash) => {
        if (err) {
          reject();
        }
        let filter = web3.eth.filter("latest");
        filter.watch((error, result) => {
          if (error) {
            reject();
          }
          web3.eth.getTransactionReceipt(txHash, (error, txReceipt) => {
            if (error) {
              reject();
            }
            if (txReceipt && txReceipt.transactionHash == txHash) {
              deployedContract.getBalance.call((err, res) => {
                ReactDOM.findDOMNode(
                  this.refs.userBalance
                ).innerHTML = `${web3.fromWei(res.toString(), "ether")} ethers`;
              });
              resolve();
            }
          });
        });
      }
    );
  }

  withDrawMoney(resolve, reject) {
    const deployedContract = web3.eth.contract(this.abi).at(this.address);

    deployedContract.withdraw(
      {
        gas: 3000000
      },
      (err, txHash) => {
        if (err) {
          reject();
        }
        let filter = web3.eth.filter("latest");
        filter.watch((error, result) => {
          if (error) {
            reject();
          }
          web3.eth.getTransactionReceipt(txHash, (error, txReceipt) => {
            if (error) {
              reject();
            }
            if (txReceipt && txReceipt.transactionHash == txHash) {
              deployedContract.getBalance.call((err, res) => {
                ReactDOM.findDOMNode(
                  this.refs.userBalance
                ).innerHTML = `${web3.fromWei(res.toString(), "ether")} ethers`;
              });
              resolve();
            }
          });
        });
      }
    );
  }

  createUser(resolve, reject, resetCallback) {
    const deployedContract = web3.eth.contract(this.abi).at(this.address);
    deployedContract.createUser(
      {
        gas: 3000000
      },
      (err, txHash) => {
        if (err) {
          reject();
        }
        let filter = web3.eth.filter("latest");
        filter.watch((error, result) => {
          if (error) {
            reject();
          }
          web3.eth.getTransactionReceipt(txHash, (error, txReceipt) => {
            if (error) {
              reject();
            }
            if (txReceipt && txReceipt.transactionHash == txHash) {
              deployedContract.getBalance.call((err, res) => {
                console.log("err", err, "res", res.toString());
                ReactDOM.findDOMNode(
                  this.refs.userBalance
                ).innerHTML = `${web3.fromWei(res.toString(), "ether")} ethers`;
              });
              setTimeout(() => {
                resetCallback();
              }, 3000);
              resolve();
            }
          });
        });
      }
    );
  }

  processSecretEgg(resolve, reject) {
    // put the code here to manupulate string // access string using this.state.string
    const deployedContract = web3.eth.contract(this.abi).at(this.address);
    deployedContract.setMerkleTree(
      "0x0",
      "0x0",
      {
        gas: 3000000
      },
      (err, txHash) => {
        if (err) {
          reject();
        }
        let filter = web3.eth.filter("latest");
        filter.watch((error, result) => {
          if (error) {
            reject();
          }
          web3.eth.getTransactionReceipt(txHash, (error, txReceipt) => {
            if (error) {
              reject();
            }
            if (txReceipt && txReceipt.transactionHash == txHash) {
              resolve();
            }
          });
        });
      }
    );
  }
  async sendMerkleProof(indexx, randomNumber, secretNumber, resolve, reject) {
    const partialTree = await axios.get("http://localhost:8680/getPartialTree");

    const { partialTreeJSON, index, number, secret } = partialTree.data;
    const newProof = await axios.post(
      "http://localhost:8680/generateProofWithPartialMerkleTree",
      {
        partialMerkleTree: partialTreeJSON,
        index: index,
        secret: secret,
        number: number
      }
    );

    // uncomment the below code and comment the above code to work with the number and secret received from user input

    //const { partialTreeJSON } = partialTree.data;
    // const index = indexx
    // const number =randomNumber
    // const secret = secretNumber
    // const newProof = await axios.post(
    //   "http://localhost:8680/generateProofWithPartialMerkleTree",
    //   {
    //     partialMerkleTree: partialTreeJSON,
    //     index: indexx,
    //     secret: secretNumber,
    //     number: randomNumber
    //   }
    // );

    const proofBuffer = newProof.data.map(value => {
      return Buffer.from(value, "hex");
    });
    //console.log(newProof, "new prrrooooofa",partialTree.data.partialTreeRoot);
    const deployedContract = web3.eth.contract(this.abi).at(this.address);
    const partialTreeRoot = Buffer.from(
      partialTree.data.partialTreeRoot,
      "hex"
    );

    const checkProofSolidity = checkProofSolidityFactory(
      deployedContract.checkProof
    );
    console.log("arguments", proofBuffer, partialTreeRoot, sha3(secret));
    const responseCheckProof = checkProof(
      proofBuffer,
      partialTreeRoot,
      sha3(secret)
    );
    console.log("checkProof ", responseCheckProof);

    // check merkle proof in Solidity
    // we can now safely pass in the buffers returned by previous methods

    const responseCheckProofSolidity = await checkProofSolidity(
      proofBuffer,
      partialTreeRoot,
      sha3(secret)
    ); // -> true
    console.log("checkProofSolidity " + responseCheckProofSolidity);
    ReactDOM.findDOMNode(
      this.refs.merkelProof
    ).innerHTML = `"checkProof: ${responseCheckProof} & checkProofSolidity: ${responseCheckProofSolidity}`;
  resolve()
  }

  createAlert(resolve, reject) {
    const deployedContract = web3.eth.contract(this.abi).at(this.address);
    deployedContract.createAlert((err, res) => {
      if (err) {
        reject();
      }
      resolve();
    });
  }
  async sendEmail() {
    console.log("seeeeeeeending emaillllllllll");
    let response = await axios.post("https://safe-basin-81208.herokuapp.com", {
      email: "sheraz1392@gmail.com"
    });
    return;
  }
  logChange(val) {
    console.log("Selected: " + JSON.stringify(val));
    this.setState({ selectedInterface: val.value });
  }
  render() {
    var options = [
      {
        value: "attacker",
        label: "Attacker"
      },
      {
        value: "defender",
        label: "Defender"
      }
    ];
    let sendEtherUI = "";
    let merkelUI = "";
    if (this.state.selectedInterface == "defender") {
      sendEtherUI = (
        <SendEtherUI
          key={this.state.selectedInterface}
          sendMoney={this.sendMoney}
        />
      );

      merkelUI = (
        <MerkelUI
          key="defender"
          keyProp="defender"
          title="Enter a String"
          buttonText="Call sendMerkelTree!"
          clickHandler={this.processSecretEgg}
        />
      );
    } else {
      merkelUI = (
        <MerkelUI
          key={this.state.selectedInterface}
          keyProp={this.state.selectedInterface}
          title="Enter a String"
          buttonText="Call sendMerkelProof!"
          clickHandler={this.sendMerkleProof}
        />
      );
    }

    return (
      <div className="container">
        <div
          className="row"
          style={{
            marginTop: "10px"
          }}
        >
          <div className="col-sm-6 col-md-4">
            <Select
              name="form-field-name"
              value={this.state.selectedInterface}
              options={options}
              onChange={this.logChange}
              clearable={false}
            />
          </div>
        </div>

        <CreateUser
          key={this.state.selectedInterface}
          createUser={this.createUser}
        />
        <div className="row">
          <div className="col-sm-6 col-md-4">
            <div className="account-wall">
              <div className="form-signin">{sendEtherUI}</div>
              <WithdrawFunds
                key={this.state.selectedInterface}
                withDrawMoney={this.withDrawMoney}
              />
              <div className="form-signin">{merkelUI}</div>
            </div>
          </div>
          <div className="col-sm-6 col-md-4">
            <AsyncButton
              style={{
                marginTop: "5%"
              }}
              className="btn btn-primary btn-block btn-lg"
              text="createAlert()"
              pendingText="creating..."
              fulFilledText="Alert created successfully!"
              rejectedText="Failed! Try Again"
              loadingClass="isSaving"
              fulFilledClass="btn-success"
              rejectedClass="btn-danger"
              onClick={() => {
                return new Promise((resolve, reject) => {
                  this.createAlert(resolve, reject);
                });
              }}
            />
            <div className="account-wall">
              <div
                style={{
                  padding: "10px"
                }}
              >
                <h>Result from send Merkel Proof:</h>
                <span
                  style={{
                    marginLeft: "10%"
                  }}
                  id="proofOutput"
                  ref="merkelProof"
                />{" "}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 col-md-4">
            <div className="account-wall">
              <div
                style={{
                  padding: "10px"
                }}
              >
                {" "}
                <h>User Balance:</h>{" "}
                <span
                  style={{
                    marginLeft: "10%"
                  }}
                  id="balance"
                  ref="userBalance"
                />{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Form;
