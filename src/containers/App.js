import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input, Select, Button, Form, Modal } from 'antd'
import { getSelects, getHosts, setList, deleteList, updatePath, clearList, saveLog, clearLog } from '../actions/count'
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

        // 获取产品列表
        getSelects()
    }

    // 获取选中产品
    getIps = value => {
        const { getHosts } = this.props

        getHosts(value)

        this.props.form.setFieldsValue({'hosts': []})
    }

    // 加入列表
    handleSubmit = e => {
        const { setList, clearLog } = this.props

        e.preventDefault()

        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!')
                return
            }

            clearLog() // 清空日志

            let list = []

            values.hosts.map(e => {
                list.push({product: values.products, ip: e, path: values.paths})
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

    // 拷贝
    copy = (e) => {
        this.props.setList([{product: e.product, ip: e.ip, path: e.path}])
    }

    // 删除
    delete = (index) => {
        this.props.deleteList(index)
    }

    // 更新路径
    handleChange = (e) => {
        this.props.updatePath(e.value, e.id)
    }

    // 清空列表
    clear = () => {
        this.props.clearList()
        this.props.clearLog()
    }

    // 清空list
    clearPaths = () => {
        this.props.clearList()
    }

    // 存储日志
    saveLog = param => {
        this.props.saveLog(param)
    }

    render() {
        const { products, ips, lists, update, logs } = this.props

        const { getFieldProps } = this.props.form

        const productProps = getFieldProps('products', {
            rules: [
                { required: true, message: '请选择产品' }
            ]
        })

        const hostProps = getFieldProps('hosts', {
            rules: [
                { required: true, type: 'array', message: '请选择IP' }
            ]
        })

        const pathProps = getFieldProps('paths', {
            rules: [
                { required: true, message: '请填写路径' }
            ]
        })

        return(
            <div className="log-box">
                <div className="panel panel-default log-header">
                    <div className="panel-heading header-style">
                        <h1 className="panel-title">
                            <ul className="circle-box">
                                <li className="red-circle circle"></li>
                                <li className="yellow-circle circle"></li>
                                <li className="gray-circle circle"></li>
                            </ul>
                            日志拉取工具
                            <Button className="exit-btn" onClick={this.showConfirm}>
                                <span className="glyphicon glyphicon-off"></span>
                            </Button>
                        </h1>
                    </div>
                    <div className="panel-body">
                        <Form inline form={this.props.form}>
                            <FormItem label="产品" hasFeedback>
                                <Select showSearch
                                    {...productProps}
                                    style={{ width: '120px' }} 
                                    placeholder="请选择产品"
                                    optionFilterProp="children"
                                    notFoundContent="无法找到"
                                    onSelect={this.getIps}
                                >
                                    {
                                        products.map((e,index) => 
                                            <Option value={e.value} key={index}>{e.label}</Option>
                                        )
                                    }
                                </Select>
                            </FormItem>
                            <FormItem label="IP" hasFeedback>
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
                            <FormItem label="路径" hasFeedback>
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
                        <List 
                            lists={lists}
                            logs={logs} 
                            update={update}
                            copy={this.copy} 
                            delete={this.delete}
                            handleChange={this.handleChange}
                            clear={this.clear}
                            saveLog={this.saveLog}
                            clearPaths={this.clearPaths}
                        >
                        </List>
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
        lists: state.list.lists,
        update: state.list.update,
        logs: state.list.logs
    }
}

App = createForm()(App)

export default connect(getData, { getSelects, getHosts, setList, deleteList, updatePath, clearList, saveLog, clearLog })(App)