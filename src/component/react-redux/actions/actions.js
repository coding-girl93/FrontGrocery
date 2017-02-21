export const CLICK_TEXT ='CLICK_TEXT'
export const CLICK_BUTTON = 'CLICK_BUTTON'

export function clickText(text){
    return{
        type:CLICK_TEXT,
        text
    }
}
export function clickButton() {
    return{
        type:CLICK_BUTTON
    }
}
