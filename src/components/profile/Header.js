/* @flow */

import React from 'react'
import { View } from 'react-native'
import { Thumbnail } from 'native-base'
import styled from 'styled-components/native'
function header ({ name,domain, backgroundImage, avatar , nickname  }) {
  const logo = require('../../images/logowhite.png')
  name = name || 'welcome'
  domain = domain || 'yeetiku'
  backgroundImage = backgroundImage || logo
  avatar = <ProfileImage source={{uri:avatar}} />  || <ProfileImage source={require('../../images/me.jpg')} />
  nickname = nickname || 'edit your motto'
  return (
       <Header>
          <View style={{flex:1, flexDirection:'row'}}>
            <Info>
                <Logo source={logo} />
                <Name>{name} </Name>
                <Desc>{nickname} </Desc>
            </Info>
            <ImageWrap>
              {avatar}
            </ImageWrap>
          </View>
          <Footer>
            <FooterText>@{domain}</FooterText>
          </Footer>
       </Header>
  )
}

const Logo = styled.Image`
  width:50;
  height:50;
  align-self:stretch;
`

const Header = styled.View`
  height:200;
  justify-content:center;
  padding:10;
  flex:1;
`
const ImageWrap = styled.View`
  width:120;
  height:120;
`

const Info = styled.View`
  flex:1;
  border-bottom-width:2;
  border-radius:5;
  border-style:dashed;
  border-color: #cccccc;
`

const ProfileImage = styled.Image`
  flex:1;
  width:auto;
  align-self:stretch;
  border-radius:10;
  border-color:#2c3e50;
  border-width:2;
  margin-top:20;
`

const Name = styled.Text`
  margin:10;
  font-size:16;
  font-weight:bold;
  color:white;
`

const Desc = styled.Text`
   margin:10;
   font-size:14;
   font-weight:300;
`

const Footer = styled.View`
  height:15;
  align-items: flex-end;
`

const FooterText = styled.Text`
  font-size:10;
  color:#ecf0f1;
`

export default header
