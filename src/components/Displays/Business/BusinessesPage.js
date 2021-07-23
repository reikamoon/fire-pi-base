import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { compose } from 'recompose';

import * as ROUTES from '../../../routes';
import { AuthUserContext, withAuthorization, withEmailVerification } from '../../Session';
import { CreateBusinessForm } from '../../Utils';
import { BusinessList, BusinessDetails } from './index';

const BusinessesPage = () => (
  <AuthUserContext.Consumer>
    {(authUser) => (
      <div>
        <div className="jumbotron paral paralsec">
          <h1 className="display-8 text-center mb-3">Businesses</h1>
        </div>

        <Switch>
          <Route exact path={ROUTES.BUSINESSES} component={BusinessList} />
          <Route exact path={ROUTES.BUSINESSES_NEW}>
            <CreateBusinessForm authUser={authUser} />
          </Route>
          <Route exact path={ROUTES.BUSINESSES_DETAILS} component={BusinessDetails} />
        </Switch>
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = (authUser) => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(BusinessesPage);
