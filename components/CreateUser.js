import React, { Component } from "react";
import AsyncButton from "react-async-button";
class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 1
    };
  }
  render() {
    return (
      <div className="row">
        <div className="col-sm-6 col-md-4">
          <AsyncButton
            key={this.state.active}
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
                this.setState;
                this.props.createUser(resolve, reject, () => {
                  this.setState({ active: this.state.active + 1 });
                });
              });
            }}
          />
        </div>
      </div>
    );
  }
}

export default CreateUser;
