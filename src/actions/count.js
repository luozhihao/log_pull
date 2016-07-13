import { GETPRODUCTS, GETLIST } from '../constants' 
import 'whatwg-fetch'  // 引入fetch来进行Ajax

// 创建对象时设置初始化信息
const headers = new Headers()

// 设置请求头
headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')

export const setProducts = data => {
    return {
        type: GETPRODUCTS,
        products: data.products,
        ips: data.ips
    }
}

export const setList = data => {
    return {
        type: GETLIST,
        arr: data
    }
}

function fetchProducts() {
    return dispatch => {
        let bar = 1

        let request = new Request('data.json', {
            headers,
            /*method: 'POST', 
            body: `foo=${bar}`*/
        })

        return fetch(request)
            .then((res) => { console.log(res.status); return res.json() })
            .then((data) => {
                dispatch(setProducts(data))
            })
            .catch((e) => { console.log(e.message) })
        }
}

// 获取下拉框数据
export function getSelects() {
    return (dispatch, getState) => {
        return dispatch(fetchProducts())
    }
}
