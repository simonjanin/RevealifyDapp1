import React, { Component } from "react";
import AsyncButton from "react-async-button";
import ReactDOM from "react-dom";

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
    anonymous: false,
    inputs: [{ indexed: false, name: "str", type: "string" }],
    name: "Print",
    type: "event"
  }
];

const address = "0x1d3b137ecf53ee977e42b69f8b2ebfd3c42dc822";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      etherValue: "",
      string: ""
    };
    this.withDrawMoney = this.withDrawMoney.bind(this);
    this.sendMoney = this.sendMoney.bind(this);
    this.createUser = this.createUser.bind(this);
    this.processSecretEgg = this.processSecretEgg.bind(this);
  }

  componentDidMount() {
    if (typeof web3 !== "undefined") {
      web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    setTimeout(() => {
      const deployedContract = web3.eth.contract(abi).at(address);

      deployedContract.getBalance.call((err, res) => {
        ReactDOM.findDOMNode(this.refs.userBalance).innerHTML = `${web3.fromWei(
          res.toString(),
          "ether"
        )} ethers`;
      });
    }, 3000);
  }

  sendMoney() {
    const deployedContract = web3.eth.contract(abi).at(address);
    return new Promise((resolve, reject) => {
      deployedContract.sendMoney(
        { value: web3.toWei(this.state.etherValue, "ether"), gas: 3000000 },
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
                  ).innerHTML = `${web3.fromWei(
                    res.toString(),
                    "ether"
                  )} ethers`;
                });
                resolve();
              }
            });
          });
        }
      );
    });
  }

  withDrawMoney() {
    const deployedContract = web3.eth.contract(abi).at(address);

    return new Promise((resolve, reject) => {
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
    });
  }

  createUser() {
    const deployedContract = web3.eth.contract(abi).at(address);
    return new Promise((resolve, reject) => {
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
    });
  }

  processSecretEgg() {
    // put the code here to manupulate string // access string using this.state.string
    const deployedContract = web3.eth.contract(abi).at(address);
    return new Promise((resolve, reject) => {
      deployedContract.setMerkleTree(
        "0x0",
        "0x0",
        { gas: 3000000 },
        (err, txHash) => {
          if(err){reject()}
          let filter = web3.eth.filter("latest");
          filter.watch((error, result) => {
            if(error){reject()}
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
    });
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-6 col-md-4 col-md-offset-4">
            <AsyncButton
              style={{ marginTop: "5%" }}
              className="btn btn-primary btn-block btn-lg"
              text="Create User on Blockchain!"
              pendingText="Saving..."
              fulFilledText="User created successfully!"
              rejectedText="Failed! Try Again"
              loadingClass="isSaving"
              fulFilledClass="btn-success"
              rejectedClass="btn-danger"
              onClick={this.createUser}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 col-md-4 col-md-offset-4">
            <div className="account-wall">
              <form className="form-signin">
                <div>
                  <p className="profile-name">Enter Ethers to send!</p>
                  <input
                    style={{ marginTop: "10px" }}
                    value={this.state.etherValue}
                    onChange={e =>
                      this.setState({ etherValue: e.target.value })}
                    type="text"
                    className="form-control"
                    placeholder="...."
                    required
                    autoFocus
                  />
                  <AsyncButton
                    style={{ marginTop: "8px" }}
                    className="btn btn-primary btn-block btn-lg"
                    text="Send Ethers!"
                    pendingText="Saving...!"
                    fulFilledText="sent Successfully!"
                    rejectedText="Failed! Try Again"
                    loadingClass="isSaving"
                    fulFilledClass="btn-success"
                    rejectedClass="btn-danger"
                    onClick={this.sendMoney}
                  />
                </div>
                <div style={{ marginTop: "25px" }}>
                  <p>Click to withdraw all of your balance!</p>
                  <AsyncButton
                    className="btn btn-primary btn-block btn-lg"
                    text="Withdraw Money!"
                    pendingText="Saving...!"
                    fulFilledText="withdrawn Successfully!"
                    rejectedText="Failed! Try Again"
                    loadingClass="isSaving"
                    fulFilledClass="btn-success"
                    rejectedClass="btn-danger"
                    onClick={this.withDrawMoney}
                  />
                </div>
                <div style={{ marginTop: "25px" }}>
                  <p className="profile-name">Enter String!</p>
                  <input
                    style={{ marginTop: "10px" }}
                    value={this.state.string}
                    onChange={e => this.setState({ string: e.target.value })}
                    type="text"
                    className="form-control"
                    placeholder="...."
                    required
                    autoFocus
                  />
                  <AsyncButton
                    style={{ marginTop: "8px" }}
                    className="btn btn-primary btn-block btn-lg"
                    text="Call setMerkleTree!"
                    pendingText="Saving...!"
                    fulFilledText="Saved Successfully!"
                    rejectedText="Failed! Try Again"
                    loadingClass="isSaving"
                    fulFilledClass="btn-success"
                    rejectedClass="btn-danger"
                    onClick={this.processSecretEgg}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 col-md-4 col-md-offset-4">
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
