
import React, { Component } from 'react'
import styled from 'styled-components/native'
import { Entypo } from '@expo/vector-icons'
import { Text } from 'react-native'
import { observable } from 'mobx'
import { observer } from 'mobx-react'

//在数字前补0，如1 补为01
function pad(num, n) {
  var len = num.toString().length
  while(len < n) {
      num = "0" + num
      len++
  }
  return num
}


@observer
export default class Timer extends Component {
  @observable minute = 0
  @observable hour = 0
  @observable second = 0

  componentWillMount(){
    this.timer && clearInterval(this.timer)
  }

  componentDidMount(){
    this.timer = setInterval(
      () => {
        this.showClock()
      },
      1000
    )
  }

  componentWillUnmount(){
   clearInterval(this.timer)
  }

  showClock = () => {
    this.second +=  1
    if ( this.second === 60 ) {
      this.second = 0
      this.minute += 1
      if ( this.minute === 60){
        this.minute = 0
        this.hour += 1
      }
    }
  }

  render(){
    return (
        <Text style={{color:"grey"}}>{ pad(this.hour,2) } : { pad(this.minute,2)} : { pad(this.second,2) }</Text>
    )
  }
}
