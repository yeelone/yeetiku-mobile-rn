
import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation'
import { FontAwesome,Entypo } from '@expo/vector-icons'
import { MarketScreen, MarketItemScreen,TagsScreen  }from './screens/market'
import { ProfileScreen,ProfileInfo,ProfileNameEditor,ProfileSexEditor,ProfilePasswordEditor }  from './screens/profile'
import { PracticeIndex,Practing,QuestionComments,PracticeRecord} from './screens/practice'
import { ExamScreen,ExamPracting } from './screens/exam'
import { Register,Settings,FeedBack,About,Banks,Login,Splash} from './screens'
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
      style: { backgroundColor: '#34495e' },
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
 
  Practice: {
    screen: PracticeIndex,
    navigationOptions:{
      tabBarIcon: ({ tintColor }) => (
        <FontAwesome name="play" size={32} style={{color:tintColor}}/>
      ),
      title: '练习',
    }
  },
  ExamScreen:{
    screen:ExamScreen,
    navigationOptions:{
      tabBarIcon: ({ tintColor }) => (
        <Entypo name="hour-glass" size={32} style={{color:tintColor}} />
      ),
      title: '测试',
    }
  },
  TagsScreen:{
    screen: TagsScreen,
    navigationOptions:{
      tabBarIcon: ({ tintColor }) => (
        <FontAwesome name="tags" size={32} style={{color:tintColor}} />
      ),
      title: '分类',
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
  About: { screen: About },
  MarketScreen: { path: 'market/:type', screen: MarketScreen },
  ProfileInfo :{ screen:ProfileInfo},
  ProfileNameEditor:{ screen:ProfileNameEditor, path: 'profile-field/:name' },
  ProfileSexEditor:{ screen:ProfileSexEditor, path: 'profile-field/:sex' },
  ProfilePasswordEditor:{ screen:ProfilePasswordEditor, path: 'profile-field/:password' },
  Practing:{ path: 'practing/:type/:bankid',screen: Practing},
  ExamPracting:{ path: 'exam/practing/:id',screen: ExamPracting},
  PracticeRecord:{ screen: PracticeRecord},
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
