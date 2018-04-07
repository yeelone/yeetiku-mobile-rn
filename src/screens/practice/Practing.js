/* @flow */
/* 练习题页面 */
/*todo : 该组件太过复杂，有机会有时间要重构 */

import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { View,StyleSheet,Text,Animated,Modal,ActivityIndicator} from 'react-native'
import { Container,Content, Card,CardItem,Footer, FooterTab,Body, Button, Icon, Badge, Picker,Input} from 'native-base'
import { Entypo } from '@expo/vector-icons'
import styled from 'styled-components/native'
import Header  from '../../components/header'
import Choice from '../../components/questions/choice'
import MultiSelect from '../../components/questions/multiselect'
import Truefalse from '../../components/questions/truefalse'
import Filling from '../../components/questions/filling'
import StarButton  from '../../components/button/star'
import Timer from '../../components/timer/timer'
import colors from '../../components/colors'

import dataMap from '../../../mock/data'

const QuestionType = {
    single:'单选题',
    multiple:'多选题',
    truefalse:'判断题',
    filling:'填空题',
}

@inject('bankStore','questionStore','userStore')
@observer
export default class Practing extends Component {
  @observable answers = {} //临时性的保存用户刚刚执行的答案
  @observable showModal = false
   _timer: Timer

  static navigationOptions = {
    header: null,
  }

  constructor(props){
    super(props)
    this.state = {
      fadeAnim: new Animated.Value(0),          // Initial value for opacity: 0
      animating: true,
    }

    this.selectedOptions = []
    this.filling_answers = []    //服务器返回的多个填空选项之间用 || 分割
    this.truefalse = false
    this.hasChange = false       //如果题目有变化 ，则记录起来
    this.result = false
    this.questionType = ''
  }

  fetchQuestions = () => {
    const { navigation,bankStore,questionStore,userStore } = this.props
    const { banks,currentIndex } = bankStore
    this.questionType = navigation.state.params.type || null
    if ( this.questionType === 'favorites') {
      questionStore.fetchFavorites(userStore.id)
    }else if (this.questionType === 'wrong') {
      questionStore.fetchWrong(userStore.id)
    }else if (this.questionType === 'banks') {
      questionStore.getByBankID(banks[currentIndex].id)
    }
  }

  componentDidMount(){
    Animated.timing(                            // Animate over time
      this.state.fadeAnim,                      // The animated value to drive
      {
        toValue: 10,                             // Animate to opacity: 1, or fully opaque
      }
    ).start()

    const { navigation,bankStore,questionStore } = this.props
    const { banks,currentIndex,getCurrentRecord } = bankStore
    this.questionType = navigation.state.params.type || null
    questionStore.clear()
    if (this.questionType === 'banks') {
      if ( banks.length >  0 ) {
        questionStore.setOffset(getCurrentRecord(banks[currentIndex].id).latest)
      }
    }
    this.fetchQuestions()
    this.timer && clearInterval(this.timer)
    clearTimeout(this._timer)


    //当前练习内容是从题库里取的话，就定时向服务器同步做题记录
      const user_id = this.props.userStore.id
      const bank_id = this.props.bankStore.id
      const { syncHistoryRecords } = this.props.questionStore
      this.timer = setInterval(
        () => {
            syncHistoryRecords(user_id, bank_id)
        },
        5000
      )
  }

  componentWillUnmount(){
   clearInterval(this.timer)
  }

  _handleChoice = (selected,result ) => {
    this.hasChange = true
    this.selectedOptions = [selected]
    this.result = result
  }

  _handleTruefalseSelect = (selected,result) => {
    this.hasChange = true
    this.truefalse = selected
    this.result = result
  }

  _handleOptionsSelect = ( selected,result ) => {
    this.hasChange = true
    this.selectedOptions = selected
    this.result = result
  }

  _handleChangeText = ({ index,text }) => {
    this.hasChange = true
    this.filling_answers[index] = text
  }

