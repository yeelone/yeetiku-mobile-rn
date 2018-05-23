/* @flow */

import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { View,Text,FlatList,StyleSheet,Dimensions,ImageBackground,TouchableOpacity } from 'react-native'
import { Container ,Card,Button,CardItem} from 'native-base'
import TopHeader  from '../../components/header'
import colors from '../../components/colors'
const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

@inject('examStore','questionStore','userStore')
@observer
export default class ExamScreen extends Component {

  componentDidMount(){
    this.asyncInitialData()
  }

  asyncInitialData = () => {
    const { examStore, userStore} = this.props
    examStore.cleanUserExams()
    examStore.fetchByUser(userStore.id)
  }

  _handlePress  = async () => {
    const { examStore,navigation } = this.props 
    await examStore.getNewExam()
    navigation.navigate('ExamPracting', {id: examStore.currentExam.id})
  }

  renderTimeComp = (date) => {
    let newDate = [2018,1,1]
    if ( date ){
      newDate = date.split('-')
    }

    return (
      <View style={{marginTop:10}}>
         <Text style={{width:60,color:'#ff7f50',fontSize:20,textAlign: 'center'}}>{newDate[2]} </Text>
         <Text style={{color:'grey',fontSize:12,textAlign: 'center'}}>{newDate[1]} </Text>
         <Text style={{color:'grey',fontSize:10,textAlign: 'center'}}>{newDate[0]} </Text>
      </View>
    )
  }


  renderItem = ({item,index}) => {
    const { examStore } = this.props 
    let score = item.score
    if ( examStore.getScore(item.id) > 0 ){
      score = examStore.getScore(item.id) 
    }
    return (
      <View style={{flex:1,flexDirection:'row'}}>
        <View style={styles.leftPane}>
            {this.renderTimeComp(item.CreatedAt)}
        </View>
          
        <Card style={styles.cardItem}>
          <Text style={{fontSize:16}}>{item.name} </Text>
          
          <View style={{flex:1,flexDirection:'row',margin:5}}>
            <Text style={styles.cardText}>题数： <Text style={{fontSize:20,color:'#fab1a0'}}> {item.quantity} </Text> </Text>
            <Text style={styles.cardText}>得分： <Text style={{fontSize:20,color:'#55efc4'}}> {score} </Text> </Text>
          </View>

          <View style={{flex:1,flexDirection:'row',justifyContent: 'flex-end',}}>
          { item.expired ? 
          <TouchableOpacity onPress={()=>this.props.navigation.navigate('ExamPracting', {id: item.id})}>
            <Text style={{color:'grey',fontSize:12}}>查看结果 </Text>
          </TouchableOpacity>
          :
          <TouchableOpacity onPress={()=>this.props.navigation.navigate('ExamPracting', {id: item.id})}>
            <Text style={{color:'grey',fontSize:12}}>开始测试</Text>
          </TouchableOpacity>
          }
            
          </View> 
        </Card>
      </View>
    )
  }

  renderCreateBtn = () => {
    return (
      <View style={{height:140,paddingLeft:10,paddingRight:10,marginBottom:20}}>
        <Card style={{ borderWidth:0 }}>
          <View style={{ justifyContent:'center',backgroundColor:"#f6e58d"}}>
            <Text style={{padding:10}}>
                  欢迎来到YEE测试教室，我是您的测试小助手，在这里您可以随意创建您的复习试卷，系统将会从您之前练习过的题中随机抽取来组成复习试卷。
            </Text>
          </View>
          <View style={{ flex:1,flexDirection:'row',justifyContent:'center',height:50,marginTop:20 }}>
            <Button style={{backgroundColor:"#ff7979" ,width:150,height:30, justifyContent: 'center'}} onPress={() => this._handlePress() }>
                <Text style={{color:'white'}}>创建随机复习卷</Text>
            </Button>
          </View>
        </Card>
      </View>
    )
  }

  _keyExtractor = (item, index) =>  index.toString()
  render() {
    const { navigation, examStore,userStore } = this.props
    return (
      <Container style={{flex:1,backgroundColor:"#fff"}}>
       <TopHeader
            navigation={navigation}
            left={ <Text style={{color:colors.headerTextColor, fontSize:20 }}>考试</Text>}
            style={{ height:60,backgroundColor:colors.theme }}
            />
            {this.renderCreateBtn()}
            <FlatList
                data={examStore.exams}
                keyExtractor={this._keyExtractor}
                renderItem={({item,index}) => this.renderItem({item,index})}
                refreshing={examStore.loading}
                />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  cardItem :{
    padding:20,
    marginLeft:10,
    marginRight:20,
    
  },
  cardText:{
    color:'grey'
  },
  leftPane:{
    width:80,
    flexDirection:'row',
    justifyContent: 'flex-start',
    borderRightWidth:1,
    borderRightColor:'#dfe4ea',
  }

})
