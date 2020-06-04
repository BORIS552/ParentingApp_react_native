import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { AsyncStorage } from 'react-native';
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager
} from 'react-native-fbsdk';
import Spinner from 'react-native-loading-spinner-overlay';
import Snackbar from 'react-native-snackbar';

import { url_loginbygmail } from './Constant';


LoginManager.setLoginBehavior('WEB_ONLY');


export default class FacebookSigninPage extends Component {
	constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      email: '',
      spinner: false
    };
  }

  componentDidMount= () => {
    
  }

 initUser(token) {
  this.setState({
    spinner: true
  });

  fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + token)
  .then((response) => response.json())
  .then((json) => {
    // Some user object has been set up somewhere, build that user here
    console.log(json.name);
    console.log(json.email);
    this.setState({ first_name: json.name });
    this.setState({ email: json.email });
    this.storeUserData(this.props);  
  })
  .catch(() => {
    reject('ERROR GETTING DATA FROM FACEBOOK')
  })
}

  storeUserData = (nav) => {
    fetch(url_loginbygmail,{
         method: 'POST',
         headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
         },
         body: JSON.stringify({
          "email": this.state.email,
          "first_name": this.state.first_name})
         }).then(function (response) {
           return response.json();
         }).then((result) => {
           if(result.status ==  'success'){
             console.log(result);
             if( result.user == 'exists'){
               console.log("in exists FB");
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
            text: 'Server Error Try again Later ' + this.state.parent_id,
             duration: Snackbar.LENGTH_SHORT,
              });
         console.log(result);
      }
      }).catch(function (error) {
          this.setState({
              spinner: false
            });
          console.log("-------- error ------- "+error);
      });
  }



  onLogout = () => {
    this.setState({ first_name: null, email: null });
  };

  // storeUserData = (nav) => {
  // 	const url = 'http://192.168.0.104:8000/api/loginbygmail';
  // 	fetch(url,{
  //        method: 'POST',
  //        headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json',
  //        },
  //        body: JSON.stringify({
  //         "email": this.state.email,
  //         "first_name": this.state.first_name,
  //         "last_name": this.state.last_name})
  //        }).then(function (response) {
  //          return response.json();
  //        }).then((result) => {
  //          if(result.status ==  'success'){
  //           var parent_id = result.parent_id.toString();
  //           console.log("parent_id: " + parent_id);
  //           this.setState({parent_id: parent_id});
  //           AsyncStorage.setItem('parent_id', this.state.parent_id);
  //           Snackbar.show({
  //           text: 'Successfully Logged In ' + this.state.parent_id,
  //            duration: Snackbar.LENGTH_SHORT,
  //             });
  //           this.setState({
  //             spinner: false
  //           });
  //           nav.navigation.navigate('KidProfilePage');


  //       }else{
  //         this.setState({
  //             spinner: false
  //           });
  //        Snackbar.show({
  //           text: 'Invalid OTP: ' + this.state.parent_id,
  //            duration: Snackbar.LENGTH_SHORT,
  //             });
  //        console.log(result);
  //     }
  //     }).catch(function (error) {
  //         this.setState({
  //             spinner: false
  //           });
  //         console.log("-------- error ------- "+error);
  //         //alert("result:"+error);
  //         //AsyncStorage.setItem('parent_id', '6');
  //         //nav.navigation.navigate('KidProfilePage');
  //       //goToKidProfilePage();
  //     });
  // }

  // getCurrentUserInfo = async () => {
  //   try {
  //     const userInfo = await GoogleSignin.signInSilently();
  //     this.setState({ userInfo });
  //     console.log(userInfo);
  //   } catch (error) {
  //     if (error.code === statusCodes.SIGN_IN_REQUIRED) {
  //       // user has not signed in yet
  //       this.setState({ loggedIn: false });
  //     } else {
  //       // some other error
  //       this.setState({ loggedIn: false });
  //     }
  //   }
  // };

  // signOut = async () => {
  //   try {
  //     await GoogleSignin.revokeAccess();
  //     await GoogleSignin.signOut();
  //     this.setState({ user: null, loggedIn: false }); // Remember to remove the user from your app's state as well
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

render() {

  return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: 'center'}}>
              <LoginButton
                style={{ width: 250, height: 35 }}
                publishPermissions={['publish_actions', 'WEB_ONLY']}
                permissions={['public_profile','email']}
                onLoginFinished={
                (error, result) => {
                if (error) {
                  console.log('login has error: ', result.error)
                } else if (result.isCancelled) {
                console.log('login is cancelled.')
                } else {
                AccessToken.getCurrentAccessToken().then((data) => {
                  const { accessToken } = data
                  this.initUser(accessToken)
                })
              }
          }
        }
      onLogoutFinished={this.onLogout} />
      <Spinner
            visible={this.state.spinner}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
            </View>
        );
	}
}

const styles = StyleSheet.create({});