  _saveCurrentAnswer = () => {
    const { bankStore,questionStore } = this.props
    const { questions,current,setCurrent,saveAnswer,getAnswer } = questionStore
    const { banks,currentIndex } = bankStore

    if ( !questions.length ) return

    const type = questions[current].type
    let data = {
                  bank_id:banks[currentIndex].id,
                  question_id:questions[current].id ,
                  type:questions[current].type,
                  result: this.result,
                }
    if ( type === 'single' || type === 'multiple')  {
      data['options'] = this.selectedOptions
    }

    if ( type === 'filling' ){
      data['filling_answers'] =  this.filling_answers
    }

    if ( type === 'truefalse') {
      data['truefalse'] = this.truefalse
    }
    saveAnswer( data )
  }

  _getAnswers = () => {
    const { questions,current,getAnswer } = this.props.questionStore

    if ( !questions.length || current < 0 ) return null
    //获取下一题/上一题的用户选择过的答案
    if (questions[current]){
      return getAnswer({
        question_id:questions[current].id
      })
    }
    return null
  }

  __handleNextPrev = async (index) => {
    const { questionStore } = this.props
    const { getCurrentIndex,setCurrent,insertHistoryRecord,isUserFavoritesAction,page,pageSize } = questionStore
    if ( this.hasChange ) {
      this._saveCurrentAnswer()
      insertHistoryRecord(this.result)
      this.hasChange = false
    }

    const userid = this.props.userStore.id

    await setCurrent( index , () => this.fetchQuestions()  )
    await isUserFavoritesAction(userid)

  }

  _handleStarAction = (status) => {
      const { addFavoritesAction,removeFavoritesAction } = this.props.questionStore
      if ( status ){
        removeFavoritesAction()
      }else{
        addFavoritesAction()
      }
  }

  _handleReplyAction = (id) => {
      const {navigation} = this.props
      navigation.navigate('QuestionComments',{id})
  }

  _handleNext = () => {
    this.__handleNextPrev( this.props.questionStore.current +1 )
  }

  _handlePrev = () => {
    this.__handleNextPrev(  this.props.questionStore.current - 1 )
  }

  

  renderHeader = (title) => {
    return (
      <View>
        <Timer />
      </View>
    )
  }

