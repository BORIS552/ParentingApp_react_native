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
  ScrollView,
  BackHandler,
  StatusBar
} from 'react-native';
import { AsyncStorage } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-picker';
import Snackbar from 'react-native-snackbar';
import Spinner from 'react-native-loading-spinner-overlay';

import logo from '../assets/logo.png';
import backdrop from './../assets/back_main.png';
import cam from './../assets/cam.png';
import add from './../assets/add.png';
import male from './../assets/male.png';
import female from './../assets/female.png';
import mother from './../assets/mother.png';
import father from './../assets/father.png';
import continueImg from './../assets/continue.png';
import doneImg from './../assets/done.png';
import { url_add_kid, url_get_relation_type } from './Constant';
import MyTabs from './MyTabs';

export default class KidProfilePage extends Component {

  constructor(props) {
    super(props);
    this.nameTextInput = React.createRef();
    this.state = {
      avatar: cam,
      parent_id: '',
      kid_name: '',
      date: new Date(),
      Birthday: "Birthday",
      kid_gender: 'Gender',
      parent_relation: 'mother',
      gender_male_click: false,
      gender_female_click: false,
      parent_father_click: false,
      parent_mother_click: false,
      spinner: false,
      cam_add_click: false,
      image_set_status: false,
      relation_type: null
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount= () => {
    StatusBar.setBackgroundColor("#003379");
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

    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      AsyncStorage.getItem('parent_id').then((value) => {
        this.setState({ parent_id : value })
    })
    .then(res => {
      var url = url_get_relation_type+this.state.parent_id;
      fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        }
      }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({relation_type: responseJson.relation_type});
        this.setState({
        spinner: false
        });
        //this.setState({ dob: responseJson.kids[0][0].dob})
      })
    });
  
      AsyncStorage.getItem('user_email').then((value) => this.setState({ email : value }));
    });
    
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }


  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    this._unsubscribe();
  }

  handleBackButtonClick() {
    this.props.navigation.navigate('MyTabs');
    return true;
  }

  chooseFile = () => {
    this.setState({ cam_add_click: ! this.state.cam_add_click})
    var options = {
      title: 'Select Profile Photo',
       quality:1, 
       maxWidth: 800, 
       maxHeight: 800,
       storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);
      console.log(options);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let source = response;
        this.setState({ 
          image_set_status: true
        });
        this.setState({
          avatar: source,
        });
        console.log(response.fileName);
        console.log(response.type);
        console.log(response.uri);
        console.log(response.path);
      }
    });
  }


  onClickListener = (viewId) => {
    Alert.alert("Alert", "Button pressed "+viewId);
  }

  genderMaleSelected = (val) => {
     console.log("parent_id: " + this.state.parent_id);
    console.log("email: " + this.state.email);
    //Alert.alert(val + this.state.parent_id + this.state.email);
    this.setState({gender_male_click: true});
    this.setState({gender_female_click: false});
    this.setState({kid_gender: val});
  }

  genderFemaleSelected = (val) => {
     console.log("parent_id: " + this.state.parent_id);
    console.log("email: " + this.state.email);
    this.setState({gender_male_click: false});
    this.setState({gender_female_click: true});
    this.setState({kid_gender: val});
  }

  parentRelationMother = (val) => {
     console.log("parent_id: " + this.state.parent_id);
    console.log("email: " + this.state.email);
    this.setState({parent_mother_click: true});
    this.setState({parent_father_click: false});
    this.setState({parent_relation: val});
  }

  parentRelationFather = (val) => {
     console.log("parent_id: " + this.state.parent_id);
    console.log("email: " + this.state.email);
    this.setState({parent_father_click: true});
    this.setState({parent_mother_click: false});
    this.setState({parent_relation: val});
  }

  addMore = (nav) => {
    //const url = 'http://192.168.0.104:8000/api/addKid';
    // console.log(this.state.avatar.fileName);
    // console.log(this.state.avatar.type);
    // console.log(this.state.avatar.path);
    // console.log(this.state.avatar.uri);
    if(this.state.kid_name === '') {
      Snackbar.show({
            text: 'Kid Name Empty',
             duration: Snackbar.LENGTH_SHORT,
              });
      return;
    }
    if(this.state.Birthday === 'Birthday') {
      Snackbar.show({
            text: 'Kid Birthday Not Set',
             duration: Snackbar.LENGTH_SHORT,
              });
      return;
    }

    if(this.state.kid_gender === 'Gender') {
      Snackbar.show({
            text: 'Kid Gender Not Set',
             duration: Snackbar.LENGTH_SHORT,
              });
      return;
    }

    this.setState({
        spinner: true
      });
    var data = new FormData();
    data.append('profile_pic', {
      name: 'kid_profile_pic.jpg',
      type: this.state.avatar.type,
      uri: this.state.avatar.uri });
    data.append('parent_id', this.state.parent_id);
    data.append('kid_name', this.state.kid_name);
    data.append('kid_dob', this.state.Birthday);
    data.append('kid_gender', this.state.kid_gender);
    data.append('parent_kid_relation', this.state.parent_relation);
    fetch(url_add_kid,{
         method: 'POST',
         headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
         },
         body: data
         }).then(function (response) {
           return response.json();
         }).then((result) =>  {
          console.log(result);
          console.log(result.status);
           if(result.status ==  'success'){
            console.log('in success');
            nav.navigation.navigate('KidProfilePage');
            this.nameTextInput.current.clear()
            this.setState({avatar: cam});
            this.setState({kid_name: ''});
            this.setState({Birthday: 'Birthday'});
            this.setState({kid_gender: 'Gender'});
            this.setState({parent_relation: 'mother'});
            this.setState({
              spinner: false
            });
          Snackbar.show({
            text: 'Successfully Linked kid to your profile',
             duration: Snackbar.LENGTH_SHORT,
              });
        }else{
         console.log(result);
         this.setState({
              spinner: false
            });
          Snackbar.show({
            text: 'Error while Adding Kid, please Try Again',
             duration: Snackbar.LENGTH_SHORT,
              });
      }
      }).catch(function (error) {
          console.log("-------- error ------- "+error);
          //alert("result:"+error);
          this.setState({
              spinner: false
            });
          Snackbar.show({
            text: 'Server Erorr',
             duration: Snackbar.LENGTH_SHORT,
              });
      });
  }

  gotoDashboard = (nav) => {
    if( this.state.kid_name === ''){
      nav.navigation.navigate('MyTabs');
    } else {
      //const url = 'http://cinemaja.in/ParentingApp/public/api/addKid';
    // console.log(this.state.avatar.fileName);
    // console.log(this.state.avatar.type);
    // console.log(this.state.avatar.path);
    // console.log(this.state.avatar.uri);
    this.setState({
      spinner: true
    });
    var data = new FormData();
    data.append('profile_pic', {
      name: 'kid_profile_pic.jpg',
      type: this.state.avatar.type,
      uri: this.state.avatar.uri });
    data.append('parent_id', this.state.parent_id);
    data.append('kid_name', this.state.kid_name);
    data.append('kid_dob', this.state.Birthday);
    data.append('kid_gender', this.state.kid_gender);
    data.append('parent_kid_relation', this.state.parent_relation);
    fetch(url_add_kid,{
         method: 'POST',
         headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
         },
         body: data
         }).then(function (response) {
           return response.json();
         }).then((result) =>  {
          console.log(result);
          console.log(result.status);
           if(result.status ==  'success'){
            console.log('in success');
            //nav.navigation.navigate('KidProfilePage');
            this.nameTextInput.current.clear()
            this.setState({ image_set_status: false });
            this.setState({avatar: cam});
            this.setState({kid_name: ''});
            this.setState({Birthday: 'Birthday'});
            this.setState({kid_gender: 'Gender'});
            this.setState({parent_relation: 'mother'});
            this.setState({
              spinner: false
            });
          Snackbar.show({
            text: 'Successfully Linked kid to your profile',
             duration: Snackbar.LENGTH_SHORT,
              });
          nav.navigation.navigate('MyTabs');
        }else{
         console.log(result);
         this.setState({
              spinner: false
            });
          Snackbar.show({
            text: 'Error while Adding Kid, please Try Again',
             duration: Snackbar.LENGTH_SHORT,
              });
      }
      }).catch(function (error) {
          console.log("-------- error ------- "+error);
          this.setState({
              spinner: false
            });
          //alert("result:"+error);
          Snackbar.show({
            text: 'Server Erorr',
             duration: Snackbar.LENGTH_SHORT,
              });
      }); 
    }
  }

  render() {
    console.disableYellowBox = true;
    const parentSelection = <View style={styles.containerParents}>
    <TouchableOpacity activeOpacity = { .5 } onPress={() => this.parentRelationMother('Mother')}>
     <Image source={mother} style={this.state.parent_mother_click ? styles.motherStyleClicked : styles.motherStyle }/>
     </TouchableOpacity>
     <TouchableOpacity activeOpacity = { .5 } onPress={() => this.parentRelationFather('Father')}>
     <Image source={father} style={this.state.parent_father_click ? styles.fatherStyleClicked : styles.fatherStyle }/>
     </TouchableOpacity>
  </View>;

  const onlyFather = <View style={styles.containerParents}>
   <TouchableOpacity activeOpacity = { .5 } onPress={() => this.parentRelationFather('Father')}>
   <Image source={father} style={this.state.parent_father_click ? styles.fatherStyleClicked : styles.fatherStyle }/>
   </TouchableOpacity>
   </View>;

   const onlyMother = <View style={styles.containerParents}>
    <TouchableOpacity activeOpacity = { .5 } onPress={() => this.parentRelationMother('Mother')}>
     <Image source={mother} style={this.state.parent_mother_click ? styles.motherStyleClicked : styles.motherStyle }/>
     </TouchableOpacity>
  </View>;

  let parent;
    if(this.state.relation_type === null){
      parent = parentSelection;
    }else{
      if(this.state.relation_type === 'Father'){
        parent = onlyFather;
      } else {
        parent = onlyMother;
      }
    }
    return (
      <ImageBackground source={backdrop} style={styles.imageback}>
      <ScrollView>
      <View style={styles.container}>
      
      <View style={styles.textstyleView}>
        <Text style={styles.textstyle}>LET'S GET FRIENDLY WITH</Text>
        <Text style={styles.textstyle}>YOUR KID !!</Text>
      </View>


      <View style={styles.CircleShapeView}>
          <TouchableOpacity activeOpacity = { .5 } onPress={this.chooseFile.bind(this)}>
          <Image source={this.state.avatar} style={this.state.image_set_status ? styles.camstyle : styles.camstyleSmall} />
          
          <Image style={ this.state.cam_add_click ? styles.addstyleRotate : styles.addstyle} source={add} />
          </TouchableOpacity>
      </View>


        <View style={styles.inputContainer}>
          
          <TextInput style={{ fontSize: wp('5%'), color: '#FFF', alignSelf: 'stretch'}}
              placeholder="Name"
              placeholderTextColor="#FFF"
              ref={this.nameTextInput}
              textAlign={'left'}
              keyboardType="email-address"
              underlineColorAndroid='transparent'
              onChangeText={(kid_name) => this.setState({kid_name})}/>
        </View>

          <View style={styles.inputContainerGender}>
            <Text style={styles.generStyle}>{this.state.Birthday}</Text>
            <DatePicker
            style={{marginLeft: wp('14%')}}
            date={this.state.date} //initial date from state
            mode="date" //The enum of date, datetime and time
            format="DD-MM-YYYY"
            minDate="01-01-1970"
            maxDate="01-01-2060"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
              position: 'absolute',
              right: 0,
              top: 4
            },
            dateInput: { 
              borderWidth:0,
              display:"none"}
          }}
          onDateChange={(date) => {this.setState({Birthday: date})}}
        />
        </View>

        <View style={styles.inputContainerGender}>
            <Text style={styles.generStyle}>Gender</Text>
            <TouchableOpacity activeOpacity = { .5 } onPress={() => this.genderMaleSelected('Male')}>
           <Image source={male} style={this.state.gender_male_click ?  styles.genderImageMaleClicked : styles.genderImageMale} />
           </TouchableOpacity>
           <TouchableOpacity activeOpacity = { .5 } onPress={() => this.genderFemaleSelected('Female')}>
           <Image source={female} style={this.state.gender_female_click ?  styles.genderImageFemaleClicked : styles.genderImageFemale} />
           </TouchableOpacity>
        </View>

          <Spinner
            visible={this.state.spinner}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
        <View style={styles.containerParents}>
          <Text style={styles.addMoreText}>You are Kid's</Text>
        </View>
        {parent}
        <View style={styles.addMore}>
          <Text style={styles.addMoreText}>Add More</Text>
          <TouchableOpacity activeOpacity = { .5 } onPress={() => this.addMore(this.props)}>
          <Image source={add} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity  onPress={() => this.gotoDashboard(this.props)}>
          <Image source={ this.state.kid_name === '' ?  continueImg : doneImg } style={styles.continueImageButton} />
        </TouchableOpacity>
        
      </View>
      </ScrollView>
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
    alignItems: 'center',
    marginTop: hp('10%')
  },
  textstyleView: {
    alignItems: 'center',
    marginBottom: wp('5%')
  },
  textstyle: {
    color: 'white',
    fontSize: wp('5%'),
    fontFamily: 'Avenir'
  },
 CircleShapeView: {
    width: wp('30%'),
    height: hp('15%'),
    borderRadius: 150/2,
    backgroundColor: '#FFFFFF',
    marginBottom: hp('3%'),
    justifyContent: "center",
    alignItems: 'center'
  },
  camstyleSmall: {
    marginTop: hp('3%'),
    width: wp('20%'),
    marginLeft: wp('3%'),
    height: hp('10%'),
    borderRadius: 80
  },  
  camstyle: {
    marginTop: hp('4%'),
    width: wp('28%'),
    height: hp('14%'),
    borderRadius: 80
  },
  addstyle: {
    marginTop: hp('-3%'),
    marginLeft: wp('14%'),
    width: wp('12%'),
    height: hp('7%')
  },
  addstyleRotate: {
    marginTop: hp('-3%'),
    marginLeft: wp('14%'),
    width: wp('12%'),
    height: hp('7%'),
    transform: [{ rotate: '45deg'}]
  },
  inputContainer: {
      paddingLeft: wp('5%'),
      paddingTop: hp('1%'),
      backgroundColor: '#1B3F8B',
      borderRadius:50,
      width:wp('80%'),
      height:hp('7%'),
      marginBottom:hp('2%'),
      alignItems:'center',
      elevation: 10,
      shadowColor: '#FFFFFF',
      shadowOffset: { width: wp('4%'), height: hp('2%') },
      shadowOpacity: 1,
      shadowRadius: 8 
  },
