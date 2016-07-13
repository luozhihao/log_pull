import { GETLIST } from '../constants'

// 初始化state数据
const initialState = {
    lists: []
}

export default function list(state = initialState, action) {
    switch(action.type) {
        case GETLIST:
            return Object.assign({}, state, { lists: action.arr })
            break
        default:
            return state
    }
}