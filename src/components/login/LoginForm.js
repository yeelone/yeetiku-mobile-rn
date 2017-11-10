import React, { Component } from 'react'
import { View, TextInput,TouchableOpacity,Text } from 'react-native'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components/native'
import InputField from '../input/InputField'

@inject('userStore')
@observer
export default class LoginForm extends Component {
  focusNextField = (nextField) => {
    this.refs[nextField].root.focus()
  }

  onLoginPressed = () => {
    this.props.onSubmit()
  }

  updateProperty = (key,value) => {
    this.props.userStore[key] = value
  }

  render() {
    const { userStore } = this.props
    return (
      <Form>
        <InputField
          name="domain"
          value={userStore.domain}
          onChange={this.updateProperty}
          placeholder="域"
          returnKeyType="next"
          autoCapitalize="none"
          autoCorrect={true}
          keyboardType="email-address"
        />
          <InputField
            name="email"
            value={userStore.email}
            onChange={this.updateProperty}
            placeholder="email"
            returnKeyType="next"
            autoCapitalize="none"
            autoCorrect={true}
            keyboardType="email-address"
          />

          <InputField
            name="password"
            placeholder="password"
            onChange={this.updateProperty}
            secureTextEntry
            returnKeyType="go"
            value={userStore.password}
            ref='passwordInput'
            />
          <FormSubmit onPress={this.onLoginPressed}>
            <FormButton> 登录 </FormButton>
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
  background-color: rgba(0,0,0,0);
`
