/* @flow */

import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { View,Text,FlatList,TouchableOpacity,Dimensions,ScrollView,Platform,StyleSheet,StatusBar } from 'react-native'
import { Container,Content,Spinner,Button, Item, Input,Icon,Header } from 'native-base'
import { Entypo } from '@expo/vector-icons'
import Search from './Search'
import styled , { css }from 'styled-components/native'
import TopHeader  from '../../components/header'
import colors from '../../components/colors'


@inject('bankStore')
@observer
export default class TagsScreen extends Component {
  @observable key = ""
  @observable itemState = {
      checked: false,
      style: {},
  }

  constructor(){
    super()
    this.searchValue = ""
  }

  static navigationOptions = {
    title: '分类',
  }

  async componentDidMount(){
    const { allTags } = this.props.bankStore
    await this.props.bankStore.fetchAllTags()

  }

  jumpToMarket = (tag) => {
    const { navigation,bankStore } = this.props
    bankStore.setCurrentTag(tag)
    bankStore.cleanMarket()
    bankStore.fetchByTag(tag)
    navigation.navigate("MarketScreen",{type: 'tags'})
  }

  handlerL1Press = (key) => {
      this.key = key
      this.itemState = {
        checked: !this.itemState.checked,
        style:{backgroundColor:"#dfe6e9"}
      }
  }

  renderLevel1 = (node) => {
       if ( node.hasOwnProperty("id")  ) {
         let style = {}
         if ( node.id === this.key ){
           style = this.itemState.style
         }
         return (
              <Level1Button key={node.id} style={style} onPress={() => this.handlerL1Press(node.id) } >
                <Text>{node.name}</Text>
              </Level1Button>
         )
       }
   }

  renderLevel2 = (node) => {
    if (!node){
      return null
    }
    return (
       Object.keys(node.children).map((key)=>{
           const parent = node.children[key]
           if (parent.tag){
               return (
                   <View key={parent.tag.id}>
                            <Level2Button onPress={() => this.jumpToMarket(parent.tag.id)}>
                              <Text style={{ fontSize:16,color:"#636e72" }}> { parent.tag.name } </Text>
                            </Level2Button>
                          {/* <Entypo name="controller-play" size={36} style={{marginLeft:-10,color:colors.theme}}/> */}
                       <TagItemList>
                        {Object.keys(parent.children).map((key2)=>{
                            const child = parent.children[key2].tag
                            if (child){
                                return(
                                  <Button key={child.id} light
                                        style={[styles.tagItem]}>
                                      <TouchableOpacity onPress={() => this.jumpToMarket(child.id)}>
                                        <Text><Entypo name="price-tag" size={20} style={{color:'#b2bec3'}}/> {child.name} </Text>
                                      </TouchableOpacity>
                                    </Button>
                                )
                            }
                        })}
                       </TagItemList>
                   </View>
               )
           }
       })
       )
  }
  _keyExtractor = (item, index) =>  index

  _onChangeText = (text) => {
      this.searchValue = text
  }

  _handleSearch = (searchValue) => {
      const { navigation,bankStore } = this.props
      bankStore.cleanMarket()
      bankStore.fetchAll("name",searchValue)
      navigation.navigate("MarketScreen",{type: 'search'})
  }

  render() {
    const { navigation,bankStore } = this.props
    const { allTags , loading } = bankStore
    let level2 = null
    const keys = Object.keys(allTags)
    if ( keys.length > 0 && this.key === "") {
      level2 = allTags[keys[0]]
    }else{
      level2 = allTags[this.key]
    }
    return (
        <Container>
          <Header searchBar rounded style={[styles.headerBar]}>
            <Search onSearch={(value)=>this._handleSearch(value)} />
          </Header> 
            { loading ? <Spinner color='green' /> : null}
              <View style={{flex:1,marginTop:10,flexDirection:'row'}}>
              
                <LeftPane>
                  <ScrollView >
                  {
                    Object.keys(allTags).map((key)=>{
                              const item = allTags[key].tag
                              return this.renderLevel1(item)
                          })
                  }
                  </ScrollView>
                </LeftPane>
                <RightPane>
                  <ScrollView>
                    { this.renderLevel2( level2 ) }
                    </ScrollView>
                </RightPane>
              </View>
        </Container>
    )
  }
}
const LeftPane = styled.View`
  width:80;
  border-right-width:1;
  border-right-color:#cccccc;
`

const RightPane = styled.View`
  flex:1 ;
`

const TopPane = styled.View`
  border-style:dashed;
  border-color:#ffffff;
  flex-direction:row;
  align-items:flex-start;
  flex-wrap:wrap;
`
const BottomPane = styled.View`
  padding:10;
`
const Level1Button = styled.TouchableOpacity`
  justify-content:center;
  margin-left:10;
  padding-left:10;
  width:100;
  height:40;
  border-bottom-width:1;
  border-bottom-color:#ecf0f1;
`
const Level2Button = styled.TouchableOpacity`
  padding:3;
  background-color:#dfe6e9;
  margin-bottom:5;
  margin-top:5;
  border-color: transparent;
  border-top-width: 7;
  border-top-color: transparent;
  border-bottom-width: 7;
  border-left-width: 10;
  border-left-color: #b2bec3;
  border-right-width: 10;
  border-right-color: #b2bec3;
  ${Platform.select({ios: css`shadow-color: black;shadow-opacity: 0.4;shadow-radius: 10;shadow-offset: { height:0, width: 0};`,android: css`elevation:5`})};
`
const TagItemList = styled.View`
  flex-direction:row;
  align-items:flex-start;
  flex-wrap:wrap;
  margin-left:5;
`

const styles = StyleSheet.create({
  level2Btn:{
    width: 0,
    height: 0,
    backgroundColor:colors.theme,
    borderStyle:'solid',
    borderTopWidth: 10,
    borderTopColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderLeftWidth: 5,
    borderLeftColor: '#79bd9a',
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
  },
  tagItem:{
    margin:5,
    backgroundColor:"#dfe6e9"
  },
  headerBar:{
    paddingTop:Platform.OS === 'ios' ? 25 : StatusBar.currentHeight + 3  ,
    paddingBottom:10,
    height:60,
    backgroundColor:colors.theme,
  }
});
