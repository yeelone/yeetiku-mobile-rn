/* @flow */
/* 练习题页面 */

import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import styled from 'styled-components/native'
import { Entypo } from '@expo/vector-icons'
import colors from '../colors'
import { View,TouchableOpacity,Text,Dimensions } from 'react-native'
import { RadioButtons } from 'react-native-radio-buttons'

@observer
export default class Choice extends Component {
  @observable selectedOption = {}
  @observable selectedStyle = { fontWeight: 'bold',color:'#ffffff', backgroundColor:colors.rightColor}
  componentDidMount(){
    const { question, initial } = this.props
    const { options } = question
    if ( initial ) {
      options.some((item) => {
          if ( item.id === initial[0]) {
            this.selectedOption =  item
            this._checkAnswers(this.selectedOption)
          }
        })
    }
  }

  _checkAnswers = (option) => {
    let result = false  //答题情况
    if ( option.is_correct ) {
      this.selectedStyle =  { fontWeight: 'bold',color:'#ffffff', backgroundColor:colors.rightColor}
      result = true
    }else {
      this.selectedStyle = { fontWeight: 'bold',color:'#ffffff', backgroundColor:colors.wrongColor}
      result = false
    }

    return result
  }

  renderOption = (option, selected, onSelect, index) => {
    const style = selected ? this.selectedStyle : {}
    const mark = selected ?  <Entypo name="check" size={16} /> :<Entypo name="vinyl" size={16} />

    const _handleSelect = () => {
      let result = this._checkAnswers(option)
      onSelect()
      this.props.onSelect(option.id,result)
    }
    return (
        <RadioListView  key={index}>
          <RadioItem onPress={_handleSelect} >
            <RadioItemContent style={style}> {mark} { option.content} </RadioItemContent>
          </RadioItem>
        </RadioListView>
    )
  }

  setSelectedOption =(selectedOption) => {
    this.selectedOption = selectedOption
  }

  renderContainer = (optionNodes) => {
    return <View>{optionNodes}</View>
  }

  render() {
    const { index,question } = this.props
    //不做下面这一步转换，直接用question.options,会报这样的错：
    //Failed prop type: Invalid prop `options` of type `object` supplied to `RadioButtons`, expected `array`
    //暂时搞不明白为什么，留着以后再想
    const options = question.options.map((item) => {
      return item
    })

    return (
      <View>
        <RadioButtons
          options={ options }
          onSelection={ (selectedOption) => this.setSelectedOption(selectedOption) }
          selectedOption={ this.selectedOption }
          renderOption={ (option, selected, onSelect, index) => this.renderOption(option, selected, onSelect, index) }
          renderContainer={ (optionNodes) => this.renderContainer(optionNodes) }
        />
      </View>
    )
  }
}


const RadioListView = styled.View`
  flex-direction: row;
`

const RadioItem = styled.TouchableOpacity`
  width: ${Dimensions.get('window').width -  50}
`

const RadioItemContent = styled.Text`
  height:40;
  padding:10 ;
  align-self:stretch;
  justify-content: space-between;
  border-bottom-width:1;
  border-bottom-color:#ccc;
`
