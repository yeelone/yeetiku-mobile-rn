/* @flow */
import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { View,Text,TouchableWithoutFeedback } from 'react-native'
import { Thumbnail,Button,Spinner } from 'native-base'
import styled from 'styled-components/native'
import { RadioButtons } from 'react-native-radio-buttons'
import color from '../../components/colors'
@inject('userStore')
@observer
export default class ProfileFieldEditor extends Component {
  @observable text = ""
  @observable selectedOption = ""

  static navigationOptions = {
    title: '更改性别',
  }

  componentDidMount(){
      const { user }  = this.props.userStore
      this.selectedOption = user.sex
  }

  _handlePress = () =>　{
      this.props.userStore.update('sex',this.selectedOption)
  }

  render() {
    const { userStore } = this.props
    const { user,loading,loadResult,resultMessage } = userStore
    const options = [
      "男",
      "女",
      "其它",
    ]

    const thumb = {
      '男' : require('../../images/male.png'),
      '女' : require('../../images/female.png'),
      '其它' : require('../../images/other.png'),
    }

    function setSelectedOption(selectedOption){
        this.selectedOption = selectedOption
    }

    function renderOption(option, selected, onSelect, index){
      const style = selected ? { borderWidth:1 ,borderColor:'#dedede'} : {};

      return (
        <Cell onPress={onSelect} key={index} >
          <AlignView style={style}>
            <Thumbnail source={thumb[option]} />
            <Text >{option}</Text>
          </AlignView>
        </Cell>
      );
    }

    function renderContainer(optionNodes){
      return <View style={{flex:1, flexDirection:'row',margin:20}}>{optionNodes}</View>;
    }

    return (
      <Container>
          <View style={{alignItems:'center'}}>
            { loading ?  <Spinner color='green' /> :null }
            { loadResult ? <Text> 保存成功 </Text>  :  <Text style={{color:'red'}}> {resultMessage} </Text> }
          </View>
          <RadioButtons
            options={ options }
            onSelection={ setSelectedOption.bind(this) }
            selectedOption={this.selectedOption }
            renderOption={ renderOption }
            renderContainer={ renderContainer }
            />
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
              <Button style={{backgroundColor:color.theme,width:150,height:30, justifyContent: 'center',}} onPress={() => this._handlePress() }>
                <Text style={{color:'white'}}> 保存 </Text>
              </Button>
            </View>
      </Container>
    );
  }
}

const Container = styled.View`
  flex:1;
  background-color:#ffffff;
`
const Cell = styled.TouchableWithoutFeedback `
  justify-content: center;
  align-items: center;
`

const AlignView = styled.View`
  height:100;
  width:100;
  justify-content: center;
  align-items: center;
`
