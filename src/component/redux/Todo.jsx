import React from 'react'

export default class Todo extends React.Component{
    render(){
        <li onClick={this.props.onClick}>
            {this.props.text}
        </li>
    }
}
