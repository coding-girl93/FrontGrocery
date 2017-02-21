import React from 'react'
import ReactDOM from 'react-dom'

class Hello extends React.Component {
    constructor(props) {
        super(props)
    }
    handleClick=()=>{
        this.props.onClickText()
    }
    render(){
        return(
            <h1 onClick={this.handleClick}>{this.props.text}</h1>
        )
    }
}
class Change extends React.Component {
    constructor(props) {
        super(props)
    }
    handleClick= ()=>{
        this.props.onClickButton()
    }
    render(){
        return(
            <button onClick={this.handleClick}>点我</button>
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            text:'hello'
        }
    }
    handleClickText=()=>{
        let text = this.state.text;
        let newtext= (text=='hello' )? '在coding的姑娘':'hello'
        this.setState({text:newtext})
    }
    handleClickButton=()=>{
        this.setState({text:'姑娘你点击了按钮'})
    }
    render(){
        return(
            <div>
                <Hello text={this.state.text} onClickText={this.handleClickText}/>
                <Change onClickButton={this.handleClickButton}/>
            </div>
        )
    }
}
ReactDOM.render(<App/>,document.getElementById('root'));
