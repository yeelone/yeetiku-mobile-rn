/* @flow */

import React from 'react'
import { View,Button,Text,TouchableHighlight   } from 'react-native'
import styled from 'styled-components/native'

function list ({ navigation  }) {

  return (
    <Container>
       <ActionItem style={{ backgroundColor: '#ecf0f1'}} onPress={()=> navigation.navigate('Settings')} >
          <ActionDesction> 做过的题 </ActionDesction>
       </ActionItem>

       <ActionItem style={{ backgroundColor: '#ecf0f1'}}  >
          <ActionDesction> 收藏的题 </ActionDesction>
       </ActionItem>
       <ActionItem style={{ backgroundColor: '#ecf0f1'}}  >
          <ActionDesction> 错过的题 </ActionDesction>
       </ActionItem>

    </Container>
  )
}

const Container = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  background:#bdc3c7;
`

const ActionItem = styled.TouchableHighlight`
  justify-content: center;
  align-items: center;
  flex:1;
  height: 50;
  background:#bdc3c7;
`

const ActionDesction = styled.Text`
  font-size:16;
  color:#666;
  font-weight:bold;
`

export default list
