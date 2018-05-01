/* @flow */

import React, { Component } from 'react'
import { View,Text,Image } from 'react-native'
import styled from 'styled-components/native'
import colors from '../components/colors'

export default class About extends Component {

  static navigationOptions = {
    title: '关于',
  }

  render() {
    return (
      <Container>
        <View>
          <Logo source={require('../images/appicon.png')} />
        </View>
        <TextDec>        YeeTiku忆题库旨在为大家提供一下可控的题库平台，用户可以上传自己的题库，并利用平台的功能来学习题库。</TextDec>

        <TextDec>如遇到相关问题，可以用以下的联系方式联系我: </TextDec>

        <TextDec>Email : yljckh@gmail.com</TextDec>
        <TextDec>twitter : https://twitter.com/yljckh</TextDec>
        <TextDec>微信号 : j_vanni</TextDec>
      </Container>
    );
  }
}


const Container = styled.View`
  flex:1;
  background-color:#ffffff;
  padding:20;
`

const Logo = styled.Image`
  width:200;
  height:200;
  align-self:center;
  margin:20;
`

const TextDec = styled.Text`
  color:#2d3436;
  font-size: 16;
  font-weight: bold;
  margin-bottom:10;
  line-height:20;
`