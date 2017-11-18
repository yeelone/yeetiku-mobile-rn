/* @flow */

import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { View,Text,FlatList,TouchableOpacity,Dimensions,ScrollView } from 'react-native'
import { Container,Content,Spinner,Button  } from 'native-base'
import styled from 'styled-components/native'
import color from '../../components/colors'
import TopHeader  from '../../components/header'

@inject('bankStore')
@observer
export default class TagsScreen extends Component {
  @observable key = ""
  @observable itemState = {
      checked: false,
      style: {},
  }

  static navigationOptions = {
    title: '分类',
  }

  async componentWillMount(){
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
        style:{margin:0,padding:0,backgroundColor:"#3498db"}
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
                       <TagItemList>
                       <Level2Button onPress={() => this.jumpToMarket(parent.tag.id)} >
                           <Text style={{ fontSize:18,color:"#2c3e50" }}> { parent.tag.name } : </Text>
                       </Level2Button>
                       {Object.keys(parent.children).map((key2)=>{
                           const child = parent.children[key2].tag
                           if (child){
                               return(
                                 <Button key={child.id} light
                                      style={{margin:5,padding:10,borderColor:"#cccccc",backgroundColor:"white"}}>
                                    <TouchableOpacity onPress={() => this.jumpToMarket(child.id)}>
                                    <Text>{child.name} </Text>
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
            title={ <Text style={{color:'white', fontSize:20}}>标签</Text>}
            style={{ backgroundColor:color.theme }}
            />
            { loading ? <Spinner color='green' /> : null}
            <ScrollView>
                <View><Text style={{ fontSize:18,margin:10,color:"#7f8c8d" }}>一级标签</Text></View>
                <TopPane>
                  {
                    Object.keys(allTags).map((key)=>{
                              const item = allTags[key].tag
                              return this.renderLevel1(item)
                          })
                  }
                </TopPane>
                <View><Text style={{ fontSize:18,margin:10,color:"#7f8c8d"}}>二级标签</Text></View>
                <BottomPane>
                    { this.renderLevel2( level2 ) }
                </BottomPane>
            </ScrollView>
        </Container>
    )
  }
}

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
  align-items:center;
  padding:10;
  margin:5;
  background-color:#ecf0f1;
`
const Level2Button = styled.TouchableOpacity`
  padding:20;
`
const TagItemList = styled.View`
  flex-direction:row;
  align-items:flex-start;
  flex-wrap:wrap;
`
