import React, {Component, PropTypes} from 'react'
import { TextInput } from 'react-native'
import { observer } from 'mobx-react'
import { observable  } from 'mobx'
import styled from 'styled-components/native'

const FormInput = styled.TextInput`
  height:40;
  background: rgba(255,255,255,0.2);
  margin-bottom:10;
  color:#fff;
  padding-horizontal:10;
`

@observer
export default class InputField extends Component {
  @observable name: string = ''

  onChange = (event) =>  {
    this.props.onChange( this.name, event.nativeEvent.text)
  }

  render () {
    const input = this.props
    this.name = input.name
    return (
        <FormInput
            {...this.props}
            underlineColorAndroid='transparent'
            onChange={ (event) => this.onChange(event) }
            value={input.value} />
    )
  }
}

InputField.defaultProps = {
  type: 'text'
}
