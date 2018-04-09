/* @flow */
import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { View,Text,Image,StyleSheet,Platform,StatusBar } from 'react-native'
import { Container, Content, List, ListItem, Icon,Thumbnail, Left, Body, Right, Switch,Toast } from 'native-base'
import { EvilIcons } from '@expo/vector-icons'
import { ImagePicker } from 'expo'
import styled from 'styled-components/native'
import * as Progress from 'react-native-progress'

@inject('userStore')
@observer
export default class ProfileInfo extends Component {

  static navigationOptions = {
    title: '编辑资料',
  }

  _avatarPicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      aspect: [4, 3],
    })

    if (!result.cancelled) {
      this.props.userStore.saveAvatar(this.props.userStore.id,result.uri)
    }
  }

  _changeField = (field) => {
    this.navTo('ProfileNameEditor','name')
  }

  _changeSex = () => {
    this.navTo('ProfileSexEditor')
  }

  _changePassword = () => {
    this.navTo('ProfilePasswordEditor')
  }

  navTo = (route,type) => {
    const { userStore,navigation } = this.props
    userStore.resetLoadResult()
    navigation.navigate(route, { type })
  }

  render() {
    const { userStore } = this.props
    const { user,loading, progress,done } = userStore
    return (
      <View style={{flex:1}}> 
          { loading ? <Progress.Bar borderRadius={0} width={null}  progress={progress}  /> : null  }
        <Content>
          <List style={{backgroundColor:'red'}}>
            <ListItem icon itemDivider onPress={() => this._avatarPicker() }>
              <Body>
                <Text>头像</Text>
              </Body>
              <Right>
               { user.avatar ? <Thumbnail small source={{uri: userStore.getAvatar() }} /> : <EvilIcons name="user" style={[styles.icon]}/> }
                <EvilIcons style={[styles.icon]} name="chevron-right" />
              </Right>
            </ListItem>
            <ListItem icon itemDivider onPress={() => this.navTo('ProfileNameEditor', 'name') }>
              <Body>
                <Text>姓名</Text>
              </Body>
              <Right>
                <Text>{user.name}</Text>
                <EvilIcons style={[styles.icon]} name="chevron-right" />
              </Right>
            </ListItem>
            <ListItem icon itemDivider onPress={() => this.navTo('ProfileNameEditor','nickname') }>
              <Body>
                <Text>座右铭</Text>
              </Body>
              <Right>
                <Text>{user.nickname}</Text>
                <EvilIcons style={[styles.icon]} name="chevron-right" />
              </Right>
            </ListItem>
            <ListItem icon itemDivider onPress={() => this._changeSex() }>
              <Body>
                <Text>性别</Text>
              </Body>
              <Right>
                <Text>{user.sex}</Text>
                <EvilIcons style={[styles.icon]} name="chevron-right" />
              </Right>
            </ListItem>
            <ListItem icon itemDivider onPress={() => this._changePassword() }>
              <Body>
                <Text>修改密码</Text>
              </Body>
              <Right>
                <EvilIcons style={[styles.icon]} name="chevron-right" />
              </Right>
            </ListItem>
          </List>
        </Content>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  icon: {
    fontSize:28,
  },

})
