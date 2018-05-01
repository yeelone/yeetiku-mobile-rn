/* @flow */

import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { View,Text,TouchableHighlight,Image,TextInput } from 'react-native'
import { ProgressModal } from '../components/modal'
import Expo,{ ImagePicker } from 'expo'
import { Entypo } from '@expo/vector-icons'
import { Toast } from 'native-base'
import styled from 'styled-components/native'
import Header  from '../components/header'
import * as Progress from 'react-native-progress'
import colors from '../components/colors'

@inject('feedbackStore','userStore')
@observer
export default class FeedBack extends Component {
  @observable content = ""
  @observable contact = ""
  @observable image = null

  static navigationOptions = {
    title: '反馈',
  }
  //native-base 依赖这个字体
  async componentDidMount() {
      await Expo.Font.loadAsync({
        'Roboto': require('native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      })
  }

  _openImagePicker =  async () => {
    const {  Permissions } = Expo
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    if (status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        aspect: [4, 3],
      });
  
      if (!result.cancelled) {
        this.image = result
      }
    } else {
      throw new Error('Camera permission not granted')
    }

    
  }

  submit = () => {
      let showText = ""
      if ( !this.content ){
        alert("请填写反馈内容")
        return
      }

      if (!this.image){
        alert("如果有图片将更好")
        return
      }

      let data = new FormData()
      data.append('content', this.content)
      data.append('contact', this.contact)
      data.append('picture', {uri: this.image.uri, type: 'multipart/form-data',name:'feedback.jpg'})
      this.props.feedbackStore.save(data)
  }

  render() {
    const {navigation,feedbackStore} = this.props
    return (
      <Container>
          { feedbackStore.loading ? <Progress.Bar borderRadius={0} width={null}  progress={feedbackStore.progress}  /> : null  }
          <FeedbackInput
            editable={true}
            multiline={true}
            blurOnSubmit={false}
            numberOfLines={4}
            placeholder="请填写详细的反馈"
            onChangeText={(text) => this.content = text }
            onSubmitEditing={() => {
                          if (!this.content.endsWith("\n")) {
                              this.content = this.content + "\n"
                          }
                      }}
            value={this.content} />

        <View style={{flexDirection: 'row' ,height:100}}>
            <UploadImageButton onPress={() => this._openImagePicker()}>
                { this.image ?  
                  <Image source={{ uri: this.image.uri }} style={{ width: 100, height: 100 }} /> 
                  :  
                  <View>
                    <Entypo name="camera" size={32}  />
                    <Text>选择</Text>
                  </View>
                }
            </UploadImageButton>
            <AlignView style={{flex:1 }}>
                <CustomTextInput
                  placeholder="请留下QQ或者邮箱地址作为联系方式"
                  onChangeText={(text) => this.contact = text }
                  value={this.contact} />
            </AlignView>
        </View>
        <View>
          <Text>        提交反馈可以帮助APP开发者发现问题并解决问题，非常感谢您的反馈。
            如果您觉得这个反馈页面不能满足您要描述的内容，请发邮件到 yljckh@gmail.com 联系作者。</Text>
        </View>
        <SubmitView>          
          <SubmitButton onPress={() => this.submit() }>
              <Text style={{fontSize:20,color:'white'}}> 发送 </Text>
          </SubmitButton>
        </SubmitView>
        <View>
        

        </View>
        { feedbackStore.done ?
            alert("已成功提交反馈，感谢您！" ) : null }
      </Container>
    );
  }
}


const Container = styled.View`
  flex:1;
  background-color:#ffffff;
`

const AlignView = styled.View`
  justify-content: center;
`

const CustomTextInput = styled.TextInput`
  background-color:#ecf0f1;
  height:80;
  padding:5;


`
const FeedbackInput = styled.TextInput`
  padding:20;
  textAlign-vertical: top;
  height: 200;
  margin:10;
  background-color:#ecf0f1;
`

const UploadImageButton = styled.TouchableHighlight`
  width:80;
  height:80;
  padding:5;
  margin:10;
  border-radius:10;
  justify-content: center;
  align-items: center;
  background-color:#cccccc;
`
const SubmitView = styled.View`
  flex:1;
  justify-content: center;
  align-items: center;
`

const SubmitButton = styled.TouchableHighlight`
  width:150;
  height:40;
  background-color:${colors.theme};
  justify-content: center;
  align-items: center;
  border-radius:40;
`
