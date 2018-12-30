import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import * as routes from './constants/routes';
import { firebase } from './firebase';
import { withAuthentication } from './firebase/withAuthentication';
import { Account } from './pages/Account';
import { Home } from './pages/Home';
import { Landing } from './pages/Landing';
import { PasswordForget } from './pages/PasswordForget';
import { SignIn } from './pages/SignIn';
import { Navigation } from './components/Navigation';
// import { SignUp } from './pages/SignUp';

class AppComponent extends React.Component {
  constructor(props: any) {
    super(props);

    this.state = {
      authUser: null
    };
  }

  public componentDidMount() {
    firebase.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.setState(() => ({ authUser }));
        authUser.getIdToken().then(token => {
          localStorage.setItem('jwt', token);
        });
      } else {
        this.setState(() => ({ authUser: null }));
      }
    });
  }

  public render() {
    return (
      <BrowserRouter>
        <div>
          <Navigation />
          <hr />
          <Switch>
            <Route exact={true} path={routes.LANDING} component={Landing} />
            {/* <Route exact={true} path={routes.SIGN_UP} component={SignUp} /> */}
            <Route exact={true} path={routes.SIGN_IN} component={SignIn} />
            <Route
              exact={true}
              path={routes.PASSWORD_FORGET}
              component={PasswordForget}
            />
            <Route exact={true} path={routes.HOME} component={Home} />
            <Route exact={true} path={routes.ACCOUNT} component={Account} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export const App = withAuthentication(AppComponent);
