import React from 'react'
import { DatePicker,Modal,message} from 'antd'

export default class DateRange extends React.Component {
    constructor(props) {
        super(props)
    }
    render(){
        return(
            <Modal style={{width:400}} title='自定义时间范围' visible={this.props.visible} onCancel={this.handleCancel}>
                <DatePicker/>
            </Modal>
        )
    }
}
