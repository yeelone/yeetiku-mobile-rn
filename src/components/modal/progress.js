/* @flow */

import React, { Component } from 'react'
import { observable } from 'mobx'
import { View,StyleSheet } from 'react-native'
import { observer, inject } from 'mobx-react'
import Modal from 'react-native-modalbox'
import * as Progress from 'react-native-progress'

export default class ProgressModal extends Component {
  @observable modalState = {
      isOpen: true,
      isDisabled: false,
      swipeToClose: false,
      sliderValue: 0.3
  }

  componentDidMount(){
    this.refs.modal1.close()
  }

  onClose() {
  }

  onOpen() {
  }

  onClosingState(state) {
  }

  _keyExtractor = (item, index) =>  index

  render() {
    return (
      <View style={{backgroundColor:color.background}}>
          <Modal
              style={[styles.modal]}
              ref={"modal1"}
              swipeToClose={this.swipeToClose}
              onClosed={this.onClose}
              onOpened={this.onOpen}
              onClosingState={this.onClosingState}>
              <Progress.Bar progress={0.3} width={200} />
              <Progress.Pie progress={0.4} size={50} />
              <Progress.Circle size={30} indeterminate={true} />
              <Progress.CircleSnail color={['red', 'green', 'blue']} />
            </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({

  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height:400,
    width:300,
    backgroundColor:'transparent'
  },

})
