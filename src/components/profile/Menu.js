/* @flow */

import React,{Component} from 'react'
import { View,Text,TouchableHighlight } from 'react-native'
import styled from 'styled-components/native'
import { LinearGradient } from 'expo'
import { EvilIcons,Entypo } from '@expo/vector-icons'

class ActionItem extends Component {

  _handlePress = () => {

  }
  //这时原本用的Grid, 删掉掉过
  render(){
    let { icon ,iconColor,title,onPress } = this.props
    icon = icon || <Entypo name="address" size={24}  style={{color:"#ffffff"}} />
    iconColor = iconColor || '#f1c40f'
    title = title || 'dd'
    onPress = onPress || this._handlePress
    return (
      <Item onPress={onPress}>
        <Grid>
            <Col style={{width:60}}>
              <Cell style={{backgroundColor:iconColor }}>
                  {icon}
              </Cell>
            </Col>
            <Col>
                <ItemText>  {title} </ItemText>
            </Col>
        </Grid>
      </Item>
    )
  }
}

class ActionMenu extends Component {
  render(){
    return (
        <LinearGradient
            colors={['#dedede', '#ffffff']}
            start={[0.1,0.1]}
            style={{flex:1,borderRadius: 5 }}
            >

          <View>
              <ActionItem icon={<Entypo name="user" size={24}  style={{color:"#ffffff"}} />}
                          iconColor="#3498db" title={"个人信息"}
                          onPress={()=>{console.log("hello");}}
                          />
              <ActionItem icon={<Entypo name="log-out" size={24}  style={{color:"#ffffff"}} />}
                          iconColor="#e74c3c" title={"注销"}
                          onPress={()=>{console.log("hello");}}
                          />
          </View>
        </LinearGradient>
    )
  }
}

const Container = styled.View`
  flex-grow:1;
  background-color:#dedede;
`
const Grid = styled.View``
const Col = styled.View``

const Item = styled.TouchableHighlight`
  height:60;
  border-width:1;
  border-color:#cccccc;
  background-color:#ffffff;
`
const ItemText = styled.Text`
  font-size:20;
  padding-top:15;
`
const Cell = styled.View`
  justify-content: center;
  align-items: center;
  height:60;
`
export default ActionMenu
