import React, { useState } from 'react';
import './App.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import '/node_modules/primeflex/primeflex.css'
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

import Keycloak from 'keycloak-js';
//import Keycloak from 'keycloak-connect';

let initOptions = {
  url: 'http://localhost:8080/auth',
  realm: 'MNG-TEST',
  clientId: 'react-client',
  onLoad: 'login-required', // check-sso | login-required
  KeycloakResponseType: 'code',
  // silentCheckSsoRedirectUri: (window.location.origin + "/silent-check-sso.html")
}

// these are malware init options
//let initOptions = {
//  url: process.env.REACT_APP_SSO_URL, 
//  realm: process.env.REACT_APP_REALM, 
//  clientId: process.env.REACT_APP_CLIENTID, 
//  onLoad: 'login-required'
//}

let kc = new Keycloak(initOptions);
//let kc = new Keycloak();
//let kc = new Keycloak('./public/keycloak.json');

kc.init({
  onLoad: initOptions.onLoad,
  KeycloakResponseType: 'code',
  silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html", 
  checkLoginIframe: false,
  pkceMethod: 'S256',
  enableLogging: true
}).then((auth) => {
  if (!auth) {
    window.location.reload();
  } else {
    console.info("Authenticated");
    console.log('auth', auth)
    console.log('Keycloak', kc)
    kc.onTokenExpired = () => {
      console.log('token expired')
    }
  }
}, () => {
  console.error("Authenticated Failed");
});

// Perform Keycloak logout
function logout() {
  kc.logout( { redirectUri: 'http://localhost:3000/' } );
}

// Perform logout from Keycloak and external identity provider
function logoutFromAll() {
   // Redirect to Login.gov logout endpoint
  window.location.replace("https://idp.int.identitysandbox.gov/openid_connect/logout"); // Example logout URL, replace with actual URL provided by Login.gov
 // Logout from Keycloak
 logout();

}


function App() {

  const [infoMessage, setInfoMessage] = useState('');

  return (
    <div className="App">
      {/* <Auth /> */}
      <div className='grid'>
        <div className='col-12'>
          <h1>My Awesome React App</h1>
        </div>
        <div className='col-12'>
          <h1 id='app-header-2'>Secured with Keycloak</h1>
        </div>
      </div>
      <div className="grid">
        <div className="col">
        <Button onClick={() => { setInfoMessage(kc.authenticated ? 'Authenticated: TRUE' : 'Authenticated: FALSE') }} className="m-1" label='Is Authenticated' />
         
          <Button onClick={() => { kc.login() }} className='m-1' label='Login' severity="success" />
          <Button onClick={() => { setInfoMessage(kc.token) }} className="m-1" label='Show Access Token' severity="info" />
          <Button onClick={() => { setInfoMessage(JSON.stringify(kc.tokenParsed)) }} className="m-1" label='Show Parsed Access token' severity="info" />
          <Button onClick={() => { setInfoMessage(kc.isTokenExpired(5).toString()) }} className="m-1" label='Check Token expired' severity="warning" />
          <Button onClick={() => { kc.updateToken(10).then((refreshed)=>{ setInfoMessage('Token Refreshed: ' + refreshed.toString()) }, (e)=>{setInfoMessage('Refresh Error')}) }} className="m-1" label='Update Token (if about to expire)' />  {/** 10 seconds */}
          <Button onClick={() => { /* kc.logout({ redirectUri: 'http://localhost:3000/' */ logoutFromAll() }} className="m-1" label='Logout' severity="danger" />
          
        </div>
      </div>

      {/* <div className='grid'>
      <div className='col'>
        <h2>Is authenticated: {kc.authenticated}</h2>
      </div>
        </div> */}


      <div className='grid'>
        <div className='col-2'></div>
        <div className='col-8'>
        <h3>Info Pane</h3>
          <Card>
            <p style={{ wordBreak: 'break-all' }} id='infoPanel'>
              {infoMessage}
            </p>
          </Card>
        </div>
        <div className='col-2'></div>
      </div>



    </div>
  );
}


export default App;
