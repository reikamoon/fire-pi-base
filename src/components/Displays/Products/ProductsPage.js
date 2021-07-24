import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { compose } from 'recompose';

import * as ROUTES from '../../routes';
import { AuthUserContext, withAuthorization, withEmailVerification } from '../../Session';
import { CreateProductForm } from '../../Utils';
import { ProductList, ProductDetails } from './index';


const ProductsPage = () => (
  <AuthUserContext.Consumer>
    {(authUser) => (
      <div>
        <div className="jumbotron paral paralsec">
          <h1 className="display-8 text-center mb-3">Products</h1>
        </div>
        <Switch>
          <Route exact path={ROUTES.PRODUCTS} component={ProductList} />
          <Route exact path={ROUTES.PRODUCT_NEW}>
            <CreateProductForm authUser={authUser} />
          </Route>
          <Route exact path={ROUTES.PRODUCT_DETAILS} component={ProductDetails} />
        </Switch>
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = (authUser) => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(ProductsPage);
