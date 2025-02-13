import React from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { AuthUserContext, withAuthentication } from './Session';
import * as ROUTES from './routes';
import Navigation from './Navigation';
import PromptSaveBookmark from './Utils/PromptSaveBookmark';

import { SignUpPage, SignInPage, PasswordForgetPage } from './Auth';

import {
  LandingPage,
  NotFoundPage,
  AccountPage,
  AdminPage,
  BusinessesPage,
  ProductsPage,
  PI_PURCHASE,
} from './Displays';

const App = () => (
  <Router>
    <div>
      {/* <div className="hidden text-center">
        <div className="row desktop-banner">
          <div className="col">
            <img className="littler-square" alt="logo" src={Logo} />
            <h3>
              <br></br>
              Visit us on mobile to get the full experience!
            </h3>
          </div>
        </div>
      </div> */}
      <div className="site-content">
        <AuthUserContext.Consumer>
          {(authUser) =>
            authUser ? (
              <Switch>
                <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />

                <Route path={ROUTES.ADMIN} component={AdminPage} />
                <Route path={ROUTES.ACCOUNT} component={AccountPage} />
                <Route path={ROUTES.BUSINESSES} component={BusinessesPage} />
                <Route path={ROUTES.PRODUCTS} component={ProductsPage} />
                <Route path={ROUTES.PI_PURCHASE} component={PI_PURCHASE} />
                
                <Route exact path={ROUTES.HOME}>
                  <Redirect to={ROUTES.PI_PURCHASE} />
                </Route>
                <Route exact path={ROUTES.LANDING}>
                  <Redirect to={ROUTES.HOME} />
                </Route>
                <Route path={ROUTES.SIGN_UP}>
                  <Redirect to={ROUTES.HOME} />
                </Route>
                <Route path={ROUTES.SIGN_IN}>
                  <Redirect to={ROUTES.HOME} />
                </Route>

                <Route path={ROUTES.NOT_FOUND} component={NotFoundPage} />
              </Switch>
            ) : (
              <Switch>
                <Route exact path={ROUTES.LANDING} component={LandingPage} />
                <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
                <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
                <Route exact path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />

                <Route path={ROUTES.HOME}>
                  <Redirect to={ROUTES.SIGN_IN} />
                </Route>
                <Route path={ROUTES.ADMIN}>
                  <Redirect to={ROUTES.SIGN_IN} />
                </Route>
                <Route path={ROUTES.ACCOUNT}>
                  <Redirect to={ROUTES.SIGN_IN} />
                </Route>
                <Route path={ROUTES.BUSINESSES}>
                  <Redirect to={ROUTES.SIGN_IN} />
                </Route>

                <Route path={ROUTES.NOT_FOUND} component={NotFoundPage} />
              </Switch>
            )
          }
        </AuthUserContext.Consumer>

        <PromptSaveBookmark />
        <Navigation />
      </div>
    </div>
  </Router>
);

export default withAuthentication(App);
