import React, { Component } from "react";
import AsyncButton from "react-async-button";
class WithdrawFunds extends Component {
  render() {
    return (
      <div style={{ marginTop: "25px" }} className="form-signin">
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
          onClick={() => {
            return new Promise((resolve, reject) => {
              this.props.withDrawMoney(resolve, reject);
            });
          }}
        />
      </div>
    );
  }
}

export default WithdrawFunds;
