/* @flow */

import React, { Component } from 'react'
import {
  AppRegistry,
} from 'react-native'
import { Provider,onError } from 'mobx-react'

import App from './router'
import stores from './stores'

export default class YeeTiku extends Component {
  render() {
    return (
      <Provider {...stores}>
        <App />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('YeeTiku', () => YeeTiku)
