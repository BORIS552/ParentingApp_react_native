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
  BackHandler
} from 'react-native';

import DatePicker from 'react-native-datepicker';
import logo from '../assets/logo.png';
import backdrop from './../assets/back_main.png';
import cam from './../assets/cam.png';
import add from './../assets/add.png';
import male from './../assets/male.png';
import female from './../assets/female.png';
import mother from './../assets/mother.png';
import father from './../assets/father.png';

import MyTabs from './MyTabs';

export default class UnderProgressPage extends Component {

  constructor(props) {
    super(props);
    // this.state = {
    // }
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }
  componentDidMount = ()=> {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.props.navigation.navigate('MyTabs');
    return true;
  }

  render() {
    return (
      <ImageBackground source={backdrop} style={styles.imageback}>
      <View style={styles.container}>
          <Text style={{  color: '#fff', fontSize: 50, fontWeight: 'bold'}}>Under Progress</Text>
      </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  addMore: {
    flexDirection: 'row',
      alignItems:'center',
  },
  addMoreText: {
    color: '#FFF',
    fontSize: 20
  },
  camstyle: {
    marginTop: 20,
    width: 90,
    height: 90
  },
  generStyle: {
    color: '#FFF',
    alignItems: 'center',
    marginLeft: 15,
    fontSize: 20
  },
  addstyle: {
    marginTop: -20,
    marginLeft: 70,
    width: 60,
    height: 60
  },
  imageback: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  genderImageMale: {
    width: 30,
    marginLeft: 50
  },
  genderImageFemale: {
    width: 30,
    marginLeft: 50,
    marginTop: 10
  },
  CircleShapeView: {
    width: 150,
    height: 150,
    borderRadius: 150/2,
    backgroundColor: '#FFFFFF',
    marginBottom: 50,
    justifyContent: "center",
    alignItems: 'center'
  },
  textstyleView: {
    alignItems: 'center',
    marginTop: -150,
    marginBottom: 20
  },
  textstyle: {
    color: 'white',
    fontSize: 30,
    fontWeight: "bold"
  },
  container: {
    marginTop: 250,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainer: {
      backgroundColor: '#1B3F8B',
      borderRadius:8,
      width:350,
      height:60,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center',
      elevation: 10,
      shadowColor: '#fff',
      shadowOffset: { width: 1, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 8, 
  },
  inputContainerGender: {
      backgroundColor: '#1B3F8B',
      borderRadius:8,
      width:350,
      height:60,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center'
  },
  containerParents: {
    flexDirection: 'row',
    alignItems:'center'
  },
  inputs:{
    color: '#fff',
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
  },
  logoStyle: {
    width:150,
    height:150,
    marginBottom:15,
    marginTop:-100,
    justifyContent: 'center'
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:350,
    borderRadius:8,
  },
  loginButton: {
    backgroundColor: "#00b5ec"
  },
  loginText: {
    color: 'white',
  }
});