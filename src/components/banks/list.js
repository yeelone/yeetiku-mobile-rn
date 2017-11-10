/* @flow */

import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { View,Text,FlatList,StyleSheet} from 'react-native'
import { Container ,Content } from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import Modal from 'react-native-modalbox'
import PracticeModal from './PracticeModal'
import color from '../../components/colors'
import ThumbnailListItem from '../../components/metaList/item'

@inject('bankStore','questionStore','userStore')
@observer
export default class Practice extends Component {
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
    const {navigation, bankStore} = this.props
    return (
      <Container style={{backgroundColor:color.background}}>
            <FlatList
              data={bankStore.banks}
              keyExtractor={this._keyExtractor}
              renderItem={({item,index}) => <ThumbnailListItem  item={item}
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
