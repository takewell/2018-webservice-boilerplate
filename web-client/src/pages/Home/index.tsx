import * as React from 'react';
// import { auth } from '../../firebase';
import { withAuthorization } from '../../firebase/withAuthorization';
import { UserList } from './UserList';

class HomeComponent extends React.Component {
  constructor(props: any) {
    super(props);

    this.state = {
      users: null,
      msg: null
    };
  }

  public async componentDidMount() {
    fetch('http://localhost:8080/api/auth', {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt')
      }
    }).then(res => {
      res.json().then(json => {
        console.log(json);
      });
    });
    // });
  }

  public render() {
    const { users, msg }: any = this.state;

    return (
      <div>
        <h2>Home Page</h2>
        <p>The Home Page is accessible by every signed in user.</p>
        <p>{msg}</p>
        {!!users && <UserList users={users} />}
      </div>
    );
  }
}

const authCondition = (authUser: any) => !!authUser;

export const Home = withAuthorization(authCondition)(HomeComponent);
