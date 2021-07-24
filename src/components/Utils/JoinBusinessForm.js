import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';
import * as ROUTES from '../routes';

const JoinBusinessPage = () => (
  <AuthUserContext.Consumer>
    {(authUser) => (
      <div>
        <h3>Join A Business</h3>
        <JoinBusinessForm authUser={authUser} />
      </div>
    )}
  </AuthUserContext.Consumer>
);

const INITIAL_STATE = {
  businessID: '',
  error: null,
};

class BusinessFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { authUser } = this.props;
    const { businessID } = this.state;

    this.props.firebase
      .setUserBusiness(authUser.uid, businessID)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { businessID, error } = this.state;

    const isInvalid = businessID === '';

    return (
      <form onSubmit={this.onSubmit}>
        <input
          className="form-input"
          name="businessID"
          autoComplete="businessID"
          value={this.state.businessID}
          onChange={this.onChange}
          type="text"
          placeholder="Business ID"
        />
        <button className="btn btn-primary" disabled={isInvalid} type="submit">
          Join This Business
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const BusinessLink = () => (
  <p>
    <Link to={ROUTES.JOIN_A_BUSINESSES}>Join A Business!!</Link>
  </p>
);

export default JoinBusinessPage;

const JoinBusinessForm = withFirebase(BusinessFormBase);

export { JoinBusinessForm, BusinessLink };
