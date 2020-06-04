import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Alert,
  ImageBackground
} from 'react-native';
import Snackbar from 'react-native-snackbar';

import logo from '../assets/logo.png';
import backdrop from './../assets/back_main.png';
import { AsyncStorage } from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Spinner from 'react-native-loading-spinner-overlay';
import continueImg from './../assets/continue.png';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';


import { url_auth_register, url_auth_verify } from './Constant';

export default class OtpPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      phone: '',
      parent_id: '',
      page_state: true,
      spinner: false
    }
  }

  componentDidMount = () => AsyncStorage.getItem('user_email').then((value) => this.setState({ 'email': value }))

  // onClickListener = (viewId) => {

  //   Alert.alert("Alert", "Button pressed "+viewId+": "+ this.state.email);
  // }

  goToKidProfilePage = () => {
    this.props.navigation.navigate('KidProfilePage');
  }


  sendOtp = (nav) => {
    if(this.state.phone == ''){
      Snackbar.show({
      text: 'Enter phone number to proceed: ' + this.state.email,
      duration: Snackbar.LENGTH_SHORT,
      });
      return;
    }

    this.setState({page_state: false});
    this.setState({
        spinner: true
      });

      setTimeout(
        function() {
            this.setState({
        spinner: false
      });
        }
        .bind(this),
        5000
      );


    //const url = 'http://192.168.0.104:8000/api/auth/register';
    var phone = this.state.phone;
    fetch(url_auth_register,{
         method: 'POST',
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
         },
         body: JSON.stringify({
          "phone": phone
          })
         }).then(function (response) {
           return response.json();
         }).then((result) => {
          console.log(result);
           if(result.status ==  'success'){
            //nav.navigation.navigate('KidProfilePage');
            this.setState({
                spinner: false
            });
            Snackbar.show({
            text: 'OTP Generation Failed',
             duration: Snackbar.LENGTH_SHORT,
              });
            
        }else{
         //Alert.alert(result.error_msg);
          console.log(result);
          this.setState({
                spinner: false
            });
            Snackbar.show({
              text: 'OTP Generation Failed, Try Again Later',
               duration: Snackbar.LENGTH_SHORT,
              });
      }
      }).catch(function (error) {
          console.log("-------- error ------- "+error);
          this.setState({ spinner: false });
          Snackbar.show({
            text: 'OTP Generation Failed',
             duration: Snackbar.LENGTH_SHORT,
              });
      });
  }

  verifyOtp = (nav, otp) => {
    //Alert.alert("OTP: "+ otp);
    //const url = 'http://192.168.0.104:8000/api/auth/verifyotp';
    this.setState({
        spinner: true
      });

      setTimeout(
        function() {
            this.setState({
        spinner: false
      });
        }
        .bind(this),
        5000
      );


    fetch(url_auth_verify,{
         method: 'POST',
         headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
         },
         body: JSON.stringify({
          "email": this.state.email,
          "phone": this.state.phone,
          "otp": otp})
         }).then(function (response) {
           return response.json();
         }).then((result) => {
           if(result.status ==  'success'){
            var parent_id = result.parent_id.toString();
            console.log("parent_id: " + parent_id);
            this.setState({parent_id: parent_id});
            AsyncStorage.setItem('parent_id', this.state.parent_id);
            Snackbar.show({
            text: 'OTP Generated Check SMS for OTP: ' + this.state.parent_id,
             duration: Snackbar.LENGTH_SHORT,
              });
            this.setState({
              spinner: false
            });
            nav.navigation.navigate('KidProfilePage');


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

  resendOtp = (nav) => {

  }

  render() {
    console.disableYellowBox = true;
    if(this.state.page_state){
      return (
      <ImageBackground source={backdrop} style={styles.imageback}>
      <View style={styles.container}>
      <Image style={styles.logoStyle} source={logo}/>

        <View style={styles.inputContainer}>
          <TextInput style={{ fontSize: wp('5%'), color: '#FFF'}}
              placeholder="Enter your Phone Number"
              placeholderTextColor="#FFF"
              textAlign={'center'}
              keyboardType='numeric'
              underlineColorAndroid='transparent'
              onChangeText={(phone) => this.setState({phone})}/>
        </View>

        <TouchableOpacity onPress={() => this.sendOtp(this.props) }>
          <Image source={continueImg} style={styles.continueImageButton}/>
        </TouchableOpacity>

      </View>
      </ImageBackground>
    );
    } else {
       return (
      <ImageBackground source={backdrop} style={styles.imageback}>
      <View style={styles.container}>
      
        <Image style={styles.logoStyle} source={logo}/>
        <View style={styles.inputContainerOtp}>
           <TextInput style={{ fontSize: wp('5%'), color: '#FFF'}}
              placeholder="Enter your Phone Number"
              placeholderTextColor="#FFF"
              textAlign={'center'}
              keyboardType='numeric'
              underlineColorAndroid='transparent'
              onChangeText={(phone) => this.setState({phone})}/>
        </View>

        <Text style={styles.loginText}>Enter The OTP Sent on Your</Text>
        <Text style={styles.loginText}>Mail/Phone</Text>

        <OTPInputView
          style={{width: wp('50%'), height: hp('15%') }}
          pinCount={4}
          code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
          onCodeChanged = {code => { this.setState({code})}}
          autoFocusOnLoad
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          onCodeFilled = {(code => this.verifyOtp(this.props, code))}
        />
        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
        />

        <TouchableOpacity  onPress={() => this.sendOtp(this.props) }>
          <Text style={styles.loginText}>Resend OTP</Text>
        </TouchableOpacity>


      </View>
      </ImageBackground>
      );
    }
    
  }
}

const styles = StyleSheet.create({
  imageback: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width:wp('100%'),
    height:hp('100%')
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoStyle: {
    width: wp('20%'),
    height:hp('10%'),
    marginBottom:'10%',
    justifyContent: 'center'
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: 'transparent',
      borderBottomWidth: 2,
      width: wp('80%'),
      alignItems:'center'
  },
  inputContainerOtp: {
    borderBottomColor: '#F5FCFF',
      backgroundColor: 'transparent',
      borderBottomWidth: 2,
      width: wp('80%'),
      alignItems:'center',
      marginBottom: wp('5%')
  },
  loginText: {
    color: '#FFF',
    fontSize: wp('5%')
  },
  continueImageButton: {
    width: wp('85%'),
    height: hp('15%')
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 3,
  },
  underlineStyleHighLighted: {
    borderColor: "#03DAC6",
  },

  borderStyleBase: {
    width: 30,
    height: 45
  },

  borderStyleHighLighted: {
    borderColor: "#03DAC6",
  },
});