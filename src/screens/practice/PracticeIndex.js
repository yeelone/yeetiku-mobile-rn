/* @flow */

import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { View,Text,FlatList,StyleSheet,Dimensions,ImageBackground } from 'react-native'
import { Container ,CardItem,Content ,Header, Item, Input, Icon, Button } from 'native-base'
import Modal from 'react-native-modalbox'
import PracticeModal from './PracticeModal'
import InfoBar from './InfoBar'
import styled from 'styled-components/native'
import TopHeader  from '../../components/header'
import ThumbnailListItem from '../../components/metaList/item'

import colors from '../../components/colors'
const height = Dimensions.get('window').height
const width = Dimensions.get('window').width


@inject('bankStore','questionStore','userStore')
@observer
export default class PracticeIndex extends Component {
  @observable modalState = {
      isOpen: true,
      isDisabled: false,
      swipeToClose: true,
      sliderValue: 0.3
  }

  componentDidMount(){
    this.asyncInitialData()
    this.refs.modal1.close()
  }

  asyncInitialData = () => {
    const { bankStore, userStore} = this.props
    bankStore.cleanUserBanks()
    bankStore.fetchRecords(userStore.id)
    bankStore.fetchByUser(userStore.id)
  }

  onClose() {
  }

  onOpen() {
  }

  onClosingState(state) {
  }

  _handleItemPress = (item,index) => {
    const {bankStore} = this.props
    const {setCurrentIndex } = bankStore
    setCurrentIndex(index)
    this.refs.modal1.open()
  }

  _onRefresh = () => {
    this.asyncInitialData()
  }

  _renderHeaderComponent = (navigation,total) => {
    return (
      <View>
         <InfoBar navigation={navigation} />
        <DesTextView>
          <Text style={{color:'#cccccc'}}> {total}个题库 </Text>
        </DesTextView>
      </View>
    )
  }
  _keyExtractor = (item, index) =>  index.toString()

  render() {
    const { navigation, bankStore,userStore } = this.props
    const { banksTotal } = bankStore
    let total = 0
    if ( banksTotal !== -1 ) total = banksTotal

    return (
      <Container style={{flex:1,}}>
        
          <TopHeader
            navigation={navigation}
            left={ <Text style={{color:colors.headerTextColor, fontSize:20 }}>练习</Text>}
            style={{ height:120,backgroundColor:colors.theme }}
            />
            <ImageBackground style={{marginTop:-200,height:200,width:width}}  source={require('../../images/bgtop.png')}>
            </ImageBackground>
             
              <FlatList
                data={bankStore.banks}
                keyExtractor={this._keyExtractor}
                renderItem={({item,index}) => <ThumbnailListItem  item={item}
                                                            index={ index }
                                                            key={item.key}
                                                            onPress={this._handleItemPress}/>}
                refreshing={bankStore.loading}
                ListHeaderComponent={this._renderHeaderComponent(navigation,total)}
                onRefresh={()=>this._onRefresh()}
                onEndReachedThreshold={0.5}
                onEndReached={({ distanceFromEnd }) => {
                    bankStore.fetchByUser(userStore.id)
                }}
                style={{marginTop:-60}}
                />

          <Modal
              style={[styles.modal]}
              ref={"modal1"}
              coverScreen={true}
              swipeArea={100}
              onClosed={this.onClose}
              onOpened={this.onOpen}
              onClosingState={this.onClosingState}>
                <View >
                  <PracticeModal navigation={navigation} onClose={() => this.refs.modal1.close()}/>
                  <CardItem style={{ justifyContent:'center' }}>
                    <CloseBtn style={{backgroundColor:colors.theme}} onPress={() => this.refs.modal1.close()}>
                      <Text style={{color:'white'}}>X</Text>
                    </CloseBtn>
                  </CardItem>
                </View>
            </Modal>
      </Container>
    )
  }
}

const DesTextView = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  height:20;
  margin-right:20;
`
const CloseBtn = styled.TouchableOpacity`
    justify-content:center;
    align-items: center;
    background-color:red;
    height:50;
    width:50;
    border-radius:50;
    margin-top:-40;
`

const styles = StyleSheet.create({

  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height:height- 100,
    backgroundColor:'transparent'
  },

});
