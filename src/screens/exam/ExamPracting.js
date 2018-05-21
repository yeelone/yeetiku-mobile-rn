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
import colors from '../../components/colors'
import HTMLView from 'react-native-htmlview'

const QuestionType = {
    single:'单选题',
    multiple:'多选题',
    truefalse:'判断题',
    filling:'填空题',
}

@inject('examStore','questionStore','userStore')
@observer
export default class ExamPracting extends Component {
  @observable answers = {} //临时性的保存用户刚刚执行的答案
  @observable showModal = false
  @observable hasChange = false       //如果题目有变化 ，则记录起来
  @observable themeColor = "#00d2d3"
  @observable right = observable.map({})  //错题数量
   _timer: Timer

  static navigationOptions = {
    header: null,
  }

  constructor(props){
    super(props)

    this.selectedOptions = []
    this.filling_answers = []    //服务器返回的多个填空选项之间用 || 分割
    this.truefalse = false
    this.result = false
    this.questionType = ''
    
  }

  fetchQuestions = async () => {
    const { navigation,examStore,questionStore,userStore } = this.props
    let examid = navigation.state.params.id || null
    if ( examid ) {
      await examStore.fetchByID(examid)
      questionStore.questions = examStore.currentExam.questions
      questionStore.total = examStore.currentExam.questions.length 
    } 
  }

  componentDidMount(){
    const { navigation,examStore,questionStore } = this.props
    const { exams,currentIndex,getCurrentRecord } = examStore
    questionStore.clear()
    this.fetchQuestions()
    this.timer && clearInterval(this.timer)
    clearTimeout(this._timer)
  }

  componentWillUnmount(){
   clearInterval(this.timer)
  }

  renderExplain = (current_question) => {
    let explain = null

    if ( this.hasChange ) {
      return (
        <CardView style={{padding:10,}}>
          <HTMLView
            value={current_question.explanation}
          />
        </CardView>
      )
    }
    
  }

  _handleResult = (result) => {
    const { questions,current } = this.props.questionStore
    const qid = questions[current].id
    if (result){
      this.right.set(qid,true)
    }else{
      this.right.delete(qid)
    }
  }

  _handleChoice = (selected,result ) => {
    this.hasChange = true
    this.selectedOptions = [selected]
    this.result = result
    this._handleResult(result)
  }

  _handleTruefalseSelect = (selected,result) => {
    this.hasChange = true
    this.truefalse = selected
    this.result = result
    this._handleResult(result)
  }

  _handleOptionsSelect = ( selected,result ) => {
    this.hasChange = true
    this.selectedOptions = selected
    this.result = result
    this._handleResult(result)
  }

  _handleChangeText = ({ index,text }) => {
    this.hasChange = true
    this.filling_answers[index] = text
    this._handleResult(result)
  }

  _saveCurrentAnswer = () => {
    const { examStore,questionStore } = this.props
    const { questions,current,setCurrent,saveAnswer,getAnswer } = questionStore
    const { exams,currentIndex } = examStore

    if ( !questions.length ) return

    const type = questions[current].type
    let data = {
                  exam_id:exams[currentIndex].id,
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
    const { questionStore,userStore } = this.props
    const { getCurrentIndex,setCurrent,page,pageSize } = questionStore
    if ( this.hasChange ) {
      this._saveCurrentAnswer()
      this.hasChange = false
    }
    await setCurrent( index , () => this.fetchQuestions()  )

  }

  _handleNext = () => {
    this.__handleNextPrev( this.props.questionStore.current +1 )
  }

  _handlePrev = () => {
    this.__handleNextPrev(  this.props.questionStore.current - 1 )
  }

  renderHeader = (title) => {
    const { examStore } = this.props
    const { quantity } = examStore.currentExam || 0 
    return (
      <View style={{marginRight:20}}>
        <Text>{this.right.size}/{quantity}</Text>
      </View>
    )
  }

  renderAction = () => {
    const { navigation,examStore } = this.props
    const { quantity } = examStore.currentExam || 0 
    const onPress = () => {
      let score = (this.right.size / quantity * 100).toFixed(2) 
      examStore.saveScore(examStore.currentExam.id,score)
      navigation.navigate('ExamScreen')
    }

    return (
      <Button 
          onPress={()=> {onPress()}} 
          style={{justifyContent:'center',backgroundColor:'#81ecec',margin:5,padding:5,height:30,width:50}}>
        <Text>交卷</Text>
      </Button>
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
          return <MultiSelect index={current}  question={current_question} onSelect={this._handleOptionsSelect} initial={initialOptions}/> //defaultAnswers 是个ID数组
        }else if ( current_question.type === 'truefalse'){
          return <Truefalse index={current}  question={current_question} initial={initialTruefalse} onSelect={this._handleTruefalseSelect}/>
        }else if ( current_question.type === 'filling'){
          return <Filling index={current} question={current_question} initial={initialFillings} onChangeText={this._handleChangeText}/>
        }else{
          return null
        }
    }

    return (

      <Container style={{ backgroundColor:this.themeColor }}>
        <Header
          navigation={navigation}
          hasBack={true}
          title={ current_question.type ? this.renderHeader(QuestionType[current_question.type]) : this.renderHeader("")  }
          right={this.renderAction()}
          style={{ backgroundColor:this.themeColor }}
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
              </CardViewBody>

          </CardView>

          { this.renderExplain(current_question) }
        </Content>
        <Footer style={{backgroundColor:"#34495e"}}>
          <FooterTab style={{backgroundColor:"#34495e"}}>
              <Button iconLeft style={{backgroundColor:"#34495e"}} onPress={ () => this._handlePrev()  } >
                   <Icon name='arrow-back' />
                   <Text>上一题</Text>
              </Button>
              <Button transparent primary iconLeft >
                 <Text> { getCurrentIndex() + 1 } /  { total }</Text>
              </Button>
              <Button iconRight style={{backgroundColor:"#34495e"}}  onPress={ () => this._handleNext()  }>
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
`
const ActionView = styled.View`
    flex-direction:row;
    justify-content: center;
    align-items: center;
    margin:20;
    border-radius:10;
    height:60 ;
`

const CardViewHeader = styled.View`
    background-color:#ffffff;
    flex-direction:row;
    margin-top:10;
`

const CardViewBody = styled.View`
    background-color:transparent;
    padding-bottom:20;
`

const ReplyBtn = styled.TouchableOpacity `
  justify-content: center;
  align-items: center;
`

const ReplyBtnText = styled.Text `
  color:#b2bec3;
`

const ActionBtn = styled.TouchableOpacity`
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
