/* @flow */

import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer ,inject } from 'mobx-react'
import styled from 'styled-components/native'
import { Text } from 'react-native'
import { Button ,Card, CardItem, Icon} from 'native-base'
import { ConfigManager } from '../../utils'
import { Ionicons } from '@expo/vector-icons'
import color from '../../components/colors'

@inject('bankStore')
@observer
export default class MarketItemScreen extends Component {

  _handleItemPress = () => {
    const { bankStore,navigation } = this.props
    bankStore.appendToBanks()
    navigation.navigate('Practing', {type: 'banks'})
  }

  render() {
    const { bankStore } = this.props
    const { bankMarket,currentMarketIndex,records } = bankStore
    const bank = bankMarket[currentMarketIndex]
    const thumbnail = ConfigManager.getInstance().server + bank.image
    return (
            <Card>
              <CardItem header style={{ justifyContent:'center' }}>
                  <Info>{ bank.name }</Info>
              </CardItem>
              <CardItem style={{ justifyContent:'center' }}>
                  <Thumbnail source={{uri:thumbnail}} />
              </CardItem>

              <CardItem style={{ justifyContent:'center' }}>
                  <Info>{ bank.total }道题</Info>
              </CardItem>

              <CardItem style={{ justifyContent:'center' }}>
                  <Button transparent onPress={() => this._handleItemPress()}>
                      <Text style={{fontSize:24}}>开始刷题</Text>
                  </Button>
              </CardItem>
            </Card>
    )
  }
}

const Thumbnail = styled.Image`
  height:100;
  width:300;
  background-color:green;
`

const Info = styled.Text`
  font-size:20;
  justify-content: space-between;
  align-items: center;
`
