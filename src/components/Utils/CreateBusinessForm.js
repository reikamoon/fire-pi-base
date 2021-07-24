import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BUSINESSES } from '../routes';

import { withFirebase } from '../Firebase';

// import AddressForm from '../AddressForm';

class BusinessForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      businessTitle: '',
      businessAddress: '',
    };
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onCreateBusiness = () => {
    let ownerName = this.props.authUser.username;
    let ownerID = this.props.authUser.uid;

    var businessData = {
      businessTitle: this.state.businessTitle,
      businessAddress: this.state.businessAddress,
      owner: { ownerName, ownerID },
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
    };

    let businessID = this.props.firebase.createBusiness(businessData);
    console.log(businessID);
    this.setState({
      businessTitle: '',
      businessAddress: '',
    });
  };

  render() {
    const { businessTitle, businessAddress } = this.state;

    return (
      <div className="add-padding-bottom text-center">
        <h1>Create A Business!</h1>
        <form>
          <input
            className="col-10 form-input"
            type="text"
            placeholder="Name Your Business!"
            value={businessTitle}
            name="businessTitle"
            onChange={this.onChange}
          />
          <input
            className="col-10 form-input"
            type="text"
            placeholder="Where does it live?"
            value={businessAddress}
            name="businessAddress"
            onChange={this.onChange}
          />

          {/* <AddressForm parentCallBack={this.onChangeBusinessAddress} /> */}
        </form>

        <button className="btn btn-primary" type="submit" onClick={this.onCreateBusiness}>
          <Link to={BUSINESSES}>Submit</Link>
        </button>

      </div>
    );
  }
}

export default withFirebase(BusinessForm);
