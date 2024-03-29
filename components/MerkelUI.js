import React, { Component } from "react";
import AsyncButton from "react-async-button";

class MerkerUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      string: ""
    };
  }
  render() {
    return (
      <div style={{ marginTop: "25px" }}>
        <p className="profile-name">{this.props.title}</p>
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
          text={this.props.buttonText}
          pendingText="Saving...!"
          fulFilledText="Saved Successfully!"
          rejectedText="Failed! Try Again"
          loadingClass="isSaving"
          fulFilledClass="btn-success"
          rejectedClass="btn-danger"
          onClick={() => {
            if (this.props.keyProp == "attacker") {
              const tokenizedString = this.state.string.split(/[ ,]/);

              let index = tokenizedString[0];
              let randomNumber = parseInt(tokenizedString[1]);
              let secretNumber = tokenizedString[2];

              return new Promise((resolve, reject) => {
                this.props.clickHandler(
                  index,
                  randomNumber,
                  secretNumber,
                  resolve,
                  reject
                );
              });
            } else {
              return new Promise((resolve, reject) => {
                this.props.clickHandler(resolve, reject);
              });
            }
          }}
        />
      </div>
    );
  }
}

export default MerkerUI;
