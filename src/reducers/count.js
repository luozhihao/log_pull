import { GETPRODUCTS } from '../constants'

// 初始化state数据
const initialState = {
    products: [],
    types: []
}

export default function update(state = initialState, action) {
    switch(action.type) {
        case GETPRODUCTS:
            return Object.assign({}, state, { products: action.products, types: action.ips })
            break
        default:
            return state
    }
}