import React, { Component } from 'react'
import { Text,View, } from 'react-native'
import { Container,CardItem ,ListItem, CheckBox,Button } from 'native-base'
import { observable,toJS,runInAction } from 'mobx'
import { observer } from 'mobx-react'
import color from '../colors'

@observer
export default class MultiSelect extends Component {
  @observable selectedOptions = observable.map({})
  @observable showAnswers = false
  @observable selectedStyles = observable.map({})

  constructor(props){
    super(props)
    this.result = false
  }

  componentDidMount(){
      const { options } = this.props.question
      const { initial } = this.props
      runInAction("update state after fetching data",()=>{
          this.showAnswers = false
          if ( initial ) {
            if ( initial.length > 0 ){
              initial.map((item) => {
                this.selectedOptions.set(item,true)
              })
              this._checkAnswer()
            }else{
              this.selectedOptions = observable.map({})
              this.selectedStyles = observable.map({})
              this.showAnswers = false
            }
          }
      })

  }

  _handlerPress = (id) => {
      this.selectedOptions.set(id,!this.selectedOptions.get(id))
  }

  _checkAnswer = () => {
    const { options }  = this.props.question
    runInAction("check answers and set styles ",()=>{
      if ( options.length > 0 ){
        for (let i = 0 ; i < options.length; i++){
          let id = options[i].id
          if ( this.selectedOptions.get(id) && options[i].is_correct ){ //都为真，则表示选择正确
            this.selectedStyles.set(id,{color:color.rightColor})
            this.result = true
          }else if ( !this.selectedOptions.get(id) && options[i].is_correct ){
            //只要有一个选错，则结果就是错的
            this.selectedStyles.set(id,{color:color.wrongColor})
            this.result = false
          }
        }

        this.showAnswers = true
      }
    })
  }

  renderAnswerList(){
      const { question } = this.props
      const options = question.options
      let answers = []
      for ( let i=0; i< options.length ;i++){
        if ( options[i].is_correct ){
          answers.push(String.fromCharCode(65+i))
        }
      }

      return <Text> { answers.join(" , ") } </Text>
  }

  _submitOptions = () => {
    this._checkAnswer()
    this.showAnswers = true

    //获得所有选择的选项的键
    let selectedKeys = []
    this.selectedOptions.forEach((value, key, map) => {
      if ( value ) {
        selectedKeys.push(key)
      }
    })
    this.props.onSelect(selectedKeys, this.result )
  }

  render() {
    const { index,question } = this.props
    const checkitem = question.options.map((item)=> {
        const id = item.id
        let style = this.selectedStyles.get(id)
        return (
          <ListItem key={id} onPress={ () => this._handlerPress(id) }  style={{minWidth:250}}>
              <CheckBox checked={this.selectedOptions.get(id)} />
              <Text style={ style }> {item.content} </Text>
          </ListItem>
        )
    })

    const answers = question.options
    return (
        <View style={{flex:1}}>
              <View>
                { checkitem }
                <Button light full onPress={() => { this._submitOptions() } }>
                      <Text>提交答案</Text>
                </Button>
              </View>

              { this.showAnswers ?
                <CardItem header>
                    <Text>正确答案是：</Text>
                    { this.renderAnswerList() }
                </CardItem>
                : null }
        </View>
    )
  }
}
