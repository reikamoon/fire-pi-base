import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { AuthUserContext } from '../../Session';
import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../routes';

class BusinessList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      businesses: [],
      limit: 5,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase
      .businesses()
      .orderByChild('id')
      .limitToLast(this.state.limit)
      .on('value', (snapshot) => {
        const businessObject = snapshot.val();

        if (businessObject) {
          const businessList = Object.keys(businessObject).map((key) => ({
            ...businessObject[key],
            uid: key,
          }));

          this.setState({
            businesses: businessList,
            loading: false,
          });
        } else {
          this.setState({ businesses: null, loading: false });
        }
      });
  }

  componentWillUnmount() {
    this.props.firebase.businesses().off();
  }

  onNextPage = () => {
    this.setState(
      (state) => ({ limit: state.limit + 5 }),
      this.onListenForBusinesses,
    );
  };


  render() {
    const { businesses, loading } = this.state;

    return (
      <AuthUserContext.Consumer>
        {(authUser) => (
          <div className="container add-padding-bottom">
            {loading && <div>Loading ...</div>}

            {!businesses ? (
              <div>There are no businesses ...</div>
            ) : (
              <div>
                {businesses.length > this.state.limit && (
                  <button className="btn btn-secondary" type="button" onClick={this.onNextPage}>
                    Show More
                  </button>
                )}

                <ul className="ul-comp-list">
                  {businesses.map(
                    (business) =>
                      business.uid === authUser.business_id && (
                        <li key={business.uid} className="r-details-card">
                          <strong>Title:</strong> {business.businessTitle}
                          <br />
                          <strong>Location:</strong> {business.businessAddress}
                          <br />
                          <div className="row">
                            <div className="ml-3 mr-2">
                              <Link
                                to={{
                                  pathname: `${ROUTES.BUSINESSES}/${business.uid}`,
                                  state: { business },
                                }}
                              >
                                Details
                              </Link>
                            </div>
                          </div>
                          <hr />
                        </li>
                      ),
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default withFirebase(BusinessList);
