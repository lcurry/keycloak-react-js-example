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

A shortcut would be to import the REALM provided here in this repo.  You'll need to stop rh-sso and run the following from the command line:

bin/standalone.sh -Dkeycloak.migration.action=import -Dkeycloak.migration.provider=singleFile -Dkeycloak.migration.file=./MNG-TEST-realm.json -Dkeycloak.migration.strategy=OVERWRITE_EXISTING

4. 
NPM installed locally. With this repo cloned locally. Change directories to the root of this project. 

5.
Create self-signed certificate pair for running 

 openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
(Note these files referenced from 'package.json' and are necessary for running HTTPS)

### To run the demo 

From this project directory at the command line, to install the npm module dependencies, you can run:

    npm install

To run the client application from a browser first run the command to serve the application:

    npm start

Runs the app in the development mode. Then go to the URL connect:

    Open [https://localhost:3000](https://localhost:3000) to view it in your browser.
