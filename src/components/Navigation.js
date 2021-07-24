import React from 'react';
import { Link } from 'react-router-dom';

import { AuthUserContext } from './Session';
import * as ROUTES from '../routes';
import { faHome, faShoppingCart, faCompass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Navigation = () => (
  <AuthUserContext.Consumer>
    {(authUser) => !!authUser && (
      <div className="tab-wrapper">
        <div className="container">
          <div className="row">
            <nav defaultactivekey="/home">
              <div className="nav nav-tabs" id="nav-tab" role="tablist">
                <Link
                  className="nav-item nav-link"
                  id="nav-home-tab"
                  data-toggle="tab"
                  role="tab"
                  aria-controls="nav-home"
                  aria-selected="false"
                  to={ROUTES.HOME}
                >
                  {/* <FontAwesomeIcon icon={faHome} /> */}
                  <FontAwesomeIcon icon={faShoppingCart} /> Shop Online
                </Link>
                
                <Link
                  className="nav-item nav-link"
                  id="nav-account-tab"
                  data-toggle="tab"
                  role="tab"
                  aria-controls="nav-account"
                  aria-selected="false"
                  to={ROUTES.ACCOUNT}
                >
                  Manage Your Account
                  <br /> & <br />
                  Set Up A Free Store
                </Link>
                
                <Link
                  className="nav-item nav-link"
                  id="nav-buildings-tab"
                  data-toggle="tab"
                  role="tab"
                  aria-controls="nav-buildings"
                  aria-selected="false"
                  to={ROUTES.BUSINESSES}
                >
                  <FontAwesomeIcon icon={faCompass} /> Find Pi Shops Near You
                </Link>
                {/* {authUser.business_id && ( DO Something )} */}

                
                {authUser.roles === 'ADMIN' && (
                  <Link
                    className="nav-item nav-link"
                    id="nav-admin-tab"
                    data-toggle="tab"
                    role="tab"
                    aria-controls="nav-admin"
                    aria-selected="false"
                    to={ROUTES.ADMIN}
                  >
                    Admin
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    )}
  </AuthUserContext.Consumer>
);

export default Navigation;
