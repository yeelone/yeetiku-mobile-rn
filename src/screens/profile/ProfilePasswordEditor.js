/* @flow */
import Expo from 'expo'
import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { View,Text,TouchableWithoutFeedback,StyleSheet } from 'react-native'
import { Spinner  } from 'native-base'
import InputField from '../../components/input/InputField'
import styled from 'styled-components/native'
import color from '../../components/colors'
import { Toast } from 'native-base'

@inject('userStore')
@observer
export default class ProfilePasswordEditor extends Component {
  @observable oldpassword = ""
  @observable newpassword = ""
  @observable newpassword_confirm = ""
  @observable consistent = false

  static navigationOptions = {
    title: '更改密码',
  }

  //native-base 依赖这个字体
  async componentDidMount() {
      await Expo.Font.loadAsync({
        'Roboto': require('native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      })
  }

  _changePassword = () =>　{
      if( this.newpassword === this.newpassword_confirm ) {
        this.consistent = true
      }else {
        this.consistent = false
        Toast.show({
                text: "两次密码输入不一致，请重新输入" ,
                position: 'bottom',
                buttonText: 'Ok'
        })
        return
      }

      this.props.userStore.changePassword(this.oldpassword, this.newpassword)

  }

  render() {
    const { userStore } = this.props
    const { user,loading,loadResult,resultMessage } = userStore

    return (
      <Container>
        <View style={{alignItems:'center'}}>
          { loading ?  <Spinner color='green' /> :null }
          { loadResult ? <Text> 保存成功 </Text>  :  <Text style={{color:'red'}}> {resultMessage} </Text> }
        </View>
        <Form>
          <InputField
              name="oldpassword"
              placeholder="请输入旧密码"
              onChange={(key,value) => this.oldpassword = value}
              secureTextEntry
              returnKeyType="go"
              value={this.oldpassword}
              ref='passwordInput'
              style={styles.input}
              />

            <InputField
                name="newpassword"
                placeholder="请输入新的密码"
                onChange={(key,value) => this.newpassword = value}
                secureTextEntry
                returnKeyType="go"
                value={this.newpassword}
                ref='passwordInput'
                style={styles.input}
              />
            <InputField
                name="newpassword_confirm"
                placeholder="请再一次确认密码"
                onChange={(key,value) => this.newpassword_confirm = value}
                secureTextEntry
                returnKeyType="go"
                value={this.newpassword_confirm}
                ref='passwordInput'
                style={styles.input}
                />
              <SubmitButton onPress={() => this._changePassword()}>
                <SubmitText>
                  <Text style={{color:'white'}}> 提交 </Text>
                </SubmitText>
              </SubmitButton>

            </Form>
      </Container>
    );
  }
}
const Container = styled.View`
  flex:1;
  background-color:#ffffff;
  justifyContent:flex-start;
  alignItems:center;
`

const Form = styled.View`
  width:250;
  margin-top:20;
`

const SubmitButton = styled.TouchableWithoutFeedback`
  alignItems:center;
`

const SubmitText = styled.View`
  height:40;
  width:100;
  background-color:#e74c3c;
  alignItems:center;
  justifyContent:center;
`

const styles = StyleSheet.create({

  input: {
    fontSize:20,
    color:'#000',
    borderColor:'#ecf0f1',
    borderBottomWidth:1,
  },

})
