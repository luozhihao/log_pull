import { GETPRODUCTS } from '../constants'

// 初始化state数据
const initialState = {
    products: [],
    ips: [{value: '127.0.0.1', label: '127.0.0.1'}, {value: '12.2.2.2', label: '12.2.2.2'}]
}

export default function update(state = initialState, action) {
    switch(action.type) {
        case GETPRODUCTS:
            return Object.assign({}, state, { products: action.products })
            break
        default:
            return state
    }
}