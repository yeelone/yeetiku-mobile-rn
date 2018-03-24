/* @flow */

import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Text } from 'react-native'
import { Container} from 'native-base'

@observer
export default class QuestionComments extends Component {

  _openPractingView = (type) => {
      const {navigation} = this.props
      navigation.navigate('Practing', {type})
  }

  render() {
    return (
        <Container>
            <Text>hello</Text>
        </Container>
    )
  }
}
