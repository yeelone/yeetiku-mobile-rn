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
      <CustomCard>
          <BorderView>
            <View style={{flex:1,padding:10}}>
              <View>
                <Text> {name} [{total}道题]</Text>
              </View>
              <View>
                <Text style={{color:"grey"}} numberOfLines={1}> {description} </Text>
              </View>
              <View>
                <Text style={{color:"grey"}}> {this.formatTime(createdAt)} </Text>
              </View>
            </View>
            <View style={{width:100,justifyContent: 'flex-end',alignItems: 'center'}}>
              <Thumbnail square source={{uri:thumbnail}} style={{height:100,width:100}} />
            </View>
          </BorderView>
        </CustomCard>
    </Container>
  )
}

const Container = styled.TouchableOpacity`
`

const CustomCard = styled.View`
  background-color:#ffffff;
`

const BorderView = styled.View`
  flex-direction: row;
`
