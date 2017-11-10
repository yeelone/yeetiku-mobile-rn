
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
        <Text><Entypo name="star" size={20} style={{color:"yellow"}} /></Text> :
        <Text><Entypo name="star" size={20} style={{color:"white"}} /></Text>
      }
      </Button>
    )
  }
}

const Button = styled.TouchableHighlight`
  justify-content: center;
  align-items: center;
  flex:1;
  width:40;
`
