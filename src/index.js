/* @flow */

import React, { Component } from 'react'
import {
  AppRegistry,
} from 'react-native'
import { Provider } from 'mobx-react'

import App from './router'
import stores from './stores'
import { injectStore } from './utils/request'

injectStore(stores.userStore)

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
