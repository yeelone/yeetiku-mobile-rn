/* @flow */

import React, { Component } from 'react'
import { View,Text,Image } from 'react-native'
import { ConfigManager,isEmpty } from '../../utils'
import { Card,CardItem,Thumbnail } from 'native-base'
import styled from 'styled-components/native'

export default function listItem({ index,item,onPress }) {
  const { id,name ,description,image,total,createdAt,latest } = item
  const config = ConfigManager.getInstance().config
  thumbnail = config.server + image
  formatTime = (datetime) => {
    return datetime
  }

  return (
    <Container onPress={() => onPress(item,index)}>
      <Card style={{padding:0}}>
        <CardItem>
          <BorderView>
            <View style={{flex:1}}>
              <View>
                <Text> {name} [{total}道题]</Text>
              </View>
              <View >
                <Text style={{color:"grey"}} numberOfLines={1}> {description} </Text>
              </View>
              <View>
                <Text style={{color:"grey"}}> 创建时间:{this.formatTime(createdAt)} </Text>
              </View>
            </View>
            <View style={{width:80,justifyContent: 'flex-end',alignItems: 'center'}}>
              <Thumbnail square source={{uri:thumbnail}} style={{width:80}} />
            </View>
          </BorderView>
        </CardItem>
      </Card>
    </Container>
  )
}

const Container = styled.TouchableOpacity`
`

const BorderView = styled.View`
  flex-direction: row;
  border-width:2;
  border-radius:5;
  padding:10;
  border-style:dashed;
  border-color: #f1f1f1;
`
