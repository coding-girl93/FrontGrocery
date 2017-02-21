import {CLICK_TEXT,CLICK_BUTTON} from '../actions/actions.js'


export default function myApp(state={text:"Hello"},action){
    switch (action.type) {
        case CLICK_TEXT:
            return {
                text:state.text=='Hello'?'在coding的姑娘':'Hello'
            }
        case CLICK_BUTTON:
            return{
                text:'有一个姑娘在coding'
            }

        default:
            return state

    }
}