inputContainerGender: {
      backgroundColor: '#1B3F8B',
      borderRadius:50,
      width:wp('80%'),
      height:hp('7%'),
      marginBottom:hp('2%'),
      flexDirection: 'row',
      alignItems:'center',
      elevation: 10,
      shadowColor: '#fff',
      shadowOffset: { width: 10, height: 10 },
      shadowOpacity: 1,
      shadowRadius: 8, 
  },
  addMore: {
    flexDirection: 'row',
    alignItems:'center',
    marginTop: 10

  },
  addMoreText: {
    color: '#FFF',
    fontSize: wp('5%')
  },
  
  generStyle: {
    color: '#FFF',
    alignItems: 'center',
    paddingLeft: wp('5%'),
    fontSize: wp('5%')
  },
  
  genderImageMale: {
    width: wp('7%'),
    marginLeft: wp('15%'),
  },
  genderImageFemale: {
    width: wp('8%'),
    marginLeft: wp('15%')
  },
  genderImageFemaleClicked: {
    width: wp('7%'),
    marginLeft: wp('15%'),
    padding: wp('4.5%'),
    borderWidth: 3,
    borderColor: '#98FC8B',
    borderRadius: 50
  },
  genderImageMaleClicked: {
    width: wp('7%'),
    marginLeft: wp('15%'),
    padding: wp('4.5%'),
    borderWidth: 3,
    borderColor: '#98FC8B',
    borderRadius: 50
  },

  motherStyle:{
    width: wp('20%'),
    height: hp('10%'),
    marginRight: wp('7%')
  },
  fatherStyle:{
    width: wp('20%'),
    height: hp('10%')
  },
  motherStyleClicked:{
    width: wp('20%'),
    height: hp('10%'),
    marginRight: wp('7%'),
    padding: wp('5%'),
    borderWidth: 3,
    borderColor: '#98FC8B',
    borderRadius: 80
  },
  fatherStyleClicked:{
    width: wp('20%'),
    height: hp('10%'),
    padding: wp('5%'),
    borderWidth: 3,
    borderColor: '#98FC8B',
    borderRadius: 80
  },
  containerParents: {
    flexDirection: 'row',
    alignItems:'center'
  },
  continueImageButton: {
    width: wp('85%'),
    height: hp('15%')
  }
});