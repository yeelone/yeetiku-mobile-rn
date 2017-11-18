/* @flow */
/*导致逻辑有点复杂 ，暂且搁置，暂不使用*/
import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { View,Text,FlatList,StyleSheet} from 'react-native'
import { Container ,Content ,Header, Item, Input, Icon, Button } from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import Modal from 'react-native-modalbox'
import PracticeModal from './PracticeModal'
import InfoBar from './InfoBar'
import styled from 'styled-components/native'
import color from '../../components/colors'
import TopHeader  from '../../components/header'
import ThumbnailListItem from '../../components/metaList/item'

@inject('bankStore','questionStore','userStore')
@observer
export default class PracticeIndex extends Component {
  @observable modalState = {
      isOpen: true,
      isDisabled: false,
      swipeToClose: true,
      sliderValue: 0.3
    }

  componentWillMount(){
    this.props.bankStore.fetchByUser()
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

  _openView = () => {
      this.props.navigation.navigate("Settings")
  }

  _handleItemPress =  async (item,index) => {
    const {navigation,bankStore,questionStore} = this.props
    const {banks,fetchRecords,getCurrentRecord,setCurrentIndex } = bankStore
    const {clear,setOffset} = questionStore
    setCurrentIndex(index)
    //查询选中题库的记录，比如最后做到哪一题之类 的信息
    await fetchRecords(banks[index].id)
    if ( banks.length >  0 ) {
      clear()
      setOffset(getCurrentRecord(banks[index].id).latest)
    }

    this.refs.modal1.open()
  }

  _keyExtractor = (item, index) =>  index

  render() {
    const {navigation, bankStore,userStore} = this.props
    const banks = userStore.records.banks
    return (
      <Container style={{backgroundColor:color.background}}>
            <FlatList
              data={banks}
              keyExtractor={this._keyExtractor}
              renderItem={({item,index}) => <ThumbnailListItem item={item}
                                                          index={ index }
                                                          key={item.key}
                                                          onPress={this._handleItemPress}/>}
              />

          <Modal
              style={[styles.modal]}
              ref={"modal1"}
              swipeToClose={this.swipeToClose}
              onClosed={this.onClose}
              onOpened={this.onOpen}
              onClosingState={this.onClosingState}>
                <PracticeModal navigation={navigation} />
            </Modal>
      </Container>
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

});
