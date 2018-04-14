/* @flow */

import React, { Component } from 'react'
import { View,Text,Image,Platform } from 'react-native'
import { ConfigManager,isEmpty } from '../../utils'
import { Card,CardItem,Thumbnail } from 'native-base'
import styled,{css} from 'styled-components/native'

export default function listItem({ index,item,onPress }) {
  const { id,name ,description,image,total,createdAt,latest } = item
  const config = ConfigManager.getInstance().config
  thumbnail = config.server + image
  formatTime = (datetime) => {
    return datetime
  }

  return (
    <Container >
      <CustomCard onPress={() => onPress(item,index)}>
          <BorderView>
            <LeftPane>
              <View>
                <Text> {name} </Text>
              </View>
              <View>
                <Text style={{color:'grey'}} numberOfLines={2}> {description} </Text>
              </View>
              <View style={{flex:1,justifyContent: 'flex-end'}}>
                <Text style={{color:'grey'}}> [{total}道题]  {this.formatTime(createdAt)} </Text>
              </View>
            </LeftPane>
            <View style={{overflow: 'hidden',borderTopRightRadius:10,borderBottomRightRadius:10,justifyContent: 'flex-end',alignItems: 'center',}}>
              <Thumbnail square source={{uri:thumbnail}} style={{height:100,width:100,}} />
            </View>
          </BorderView>
        </CustomCard>
    </Container>
  )
}

const Container = styled.View`
  margin:10;
  ${Platform.select({ios: css`shadow-color: black;shadow-opacity:0.1;shadow-radius: 20;shadow-offset: { height:0, width: 0};`,android: css`elevation:1`})};
`

const CustomCard = styled.TouchableOpacity`
  background-color:#f5f5f5;
  padding:5;
  
`

const BorderView = styled.View`
  flex-direction:row;
  border-width:2;
  border-radius:5;
  border-style:dashed;
  border-color: #dfe4ea;
`

const LeftPane = styled.View`
  flex:1;
  padding:10;
`