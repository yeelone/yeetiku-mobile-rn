/* @flow */

import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { View,Text,FlatList,TouchableOpacity,Dimensions,ScrollView } from 'react-native'
import { Container,Content,Spinner,Button, Item, Input,Icon } from 'native-base'
import { Entypo } from '@expo/vector-icons'
import Search from './Search'
import styled from 'styled-components/native'
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
                       <View>
                        <Level2Button onPress={() => this.jumpToMarket(parent.tag.id)} >
                            <Text style={{ fontSize:18,color:"#2c3e50" }}> { parent.tag.name } > </Text>
                        </Level2Button>
                       </View>
                       <TagItemList>
                        {Object.keys(parent.children).map((key2)=>{
                            const child = parent.children[key2].tag
                            if (child){
                                return(
                                  <Button key={child.id} light
                                        style={{margin:5,padding:10}}>
                                      <TouchableOpacity onPress={() => this.jumpToMarket(child.id)}>
                                        <Text><Entypo name="price-tag" size={14} style={{color:'#ffeaa7'}}/> {child.name} </Text>
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
        <Container style={{backgroundColor:"white"}}>
          <TopHeader
            navigation={navigation}
            left={ <Text style={{color:colors.headerTextColor,fontSize:24}}>所有标签</Text>}
            style={{ backgroundColor:colors.theme,borderBottomWidth:0.5,borderBottomColor:"#dfe6e9",paddingLeft:20,paddingBottom:50 }}
            />
            { loading ? <Spinner color='green' /> : null}
            <ScrollView>
                <Search onSearch={(value)=>this._handleSearch(value)} />
                <View style={{flexDirection:'row'}}>
                  <LeftPane>
                    {
                      Object.keys(allTags).map((key)=>{
                                const item = allTags[key].tag
                                return this.renderLevel1(item)
                            })
                    }
                  </LeftPane>
                  <RightPane>
                      { this.renderLevel2( level2 ) }
                  </RightPane>
                </View>
            </ScrollView>
        </Container>
    )
  }
}
const LeftPane = styled.View`
  align-items:flex-start;
  width:100;
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
  padding:20;
  flex:1;
`
const TagItemList = styled.View`
  flex-direction:row;
  align-items:flex-start;
  flex-wrap:wrap;
  margin-left:15;
`
