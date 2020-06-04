import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './LoginPage';
import OtpPage from './OtpPage';
import KidProfilePage from './KidProfilePage';
import KidDashboardPage from './KidDashboardPage';
import GoogleSignInPage from './GoogleSignInPage';
import FacebookSignInPage from './FacebookSignInPage';
import VaccinePage from './VaccinePage';
import UnderProgressPage from './UnderProgressPage';
import MyTabs from './MyTabs';
import MenuPage from './MenuPage';
const Stack = createStackNavigator();

export default function HomePage() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginPage" screenOptions={{ headerShown: false}}>
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="OtpPage" component={OtpPage} />
        <Stack.Screen name="KidProfilePage" component={KidProfilePage} />
        <Stack.Screen name="KidDashboardPage" component={KidDashboardPage} />
        <Stack.Screen name="GoogleSignInPage" component={GoogleSignInPage} />
        <Stack.Screen name="FacebookSignInPage" component={FacebookSignInPage} />
        <Stack.Screen name="VaccinePage" component={VaccinePage} />
        <Stack.Screen name="MenuPage" component={MenuPage} />
        <Stack.Screen name="MyTabs" component={MyTabs} />
        <Stack.Screen name="UnderProgressPage" component={UnderProgressPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
