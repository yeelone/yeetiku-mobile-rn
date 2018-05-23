/* @flow */

import React, { Component } from 'react'
import { observable,toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import { View,Text } from 'react-native'
import { Container} from 'native-base'
import { Comments } from 'react-native-easy-comments'

@inject('questionStore','userStore')
@observer
export default class QuestionComments extends Component {

    componentDidMount(){
        this.asyncInitialData()
    }

    asyncInitialData = (id) => {
        const { navigation,questionStore } = this.props
        let questionID = navigation.state.params.id || null
        if ( questionID) {
            questionStore.fetchComments(questionID)
        }else{
            questionStore.fetchChildComments(id)
        }
    }

    onLike = ({item}) => {
        const {questionStore, userStore } = this.props
        questionStore.likeByUser(item.id, userStore.id )
    }

    onDislike = ({item}) => {
        const {questionStore, userStore } = this.props
        questionStore.dislikeByUser(item.id, userStore.id )
    }

    onSend = ({parent,content}) => {
        const { questionStore,userStore } = this.props
        const c = {
            id:null,
            creator:userStore.id, 
            question:questionStore.questions[questionStore.current].id,
            like:0,
            dislike:0,
            parent,
            content,
        }
        questionStore.addComments(c)
    }

    onFollow = ({item}) => {
    }

    onEndReached = (id) => {
        this.asyncInitialData(id)
    }

    onPress = ({item}) =>  {
        this.asyncInitialData(item.id)
    }

    render() {
        const { questionStore,userStore } = this.props 
        return (
            <View style={{flex:1}}>
                <Comments
                    data={toJS(questionStore.comments)}
                    avatar={userStore.getAvatar()}
                    onLike={this.onLike}
                    onDislike={this.onDislike}
                    onSend={this.onSend}
                    onFollow={this.onFollow}
                    onPress={this.onPress}
                    onEndReached={this.onEndReached}
                    />
            </View>
        )
    }
}
