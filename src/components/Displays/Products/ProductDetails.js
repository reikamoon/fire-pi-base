import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../../Firebase';
import { AuthUserContext } from '../../Session';
import * as ROUTES from '../../../routes';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

class ProductDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      product: null,
      editMode: false,
      businessID: '',
      productTitle: '',
      productAddress: '',
      ...props.location.state,
    };
  }

  componentDidMount() {
    if (this.state.product) {
      console.log(this.state);
      return;
    }

    this.setState({ loading: true });

    this.props.firebase.product(this.props.match.params.id).on('value', (snapshot) => {
      this.setState({
        product: snapshot.val(),
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.product(this.props.match.params.id).off();
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onToggleEditMode = () => {
    this.setState((state) => ({
      editMode: !state.editMode,
      businessID: this.state.businessID,
      productTitle: this.state.product.productTitle,
      productAddress: this.state.product.productAddress,
    }));
  };

  onSaveEdit = () => {
    const { product, productTitle, productAddress } = this.state;
    const { uid, ...productSnapshot } = product;

    this.props.firebase.product(product.uid).set({
      ...productSnapshot,
      productTitle,
      productAddress,
      editedAt: this.props.firebase.serverValue.TIMESTAMP,
    });

    this.setState({ editMode: false });
  };

  onRemoveProduct = (uid) => {
    this.props.firebase.product(uid).remove();
  };

  render() {
    const { loading, product, businessID, editMode, productTitle, productAddress } = this.state;

    const fullDateCreated = new Date(product.createdAt * 1000).toString().split(' ');
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

    const fullDateEdited = new Date(product.editedAt * 1000).toString().split(' ');
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
            {product && (
              <div>
                <h5>Product ({product.uid})</h5>
                <strong>Title:</strong> {product.productTitle}
                <br />
                {/* <strong>Location:</strong> {product.productAddress} */}
                <br />
                <strong>Business:</strong> {businessID}
                <br />
                {/* <strong>Business Owner:</strong> {product.businessOwner} */}
                <br />
                <strong>Created At:</strong> {dateCreated}
                <br />
                {product.editedAt && (
                  <p>
                    <strong>Last Edited At:</strong> {dateEdited}
                  </p>
                )}
              </div>
            )}

            {authUser.uid === product.owner.ownerID && (
              <div className="">
                {editMode ? (
                  <div>
                    <div className="container">
                      <input
                        type="text"
                        className="col-10 form-input"
                        placeholder="Name Your Product!"
                        name="productTitle"
                        value={productTitle}
                        onChange={this.onChange}
                      />
                      <input
                        type="text"
                        className="col-10 form-input"
                        placeholder="Where does it live?"
                        name="productAddress"
                        value={productAddress}
                        onChange={this.onChange}
                      />
                    </div>

                    <div className="justify-me">
                      <button className="btn btn-secondary btn-bot" onClick={this.onSaveEdit}>
                        Save Changes
                      </button>
                      <button className="btn btn-secondary btn-bot" onClick={this.onToggleEditMode}>
                        Cancel Edit
                      </button>business
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    <button className="btn-li" onClick={this.onToggleEditMode}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>

                    <button className="btn-li" tpye="button" onClick={() => this.onRemoveProduct(product.uid)}>
                      <Link to={ROUTES.PRODUCTS}><FontAwesomeIcon icon={faTrash} /></Link>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="row">
              <div className="ml-3 mr-2">
                <Link to={ROUTES.BUSINESSES}>
                  <button className="btn btn-secondary">Back</button>
                </Link>
              </div>
              {/* <div className="mr-2">
                <Link to={{ pathname: `${ROUTES.FLOORS}`, state: product }}>
                  <button className="btn btn-success">Floors List </button>
                </Link>
              </div> */}
            </div>
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default withFirebase(ProductDetail);
