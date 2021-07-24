import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../../Firebase';
import { AuthUserContext } from '../../Session';
import * as ROUTES from '../../../routes';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

class BusinessDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      loading: false,
      business: null,
      businessTitle: '',
      businessAddress: '',
      ...props.location.state,
    };
  }

  componentDidMount() {
    if (this.state.business) {
      return;
    }

    this.setState({ loading: true });

    this.props.firebase.business(this.props.match.params.id).on('value', (snapshot) => {
      this.setState({
        business: snapshot.val(),
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.business(this.props.match.params.id).off();
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onToggleEditMode = () => {
    this.setState((state) => ({
      editMode: !state.editMode,
      businessTitle: this.state.business.businessTitle,
      businessAddress: this.state.business.businessAddress,
    }));
  };

  onSaveEdit = () => {
    const { business, businessTitle, businessAddress } = this.state;
    const { uid, ...businessSnapshot } = business;

    this.props.firebase.business(business.uid).set({
      ...businessSnapshot,
      businessTitle,
      businessAddress,
      editedAt: this.props.firebase.serverValue.TIMESTAMP,
    });

    this.setState({ editMode: false });
  };

  onRemoveBusiness = (uid, userID) => {
    let dbUSER = this.props.firebase.user(userID)
    dbUSER.child('businesses').child(uid).remove();
    dbUSER.child('business_id').remove();
    this.props.firebase.business(uid).remove();
    console.log("REMOVED Business: ", uid, dbUSER);
  };

  render() {
    const { loading, business, editMode, businessTitle, businessAddress } = this.state;

    const fullDateCreated = new Date(business.createdAt * 1000).toString().split(' ');
    const dateCreated =
      fullDateCreated[0] +
      ', ' +
      fullDateCreated[1] +
      ' ' +
      fullDateCreated[2] +
      ', ' +
      fullDateCreated[4] +
      ', ' +
      fullDateCreated[6] +
      fullDateCreated[7] +
      fullDateCreated[8];

    const fullDateEdited = new Date(business.editedAt * 1000).toString().split(' ');
    const dateEdited =
      fullDateEdited[0] +
      ', ' +
      fullDateEdited[1] +
      ' ' +
      fullDateEdited[2] +
      ', ' +
      fullDateEdited[4] +
      ', ' +
      fullDateEdited[6] +
      fullDateEdited[7] +
      fullDateEdited[8];

    return (
      <AuthUserContext.Consumer>
        {(authUser) => (
          <div className="container">
            {loading && <div>Loading ...</div>}

            {/* Display */}
            {business && (
              <div>
                <h5>Business ({business.uid})</h5>
                <strong>Title:</strong> {business.businessTitle}
                <br />
                <strong>Location:</strong> {business.businessAddress}
                <br />
                <strong>Business Owner:</strong> {business.ownerID}
                <br />
                <strong>Created At:</strong> {dateCreated}
                <br />
                {business.editedAt && (
                  <p>
                    <strong>Last Edited At:</strong> {dateEdited}
                  </p>
                )}
                <br />
                {business.buildingList && (
                  <p>
                    <strong>Products List:</strong> {business.buildingsList}
                  </p>
                )}
              </div>
            )}

            {authUser.uid === business.owner.ownerID && (
              <div className="">
                {editMode ? (
                  <div>
                    <div className="container">
                      <input
                        type="text"
                        className="form-input form-control"
                        placeholder="Business name..."
                        name="businessTitle"
                        value={businessTitle}
                        onChange={this.onChange}
                      />
                      <input
                        type="text"
                        className="form-input form-control"
                        placeholder="Address..."
                        name="businessAddress"
                        value={businessAddress}
                        onChange={this.onChange}
                      />
                    </div>

                    <div className="justify-me">
                      <button className="btn btn-secondary btn-bot" onClick={this.onSaveEdit}>
                        Save Changes
                      </button>
                      <button className="btn btn-secondary btn-bot" onClick={this.onToggleEditMode}>
                        Cancel Edit
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    <button className="btn-li" onClick={this.onToggleEditMode}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>

                    <button className="btn-li" type="button" onClick={(auhtUser) => this.onRemoveBusiness(business.uid, auhtUser.uid)}>
                      <Link to={ROUTES.BUSINESSES}><FontAwesomeIcon icon={faTrash} /></Link>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            {/* <div className="row">
              <div className="ml-3 mr-2">
                <Link to={ROUTES.BUSINESSES}>
                  <button className="btn btn-secondary">Back</button>
                </Link>
              </div>
              <div className="mr-2">
                <Link to={{ pathname: `${ROUTES.PRODUCTS}`, state: business }}>
                  <button className="btn btn-success">Products List</button>
                </Link>
              </div>
            </div> */}
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default withFirebase(BusinessDetail);
