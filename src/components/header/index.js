/* @flow */

import React,{Component} from 'react'
import styled from 'styled-components/native'
import { View,Text,TouchableHighlight,Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import color from '../colors'

class Back extends Component {
   render() {
     const {goBack} = this.props.navigation
     return (
       <BackButton onPress={() => goBack()} >
         <Ionicons name="md-arrow-round-back" size={20} style={{color:'white'}}/>
       </BackButton>
     )

   }
 }

export default function header({ navigation, title , style , hasBack, right  }) {
    const logowhite = require('../../images/logowhite.png')
    hasBack = hasBack || false
    style = style || { backgroundColor: color.theme }
    title = title || <Logo source={logowhite} />
    right = right || <View style={{flex:1, width:40}}></View>
    const {goBack} = navigation
    const backButton =  hasBack ?  <Back navigation={navigation}/>  :  null //占位
    return (
      <Container style={style}>
          <Left>
            { backButton }
          </Left>
            { title }
          <Right>
            { right }
          </Right>
      </Container>
    )
}
//  border-style:dashed;
//  border-color: #f1f1f1;
//  border-width:2;
//  border-radius:5;
const Container = styled.View`
  height:55 ;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const BackButton = styled.TouchableHighlight`
  flex:1;
  width:40;
  justify-content: center;
  align-items: center;
`

const Left = styled.View`
  align-self: flex-start;
  width:20;
  height:55;
`

const Right = styled.View`
  align-self: flex-end;
  justify-content: center;
  align-items: center;
  width:30;
  height:55;
`

const Logo = styled.Image`
  width:40;
  height:40;
  align-self:stretch;
`
