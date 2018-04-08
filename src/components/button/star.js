
import React, { Component } from 'react'
import styled from 'styled-components/native'
import { Entypo } from '@expo/vector-icons'
import { Text } from 'react-native'

export default class StarButton extends Component {

  _checkStatus = () => {
    this.props.onPress()
  }

  render(){
    return (
      <Button onPress={() => this._checkStatus()} >
      { this.props.default ?
        <ButtonText><Entypo name="star" size={24} style={{color:"yellow"}} />收藏</ButtonText> :
        <ButtonText><Entypo name="star" size={24} style={{color:"#b2bec3"}} />收藏</ButtonText>
      }
      </Button>
    )
  }
}

const Button = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  width:80;
`

const ButtonText = styled.Text`
  color:#b2bec3;
  font-size:14;
`