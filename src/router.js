
import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { StatusBar,Platform } from 'react-native'
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation'
import { FontAwesome } from '@expo/vector-icons'
import { MarketScreen, MarketItemScreen,TagsScreen  }from './screens/market'
import { ProfileScreen,ProfileInfo,ProfileNameEditor,ProfileSexEditor,ProfilePasswordEditor }  from './screens/profile'
import { PracticeIndex,Practing,QuestionComments } from './screens/practice'
import { Register,Settings,FeedBack,Banks,Login,Splash } from './screens'
import color from './components/colors'

const lightContentScenes = ['Home', 'Practice','Profile']
const tabNavigatorConfig  = {
  initialRouteName: 'Practice',
  tabBarComponent: TabBarBottom,
  tabBarPosition: 'bottom',
  headerMode: 'none',
  swipeEnabled: true,
  animationEnabled: true,
  lazy: true,
  tabBarOptions: {
      activeTintColor: color.theme,
      inactiveTintColor: '#d3d3d3',
      style: { backgroundColor: '#ffffff' },
  },
}

function getCurrentRouteName(navigationState) {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
        return getCurrentRouteName(route);
    }
    return route.routeName;
}

const AppNavigator = TabNavigator({
  TagsScreen:{
    screen: TagsScreen,
    navigationOptions:{
      tabBarIcon: ({ tintColor }) => (
        <FontAwesome name="tags" size={32} style={{color:tintColor}} />
      ),
      title: '分类',
    }
  },
  Practice: {
    screen: PracticeIndex,
    navigationOptions:{
      tabBarIcon: ({ tintColor }) => (
        <FontAwesome name="play" size={32} style={{color:tintColor}}/>
      ),
      title: '题库练习',
    }
  },
  ProfileScreen:{
    screen:ProfileScreen,
    navigationOptions:{
      tabBarIcon: ({ tintColor }) => (
        <FontAwesome name="user" size={32} style={{color:tintColor}} />
      ),
    }
  }
}, tabNavigatorConfig)


const MainNavigator =  StackNavigator({
  Login: { screen: Login },
  AppNavigator: { screen: AppNavigator,navigationOptions:{ header:null }  },
  MarketItemScreen:{screen: MarketItemScreen },
  Register: { screen: Register },
  FeedBack: { screen: FeedBack },
  MarketScreen: { path: 'market/:type', screen: MarketScreen },
  ProfileInfo :{ screen:ProfileInfo},
  ProfileNameEditor:{ screen:ProfileNameEditor, path: 'profile-field/:name' },
  ProfileSexEditor:{ screen:ProfileSexEditor, path: 'profile-field/:sex' },
  ProfilePasswordEditor:{ screen:ProfilePasswordEditor, path: 'profile-field/:password' },
  Practing:{ path: 'practing/:type',screen: Practing},
  QuestionComments:{ path: 'comments/:id', screen: QuestionComments},
  Banks:{screen: Banks},
}, {
  initialRouteName: 'Login',
  tintColor: color.theme,
  headerMode: 'screen',
  showIcon: true,
  navigationOptions : {
    headerStyle:{ backgroundColor: color.theme},
    headerTitleStyle:{ color: 'white'},
    headerTintColor: 'white',
  },
})


const RootNavigator =  StackNavigator({
  MainNavigator: { screen: MainNavigator },
  Splash:{screen: Splash},
}, {
  initialRouteName: 'Splash',
  headerMode: 'none',
  cardStyle: {
      backgroundColor: color.theme
    }
})

export default class App extends Component {
  render(){
    return <RootNavigator onNavigationStateChange={(prevState, currentState) => {
      }
    }/>
  }
}
