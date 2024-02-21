import React, { useState } from 'react';
import './App.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import '/node_modules/primeflex/primeflex.css'
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

import Keycloak from 'keycloak-js';

const malwarewebApp = window.location.protocol + '//' + window.location.host;
const malwarewebAppUrlEncoded =  encodeURIComponent(malwarewebApp);

let initOptions = {
  url: 'https://localhost:8443/auth',
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



// Perform logout from Keycloak and external identity provider
function logoutFromAll() {
  logoutFromLoginGov();
  logoutFromKeycloak();
}
// Perform logout from Login.gov
function logoutFromLoginGov() {
  let logingovLogoutEndpt = "https://idp.int.identitysandbox.gov/openid_connect/logout?client_id=urn:gov:gsa:openidconnect.profiles:sp:sso:DHS:malware-nextgen-logout-test-fix" + "&post_logout_redirect_uri=" + malwarewebAppUrlEncoded; 
  //let logingovLogoutEndpt = "https://idp.int.identitysandbox.gov/openid_connect/logout?client_id=urn:gov:gsa:openidconnect.profiles:sp:sso:DHS:malware-nextgen-logout-test-fix" + "&post_logout_redirect_uri=" + keycloakLogoutEndptUrlEncodedUrlEndcoded;
  console.info("logout URL = " + logingovLogoutEndpt);
  // is there an asynch issue here , need to wait for window.location.replace() to complete before issuing next? 
  window.location.replace(logingovLogoutEndpt);
}

// Perform logout from Keycloak 
function logoutFromKeycloak() {
  console.info("logout using redirect_uri malwarewebAppUrlEncoded = " + malwarewebAppUrlEncoded);
  let keycloakLogoutEndpt= "https://localhost:8443/auth/realms/MNG-TEST/protocol/openid-connect/logout?client_id=react-client&post_logout_redirect_uri=" + malwarewebAppUrlEncoded;
  let keycloakLogoutEndptUrlEncoded = encodeURIComponent(keycloakLogoutEndpt);
  console.info("keycloakLogoutEndptUrlEncoded = " + keycloakLogoutEndptUrlEncoded);
  let keycloakLogoutEndptUrlEncodedUrlEndcoded = encodeURIComponent(keycloakLogoutEndptUrlEncoded);
    
  //kc.logout( { redirectUri: 'https://localhost:3000/' } );
  console.info("logout using keycloakLogoutEndpt  = " + keycloakLogoutEndpt);
  window.location.replace(keycloakLogoutEndpt);
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
          <Button onClick={() => { /* kc.logout({ redirectUri: 'http://localhost:3000/' */ logoutFromLoginGov() }} className="m-1" label='Logout Login.gov' severity="danger" />
          <Button onClick={() => { /* kc.logout({ redirectUri: 'http://localhost:3000/' */ logoutFromKeycloak() }} className="m-1" label='Logout Keycloak' severity="danger" />
          <Button onClick={() => { /* kc.logout({ redirectUri: 'http://localhost:3000/' */ logoutFromAll() }} className="m-1" label='Logout All' severity="danger" />

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
