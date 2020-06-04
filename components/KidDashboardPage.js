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
  StatusBar,
  BackHandler, 
  FlatList,
  TouchableWithoutFeedback
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ImagePicker from 'react-native-image-picker';
import { AsyncStorage } from 'react-native';
import ActionBar from 'react-native-action-bar';
import Spinner from 'react-native-loading-spinner-overlay';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';


import backdrop from './../assets/back_white.png';
import cam from './../assets/cam.png';
import add from './../assets/add.png';
import male from './../assets/male.png';
import female from './../assets/female.png';
import pieChart from './../assets/pie_chart.png';
import Modal from 'react-native-modal';

import { url_kid_profile_pic, url_get_kids } from './Constant';

const Tab = createBottomTabNavigator();

export default class KidDashboardPage extends Component {

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
      profile_url: '',
      spinner: false,
      isModalVisible: false
    }
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

  }

  componentDidMount= () => {

    StatusBar.setBackgroundColor("#003379");
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
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
    AsyncStorage.getItem('user_email').then((value) => this.setState({ email : value }));
    AsyncStorage.getItem('parent_id').then((value) => { 
            this.setState({ parent_id : value });
            console.log(value);
          })
          .then(res => {
            var url = url_get_kids+this.state.parent_id;
            fetch(url, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
              'Content-Type': 'multipart/form-data',
              }
            }).then((response) => response.json())
            .then((responseJson) => {
              this.setState({ kidsList: responseJson.kids})
              console.log("Res size"+this.state.kidsList.length);
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
              var profile_url = url_kid_profile_pic+this.state.kid_id+"-profile.jpg";
              console.log(profile_url);
              this.setState({ profile_url: profile_url});
              this.setState({
              spinner: false
              });
              //this.setState({ dob: responseJson.kids[0][0].dob})
            })
          });
    
    //console.log("parent_id: "+ this.state.parent_id);
    //console.log("user_email: "+ this.state.email);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  Logout = () => {
    // var web_client_id = '876183140922-kisb74sunh3rh6q2t2gqbov4iftpbje9.apps.googleusercontent.com';
    // var web_client_secret = 'dF_k38HEyy8Xefo7oi9zQssM';
    this.setState({isModalVisible: !this.state.isModalVisible});
    AsyncStorage.clear();
    this.props.navigation.navigate('LoginPage')
  }


  handleBackButtonClick() {
   
   BackHandler.exitApp();
    return true;
  }

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  onClickListener = (viewId) => {
    //Alert.alert("Alert", "Button pressed "+viewId);
    console.log("parent_id: "+ this.state.parent_id);
    console.log("user_email: "+ this.state.email);
    this.props.navigation.navigate('VaccinePage');
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
          profile_url: source,
        });
      }
    });
  }

  clearState() {
    this.setState({ kid_id: ''});
    this.setState({})
  }
  setKidData = (kid)=> {
    this.setState({isModalVisible: !this.state.isModalVisible});
    this.setState({
      spinner: true
      });
    setTimeout(() => {
      console.log(kid);
     
    this.clearState();
   this.setState({ kid_id: kid.user_id});
    console.log(this.state.kid_id);
    console.log(kid.first_name);
    console.log(kid.dob);
    this.setState({ KidName: kid.first_name});
    this.setState({ dob: kid.dob});
    console.log(this.state.dob);
    console.log(kid.gender);
    if( !kid.weight){
          this.setState({ weight: 'not set'});
    }else {
      var weight_str = kid.weight + " " + "Kg";
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
    console.log(kid.dob);
    var profile_url = url_kid_profile_pic+this.state.kid_id+"-profile.jpg";
    console.log(profile_url);
    this.setState({ profile_url: profile_url});
    this.setState({
      spinner: false
    });
    }, 2000);
   
  }

  addKid = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
    this.props.navigation.navigate('KidProfilePage');
  }

  gotoUnderProgress = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
    this.props.navigation.navigate('UnderProgressPage');
  }
  render() {
    return (
      <ImageBackground source={backdrop} style={styles.imageback}>
      <ActionBar
        containerStyle={styles.bar}
         title={'Parenting'}
        leftIconName={'back'}
        onLeftPress={() => this.props.navigation.navigate('KidProfilePage')}
        rightIcons={[
          {
            name: 'menu',
            onPress: () => this.toggleModal(),
          },
        ]}/>
      <View style={styles.container}>

      <Modal isVisible={this.state.isModalVisible} style={{ alignSelf: 'flex-end', marginTop: hp('-45%')}}>
          
          <View style={styles.menuInfo}>
          <TouchableHighlight style={styles.menubuttonstyleInfo} onPress={() => this.toggleModal()}>
                <Text style={styles.menubtntxtInfo }>Account</Text>
          </TouchableHighlight>
          </View>
          <View style={{justifyContent: 'center',
                      alignItems: 'center' }}>
          <View style={{
                    width: wp('60%'),
                    height: hp('45%'),
                    backgroundColor: '#FFF',
                    borderRadius: 10,
                    padding: wp('3%')
                     }}>

          <View style={{ height: hp('8%')}}>
          <FlatList
            data={this.state.kidsList}
            horizontal={true}
            
            renderItem={({item}) => (
            <View style={{ height: hp('10%'), width: wp('20%'), marginLeft: wp('5%'), marginTop: hp('2%')}}>

            <TouchableHighlight style={this.state.kid_id == item[0].user_id ? styles.menubuttonstyleSelected : styles.menubuttonstyle} onPress={() => this.setKidData(item[0])}>
                <Text style={this.state.kid_id == item[0].user_id ? styles.menubtntxtWhite : styles.menubtntxtBlue }>{item[0].first_name}</Text>
            </TouchableHighlight>
            </View>

          )}
          keyExtractor={(item, index) => index.toString()}
        />
        </View>
          <View style={styles.menucontainer}>
          <TouchableHighlight style={styles.menubuttonstyleSelected} onPress={() => this.addKid()}>
                <Text style={styles.menubtntxtWhite }>+Add</Text>
          </TouchableHighlight>
          </View>
          
          <View style={styles.menucontainerlist}>
            <TouchableOpacity  onPress={() => this.gotoUnderProgress() }>
            <Text style={{ color: '#003379', fontWeight:'bold'  ,fontSize: wp('4%'), marginLeft: '2%', marginRight: '2%', marginBottom: '5%'}}>Location</Text>
            </TouchableOpacity>

            <TouchableOpacity  onPress={() => this.gotoUnderProgress() }>
            <Text style={{ color: '#003379', fontWeight:'bold' ,fontSize: wp('4%'), marginLeft: '2%', marginRight: '2%', marginBottom: '5%'}}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity  onPress={() => this.gotoUnderProgress() }>
            <Text style={{ color: '#003379', fontWeight:'bold'  ,fontSize: wp('4%'), marginLeft: '2%', marginRight: '2%', marginBottom: '5%'}}>Privacy Policy</Text>
            </TouchableOpacity>

            <TouchableOpacity  onPress={() => this.gotoUnderProgress() }>
            <Text style={{ color: '#003379', fontWeight:'bold'  ,fontSize: wp('4%'), marginLeft: '2%', marginRight: '2%', marginBottom: '5%'}}>Terms and Conditions</Text>
            </TouchableOpacity>

            <TouchableOpacity  onPress={() => this.gotoUnderProgress() }>
            <Text style={{ color: '#003379', fontWeight:'bold'  ,fontSize: wp('4%'), marginLeft: '2%', marginRight: '2%', marginBottom: '5%'}}>Account Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity  onPress={() => this.Logout() }>
            <Text style={{ color: '#003379', fontWeight:'bold'  ,fontSize: wp('4%'), marginLeft: '2%', marginRight: '5%', marginBottom: '5%', textAlign: 'right'}}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menucontainer}>
          <TouchableHighlight style={styles.menubuttonstyleSelectedClose} onPress={() => this.toggleModal()}>
                <Text style={styles.menubtntxtWhite }>Close</Text>
          </TouchableHighlight>
          </View>
       
           </View>
           </View>
        </Modal>


      <ScrollView>
        <View style={styles.kidHeader}>
          <View style={styles.CircleShapeView}>
            <Image source={{ uri: this.state.profile_url === '' ? this.state.cam : this.state.profile_url }} style={styles.camstyle} />
            <TouchableOpacity activeOpacity = { .5 } onPress={this.chooseFile.bind(this)}>
              <Image style={styles.addstyle} source={add} />
            </TouchableOpacity>
          </View>


          <View style={styles.kidsDetails}>
            <Text style={styles.textStyleName}>{this.state.KidName}</Text>
            <Text style={styles.textStyle}>Age: {this.state.kidAge}</Text>
            <Text style={styles.textStyle}>Weight: {this.state.weight}</Text>
            <Text style={styles.textStyleDob}>D.O.B: {this.state.dob}</Text>
          </View>
        </View>


          {/* <View style={{ alignItems: 'center'}}>
            <Image source={pieChart} />
          </View> */}
      
          <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
        />

        

        <View style={styles.healthReport}>
          <Text style={{ color: '#003379', fontSize: wp('6%'), fontWeight: 'bold', marginLeft: wp('4%'), marginBottom: hp('2%')}}>Health Report</Text>
          <View style={{ flexDirection: 'row'}}>


       
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={{ backgroundColor: "#fff", borderRadius: 10, overflow: "hidden", elevation: 15 }}>
          <View
          style={{
                height: hp('12%'),
                width: wp('30%')
              }}>
          </View>
          <View style={{ backgroundColor: "#CCFD7D", padding: wp('2%'), width: wp('30%') }}>
            <Text style={{ textAlign: 'center', fontSize: 20,
            color: '#003379',
            fontWeight: 'bold'}}>Title</Text>
          </View>
        </View>
      </View>
     


      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={{ backgroundColor: "#fff", borderRadius: 10, overflow: "hidden", elevation: 15 }}>
          <View
          style={{
                height: hp('12%'),
                width: wp('30%')
              }}>
          </View>
          <View style={{ backgroundColor: "#CCFD7D", padding: wp('2%'), width: wp('30%') }}>
            <Text style={{ textAlign: 'center', fontSize: 20,
            color: '#003379',
            fontWeight: 'bold'}}>Title</Text>
          </View>
        </View>
      </View>



      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={{ backgroundColor: "#fff", borderRadius: 10, overflow: "hidden", elevation: 15 }}>
          <View
          style={{
                height: hp('12%'),
                width: wp('30%')
              }}>
          </View>
          <View style={{ backgroundColor: "#CCFD7D", padding: wp('2%'), width: wp('30%') }}>
            <Text style={{ textAlign: 'center', fontSize: 20,
            color: '#003379',
            fontWeight: 'bold'}}>Title</Text>
          </View>
        </View>
      </View>


      </View>
      </View>


        <View style={styles.skillReport}>
          <Text style={{ color: '#003379', fontSize: wp('6%'), fontWeight: 'bold', marginLeft: wp('4%'), marginBottom: hp('2%')}}>Skill Report</Text>
          <View style={{ flexDirection: 'row'}}>


           
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={{ backgroundColor: "#fff", borderRadius: 10, overflow: "hidden", elevation: 15 }}>
          <View
          style={{
                height: hp('12%'),
                width: wp('30%')
              }}>
          </View>
          <View style={{ backgroundColor: "#CCFD7D", padding: wp('2%'), width: wp('30%') }}>
            <Text style={{ textAlign: 'center', fontSize: 20,
            color: '#003379',
            fontWeight: 'bold'}}>Title</Text>
          </View>
        </View>
      </View>


      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={{ backgroundColor: "#fff", borderRadius: 10, overflow: "hidden", elevation: 15 }}>
          <View
          style={{
                height: hp('12%'),
                width: wp('30%')
              }}>
          </View>
          <View style={{ backgroundColor: "#CCFD7D", padding: wp('2%'), width: wp('30%') }}>
            <Text style={{ textAlign: 'center', fontSize: 20,
            color: '#003379',
            fontWeight: 'bold'}}>Title</Text>
          </View>
        </View>
      </View>



      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={{ backgroundColor: "#fff", borderRadius: 10, overflow: "hidden", elevation: 15 }}>
          <View
          style={{
                height: hp('12%'),
                width: wp('30%')
              }}>
          </View>
          <View style={{ backgroundColor: "#CCFD7D", padding: wp('2%'), width: wp('30%') }}>
            <Text style={{ textAlign: 'center', fontSize: 20,
            color: '#003379',
            fontWeight: 'bold'}}>Title</Text>
          </View>
        </View>
      </View>

      </View>
        </View>


        <View style={styles.knowledgeReport}>
          <Text style={{ color: '#003379', fontSize: wp('6%'), fontWeight: 'bold', marginLeft: wp('4%'), marginBottom: hp('2%')}}>Knowledge Report</Text>
          <View style={{ flexDirection: 'row'}}>


           
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={{ backgroundColor: "#fff", borderRadius: 10, overflow: "hidden", elevation: 15 }}>
          <View
          style={{
                height: hp('12%'),
                width: wp('30%')
              }}>
          </View>
          <View style={{ backgroundColor: "#CCFD7D", padding: wp('2%'), width: wp('30%') }}>
            <Text style={{ textAlign: 'center', fontSize: 20,
            color: '#003379',
            fontWeight: 'bold'}}>Title</Text>
          </View>
        </View>
      </View>


      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={{ backgroundColor: "#fff", borderRadius: 10, overflow: "hidden", elevation: 15 }}>
          <View
          style={{
                height: hp('12%'),
                width: wp('30%')
              }}>
          </View>
          <View style={{ backgroundColor: "#CCFD7D", padding: wp('2%'), width: wp('30%') }}>
            <Text style={{ textAlign: 'center', fontSize: 20,
            color: '#003379',
            fontWeight: 'bold'}}>Title</Text>
          </View>
        </View>
      </View>



      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={{ backgroundColor: "#fff", borderRadius: 10, overflow: "hidden", elevation: 15 }}>
          <View
          style={{
                height: hp('12%'),
                width: wp('30%')
              }}>
          </View>
          <View style={{ backgroundColor: "#CCFD7D", padding: wp('2%'), width: wp('30%') }}>
            <Text style={{ textAlign: 'center', fontSize: 20,
            color: '#003379',
            fontWeight: 'bold'}}>Title</Text>
          </View>
        </View>
      </View>

      </View>
        </View>

        </ScrollView>

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
  healthReport: {
    flexDirection:'column',
    marginTop: hp('5%'),
    width: wp('100%')
  },
  skillReport: {
    flexDirection:'column',
     marginTop: hp('5%'),
     width: wp('100%')
  },
  knowledgeReport: {
    flexDirection:'column',
     marginTop: hp('5%'),
    width: wp('100%'),
    marginBottom: hp('5%')
  },
  kidsDetails: {
      marginTop: hp('-8%'),
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
     marginTop: wp('6%'),
     marginLeft: wp('9%')
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
  },
  menubuttonstyle: {
    height: hp('4%'),
    width: wp('20%'),
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#003379'
  },
  menubuttonstyleSelected: {
    height: hp('4%'),
    width: wp('20%'),
    backgroundColor: '#003379',
    borderRadius: 8
  },
  menubuttonstyleSelectedClose: {
    height: hp('4%'),
    width: wp('60%'),
    backgroundColor: '#003379',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginBottom: hp('-5%')
  },
  menubtntxtWhite: {
    marginTop: hp('1%'),
    textAlign: 'center',
    color: '#FFF',
    fontWeight: 'bold'
  },
  menubtntxtInfo: {
    marginTop: hp('1%'),
    textAlign: 'center',
    color: '#003379',
    fontWeight: 'bold',
    fontSize: wp('4%')
  },
  menubtntxtBlue: {
    marginTop: hp('1%'),
    textAlign: 'center',
    color: '#003379',
    fontWeight: 'bold'
  },
  menucontainer: {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'center',
  },
  menuInfo: {
  },  
  menucontainerlist: {
    marginTop: hp('5%')
  },
  menubuttonstyleInfo: {
    height: hp('8%'),
    width: wp('22%'),
    backgroundColor: '#CCFD7D',
    borderRadius: 8,
    marginBottom: hp('-4%')
  },
  inputContainerLine: {
    borderBottomColor: '#000',
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    width: wp('20$%'),
    marginBottom: hp('2%'),
    alignItems:'center'
}
});