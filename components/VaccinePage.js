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
  ScrollView
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-picker';
import { AsyncStorage } from 'react-native';
import ActionBar from 'react-native-action-bar';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';



import logo from '../assets/logo.png';
import backdrop from './../assets/back_white.png';
import cam from './../assets/cam.png';
import add from './../assets/add.png';
import male from './../assets/male.png';
import female from './../assets/female.png';
import mother from './../assets/mother.png';
import father from './../assets/father.png';
import report from './../assets/report.png';
import pieChart from './../assets/pie_chart.png';

const Tab = createBottomTabNavigator();

export default class VaccinePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
       avatar: cam,
      KidName: '',
      kidAge: '',
      weight: '',
      dob: '',
      parent_id: '',
      kid_id: '',
      email: '',
      kidsList: [],
      profile_url: ''
    }

  }

  componentDidMount= () => {
    StatusBar.setBackgroundColor("#003379");
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    AsyncStorage.getItem('user_email').then((value) => this.setState({ email : value }));
    AsyncStorage.getItem('parent_id').then((value) => { 
            this.setState({ parent_id : value });
          })
          .then(res => {
            var url = 'http://cinemaja.in/ParentingApp/public/api/getKids/'+this.state.parent_id;
            fetch(url, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
              'Content-Type': 'multipart/form-data',
              }
            }).then((response) => response.json())
            .then((responseJson) => {
              this.setState({ kid_id: responseJson.kids[0][0].user_id});
              console.log(this.state.kid_id);
              console.log(responseJson.kids[0][0].first_name);
              this.setState({ KidName: responseJson.kids[0][0].first_name});
              this.setState({ dob: responseJson.kids[0][0].dob});
              console.log(responseJson.kids[0][0].gender);
              if( !responseJson.kids[0][0].weight){
                this.setState({ weight: 'not set'});
              }else {
                var weight_str = responseJson.kids[0][0].weight + " " + "Kg";
                this.setState({ weight: weight_str});
              }
              var today = new Date();
              var state_dob = this.state.dob;
              var date_parts = this.state.dob.split('-');
              var dob_date = new Date(date_parts[2], date_parts[1]-1, date_parts[0]);
              console.log(dob_date);
              console.log(dob_date.toDateString());
              this.setState({ dob: dob_date.toDateString()});
              var age_now = today.getFullYear() - dob_date.getFullYear();
              console.log(age_now);
              this.setState({ kidAge: age_now});
              console.log(responseJson.kids[0][0].dob);
              var profile_url = "http://192.168.0.104:8000/profiles/"+this.state.kid_id+"-profile.jpg";
              console.log(profile_url);
              this.setState({ profile_url: profile_url});
              //this.setState({ dob: responseJson.kids[0][0].dob})
            })
          });
    
    //console.log("parent_id: "+ this.state.parent_id);
    //console.log("user_email: "+ this.state.email);
  }


  onClickListener = (viewId) => {
    Alert.alert("Alert", "Button pressed "+viewId);
    console.log("parent_id: "+ this.state.parent_id);
    console.log("user_email: "+ this.state.email);
  }

  chooseFile = () => {
    var options = {
      title: 'Select Profile Photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let source = response;
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          avatar: source,
        });
      }
    });
  }


  genderSelected = (val) => {
    Alert.alert(val);

  } 
  addMore = () => {
    this.props.navigation.navigate('OtpPage');
  }
  render() {
    return (
      <ImageBackground source={backdrop} style={styles.imageback}>
      <ActionBar
        containerStyle={styles.bar}
        leftIconName={'back'}
        onLeftPress={() => this.props.navigation.navigate('KidDashboardPage')}
        rightIcons={[
          {
            name: 'menu',
            onPress: () => this.props.navigation.navigate('MenuPage'),
          },
        ]}/>
      <View style={styles.container}>




          

      </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: '#003379',
    shadowOffset: { height: 0, width: 0 },
    borderBottomWidth: 0
  },
  kidsDetails: {
      marginTop: hp('-10%'),
      marginLeft: wp('12%')
  },
  textStyleName: {
    fontSize: wp('4.5%'),
    color: '#98FC8B',
    fontWeight: 'bold'

  },
  textStyle: {
    fontSize: wp('4%'),
    color: '#fff'
  },
  textStyleDob: {
    fontSize: wp('4%'),
    color: '#fff'
  },
  kidHeader: {
     flexDirection: 'row',
     alignItems: 'center',
     marginTop: 40
  },
  camstyle: {
    marginTop: hp('2.5%'),
    width: wp('28%'),
    height: hp('14%'),
    borderRadius: 80
  },
  addstyle: {
    marginTop: hp('-4%'),
    marginLeft: wp('14%'),
    width: wp('12%'),
    height: hp('7%')
  },
  imageback: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width:wp('100%'),
    height:hp('100%')
  },

  CircleShapeView: {
    width: wp('30%'),
    height: hp('15%'),
    borderRadius: 150/2,
    backgroundColor: '#FFFFFF',
    marginBottom: hp('3%'),
    justifyContent: "center",
    alignItems: 'center',
    borderWidth: 0
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});