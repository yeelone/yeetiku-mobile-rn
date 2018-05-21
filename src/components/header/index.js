/* @flow */

import React,{Component} from 'react'
import styled, { css }  from 'styled-components/native'
import { View,Text,TouchableOpacity,Image,Platform,StyleSheet } from 'react-native'
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

export default function header({ navigation, title , style , hasBack, left,right  }) {
    const logowhite = require('../../images/logowhite.png')
    hasBack = hasBack || false
    style = style || { backgroundColor: color.bar }
    title = title || null
    right = right || <View style={{flex:1, width:100}}></View>
    left = left || null
    const {goBack} = navigation
    const backButton =  hasBack ?  <Back navigation={navigation}/>  :  null //占位
    return (
      <Container style={[styles.container,style]}>
            <Left>
              { left }
              { backButton }
            </Left>
              { title }
            <Right>
              { right }
            </Right>
      </Container>
    )
}

const Container = styled.View`
  padding-top:15;
  margin-bottom:10;
  height:65 ;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

// 因为styled不支持inline style
const styles = StyleSheet.create({
  container:{
      ...Platform.select({
          ios: {
              shadowColor: 'black',
              shadowOpacity: 0.1,
              shadowRadius: 5,
              shadowOffset: { height:0, width: 0},
          },
          android: {
              elevation:5
          }
      })
  },
})

const BackButton = styled.TouchableOpacity`
  flex:1;
  width:40;
  justify-content: center;
  align-items: center;
`

const Left = styled.View`
  align-self: flex-start;
  flex:1;
  height:55;
  justify-content: center;
  padding-left:20;
`

const Right = styled.View`
  align-self: flex-end;
  justify-content: center;
  align-items: center;
  height:55;
`

const Logo = styled.Image`
  width:40;
  height:40;
  align-self:stretch;
`
