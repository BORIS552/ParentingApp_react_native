import React from 'react';
import { StyleSheet, View, Text, Image, ImageBackground } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';    
import backdrop from './assets/back_main.png';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import { AsyncStorage } from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRealApp: false,
    };
  }
  componentDidMount = () => {
    AsyncStorage.getItem('parent_id')
    .then((value) => {
      if(value){
        this.setState({ showRealApp: true });
      }
    })
  }
  _onDone = () => {
    this.setState({ showRealApp: true });
  };
  _onSkip = () => {
    this.setState({ showRealApp: true });
  };
  _renderItem = ({ item }) => {
    console.disableYellowBox = true;
    return (
      <ImageBackground source={backdrop} style={styles.imageback}>
      <View
        style={{
          flex: 1,
          backgroundColor: item.backgroundColor,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <Text style={styles.title}>{item.title}</Text>
        <Image style={styles.image} source={item.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
      </ImageBackground>
    );
  };
  render() {
    if (this.state.showRealApp) {
      return (
          <HomePage />
      );
    } else {
      return (
        <AppIntroSlider
          data={slides}
          renderItem={this._renderItem}
          onDone={this._onDone}
          showSkipButton={true}
          onSkip={this._onSkip}
        />
      );
    }
  }
}
const styles = StyleSheet.create({
  imageback: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  image: {
    width: 200,
    height: 200,
    backgroundColor:'transparent'
  },
  text: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    paddingVertical: 30,
  },
  title: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
});

const slides = [
  {
    key: 's1',
    text: '',
    title: 'Welcome to Parenting App',
    image: require('./assets/logo.png')
  },
  {
    key: 's2',
    title: '',
    text: '',
    image: require('./assets/logo.png')
  },
  {
    key: 's3',
    title: '',
    text: '',
    image: require('./assets/logo.png')
  },
];