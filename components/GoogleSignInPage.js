import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert,
  ImageBackground,
  ScrollView, 
  Dimensions 
} from 'react-native';
import { AsyncStorage } from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import Spinner from 'react-native-loading-spinner-overlay';
import Snackbar from 'react-native-snackbar';
import { url_loginbygmail } from './Constant';

export default class GoogleSignInPage extends Component {
	constructor(props) {
    super(props);
    this.state = {
      email: '',
       userInfo: [],
      loggedIn: false,
      first_name: '',
      last_name: '',
      parent_id: ''
    }
  }

  componentDidMount() {
  	GoogleSignin.configure({
  		scopes: ["https://www.googleapis.com/auth/userinfo.email"],
		  webClientId: '876183140922-kisb74sunh3rh6q2t2gqbov4iftpbje9.apps.googleusercontent.com', 
		  offlineAccess: true, 
		  hostedDomain: '',
		  forceConsentPrompt: true,
  });
  }

  _signIn = async () => {
  	console.log("sign in clicked");
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({ userInfo: userInfo, loggedIn: true });
      
      console.log(userInfo);
      console.log(userInfo.user.email);
      console.log(userInfo.user.name);
      console.log(userInfo.user.givenName);
      console.log(userInfo.user.familyName);

      this.setState({ email: userInfo.user.email });
      this.setState({ first_name: userInfo.user.givenName });
      this.setState({ last_name: userInfo.user.familyName });
      console.log("success");
      this.storeUserData(this.props);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      	console.log("error 1")
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
      	console.log("error 2")
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      	console.log("error 3")
        // play services not available or outdated
      } else {
      	console.log("error 4")
        // some other error happened
      }
    }
  };

  storeUserData = (nav) => {
  	//const url = 'http://192.168.0.104:8000/api/loginbygmail';
  	fetch(url_loginbygmail,{
         method: 'POST',
         headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
         },
         body: JSON.stringify({
          "email": this.state.email,
          "first_name": this.state.first_name,
          "last_name": this.state.last_name})
         }).then(function (response) {
           return response.json();
         }).then((result) => {
           if(result.status ==  'success'){
            console.log(result);
             if( result.user == 'exists'){
              var parent_id = result.parent_id.toString();
              console.log("parent_id: " + parent_id);
              this.setState({parent_id: parent_id});
              AsyncStorage.setItem('parent_id', this.state.parent_id);
              AsyncStorage.setItem('user_email', this.state.email);
              AsyncStorage.setItem('user_phone', result.phone);
              Snackbar.show({
              text: 'Successfully Logged In ' + this.state.parent_id,
               duration: Snackbar.LENGTH_SHORT,
                });
              this.setState({
                spinner: false
              });
              nav.navigation.navigate('KidProfilePage');
             }else {
              var parent_id = result.parent_id.toString();
              console.log("parent_id: " + parent_id);
              this.setState({parent_id: parent_id});
              AsyncStorage.setItem('parent_id', this.state.parent_id);
              AsyncStorage.setItem('user_email', this.state.email);
              Snackbar.show({
              text: 'Successfully Logged In ' + this.state.parent_id,
               duration: Snackbar.LENGTH_SHORT,
                });
              this.setState({
                spinner: false
              });
              nav.navigation.navigate('OtpPage');
            }

        }else{
          this.setState({
              spinner: false
            });
         Snackbar.show({
            text: 'Invalid OTP: ' + this.state.parent_id,
             duration: Snackbar.LENGTH_SHORT,
              });
         console.log(result);
      }
      }).catch(function (error) {
          this.setState({
              spinner: false
            });
          console.log("-------- error ------- "+error);
          //alert("result:"+error);
          //AsyncStorage.setItem('parent_id', '6');
          //nav.navigation.navigate('KidProfilePage');
        //goToKidProfilePage();
      });
  }

  getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      this.setState({ userInfo });
      console.log(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // user has not signed in yet
        this.setState({ loggedIn: false });
      } else {
        // some other error
        this.setState({ loggedIn: false });
      }
    }
  };

  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({ user: null, loggedIn: false }); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

render() {

  return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: 'center'}}>
               <GoogleSigninButton
				style={{ width: 250, height: 80 }}
				size={GoogleSigninButton.Size.Wide}
				color={GoogleSigninButton.Color.Dark}
				onPress={this._signIn}
				disabled={this.state.isSigninInProgress} />
            </View>
        );
	}
}