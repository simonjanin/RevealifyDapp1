import React from "react";
import AsyncButton from 'react-async-button';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      net: "sdfds",
      account: "",
      Longitude: "",
      Latitude: "",
      Address: "",
      OwnerID: "",
      getLocation: ""
    };
    this.determineNet = this.determineNet.bind(this);
    this.onLatitudeChange = this.onLatitudeChange.bind(this);
    this.onLongitudeChange = this.onLongitudeChange.bind(this);
    this.onAddressChange = this.onAddressChange.bind(this);
    this.onOwnerIDChange = this.onOwnerIDChange.bind(this);
    this.locationSubmit = this.locationSubmit.bind(this);
    this.onGetLocationChange = this.onGetLocationChange.bind(this);
    this.getLocationFromEthereum = this.getLocationFromEthereum.bind(this);
  }
  determineNet() {
    var network;
    if (typeof web3 !== "undefined") {
      web3 = new Web3(web3.currentProvider);
      web3.version.getNetwork((err, netId) => {
        switch (netId) {
          case "1":
            network = "mainNet";
            this.setState({
              net: network
            });
            break;
          case "2":
            network = "Morden";
            break;
          case "3":
            network = "Ropsten";
            this.setState({
              net: network
            });

            break;
          default:
            console.log("This is an unknown network.");
        }
      });

      this.setState({
        account: web3.eth.defaultAccount
      });
    }
  }
  componentDidMount() {
    setInterval(this.determineNet, 2000);
  }

  onLatitudeChange(e) {
    this.setState({
      Latitude: e.target.value
    });
  }

  onLongitudeChange(e) {
    this.setState({
      Longitude: e.target.value
    });
  }

  onAddressChange(e) {
    this.setState({
      Address: e.target.value
    });
  }

  onOwnerIDChange(e) {
    this.setState({
      OwnerID: e.target.value
    });
  }

  onGetLocationChange(e) {
    this.setState({
      getLocation: e.target.value
    });
  }

  getLocationFromEthereum(e) {
    e.preventDefault();
    console.log("heeeeeeeeeeeere");
    const abi = [{
        constant: false,
        inputs: [{
            name: "_latitude",
            type: "int256"
          },
          {
            name: "_longitude",
            type: "int256"
          },
          {
            name: "_owner",
            type: "address"
          },
          {
            name: "_ownerID",
            type: "uint256"
          }
        ],
        name: "setLocation",
        outputs: [],
        payable: false,
        type: "function"
      },
      {
        constant: true,
        inputs: [{
          name: "locAddress",
          type: "address"
        }],
        name: "getLocation",
        outputs: [{
            name: "latitude",
            type: "int256"
          },
          {
            name: "longitude",
            type: "int256"
          },
          {
            name: "owner",
            type: "address"
          },
          {
            name: "ownerID",
            type: "uint256"
          }
        ],
        payable: false,
        type: "function"
      }
    ];
    const address = "0xc9FB28D302dd39c3e4f1848B3fe7d024F2342dB4";
    const deployedContract = web3.eth.contract(abi).at(address);

    deployedContract.getLocation(this.state.getLocation, function(err, data) {
      console.log("xx", data, "xx", err, "aaaaaaaaaaaaa");
      document.getElementById("latitude").innerHTML = data[0].toString();
      document.getElementById("longitude").innerHTML = data[1].toString();
      document.getElementById("address").innerHTML = data[2];
      document.getElementById("ownerId").innerHTML = data[3].toString();
    });
  }

  locationSubmit() {

    console.log(this.state, "sssssssssssss");

    const abi = [{
        constant: false,
        inputs: [{
            name: "_latitude",
            type: "int256"
          },
          {
            name: "_longitude",
            type: "int256"
          },
          {
            name: "_owner",
            type: "address"
          },
          {
            name: "_ownerID",
            type: "uint256"
          }
        ],
        name: "setLocation",
        outputs: [],
        payable: false,
        type: "function"
      },
      {
        constant: true,
        inputs: [{
          name: "locAddress",
          type: "address"
        }],
        name: "getLocation",
        outputs: [{
            name: "latitude",
            type: "int256"
          },
          {
            name: "longitude",
            type: "int256"
          },
          {
            name: "owner",
            type: "address"
          },
          {
            name: "ownerID",
            type: "uint256"
          }
        ],
        payable: false,
        type: "function"
      }
    ];
    const address = "0xc9FB28D302dd39c3e4f1848B3fe7d024F2342dB4";
    const deployedContract = web3.eth.contract(abi).at(address);
 return new Promise((resolve, reject) => {
    deployedContract.setLocation(
      this.state.Latitude,
      this.state.Longitude,
      this.state.Address,
      this.state.OwnerID, {
        from: web3.eth.defaultAccount
      },
      function(err, txHash) {
        console.log("bbbb", err, txHash);
        let filter = web3.eth.filter("latest");
        filter.watch(function(error, result) {
          var receipt = web3.eth.getTransactionReceipt(txHash, (err, receipt) => {
            console.log("receeee", receipt)
            if (receipt && receipt.transactionHash == txHash) {

              console.log("the transactionally incremented data was:");
              resolve();
              filter.stopWatching();
            }
          });

        });
      }
    );
})

  }

  render() {
    var labelStyle = {
      width: "800px",
      height: "100px"
    };
    return ( <
      div >
      <
      div >
      <
      h > Insert Location < /h> <
      form onSubmit = {
        this.locationSubmit
      } >
      <
      label style = {
        labelStyle
      } > Longitude: < /label>

      <
      input style = {
        {
          margin: "auto"
        }
      }
      type = "text"
      value = {
        this.state.Longitude
      }
      onChange = {
        this.onLongitudeChange
      }
      name = "Longitude" /
      >
      <
      br / >
      <
      label > Latitude: < /label>

      <
      input type = "text"
      value = {
        this.state.Latitude
      }
      onChange = {
        this.onLatitudeChange
      }
      name = "Latitude" /
      >
      <
      br / >
      <
      label > Address: < /label>

      <
      input type = "text"
      value = {
        this.state.address
      }
      onChange = {
        this.onAddressChange
      }
      name = "address" /
      >
      <
      br / >
      <
      label > OwnerID: < /label>

      <
      input type = "text"
      value = {
        this.state.OwnerID
      }
      onChange = {
        this.onOwnerIDChange
      }
      name = "OwnerID" /
      >
      <
      br / >

      <AsyncButton
           className="btn btn-block btn-lg"
           text="Save    "
           pendingText="Saving..."
           fulFilledText="Saved Successfully!"
           rejectedText="Failed! Try Again"
           loadingClass="isSaving"
           fulFilledClass="btn-success"
           rejectedClass="btn-danger"
           onClick={this.locationSubmit}
          />
      <
      /form> < /
      div > <
      div style = {
        {
          marginTop: "20px"
        }
      } >
      <
      form onSubmit = {
        this.getLocationFromEthereum
      } >
      <
      label > Get Location at Address: < /label> <
      input type = "text"
      value = {
        this.state.getLocation
      }
      onChange = {
        this.onGetLocationChange
      }
      name = "GetLocation" /
      >
      <
      input type = "submit"
      value = "Get Location" / >
      <
      /form> <
      h > Data: < /h> <
      div >
      <
      label >
      Latitude:
      <
      p id = "latitude" / >
      <
      /label> <
      label > Longitude: < /label> <
      p id = "longitude" / >
      <
      label > Address: < /label> <
      p id = "address" / >
      <
      label > OwnerId: < /label> <
      p id = "ownerId" / >
      <
      /div> < /
      div > <
      /div>
    );
  }
}

export default App;
