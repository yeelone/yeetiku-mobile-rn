/* @flow */

import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { View,Text,TouchableHighlight,Platform,StyleSheet } from 'react-native'
import { LinearGradient } from 'expo'
import { Container , Content,Button  } from 'native-base'
import Numeral from "numeral"
import styled,{css} from 'styled-components/native'
import color from '../../components/colors'

@inject('bankStore')
@observer
export default class InfoBar extends Component {

  _openPractingView = (type) => {
      const {navigation} = this.props
      navigation.navigate('Practing', {type})
  }

  _openRecordView = (type) => {
    const {navigation} = this.props
    navigation.navigate('PracticeRecord', {type})
  }

  render() {
    const {navigation,bankStore,styles} = this.props
    const records = bankStore.records

    return (
      <Grid style={[styles,customStyles.grid]}>
          <Col >
              <Cell style={{backgroundColor:"#3498db"}}>
                  <BigText> {Numeral(records.total).format("0 a")}</BigText>
              </Cell>
              <Text>做过</Text>
          </Col>
          <Col>
            <Cell onPress={() => this._openRecordView("wrong")} style={{backgroundColor:"#e74c3c"}}>
                <BigText> { Numeral(records.wrong).format("0 a") }</BigText>
            </Cell>
            <Text>错题</Text>
          </Col>
          <Col>
            <Cell onPress={() => this._openPractingView("favorites")} style={{backgroundColor:"#f1c40f"}}>
                <BigText> { Numeral(records.favorites).format("0 a") }</BigText>
            </Cell>
            <Text>收藏</Text>
          </Col>
      </Grid>
    )
  }
}
const Grid = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  padding:10;
  margin:10;
  border-radius:5;
  background-color:#34495e;
`

// 因为styled不支持inline style
const customStyles = StyleSheet.create({
  grid:{
      ...Platform.select({
          ios: {
              shadowColor: 'black',
              shadowOpacity: 0.1,
              shadowRadius: 20,
              shadowOffset: { height:0, width: 0},
          },
          android: {
              elevation:5
          }
      })
  },
})


const Col = styled.View`
  flex-grow:1;
  justify-content: center;
  align-items: center;
`

const Cell = styled.TouchableHighlight `
  justify-content: center;
  align-items: center;
  border-radius:30;
  background-color:#2980b9 ;
  width:60;
  height:60;
  margin-bottom:5;
`

const BigText = styled.Text`
  color:white;
  font-size:24;
`
