import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import KidDashboardPage from './KidDashboardPage';
import OtpPage from './OtpPage';
import OrganizerPage from './OrganizerPage';
import LearnAndFunPage from './LearnAndFunPage';

import * as React from 'react';
import {
  Image
} from 'react-native';
import MyKid from './../assets/mykid.png';
import Organizer from './../assets/organizer.png';
import LearnAndFun from './../assets/learnfun.png';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="KidDashboardPage"
      tabBarOptions={{
        activeTintColor: '#e91e63',
      }}
    >
      <Tab.Screen
        name="LearnAndFunPage"
        component={LearnAndFunPage}
        options={{
          tabBarLabel: 'Learn&Fun',
          tabBarIcon:() =>( <Image source={LearnAndFun} />),
        }}
      />
      <Tab.Screen
        name="KidDashboardPage"
        component={KidDashboardPage}
        options={{
          tabBarLabel: 'My Kid',
          tabBarIcon:() =>( <Image source={MyKid} />),
        }}
      />
      <Tab.Screen
        name="OrganizerPage"
        component={OrganizerPage}
        options={{
          tabBarLabel: 'Organizer',
          tabBarIcon:() =>( <Image source={Organizer} />),
        }}
      />
    </Tab.Navigator>
  );
}