/* @flow */

import React, { Component } from 'react'
import { View,Text,Image,Platform,StyleSheet } from 'react-native'
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
    <Container style={[styles.container]}>
      <CustomCard onPress={() => onPress(item,index)}>
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
            <View style={{overflow: 'hidden',justifyContent: 'flex-end',alignItems: 'center',}}>
              <Thumbnail square source={{uri:thumbnail}} style={{height:100,width:100,}} />
            </View>
        </CustomCard>
    </Container>
  )
}

const Container = styled.View`
  margin:10;
`

// 因为styled不支持inline style
const styles = StyleSheet.create({
  container:{
      ...Platform.select({
          ios: {
              shadowColor: 'black',
              shadowOpacity: 0.1,
              shadowRadius: 20,
              shadowOffset: { height:0, width: 0},
          },
          android: {
              elevation:1
          }
      })
  },
})

const CustomCard = styled.TouchableOpacity`
  background-color:#f5f5f5;
  flex-direction:row;
`

const LeftPane = styled.View`
  flex:1;
  padding:10;
`