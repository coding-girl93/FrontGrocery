import React from 'react'
import Todo from './Todo.jsx'

export default class TodoList extends React.Component{
    render(){
        <ul>
            {this.props.todos.map((todo, index) =>
             <Todo {...todo}
                   key={index}
                   onClick={() => this.props.onTodoClick(index)} />
           )}
        </ul>

    }
}
