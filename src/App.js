import * as React from "react";
import { Admin, Resource, ListGuesser } from 'react-admin';
import { createBrowserHistory } from 'history';
import authProvider from './authProvider';
import jsonServerProvider from 'ra-data-json-server';
import LoginPage from './LoginPage'




const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');
const history = createBrowserHistory();

const App = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    history={history}
    loginPage={LoginPage}
  >
    <Resource name="users" list={ListGuesser} />
  </Admin>
);

export default App;