  renderModal = () => {
    const { setCurrent } = this.props.questionStore
    let inputValue = ""
    return  (
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.showModal}
          onRequestClose={() => this.showModal = false }
          >
         <AlignView>
            <Card style={{ alignSelf: "stretch" ,backgroundColor:"pink"}}>
              <CardItem header>
                <Text>跳转...</Text>
               </CardItem>
               <CardItem>
                     <Input placeholder="请选择第几题" keyboardType="numeric" onChangeText={(value) => inputValue = value }/>
                </CardItem>
                <CardItem header>
                  <Button onPress={ () => this.showModal= false } light>
                   <Text> 关闭 </Text>
                  </Button>
                  <Button success onPress={() => { setCurrent(inputValue-1); this.showModal= false } }  >
                   <Text> 跳转 </Text>
                  </Button>
                </CardItem>
             </Card>
         </AlignView>
        </Modal>
      )
  }

  renderActions = () => {
    const { questions, current,currentIsFavorites } = this.props.questionStore
    return (
      <ActionView>
        <ActionBtn>
          <StarButton  default={currentIsFavorites} onPress={() => this._handleStarAction(currentIsFavorites) } />
        </ActionBtn>
        <ActionBtn> 
          <ReplyBtn  onPress={() => this._handleReplyAction(questions[current].id) }>
            <ReplyBtnText><Entypo name="reply" size={24} style={{color:"#b2bec3"}} />回复</ReplyBtnText>
          </ReplyBtn>
        </ActionBtn>
      </ActionView>
    )
  }


  render() {
    const {navigation,questionStore} = this.props
    const {questions, current,setCurrent,currentIsFavorites,getCurrentIndex,total,loading,addFavLoading} = questionStore
    let initialOptions = []
    let initialFillings = []
    let initialTruefalse = null
    const answer = this._getAnswers()
    if ( answer ) {
      initialOptions = answer.options || []
      initialFillings = answer.filling_answers || []
      initialTruefalse = answer.truefalse
    }
    let current_question = {type:null}
    if ( questions.length > 0 && current < total && current < questions.length ) {
      current_question = questions[current] || {type:null}
    }

    const questionComponent = () => {
        if (current_question.type === 'single') {
          return <Choice index={current} question={current_question} onSelect={this._handleChoice} initial={initialOptions}/> //defaultAnswers 是个ID
        }else if ( current_question.type === 'multiple' ){
          return <MultiSelect index={current} question={current_question} onSelect={this._handleOptionsSelect} initial={initialOptions}/> //defaultAnswers 是个ID数组
        }else if ( current_question.type === 'truefalse'){
          return <Truefalse index={current} question={current_question} initial={initialTruefalse} onSelect={this._handleTruefalseSelect}/>
        }else if ( current_question.type === 'filling'){
          return <Filling index={current} question={current_question} initial={initialFillings} onChangeText={this._handleChangeText}/>
        }else{
          return null
        }
    }

    return (

      <Container >
        <Header
          navigation={navigation}
          hasBack={true}
          title={ current_question.type ? this.renderHeader(QuestionType[current_question.type]) : this.renderHeader("")  }
          style={{ backgroundColor:colors.theme }}
          />

        <Content style={[styles.content]}>
          <ActivityIndicator
            animating={loading}
            size="small" />
          <CardView>
              { current_question.type ? (
                  <CardViewHeader>
                    <View style={{ flex:1, padding:20}}>
                      <Text > [{ QuestionType[current_question.type] }] [{current_question.score} 分] </Text>
                      <Text style={{fontWeight: 'bold'}}> {current_question.subject} </Text>
                    </View>
                  </CardViewHeader>
              ) :null }
              <CardViewBody >
                { questionComponent() }
                { this.renderModal() }
              </CardViewBody>
              {  this.renderActions()   }
          </CardView>
            
        </Content>
        <Footer>
          <FooterTab style={{backgroundColor:"#ecf0f1"}}>
              <Button iconLeft light onPress={ () => this._handlePrev()  } >
                   <Icon name='arrow-back' />
                   <Text>上一题</Text>
              </Button>
              <Button transparent primary iconLeft onPress={ () =>{this.showModal = true }}>
                 <Text> { getCurrentIndex() + 1 } /  { total }</Text>
              </Button>
              <Button iconRight light onPress={ () => this._handleNext()  }>
                   <Text>下一题</Text>
                   <Icon name='arrow-forward' />
               </Button>
          </FooterTab>
        </Footer>
      </Container>
    )
  }
}

const AlignView = styled.View`
  justify-content: center;
  align-items: center;
  flex:1;
`
const CardView = styled.View`
    justify-content: center;
    align-items: center;
    margin:20;
    background-color:#ffffff;
    border-radius:10;
    flex:1;
    elevation:4;
`
const ActionView = styled.View`
    flex-direction:row;
    justify-content: center;
    align-items: center;
    margin:20;
    border-radius:10;
    height:50 ;
`

const CardViewHeader = styled.View`
    background-color:#ffffff;
    flex-direction:row;
    margin-top:10;
`

const CardViewBody = styled.View`
    background-color:#ffffff;
`


const ReplyBtn = styled.TouchableHighlight `
  justify-content: center;
  align-items: center;
`

const ReplyBtnText = styled.Text `
  color:#b2bec3;
`

const ActionBtn = styled.TouchableHighlight`
  width:200;
  padding:15;
  background-color:#ffffff;
`

const styles = StyleSheet.create({
    container:{
      flex: 1,
    	justifyContent: 'center',
    	alignItems: 'center',
    },
    content:{
      borderRadius:10,
      
    },
    centering:{
      alignItems:'center',
      justifyContent:'center',
      padding:8,
    },
    gray:{
      backgroundColor:'#cccccc',
    },
    horizontal:{
      flexDirection:'row',
      justifyContent:'space-around',
      padding:8,
    },
    loading: {
      flex:1,
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
  }
});
