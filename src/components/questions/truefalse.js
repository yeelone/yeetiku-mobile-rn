/* @flow */

import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import styled from 'styled-components/native'
import { Entypo } from '@expo/vector-icons'
import color from '../colors'
import { View,TouchableOpacity,Text,Dimensions } from 'react-native'
import { RadioButtons } from 'react-native-radio-buttons'

@observer
export default class Truefalse extends Component {
  @observable selectedOption = null
  @observable selectedStyle = { fontWeight: 'bold',color:'#ffffff', backgroundColor:color.rightColor}

  componentDidMount(){
    const { initial } = this.props
    if ( initial !== null ) {
      if (initial){
        this.selectedOption = '正确'
        this._checkAnswers(0)
      }else{
        this.selectedOption = '错误'
        this._checkAnswers(1)
      }
    }
  }

  _checkAnswers = (index) => {
    //index 为0时，表示选择了正确
    const { true_or_false }  = this.props.question
    let result = false  //答题情况
    if ( !index && true_or_false ) {
      this.selectedStyle =  { fontWeight: 'bold',color:'#ffffff', backgroundColor:color.rightColor}
      result = true
    }else if ( index && !true_or_false ){
      this.selectedStyle = { fontWeight: 'bold',color:'#ffffff', backgroundColor:color.rightColor}
      result = true
    }else{
      this.selectedStyle = { fontWeight: 'bold',color:'#ffffff', backgroundColor:color.wrongColor}
      result = false
    }
    return result
  }

  renderOption = (option, selected, onSelect, index) => {
    const style = selected ? this.selectedStyle: {}
    const mark = selected ?  <Entypo name="vinyl" size={16} /> : null
    const _handleSelect = () => {
      onSelect()
      let result = this._checkAnswers(index)
      if ( index === 1 ){
        this.props.onSelect(false,result)
      }else{
        this.props.onSelect(true,result)
      }

    }

    return (
      <RadioListView  key={index}>
        <RadioItem onPress={_handleSelect} >
          <RadioItemContent style={style}>{mark} { option } </RadioItemContent>
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
    const options = ['正确','错误']

    return (
      <Container>
            <View style={{margin: 20}}>
              <RadioButtons
                options={ options }
                onSelection={ (selectedOption) => this.setSelectedOption(selectedOption) }
                selectedOption={ this.selectedOption }
                renderOption={ (option, selected, onSelect, index) => this.renderOption(option, selected, onSelect, index) }
                renderContainer={ (optionNodes) => this.renderContainer(optionNodes) }
              />
            </View>
      </Container>
    )
  }
}

const Container = styled.View`
  padding:0;
`

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
