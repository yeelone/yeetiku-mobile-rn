/* @flow */
/* 练习题页面 */

import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import { Entypo } from '@expo/vector-icons'
import { View,TextInput,Text  } from 'react-native'
import { Container, Content, Card, CardItem,InputGroup, Button,Input,Item } from 'native-base'
import styled from 'styled-components/native'
import InputField from '../input/InputField'
import color from '../colors'

@observer
export default class Filling extends Component {
  @observable inputs = []
  @observable inputStyles = observable.map({})
  @observable showAnswers = false
  componentWillMount(){
    const { question, initial } = this.props
    const { options } = question
    this.inputs = initial
  }

  _checkAnswer = () => {
    const { question } = this.props
    let answers = question.correct_answers.split("||")
    if (answers.length > 0 ){
      for (let i=0;i<answers.length;i++) {
        if ( answers[i] !== this.inputs[i] ) {
          this.inputStyles.set(i,{color:color.wrongColor})
        }else{
          this.inputStyles.set(i, {color:color.rightColor})
        }
      }
    }
  }

  _handleChange(index,text){
    if ( this.inputs.length > 0 ){
      this.inputs[index] = text
    }else{
      this.inputs.push(text)
    }

    this.props.onChangeText({ index,text })
  }


  renderFilling(subject) {
        //取出subject中的下划线填空部分，替换成Input
        var re =/(_)+/ig
        var strArray = []
        if ( subject ) {
            strArray = subject.match(re)
        }


        return  (
            <View>
                { strArray ? Object.keys(strArray).map((index) => {
                    let value = ""
                    if ( this.inputs.length > index ) {
                      value = this.inputs[index]
                    }
                    let style = this.inputStyles.get(index)
                    return (
                      <CardItem floatingLabel key={index} style={{minWidth:300}}>
                        <Input placeholder='填空' value={value} onChangeText={ (text) => this._handleChange(index,text)  } style={ style }/>
                     </CardItem>
                        )
                }): null  }
            </View>
        )
  }


  render() {
    const { index,question } = this.props
    let answers = question.correct_answers.split("||")
    return (
        <View>
              {this.renderFilling(question.subject)}
              <Button light full onPress={() => { this._checkAnswer(); this.showAnswers = true } }>
                    <Text>提交答案</Text>
              </Button>
              { this.showAnswers ?
                <CardItem header>
                              <Text>正确答案是：</Text>
                              { answers.map((item,index) => {
                                return <Text key={index}> {item} </Text>
                              })}
                </CardItem>
                : null }
        </View>
      )
  }
}
