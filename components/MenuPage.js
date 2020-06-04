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
  TouchableOpacity,
  BackHandler,
  StatusBar
} from 'react-native';
import { AsyncStorage } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

import backdrop from './../assets/back_main.png';

import conitinueImg from './../assets/continue.png';

import MyTabs from './MyTabs';

export default class OrganizerPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount=() => {
    StatusBar.setBackgroundColor("#003379");
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
   this.props.navigation.navigate('MyTabs');
    return true;
  }

  Logout = () => {
    // var web_client_id = '876183140922-kisb74sunh3rh6q2t2gqbov4iftpbje9.apps.googleusercontent.com';
    // var web_client_secret = 'dF_k38HEyy8Xefo7oi9zQssM';
    
    AsyncStorage.clear();
    this.props.navigation.navigate('LoginPage')
  }

  addKid = () => {
    this.props.navigation.navigate('KidProfilePage');
  }


  render() {
    return (
      <ImageBackground source={backdrop} style={styles.imageback}>
      <View style={styles.container}>
       <TouchableOpacity  onPress={() => this.addKid() }>
          <Text style={{ color: '#FFF', fontSize: 30, marginLeft: '2%', marginRight: '2%', marginBottom: '5%'}}>Add Kids</Text>
          </TouchableOpacity>
        <View style={styles.inputContainerLine}>
        </View>
         <TouchableOpacity  onPress={() => this.Logout() }>
          <Text style={{ color: '#FFF', fontSize: 30, marginLeft: '2%', marginRight: '2%', marginBottom: '5%'}}>Logout</Text>
          </TouchableOpacity>
        <View style={styles.inputContainerLine}>
        </View>
      </View>
      </ImageBackground>
    );
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
  inputContainerLine: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: 'transparent',
      borderBottomWidth: 1,
      width:'60%',
      marginBottom:'2.5%',
      alignItems:'center'
  }
});