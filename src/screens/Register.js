/* @flow */

import React, { Component } from 'react'
import { View,Text,Button,Image,ActivityIndicator,StyleSheet,TouchableOpacity,KeyboardAvoidingView } from 'react-native'
import { observer, inject } from 'mobx-react'
import { LinearGradient } from 'expo'
import styled from 'styled-components/native'
import RegisterForm from '../components/login/RegisterForm'

@inject('userStore')
@observer
export default class Register extends Component {
  static navigationOptions = {
    title: 'Login',
    header:null
  }

  handlerSubmit = (email, password) => {
    const { userStore,navigation } = this.props
    userStore.registerNewUser({ email, password },()=> {
      navigation.navigate("Login")
    } )
  }

  render() {
    const { userStore,navigation } = this.props
    const { loading } = userStore
    return (
      <KeyboardAvoidingView behavior="padding" style={{flex:1,justifyContent: 'center'}}>
        <LinearGradient
            colors={['#8ef378', '#1cbbb4']}
            style={{flex:1}}
            >
              <LogoContainer>
                <LogoImage source={require('../images/logo.png')} />
              </LogoContainer>

              <FormContainer>
                <RegisterForm onSubmit={this.handlerSubmit}/>
                <TouchableOpacity style={{justifyContent: 'center',alignItems: 'center'}} onPress={()=> navigation.navigate("Login")}>
                    <Text style={{color:"#cccccc"}}>登录</Text>
                </TouchableOpacity>
              </FormContainer>
              { loading ?
                <ActivityIndicator
                  animating={true}
                  style={[styles.centering, {height: 80}]}
                  size="large"
                />:null
                  }
        </LinearGradient>
      </KeyboardAvoidingView>
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
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  }
})
