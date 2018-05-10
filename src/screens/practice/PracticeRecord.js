/* @flow */

import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { View,Text,FlatList,StyleSheet,TouchableOpacity,Platform } from 'react-native'
import { Left,Right } from 'native-base'
import Numeral from "numeral"
import colors from '../../components/colors'
var values = require('lodash.values')

@inject('bankStore','userStore')
@observer
export default class PracticeRecord extends Component {

  _keyExtractor = (item, index) =>  index.toString()
  
  _openPractingView = (type,bankid) => {
    const {navigation} = this.props
    navigation.navigate('Practing', {type,bankid})
  }

  renderItem = ({item,index}) =>{
    return (
        <View style={styles.item} key={{index}}>
            <Left style={{padding:0}}>
                <Text>{index+1}   {item.name}</Text>
            </Left>
            <Right style={{padding:0}}>
                <View style={styles.actionBar}>
                    <TouchableOpacity style={[styles.actionBtn]} onPress={() => this._openPractingView("wrong",item.id)}>
                        <Text style={[styles.actionText,{color:'#e17058'}]}>{Numeral(item.wrong).format("0 a")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn,]}>
                        <Text style={[styles.actionText,{color:'#00cec9'}]}>{Numeral(item.done).format("0 a")}</Text>
                    </TouchableOpacity>
                </View>
            </Right>
        </View>
    )
  }

  separator = () => {
    return (<View style={{height:1,flex:1,backgroundColor:'#cccccc'}}></View>)
    }

  render() {
    const {navigation,bankStore} = this.props
    const banks = bankStore.records.banks || null 
    return (
        <View style={styles.container}>
            <FlatList
              data={values(banks)}
              keyExtractor={this._keyExtractor}
              ItemSeparatorComponent={this.separator}
              renderItem={this.renderItem}
              />
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container:{
    },
    item :{
        flexDirection:'row',
        margin:1,
        paddingLeft:10,
        backgroundColor:'#f5f5f5',
        // ...Platform.select({
        //     ios: {
        //         shadowColor: 'black',
        //         shadowOpacity: 0.1,
        //         shadowRadius: 10,
        //         shadowOffset: { height:0, width: 0},
        //     },
        //     android: {
        //         elevation:1
        //     }
        // })
    },
    actionBar:{
        flexDirection:'row',
    },
    actionBtn:{
        height:40,
        minWidth:40,
        marginLeft:5,
        justifyContent:'center',
        alignItems: 'center',
        borderLeftWidth:1,
        borderRightWidth:0,
        borderColor:'#ced6e0',
    },
    actionText:{
        color:'white',
        justifyContent:'center',
        alignItems: 'center',
        fontWeight: 'bold'
    }
});
