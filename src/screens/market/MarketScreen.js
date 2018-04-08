/* @flow */

import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { View,Text,FlatList,StyleSheet} from 'react-native'
import { Header, Item, Input, Icon, Button } from 'native-base'
import styled from 'styled-components/native'
import colors from '../../components/colors'
import ThumbnailListItem from '../../components/metaList/item'

import { Ionicons } from '@expo/vector-icons'

@inject('bankStore')
@observer
export default class Market extends Component {
  static navigationOptions = {
    title: '商店',
  }

  @observable onEndReachedCalledDuringMomentum = true

  constructor(){
    super()
    this.searchValue = ""
  }
  //
  // componentWillMount(){
  //   this.props.bankStore.fetchAll()
  // }

  _handleItemPress =  (item,index) => {
    const {navigation,bankStore} = this.props

    bankStore.setCurrentMarketIndex(index)
    navigation.navigate("MarketItemScreen")
  }

  _keyExtractor = (item, index) =>  index

  _getBanks = () => {
    const {navigation,bankStore} = this.props
    const type = navigation.state.params.type || null
    if (type === "tags"){
      bankStore.fetchByTag()
    }else if (type === "search"){
        // do nothing
    }else{
      bankStore.fetchAll("name", this.searchValue)
    }
  }

  _onChangeText = (text) => {
      this.searchValue = text
  }

  _handleSearch = () => {
      const { bankStore } = this.props
      bankStore.cleanMarket()
      bankStore.fetchAll("name", this.searchValue)
  }

  _onSubmitEditing =() =>{
    this._textInput.blur();
  }

  render() {
    const {navigation, bankStore} = this.props
    const { bankMarketTotal } = bankStore
    let total = 0
    if ( bankMarketTotal !== -1 ) total = bankMarketTotal
    return (
      <Container style={{backgroundColor:colors.background}}>
        <Content>
            <Header searchBar rounded style={{padding:10,backgroundColor:colors.theme }}>
              <SearchBar>
                <Input
                  placeholder="Search"
                  returnKeyType='search'
                  onChangeText={this._onChangeText}
                  onSubmitEdit={ () => {}}
                  />
                <Button transparent onPress={()=>this._handleSearch()}>
                  <Icon name="ios-search" style={{color:colors.theme}}/>
                  <Text style={{color:colors.theme}}>Search</Text>
                </Button>
              </SearchBar>
            </Header>
              {/* <DesTextView>
                 <Text style={{color:"#666666"}}> {total}个题库 </Text>
              </DesTextView>
              */}
              <FlatList
                data={bankStore.bankMarket}
                keyExtractor={this._keyExtractor}
                renderItem={({item,index}) => <ThumbnailListItem  item={item}
                                                            index={ index }
                                                            key={item.key}
                                                            onPress={this._handleItemPress}/>}
                refreshing={bankStore.loading}
                onRefresh={()=>this._getBanks()}
                onEndReachedThreshold={0.5}
                onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false }}
                onEndReached={({ distanceFromEnd }) => {
                   if (!this.onEndReachedCalledDuringMomentum) {
                     this._getBanks()
                     this.onEndReachedCalledDuringMomentum = true
                   }

                 }}
                style={{margin:10}}
                />

          </Content>
      </Container>
    )
  }
}

const Container = styled.View`
  flex:1;
  background:#2c3e50;
`

const Content = styled.View`
  flex:1;
`

const BannerView = styled.View`
  height:150;
  background:#f1c40f;
`

const SubscribeButton = styled.TouchableHighlight`
  justify-content: center;
  align-items: center;
  flex:1;
  width:40;
`
const DesTextView = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  height:20;
  margin-right:20;
  margin-top:5;
`

const SearchBar = styled.View`
    padding-left:20;
    padding-right:20;
    flex:1;
    flex-direction:row;
    background-color:#ffffff;
    border-radius:30;
`


const styles = StyleSheet.create({

  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height:400,
    width:300,
    backgroundColor:'transparent'
  },

});
