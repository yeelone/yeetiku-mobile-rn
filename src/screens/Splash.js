/* @flow */

import React, { Component } from 'react'
import { View,Text,ActivityIndicator,StyleSheet,TouchableOpacity } from 'react-native'
import { observer, inject } from 'mobx-react'
import { LinearGradient } from 'expo'
import { NavigationActions } from 'react-navigation'
import styled from 'styled-components/native'
import { registerErrorCallback,registerSuccessCallback } from '../utils/request'
import { ConfigManager,setHttpBaseUrl } from '../utils'
@inject('userStore')
@observer
export default class Splash extends Component {
  static navigationOptions = {
    title: '启动页',
  }

  async componentDidMount(){
    
    registerErrorCallback((status)=>{
      if ( status.status === 401 ) {
        userStore.logout()
        this.navTo('MainNavigator')
      }
    })

    const config = ConfigManager.getInstance()
    await config.getConfig()
    this.props.userStore.setDomain(config.config.domain)
    setHttpBaseUrl(config.config.domain,config.config.apiPrefix)
    this.navTo('MainNavigator')
  }

  navTo = (routeName) => {
    const resetActions = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName})]
    })
    this.props.navigation.dispatch(resetActions)
  }

  render() {
    return (
      <LinearGradient
          colors={['#8ef378', '#1cbbb4']}
          style={{flex:1}}
          >
            <LogoContainer>
              <LogoImage source={require('../images/logo.png')} />
            </LogoContainer>
      </LinearGradient>

    )
  }
}

const LogoContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex-grow:2;
`

const LogoImage = styled.Image`
  height:150;
  width:150;
  border-radius:20 ;
`
