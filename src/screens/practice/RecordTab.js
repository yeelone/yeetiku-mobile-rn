/* @flow */

import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { View,Text,FlatList,StyleSheet,Dimensions } from 'react-native'
import { Container, Content } from 'native-base'
import colors from '../../components/colors'

export default class RecordTab extends Component {

  _keyExtractor = (item, index) =>  index.toString()

  render() {
    return (
        <Container>
      </Container>
    )
  }
}
