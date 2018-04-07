import React, { Component } from 'react'
import Expo from 'expo'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { View, TextInput,TouchableOpacity,Text } from 'react-native'
import { Toast } from 'native-base'
import styled from 'styled-components/native'
import InputField from '../input/InputField'

@inject('userStore')
@observer
export default class RegisterForm extends Component {
  @observable email = ""
  @observable password = ""
  @observable password_confirm = ""

  focusNextField = (nextField) => {
    this.refs[nextField].root.focus()
  }

  //native-base 依赖这个字体
  async componentDidMount() {
      await Expo.Font.loadAsync({
        'Roboto': require('native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      })
  }


  handlePressed = () => {
    if (this.password !== this.password_confirm ){
      Toast.show({
              text: "两次密码不一样，请重新输入" ,
              position: 'bottom',
              buttonText: 'Okay'
      })
      return
    }

    
    this.props.onSubmit(this.email, this.password)
  }

  render() {
    const { userStore } = this.props
    return (
      <Form>
          <InputField
            name="email"
            value={this.email}
            onChange={(key,value) => this.email = value}
            placeholder="email"
            returnKeyType="next"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
          <InputField
            name="password"
            placeholder="password"
            onChange={(key,value) => this.password = value}
            secureTextEntry
            returnKeyType="go"
            value={this.password}
            ref='passwordInput'
            />
          <InputField
              name="password_confirm"
              placeholder="password_confirm"
              onChange={(key,value) => this.password_confirm = value}
              secureTextEntry
              returnKeyType="go"
              value={this.password_confirm}
              ref='passwordInput'
              />

          <FormSubmit onPress={this.handlePressed}>
            <FormButton> 提交注册 </FormButton>
          </FormSubmit>
      </Form>
    )
  }
}


const Form = styled.View`
  padding:20;
`
const FormSubmit = styled.TouchableOpacity`
  padding-vertical:10;
`

const FormButton =styled.Text`
  text-align:center;
  color:#ffffff;
  font-weight:700;
`
