/* @flow */

import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { View,Text,FlatList,TouchableOpacity,Dimensions } from 'react-native'
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
        style:{margin:0,padding:0,borderLeftWidth:4,backgroundColor:"#ffffff"}
      }
  }

  renderLevel1 = (node) => {
       if ( node.hasOwnProperty("id")  ) {
         let style = {}
         if ( node.id === this.key ){
           style = this.itemState.style
         }
         return (
             <ListItem key={node.id} style={style}>
                <Level1Button onPress={() => this.handlerL1Press(node.id) } >
                  <Text style={{color:"#2ecc71"}}>{node.name}</Text>
                </Level1Button>
             </ListItem>
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
                       <Level2Button onPress={() => this.jumpToMarket(parent.tag.id)} >
                           <Text>
                               { parent.tag.name }
                           </Text>
                       </Level2Button>
                       <TagItemList>
                       {Object.keys(parent.children).map((key2)=>{
                           const child = parent.children[key2].tag
                           if (child){
                               return(
                                 <Button key={child.id} rounded light
                                      style={{margin:5,borderColor:"#cccccc",backgroundColor:"white"}}>
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
        <Container style={{backgroundColor:color.background}}>
          <TopHeader
            navigation={navigation}
            title={ <Text style={{color:'white', fontSize:20 }}>标签</Text>}
            style={{ backgroundColor:color.theme }}
            />
            { loading ? <Spinner color='green' /> : null}
            <Main>
                <LeftPane>
                  <List>
                  {
                    Object.keys(allTags).map((key)=>{
                              const item = allTags[key].tag
                              return this.renderLevel1(item)
                          })
                  }
                  </List>
                </LeftPane>
                <RightPane>
                    { this.renderLevel2( level2 ) }
                </RightPane>
            </Main>
        </Container>
    )
  }
}

const windowSize = Dimensions.get('window')

const Main = styled.View`
  flex:1;
  flex-direction:row;
`

const LeftPane = styled.ScrollView`
  width:100;
  height:${windowSize.height};
  border-style:dashed;
  border-color: #ffffff;
`

const RightPane = styled.ScrollView`
  background-color:#ffffff;
  width:${windowSize.width-120};
  height:${windowSize.height};
  padding:20;
`

const Level1Button = styled.TouchableOpacity`
  justify-content:center;
  align-items:center;
  padding:10;
`

const Level2Button = styled.TouchableOpacity`
  padding:10;
`
const TagItemList = styled.View`
  flex:1;
  flex-direction:row;
`

const List = styled.View``

const ListItem = styled.View`
  margin-top:5;
`
