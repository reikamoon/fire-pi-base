import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { AuthUserContext } from '../../Session';
import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../routes';

import { CreateProductForm } from '../../Utils';

class ProductList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      products: [],
      limit: 5,
      businessID: this.props.businessID,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase
      .products()
      .orderByChild('businessID')
      .limitToLast(this.state.limit)
      .on('value', (snapshot) => {
        const productsObject = snapshot.val();

        if (productsObject) {
          const productList = Object.keys(productsObject).map((key) => ({
            ...productsObject[key],
            uid: key,
          }));

          this.setState({
            products: productList,
            loading: false,
          });
        } else {
          this.setState({ products: null, loading: false });
        }
      });
  }

  componentWillUnmount() {
    this.props.firebase.products().off();
  }

  onNextPage = () => {
    this.setState((state) => ({ limit: state.limit + 5 }), this.onListenForProducts);
  };

  render() {
    const { products, loading } = this.state;

    return (
      <AuthUserContext.Consumer>
        {(authUser) => (
          <div className="container add-padding-bottom">
            {loading && <div>Loading ...</div>}

            {!products ? (
              <div>There are no products ...</div>
            ) : (
              <div>
                {products.length > this.state.limit && (
                  <button className="btn btn-secondary" type="button" onClick={this.onNextPage}>
                    Show More
                  </button>
                )}

                <ul className="ul-comp-list">
                  {products.map(
                    (product) =>
                      // product.businessID === authUser.business_id && (
                        <li key={product.uid} className="r-details-card">
                          <strong>Title:</strong> {product.productTitle}
                          <br />
                          {/* <strong>Location:</strong> {product.productAddress} */}
                          <strong>Description:</strong> {product.productDescription}
                          <br />
                          <strong>Price:</strong> {product.productPrice} Pi
                          <div className="row">
                            <div className="ml-3 mr-2">
                              <Link
                                to={{
                                  pathname: `${ROUTES.PRODUCTS}/${product.uid}`,
                                  state: { product },
                                }}
                              >
                                Details
                              </Link>
                            </div>
                          </div>
                          <hr />
                        </li>
                      // ),
                  )}
                </ul>
              </div>
            )}

            {authUser.roles === 'ADMIN' && <CreateProductForm authUser={authUser} />}
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default withFirebase(ProductList);
