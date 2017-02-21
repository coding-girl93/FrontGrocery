import React from 'react'
import {findDOMNode} from 'react-dom'

export default class AddTodo extends React.Component{
    handleClick=(e)=>{
        const node = findDOMNode(this.refs.input)
        const text = node.value.trim()
        this.props.onAddClick(text)
        node.value=''
    }
    render(){
        return (
            <div>
                <input type='text' ref='input'/>
                <button onClick={this.handleClick}>
                    ADD
                </button>
            </div>
        )
    }
}
