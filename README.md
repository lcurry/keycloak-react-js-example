## Demo for Keycloak using Javascript adapater from REACT application 

### About the demo 

This demo will show a browser-based client application that exposes operations on RH-SSO via the Javascript adapter. 

### Demo setup 

Before running the demo you will need the following pre-requisites:

1. 
Install latest RH-SSO 7.6.7  

You can download latest RH-SSO 7.6 and patch from [here](https://access.redhat.com/jbossnetwork/restricted/listSoftware.html?downloadType=distributions&product=core.service.rhsso) (if you don't already have a login user for Red Hat, you'll need to register a Ret Hat user to access this site.)

Instructions for installing RH-SSO and the patch can be found [here](https://access.redhat.com/documentation/en-us/red_hat_single_sign-on/7.6/html/server_installation_and_configuration_guide/installing_the_software#installing_rh_sso_from_a_zip_file)

2. 
Create a sandbox application with Login.gov 
Go to the Login.gov developer sandbox dashboard [here](https://dashboard.int.identitysandbox.gov/) ,  click "Sign-In" and proceed to create a new account if you don't already have one.
Create a test Application that will allow you to point RH-SSO and use Login.gov as an external Identity Provider to authenticate users of your application. 

3. 
Start RH-SSO and setup Realm, client for Identity brokering to Login.gov using the above application as clientId. 

To use the JavaScript adapter you must first create a client for your application in the Keycloak Admin Console. Make sure public is selected for Access Type

You also need to configure Valid Redirect URIs and Web Origins.

A recommended way to Import from URL the necessary configuration when creating the client. This can be done by importing the Autodiscovery URL from RH-SSO admin console configuration for the client. 
    https://idp.int.identitysandbox.gov/.well-known/openid-configuration
See documentation [here](https://developers.login.gov/oidc/getting-started/#auto-discovery )

4. 
NPM installed locally. With this repo cloned locally. Change directories to the root of this project. 


### To run the demo 

From this project directory at the command line, to install the npm module dependencies, you can run:

    npm install

To run the client application from a browser first run the command to serve the application:

    npm start

Runs the app in the development mode. Then go to the URL connect:

    Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

When prompted to login, click the "login.gov" option on the login screen. 

When app comes up (after successful login via login.gov) you can successfully logout completely by first clicking "Logout login.gov" and then click "Logout keycloak" 

To demonstrate the issue with kc.logout(), click the "kc.logout()" button. 
You will see error in browser :

    Client client_id is missing
    Id token hint This application is misconfigured and should not be sending id_token_hint. Please send client_id instead.

This issue is being addressed with enhancement to upstream Keycloak 24 (to be released) here:
https://github.com/keycloak/keycloak/pull/27295

