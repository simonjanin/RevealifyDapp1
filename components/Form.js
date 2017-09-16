import React, { Component } from "react";
import AsyncButton from "react-async-button";
import ReactDOM from "react-dom";
import contractAddress from "../contractAddress.json";
import axios from "axios";

import SendEtherUI from "./SendEtherUI";
import MerkelUI from "./MerkelUI";
import CreateUser from "./CreateUser";
import WithdrawFunds from "./WithdrawFunds";

import Select from "react-select";
import "react-select/dist/react-select.css";

const abi = [
  {
    constant: false,
    inputs: [],
    name: "getBalance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "createUser",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "withdraw",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "contractState",
    outputs: [
      { name: "balance", type: "uint256" },
      { name: "merkleTreeRoot", type: "bytes32" },
      { name: "merkleTreeFileHash", type: "bytes32" },
      { name: "commitment", type: "bytes32" }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "merkleTreeRoot", type: "bytes32" },
      { name: "merkleTreeFileHash", type: "bytes32" }
    ],
    name: "setMerkleTree",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "sendMoney",
    outputs: [{ name: "", type: "bool" }],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "createAlert",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "str", type: "string" }],
    name: "Print",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "value", type: "bool" }],
    name: "Alert",
    type: "event"
  }
];

const address = contractAddress.address;

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
  }

  componentDidMount() {
    if (typeof web3 !== "undefined") {
      web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    let componentMounting = true;
    setTimeout(() => {
      const deployedContract = web3.eth.contract(abi).at(address);
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
    const deployedContract = web3.eth.contract(abi).at(address);

    deployedContract.sendMoney(
      { value: web3.toWei(etherValue, "ether"), gas: 3000000 },
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
    const deployedContract = web3.eth.contract(abi).at(address);

    deployedContract.withdraw({ gas: 3000000 }, (err, txHash) => {
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
    });
  }

  createUser(resolve, reject) {
    const deployedContract = web3.eth.contract(abi).at(address);
    deployedContract.createUser({ gas: 3000000 }, (err, txHash) => {
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
            resolve();
          }
        });
      });
    });
  }

  processSecretEgg(resolve, reject) {
    // put the code here to manupulate string // access string using this.state.string
    const deployedContract = web3.eth.contract(abi).at(address);
    deployedContract.setMerkleTree(
      "0x0",
      "0x0",
      { gas: 3000000 },
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
  sendMerkleProof(resolve, reject) {
    setTimeout(() => {
      resolve();
    }, 3000);
  }

  createAlert(resolve, reject) {
    const deployedContract = web3.eth.contract(abi).at(address);
    deployedContract.createAlert((err, res) => {
      if (err) {
        reject();
      }
      console.log("ooooooooooooo", res);
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
      { value: "attacker", label: "Attacker" },
      { value: "defender", label: "Defender" }
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
          title="Enter a String"
          buttonText="Call sendMerkelTree!"
          clickHandler={this.processSecretEgg}
        />
      );
    } else {
      merkelUI = (
        <MerkelUI
          key={this.state.selectedInterface}
          title="Enter a String"
          buttonText="Call sendMerkelProof!"
          clickHandler={this.sendMerkleProof}
        />
      );
    }

    return (
      <div className="container">
        <div className="row" style={{ marginTop: "10px" }}>
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
              style={{ marginTop: "5%" }}
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
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 col-md-4">
            <div className="account-wall">
              <div style={{ padding: "10px" }}>
                {" "}
                <h>User Balance:</h>{" "}
                <span
                  style={{ marginLeft: "10%" }}
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
