import React, { Component } from "react";
import AsyncButton from "react-async-button";

class SendEtherUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      etherValue: ""
    };
  }

  render() {
    return (
      <div>
        <p className="profile-name">Enter Ethers to send!</p>
        <input
          style={{ marginTop: "10px" }}
          value={this.state.etherValue}
          onChange={e => this.setState({ etherValue: e.target.value })}
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
          onClick={() => {
            return new Promise((resolve, reject) => {
              this.props.sendMoney(this.state.etherValue, resolve, reject);
            });
          }}
        />
      </div>
    );
  }
}

export default SendEtherUI;
