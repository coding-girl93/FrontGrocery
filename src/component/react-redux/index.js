// require('./index.jsx')
 //require('./hello.jsx')
 //
 import {createStore,} from 'redux'
 import reducers from './reducers/reducers.js'
 import ReactDOM from 'react-dom'
 import React from 'react'
 import { Provider} from 'react-redux'
 import App from './components/app.jsx'

 let store = createStore(reducers)

 class Index  extends React.Component{
    render(){
        return(
            <Provider store={store}>
                <App/>
            </Provider>
        )
    }
 }

ReactDOM.render(<Index/>,document.getElementById('root'))
