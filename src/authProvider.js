import { UserManager } from 'oidc-client';

const issuer = process.env.REACT_APP_OAUTH_ISSUER;
const clientId = process.env.REACT_APP_OAUTH_CLIENT_ID;
const redirectUri = process.env.REACT_APP_OAUTH_REDIRECT_URI;
const scopes = process.env.REACT_APP_OAUTH_SCOPES;

const userManager = new UserManager({
  authority: issuer,
  client_id: clientId,
  redirect_uri: redirectUri,
  response_type: 'code',
  scope: scopes
});

const authProvider = {
  login: async (params = {}) => {
    console.log("called login");

    /*
    * Step 1. ask auth code via redirect flow
    */

    // We need to check that a params object is actually passed otherwise it will fail.
    if (!params || !params.code || !params.state) {
      //redirect for auth flow
      userManager.signinRedirect();
      // Here we reject the request because there is no notification shown, but we can add an object if we want to add logic in the login call.
      return Promise.reject({ message: 'Retrieving code from authentication service.', code: 'oauthRedirect' });
    }


    /*
    * Step 2. exchange auth code for token
    */
    // Remove stale states, this is 
    userManager.clearStaleState();
    var user = await userManager.signinRedirectCallback();
    console.log("got user from callback ");
    console.dir(user);

    return Promise.resolve();
  },
  logout: async () => {
    console.log("called logout");

    //remove user info
    await userManager.removeUser();

    return Promise.resolve();
  },
  checkError: (error) => {
    console.log("called checkError");

    const { status } = error;

    if (status && (status === 401 || status === 403)) {

      return Promise.reject();
    }
    return Promise.resolve();
  },
  checkAuth: async () => {
    console.log("called checkAuth");

    //lookup user
    const user = await userManager.getUser();

    if (!user || !user.hasOwnProperty("access_token")) {
      //missing or invalid user
      await userManager.removeUser();
      return Promise.reject()
    }

    //extract jwt and validate locally for expiration
    const jwt = user.access_token;
    const now = new Date();


    return now.getTime() > (jwt.exp * 1000) ? Promise.reject() : Promise.resolve()
  },
  getPermissions: async (params = {}) => {
    console.log("called getPermission");
    // const user = localStorage.getItem('user')

    // return user ? Promise.resolve(user) : Promise.reject()
    return Promise.resolve();
  }
}

export default authProvider;