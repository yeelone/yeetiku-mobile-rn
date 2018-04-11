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

@inject('bankStore','questionStore','userStore')
@observer
export default class PracticeModal extends Component {

  _handlePress = async () => {
    this.props.navigation.navigate('Practing', {type: 'banks'})
  }
  render() {
    const { bankStore,navigation } = this.props
    const { banks,currentIndex,records,getCurrentRecord } = bankStore
    const bank = banks[currentIndex]
    const thumbnail = ConfigManager.getInstance().config.server + bank.image
    const record = getCurrentRecord(bank.id)
    return (
        <Card style={{width:290}}>
            <CardItem header style={{ justifyContent:'center' }}>
                <Info>{ bank.name }</Info>
            </CardItem>
            <CardItem style={{ justifyContent:'center' }}>
                <Thumbnail source={{uri:thumbnail}} />
            </CardItem>
            <CardItem style={{ justifyContent:'center' }}>
                <Text>{ bank.description }</Text>
            </CardItem>
            <CardItem style={{ justifyContent:'center' }}>
                <Text> { record.latest + 1 } / { bank.total } </Text>
            </CardItem>
            <CardItem style={{ justifyContent:'center' }}>
                <Text> 【 已做: { record.done } 】 【 错误: { record.wrong } 】 </Text>
            </CardItem>
            <CardItem style={{ justifyContent:'center' }}>
                <Button transparent onPress={() => this._handlePress() }>
                    <Text>开始刷题</Text>
                </Button>
            </CardItem>
        </Card>
    )
  }
}

const Thumbnail = styled.Image`
  height:100;
  width:290;
  background-color:green;
`

const Info = styled.Text`
  font-size:20;
  justify-content: space-between;
  align-items: center;
`
