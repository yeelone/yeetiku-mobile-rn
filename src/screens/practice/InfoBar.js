/* @flow */

import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { View,Text,TouchableHighlight } from 'react-native'
import { LinearGradient } from 'expo'
import { Container , Content,Button  } from 'native-base'
import styled from 'styled-components/native'
import color from '../../components/colors'

@inject('bankStore')
@observer
export default class InfoBar extends Component {

  _openPractingView = (type) => {
      const {navigation} = this.props
      navigation.navigate('Practing', {type})
  }

  render() {
    const {navigation,bankStore} = this.props
    const records = bankStore.records
    return (
          <Grid>
            <BorderView>
              <Col >
                  <Cell style={{backgroundColor:"#3498db"}}>
                      <BigText>{ records.total }</BigText>
                  </Cell>
                  <Text>做过</Text>
              </Col>
              <Col>
                <Cell onPress={() => this._openPractingView("wrong")} style={{backgroundColor:"#e74c3c"}}>
                    <BigText>{ records.wrong }</BigText>
                </Cell>
                <Text>错题</Text>
              </Col>
              <Col>
                <Cell onPress={() => this._openPractingView("favorites")} style={{backgroundColor:"#f1c40f"}}>
                    <BigText>{ records.favorites }</BigText>
                </Cell>
                <Text>收藏</Text>
              </Col>
              </BorderView>
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

const BorderView = styled.View`
  flex-direction: row;
  border-width:2;
  border-radius:5;
  padding:10;
  border-style:dashed;
  border-color: #2c3e50;
`

const Col = styled.View`
  flex-grow:1;
  justify-content: center;
  align-items: center;
`

const Cell = styled.TouchableHighlight `
  justify-content: center;
  align-items: center;
  border-radius:50;
  background-color:#2980b9 ;
  width:80;
  height:80;
  border-width:2;
  border-style:dotted;
  border-color: #34495e;
`

const BigText = styled.Text`
  color:white;
  font-size:24;
`
