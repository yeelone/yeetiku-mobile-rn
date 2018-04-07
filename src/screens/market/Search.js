/* @flow */

import React, { Component } from 'react'
import { View,Text, } from 'react-native'
import { Button, Item, Input,Icon } from 'native-base'
import styled from 'styled-components/native'

export default class Search extends Component {

  constructor(){
    super()
    this.searchValue = ""
  }

  _onChangeText = (text) => {
      this.searchValue = text
  }

  _handleSearch = () => {
      this.props.onSearch(this.searchValue)
  }

  render() {
    return (
        <Container>
            <Item>
                <Input
                    placeholder="Search"
                    returnKeyType='search'
                    onChangeText={this._onChangeText}
                    onSubmitEdit={ () => {}}
                    />
                <Button transparent onPress={()=>this._handleSearch()}>
                    <Icon name="ios-search" />
                    <Text>Search</Text>
                </Button>
            </Item>
        </Container>
    )
  }
}


const Container = styled.View`
    margin:20;
`