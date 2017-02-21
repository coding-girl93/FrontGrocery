import React from 'react'
import {createStore,bindActionCreators}  from 'redux'
import { Provider,connect} from 'react-redux'
import {clickText,clickButton} from '../actions/actions.js'
class Hello extends React.Component {
    constructor(props) {
        super(props)
    }
    handleClick=()=>{
        this.props.actions.clickText()
    }
    render(){
        return(
            <h1 onClick={this.handleClick}>{this.props.text}</h1>
        )
    }
}

class Change extends React.Component{
    constructor(props){
        super(props)
    }
    handleClick=()=>{
        this.props.actions.clickButton()
    }
    render(){
        return(
            <button onClick={this.handleClick}>点我看看</button>
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props)
    }
    render(){
        const {actions,text} = this.props
        return (
            <div>
                <Hello actions={actions} text={text}/>
                <Change actions={actions}/>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {text:state.text}
}
function mapDispatchToProps(dispatch){
    return{
        actions:bindActionCreators({clickText,clickButton},dispatch)
    }
}
App= connect(mapStateToProps,mapDispatchToProps)(App)
export default App
