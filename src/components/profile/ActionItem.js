import React,{Component} from 'react'
import styled from 'styled-components/native'

export default class ActionItem extends Component {
  _handlePress = () => {

  }

  render(){
    let { icon ,iconColor,title,onPress } = this.props
    icon = icon || <Entypo name="address" size={24}  style={{color:"#ffffff"}} />
    iconColor = iconColor || '#f1c40f'
    title = title || 'dd'
    onPress = onPress || this._handlePress
    return (
      <Item onPress={onPress}>
        <Grid>
            <Col style={{width:60}}>
              <Cell style={{backgroundColor:iconColor }}>
                  {icon}
              </Cell>
            </Col>
            <Col>
                <ItemText>  {title} </ItemText>
            </Col>
        </Grid>
      </Item>
    )
  }
}

const Item = styled.TouchableHighlight`
  height:50;
  border-width:0.2;
  border-color:#f5f5f5;
  background-color:rgba(0,0,0,0.1);
`

const Cell = styled.View`
  justify-content: center;
  align-items: center;
  height:50;
`
const ItemText = styled.Text`
  font-size:18;
  padding-top:12;
  color:white;
`
