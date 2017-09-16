import React, { Component } from "react";
import AsyncButton from "react-async-button";
class CreateUser extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-sm-6 col-md-4">
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
            onClick={() => {
              return new Promise((resolve, reject) => {
                this.props.createUser(resolve, reject);
              });
            }}
          />
        </div>
      </div>
    );
  }
}

export default CreateUser;
