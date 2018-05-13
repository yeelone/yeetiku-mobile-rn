/* @flow */

import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { View,Text,FlatList,StyleSheet,Dimensions,ImageBackground } from 'react-native'
import { Container ,Card} from 'native-base'
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

  renderTimeComp = (date) => {
    var d = date.split('-')

    return (
      <View style={{marginTop:10}}>
         <Text style={{width:60,color:'#ff7f50',fontSize:20,textAlign: 'center'}}>{d[2]} </Text>
         <Text style={{color:'grey',fontSize:12,textAlign: 'center'}}>{d[1]} </Text>
         <Text style={{color:'grey',fontSize:10,textAlign: 'center'}}>{d[0]} </Text>
      </View>
    )
  }

  renderItem = ({item,index}) => {

    return (
      <View style={{flex:1,flexDirection:'row'}}>
        <View style={styles.leftPane}>
            {this.renderTimeComp(item.CreatedAt)}
        </View>
          
        <Card style={styles.cardItem}>
          <Text style={{fontSize:16}}>{item.name} </Text>
          
          <View style={{flex:1,flexDirection:'row',margin:5}}>
            <Text style={styles.cardText}>题数： <Text style={{fontSize:20,color:'#fab1a0'}}> {item.quantity} </Text> </Text>
            <Text style={styles.cardText}>得分： <Text style={{fontSize:20,color:'#55efc4'}}> {item.score} </Text> </Text>
          </View>

          <View style={{flex:1,flexDirection:'row',justifyContent: 'flex-end',}}>
          { item.expired ? 
          <Text style={{color:'grey',fontSize:12}}>查看结果 </Text>
          :
          <Text style={{color:'grey',fontSize:12}}>开始测试</Text>
          }
            
          </View> 
        </Card>
      </View>
    )
  }

  _keyExtractor = (item, index) =>  index.toString()
  render() {
    const { navigation, examStore,userStore } = this.props
    return (
      <Container style={{flex:1,}}>
       <TopHeader
            navigation={navigation}
            left={ <Text style={{color:colors.headerTextColor, fontSize:20 }}>考试</Text>}
            style={{ height:60,backgroundColor:colors.theme }}
            />

            <FlatList
                data={examStore.exams}
                keyExtractor={this._keyExtractor}
                renderItem={({item,index}) => this.renderItem({item,index})}
                refreshing={examStore.loading}
                style={{marginTop:60}}
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
