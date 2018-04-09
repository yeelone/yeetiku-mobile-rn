/* @flow */
import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { View,Text,TextInput } from 'react-native'
import { Button,Spinner  } from 'native-base'
import styled from 'styled-components/native'
import color from '../../components/colors'

@inject('userStore')
@observer
export default class ProfileNameEditor extends Component {
  @observable text = ""

  static navigationOptions = {
    title: '更新资料',
  }

  _handlePress = () =>　{
      const { userStore,navigation } = this.props
      const { loadResult,resultMessage } = userStore
      const type = navigation.state.params.type

      // if ( type === 'name') {
        userStore.update(type,this.text)
      // }

  }

  render() {
    const { userStore , navigation } = this.props
    const { user,loading,loadResult,resultMessage } = userStore
    const type = navigation.state.params.type
    return (
      <Container>
        <View style={{alignItems:'center'}}>
        { loadResult ? <Text> 保存成功 </Text>  :  <Text style={{color:'red'}}> {resultMessage} </Text> }
        </View>
        <Input
          editable={true}
          multiline={true}
          blurOnSubmit={false}
          numberOfLines={2}
          placeholder={user[type]}
          onChangeText={(text) => this.text = text }
          value={this.text}/>

        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
          <Button style={{backgroundColor:color.theme ,width:150,height:30, justifyContent: 'center',margin:20}} onPress={() => this._handlePress() }>
            { loading ? <Spinner color='green' />  : <Text style={{color:'white'}}> 保存 </Text> }
          </Button>
        </View>

      </Container>
    )
  }
}

const Container = styled.View`
  flex:1;
  background-color:#ffffff;
`

const Input = styled.TextInput`
  background-color: #ecf0f1;
  text-align-vertical: top;
  padding:20;
  margin:10;
`
