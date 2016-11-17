import React from 'react'
import ReactDOM from 'react-dom'
import {Button} from 'antd'

import DateRange from '../../component/range-picker/index.jsx';

export default class Index extends React.Component{
    constructor(props){
        super(props)
        this.state={
            visible:false
        }
    }
    handleClick=()=>{
        this.setState({visible:true})
    }
    render(){

        return (
            <div>
                <DateRange visible={this.state.visible}></DateRange>
                <Button type='primary' onClick={this.handleClick}>选择日期</Button>
            </div>
        )
    }
}

ReactDOM.render(<Index />, document.getElementById('J_container'));
