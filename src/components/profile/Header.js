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
       <Container>
          <View style={{flex:1}}>
            <Logo source={logo} />
            <ImageWrap>
                {avatar}
            </ImageWrap>
            <Info>
                <Name>{name}</Name>
                <Desc>{nickname}</Desc>
            </Info>
            
          </View>
          <Footer>
            <FooterText>@{domain}</FooterText>
          </Footer>
       </Container>
  )
}



const Container = styled.View`
  justify-content:center;
  margin-bottom:10;
  flex:1;
`

const Logo = styled.Image`
  width:50;
  height:50;
  align-self:stretch;
`

const ImageWrap = styled.View`
  width:140;
  height:140;
  background-color:#2c3e50;
  align-self:center;
  border-radius:80;
`

const Info = styled.View`
  flex:1;
  align-self:center;
`

const ProfileImage = styled.Image`
  width:120;
  height:120;
  border-radius:60;
  align-self:center;
  margin-top:10;
`

const Name = styled.Text`
  margin:10;
  font-size:16;
  font-weight:bold;
  justify-content:center;
  align-self:center;
`

const Desc = styled.Text`
   margin:10;
   font-size:14;
   font-weight:300;
   justify-content:center;
   align-self:center;
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
