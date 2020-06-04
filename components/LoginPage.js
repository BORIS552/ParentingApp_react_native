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
  ImageBackground,
  CheckBox,
  ScrollView
} from 'react-native';

import { AsyncStorage } from 'react-native';
import Snackbar from 'react-native-snackbar';

import logo from '../assets/logo.png';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import backdrop from './../assets/back_main.png';
import orline from './../assets/or.png';
import GoogleImg from './../assets/google.png';
import FacebookImg from './../assets/facebook.png';
import conitinueImg from './../assets/continue.png';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

export default class LoginPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      tnc: false
    }
  }

  componentDidMount = () => {
    AsyncStorage.getItem('parent_id')
    .then((value) => {
      if(value){
        this.props.navigation.navigate('MyTabs');
      }
    })
  }
  continueButton = () => {
    if(this.state.email == ''){
     Snackbar.show({
      text: 'Email Cannot Be Blank',
      duration: Snackbar.LENGTH_SHORT,
      });
      return;
    }

    if(!this.state.tnc) {
        Snackbar.show({
      text: 'Please Accept Terms and Conditions',
      duration: Snackbar.LENGTH_SHORT,
      });
      return;
    }
    AsyncStorage.setItem('user_email', this.state.email);
    this.props.navigation.navigate('OtpPage')
  }

  googleSignin = () => {
    if(!this.state.tnc) {
        Snackbar.show({
      text: 'Please Accept Terms and Conditions',
      duration: Snackbar.LENGTH_SHORT,
      });
      return;
    }
    this.props.navigation.navigate('GoogleSignInPage');
  }

  facebookSignin = () => {
    if(!this.state.tnc) {
        Snackbar.show({
      text: 'Please Accept Terms and Conditions',
      duration: Snackbar.LENGTH_SHORT,
      });
      return;
    }
    this.props.navigation.navigate('FacebookSignInPage');
  }
  
  render() {
    console.disableYellowBox = true;
    
    return (

      <ImageBackground source={backdrop} style={styles.imageback}>
      <View style={styles.container}>


        <Text style={{ color: "#fff", fontSize: wp('8%'), fontWeight: 'bold', marginBottom: wp('2%'), fontFamily: 'Avenir'}}>Welcome To Parentip</Text>
        <Text style={{ color: "#fff", fontSize: wp('5%'), marginBottom: 30, fontFamily: 'Avenir'}}>Enter your Email ID</Text>


        <View style={styles.inputContainer}>
          <TextInput style={{ fontSize: wp('5%'), color: '#FFF'}}
              placeholder="Enter your Email here"
              textAlign={'left'}
              keyboardType="email-address"
              underlineColorAndroid='transparent'
              onChangeText={(email) => this.setState({email})}/>
        </View>


        <TouchableOpacity  onPress={() => this.continueButton() }>
          <Image source={conitinueImg} style={styles.continueImageButton}/>
        </TouchableOpacity>


        <View style={{ flexDirection: 'row'}}>
            <View style={styles.inputContainerLine}>
            </View>
            <Text style={{ color: '#FFF', fontSize: 20, marginLeft: '2%', marginRight: '2%'}}>OR</Text>
            <View style={styles.inputContainerLine}>
            </View>
        </View>

        <Text style={styles.loginText}>Join/Sign Up Using</Text>


        <TouchableOpacity onPress={() => this.googleSignin() }>
          <Image source={GoogleImg} style={styles.googleImageButton}/>
        </TouchableOpacity>
        

        <TouchableOpacity onPress={() => this.facebookSignin() }>
          <Image source={FacebookImg} style={styles.facebookImageButton}/>
        </TouchableOpacity>

        <View style={styles.checkboxContainer}>
        <CheckBox
          value={this.state.tnc}
          onValueChange={() => this.setState({ tnc: !this.state.tnc })}
        />
        <Text style={styles.label}>Agree To Terms and Conditions</Text>
        </View>
        
      </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    margin: 8,
    color: '#FFF',
    fontSize: wp('4%'),
    fontWeight: 'bold'
  },
  checkboxContainer: {
    flexDirection: "row",
    marginTop: wp('5%'),
  },
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
    alignItems: 'center',
    height: hp('90%'),
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: 'transparent',
      borderBottomWidth: 2,
      width: wp('80%'),
      alignItems:'center'
  },
  inputContainerLine: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: 'transparent',
      borderBottomWidth: 1,
      width:wp('40%'),
      marginBottom:wp('2.5%'),
      alignItems:'center'
  },
  loginText: {
    marginBottom: wp('5%'),
    color: '#FFF',
    fontSize: wp('6%'),
    fontWeight: 'bold',
    fontFamily:'Avenir'
  },
  continueImageButton: {
    width: wp('85%'),
    height: hp('15%')
  },
  googleImageButton: {
    width: wp('70%'),
    height: hp('7%')
  },
  facebookImageButton:{
    width: wp('70%'),
    height: hp('7%')
  }
});