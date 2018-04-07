/* @flow */
import Expo from 'expo'
import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { View,Text,TouchableHighlight,Image,TextInput } from 'react-native'
import styled from 'styled-components/native'
import { ProgressModal } from '../components/modal'
import { ImagePicker } from 'expo'
import { Entypo } from '@expo/vector-icons'
import { Toast } from 'native-base'
import Header  from '../components/header'
import * as Progress from 'react-native-progress'

@inject('feedbackStore','userStore')
@observer
export default class FeedBack extends Component {
  @observable content = ""
  @observable contact = ""
  @observable image = null

  static navigationOptions = {
    header: null,
  }
  //native-base 依赖这个字体
  async componentDidMount() {
      await Expo.Font.loadAsync({
        'Roboto': require('native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      })
  }

  _openImagePicker =  async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.image = result
    }
  }

  submit = () => {
      let showText = ""
      if ( !this.content ){
        Toast.show({
                text: "请填写反馈内容" ,
                position: 'bottom',
                buttonText: 'Okay'
        })
        return
      }

      if (!this.image){
        Toast.show({
                text: "如果有图片将更好" ,
                position: 'bottom',
                buttonText: 'Okay'
        })
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
        <Header
          navigation={navigation}
          hasBack={true}
          right={<SubmitButton onPress={() => this.submit() }>
                    <Text style={{color:'#ffffff'}}> 发送 </Text>
                  </SubmitButton>
                }
          />
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
              <View>
                  <Entypo name="camera" size={32}  />
                  <Text>选择</Text>
              </View>
            </UploadImageButton>
            <AlignView style={{flex:1 }}>
                <CustomTextInput
                  placeholder="请留下QQ或者邮箱地址作为联系方式"
                  onChangeText={(text) => this.contact = text }
                  value={this.contact} />
            </AlignView>
        </View>
        <View>
          <Text> 提交反馈可以帮助APP开发者发现问题并解决问题，非常感谢您的反馈。
            如果您觉得这个反馈页面不能满足您要描述的内容，请发邮件到 yljckh@gmail.com 联系作者。</Text>
        </View>
        <View>
        { this.image ?   <Image source={{ uri: this.image.uri }} style={{ width: 100, height: 100 }} /> : null  }

        </View>
        { feedbackStore.done ?
              Toast.show({
                text: "已成功提交反馈，感谢您！" ,
                position: 'bottom',
                buttonText: 'Okay'
              }) : null }
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
const SubmitButton = styled.TouchableHighlight`
  justify-content: center;
  align-items: center;
  flex:1;
`
