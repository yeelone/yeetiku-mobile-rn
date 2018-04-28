/* @flow */

import React, { Component } from 'react'
import { observable } from 'mobx'
import { View,Text,Button,ToastAndroid,ActivityIndicator,StyleSheet,TouchableOpacity,KeyboardAvoidingView,BackHandler } from 'react-native'
import { observer, inject } from 'mobx-react'
import { NavigationActions } from 'react-navigation'
import { LinearGradient } from 'expo'
import { getUser,getLoginStatus } from '../utils/jwtToken'
import styled from 'styled-components/native'
import LoginForm from '../components/login/LoginForm'
import { ConfigManager } from '../utils'
import { requestConfig } from '../services/config'

@inject('userStore')
@observer
export default class Login extends Component {
  @observable checking = false
  static navigationOptions = {
    title: 'Login',
    header:null
  }

  constructor(props){
    super(props)
    this.lastBackPressed = 0
  }

  componentDidMount() {
      this.checking = true
      BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid )
      getLoginStatus().then( async (data)=>{
        await this.props.userStore.setLoginedUser(data.user)
        if ( data.isLoginedIn ) {
          this.checking = false
          const resetActions = NavigationActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({routeName: 'AppNavigator'})]
          })
          this.props.navigation.dispatch(resetActions)
        }
        this.checking = false
      }).catch((error) => {
        this.checking = false
      })
  }

  componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid)
  }

  onBackAndroid = () => {
      if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
         return false
      }
      this.lastBackPressed = Date.now()
      ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT)
      return true
  }

  _getConfigurationFromServer = () => {
    const config = ConfigManager.getInstance()
    requestConfig().then( (res)=>{
      if ( res.body.config ){
        config.setConfig(res.body.config)
      }
    })
  }

  handlerSubmit = () => {
    const { userStore , navigation} = this.props
    userStore.login( async ()=>{
        if ( userStore.isLoginedIn ) {
          // await this._getConfigurationFromServer()
          const resetActions = NavigationActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({routeName: 'AppNavigator'})]
          })
          navigation.dispatch(resetActions)
        }
    })
  }

  fillLoginForm = async () => {
      const { userStore } = this.props
      const config = ConfigManager.getInstance()
      await config.getConfig()

      userStore.setGuestUser(config.config.guestAccount, config.config.guestPassword)
  }

  render() {
    const { userStore,navigation } = this.props
    const { loading } = userStore
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <LinearGradient
            colors={[ '#1cbbb4','#8ef378']}
            style={{flex:1}}
            >
              <LogoContainer>
                <Logo source={require('../images/icon.png')} />
              </LogoContainer>

              {this.checking ?
                <ActivityIndicator
                animating={loading}
                size="small" />
                :
                <FormContainer>
                  <LoginForm onSubmit={() => this.handlerSubmit()}/>
                  <TouchableOpacity style={{justifyContent: 'center',alignItems: 'center'}} onPress={()=> navigation.navigate("Register")}>
                      <Text style={{color:"#cccccc",backgroundColor:"rgba(0,0,0,0)"}}>还没有账号？点击注册</Text>
                  </TouchableOpacity>
                </FormContainer>
              }

              <TouchableOpacity style={{justifyContent: 'center',alignItems: 'center',padding:20,}} onPress={()=> this.fillLoginForm() }>
                  <Text style={{color:"#cccccc",backgroundColor:"rgba(0,0,0,0)"}}>游客体验</Text>
              </TouchableOpacity>

              { loading ?
                <View>
                  <ActivityIndicator
                    animating={true}
                    style={[styles.centering, {height: 80}]}
                    size="large"
                  />
                  <Text>正在连接到{userStore.domain}...</Text>
                </View>
                :null
                  }
        </LinearGradient>
        </KeyboardAvoidingView>
    );
  }
}

const LogoContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex-grow:2;
`

const Logo = styled.Image`
  height:150;
  width:150;
  border-radius:20 ;
`

const Title = styled.Text`
  color: white ;
  margin-top:10;
  width:140;
  text-align:center;
  opacity:0.9;
`

const FormContainer = styled.View`
  flex-grow:2;
`

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  }
})
