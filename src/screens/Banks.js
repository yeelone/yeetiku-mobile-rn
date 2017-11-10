/* @flow */
import React, { Component } from 'react'
import styled from 'styled-components/native'
import { Text } from 'react-native'

const Container = styled.View`
  flex:1;
`
export default class Banks extends Component {
  static navigationOptions = {
    title: '题库',
  }

  render() {
    return (
      <Container>
        <Text> 题库 </Text>
      </Container>
    );
  }
}
