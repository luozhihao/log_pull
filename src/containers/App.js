import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input, Select, Button, Form, Modal } from 'antd'
import { getSelects, setList } from '../actions/count'
import List from '../components/List'

const Option = Select.Option
const createForm = Form.create
const FormItem = Form.Item
const confirm = Modal.confirm

// 创建对象时设置初始化信息
const headers = new Headers()

// 设置请求头
headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')

class App extends Component {

    componentDidMount() {
        const { getSelects } = this.props

        // 获取下拉框数据
        getSelects()
    }


    // 获取选中产品
    getHosts = value => {
        console.log(value)
    }

    // 加入列表
    handleSubmit = e => {
        const { setList } = this.props

        e.preventDefault()

        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!')
                return
            }

            let list = []

            values.hosts.map(e => {
                list.push({product: values.products, host: e, path: values.paths})
            })

            setList(list)

            this.props.form.resetFields()
        })
    }

    // 确认退出
    showConfirm = () => {
        confirm({
            title: '确认提示',
            content: '是否退出系统？',
            onOk() {
                let request = new Request('/logout/', {
                    headers,
                    method: 'POST',
                    credentials: 'include'
                })

                fetch(request)
                    .then((res) => { return res.json() })
                    .then((data) => {
                        location.href="/"
                    })
            },
            onCancel() {}
        })
    }

    render() {
        const { products, ips, lists } = this.props

        const { getFieldProps } = this.props.form

        const productProps = getFieldProps('products', {
            rules: [
                { required: true, message: '请选择产品' },
            ]
        })

        const hostProps = getFieldProps('hosts', {
            rules: [
                { required: true, type: 'array', message: '请选择IP' },
            ]
        })

        const pathProps = getFieldProps('paths', {
            rules: [
                { required: true, message: '请填写路径' },
            ]
        })

        return(
            <div className="log-box">
                <div className="panel panel-default log-header">
                    <div className="panel-heading header-style">
                        <h1 className="panel-title">
                            日志拉取工具
                            <Button className="exit-btn" onClick={this.showConfirm}>
                                <span className="glyphicon glyphicon-off"></span>
                            </Button>
                        </h1>
                    </div>
                    <div className="panel-body">
                        <Form inline form={this.props.form}>
                            <FormItem label="产品">
                                <Select showSearch
                                    {...productProps}
                                    style={{ width: '120px' }} 
                                    placeholder="请选择产品"
                                    optionFilterProp="children"
                                    notFoundContent="无法找到"
                                    onSelect={this.getHosts}
                                >
                                    {
                                        products.map((e,index) => 
                                            <Option value={e.value} key={index}>{e.label}</Option>
                                        )
                                    }
                                </Select>
                            </FormItem>
                            <FormItem label="IP">
                                <Select 
                                    showSearch
                                    multiple
                                    {...hostProps}
                                    style={{ width: '500px' }}
                                    placeholder="请选择类型"
                                    optionFilterProp="children"
                                    notFoundContent="无法找到"
                                >
                                    {
                                        ips.map((e,index) => 
                                            <Option value={e.value} key={index}>{e.label}</Option>
                                        )
                                    }
                                </Select>
                            </FormItem>
                            <FormItem label="路径">
                                <Input
                                    {...pathProps} 
                                    style={{ width: '300px' }}
                                    placeholder="请填写路径"
                                 />
                            </FormItem>
                            <FormItem>
                                <Button onClick={this.handleSubmit}>加入列表</Button>
                            </FormItem>
                        </Form>
                        <List lists={lists}></List>
                    </div>
                </div>
            </div>
        )
    }
}

const getData = state => {
    return {
        products: state.update.products,
        ips: state.update.ips,
        lists: state.list.lists
    }
}

App = createForm()(App)

export default connect(getData, { getSelects, setList })(App)