import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../routes';

class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val();

      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }));

      this.setState({
        users: usersList,
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    const { users, loading } = this.state;

    return (
      <div className="add-padding-bottom">
        <h2>Users</h2>
        {loading && <div>Loading ...</div>}
        <ul>
          {users.map((user) => (
            <li key={user.uid}>
              <span>
                <strong>ID:</strong> {user.uid}
              </span>
              <br />
              <span>
                <strong>E-Mail:</strong> {user.email}
              </span>
              <br />
              <span>
                <strong>Username:</strong> {user.username}
              </span>
              <br />
              <span>
                <Link
                  to={{
                    pathname: `${ROUTES.ADMIN}/${user.uid}`,
                    state: { user },
                  }}
                >
                  Details
                </Link>
              </span>
              <hr />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default withFirebase(UserList);
