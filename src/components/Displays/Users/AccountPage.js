import React, { Component, useState } from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../../Firebase';

import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification,
} from '../../Session';

// import { PasswordForgetForm, PasswordChangeForm, SignOutButton} from '../Auth';
import { PasswordChangeForm, SignOutButton } from '../../Auth';
import { CreateBusinessForm, JoinBusinessForm, ToggleSwitch } from '../../Utils';

// import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const AccountPage = () => {
  let [settings, setSettings] = useState(false);
  // let [daily, setDaily] = useState(false);
  // let [weekly, setWeekly] = useState(false);
  // let [monthly, setMonthly] = useState(false);

  const onSettingsChange = (checked) => {
    setSettings(checked);
    // if (!checked) {
    //   setDaily(false);
    //   setWeekly(false);
    //   setMonthly(false);
    // }
  };

  return (
    <AuthUserContext.Consumer>
      {(authUser) => (
        <div className="container text-center add-padding-bottom">
          <div className="usercard">
            <div className="mt-3">
              <img className="profile-photo" src={'https://picsum.photos/200'} width="100" height="100" alt="Profile" />
            </div>
            <h3>{authUser.username}'s Account</h3>
            <p>
              <strong>Email: </strong>
              {authUser.email}
              <br />
              <strong>Business: </strong>
              {authUser.business_id || 'No Business assigned.'}
            </p>
            <p>
              <strong>Roles:</strong> {authUser.roles}
            </p>
            <SignOutButton />
            <br />
            <br />
          </div>
          <hr />
          <div>
            <ToggleSwitch id="settings" checked={settings} onChange={onSettingsChange} />
            <label htmlFor="settings">Edit Account Settings</label>
          </div>

          {settings && (
            <div>
              {/* Forgot Your Password? <PasswordForgetForm /> */}
              Reset Your Password. <PasswordChangeForm />
              <LoginManagement authUser={authUser} />
            </div>
          )}

          <br />
          <br />

          {/* {authUser.roles === 'ADMIN' && } */}
          
          {!authUser.business_id && (
            <div>
              <JoinBusinessForm />
              <br /> OR <br /><br />
              <CreateBusinessForm authUser={authUser} />
            </div>
          )}
        </div>
      )}
    </AuthUserContext.Consumer>
  );
};


const SIGN_IN_METHODS = [
  { id: 'password', provider: null },
  // { id: 'google.com', provider: 'googleProvider' },
  // { id: 'facebook.com', provider: 'facebookProvider' },
  // { id: 'twitter.com', provider: 'twitterProvider' },
];


class LoginManagementBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSignInMethods: [],
      error: null,
    };
  }

  componentDidMount() {
    this.fetchSignInMethods();
  }

  fetchSignInMethods = () => {
    this.props.firebase.auth
      .fetchSignInMethodsForEmail(this.props.authUser.email)
      .then((activeSignInMethods) =>
        this.setState({ activeSignInMethods, error: null }),
      )
      .catch((error) => this.setState({ error }));
  };

  onSocialLoginLink = (provider) => {
    this.props.firebase.auth.currentUser
      .linkWithPopup(this.props.firebase[provider])
      .then(this.fetchSignInMethods)
      .catch((error) => this.setState({ error }));
  };

  onDefaultLoginLink = (password) => {
    const credential = this.props.firebase.emailAuthProvider.credential(
      this.props.authUser.email,
      password,
    );

    this.props.firebase.auth.currentUser
      .linkAndRetrieveDataWithCredential(credential)
      .then(this.fetchSignInMethods)
      .catch((error) => this.setState({ error }));
  };

  onUnlink = (providerId) => {
    this.props.firebase.auth.currentUser
      .unlink(providerId)
      .then(this.fetchSignInMethods)
      .catch((error) => this.setState({ error }));
  };

  render() {
    const { activeSignInMethods, error } = this.state;

    return (
      <div>
        Sign In Methods:
        <ul className="social-links">
          {SIGN_IN_METHODS.map((signInMethod) => {
            const onlyOneLeft = activeSignInMethods.length === 1;
            const isEnabled = activeSignInMethods.includes(
              signInMethod.id,
            );

            return (
              <li key={signInMethod.id}>
                {signInMethod.id === 'password' ? (
                  <DefaultLoginToggle
                    onlyOneLeft={onlyOneLeft}
                    isEnabled={isEnabled}
                    signInMethod={signInMethod}
                    onLink={this.onDefaultLoginLink}
                    onUnlink={this.onUnlink}
                  />
                ) : (
                  <SocialLoginToggle
                    onlyOneLeft={onlyOneLeft}
                    isEnabled={isEnabled}
                    signInMethod={signInMethod}
                    onLink={this.onSocialLoginLink}
                    onUnlink={this.onUnlink}
                  />
                )}
              </li>
            );
          })}
        </ul>
        {error && error.message}
      </div>
    );
  }
}


const SocialLoginToggle = ({
  onlyOneLeft,
  isEnabled,
  signInMethod,
  onLink,
  onUnlink,
}) =>
  isEnabled ? (
    <button
      type="button"
      className="btn btn-primary btn-social"
      onClick={() => onUnlink(signInMethod.id)}
      disabled={onlyOneLeft}
    >
      Deactivate {signInMethod.id}
    </button>
  ) : (
    <button
      type="button"
      className="btn btn-primary btn-social"
      onClick={() => onLink(signInMethod.provider)}
    >
      Link {signInMethod.id}
    </button>
  );

class DefaultLoginToggle extends Component {
  constructor(props) {
    super(props);

    this.state = { passwordOne: '', passwordTwo: '' };
  }

  onSubmit = (event) => {
    event.preventDefault();

    this.props.onLink(this.state.passwordOne);
    this.setState({ passwordOne: '', passwordTwo: '' });
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      onlyOneLeft,
      isEnabled,
      signInMethod,
      onUnlink,
    } = this.props;

    const { email, passwordOne, passwordTwo } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';

    return isEnabled ? (
      <button
        type="button"
        className="btn btn-danger btn-social  disabled"
        onClick={() => onUnlink(signInMethod.id)}
        disabled={onlyOneLeft}
      >
        Deactivate {signInMethod.id}
      </button>
    ) : (
      <form onSubmit={this.onSubmit}>
        <input
          hidden={true}
          name="email"
          autoComplete="email"
          value={email}
          // onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <input
          className="form-input"
          name="passwordOne"
          autoComplete="new-password"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="New Password"
        />
        <input
          className="form-input"
          name="passwordTwo"
          autoComplete="new-password"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm New Password"
        />

        <button
          className="btn btn-primary"
          disabled={isInvalid}
          type="submit"
        >
          Link {signInMethod.id}
        </button>
      </form>
    );
  }
}

const LoginManagement = withFirebase(LoginManagementBase);

const condition = (authUser) => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(AccountPage);
