import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input, Select, Button, DatePicker, Form, Modal } from 'antd'
import { getSelects, setList } from '../actions/count'
import List from '../components/List'

const Option = Select.Option
const createForm = Form.create
const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const confirm = Modal.confirm

class App extends Component {

    componentDidMount() {
        const { getSelects } = this.props

        // 获取下拉框数据
        getSelects()
    }

    // 加入列表
    handleSubmit = (e) => {
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
          console.log('确定')
        },
        onCancel() {}
      })
    }

    render() {
        const { products, types, lists } = this.props

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

        /*const timeProps = getFieldProps('times', {
            rules: [
                { required: true, type: 'array', message: '请选择时间范围' },
            ]
        })

        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 12 }
        }*/

        return(
            <div className="log-box">
                <div className="panel panel-default log-header">
                    <div className="panel-heading">
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
                                        types.map((e,index) => 
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
                            {/*<FormItem label="时间">
                                <RangePicker {...timeProps} />
                            </FormItem>*/}
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
        types: state.update.types,
        lists: state.list.lists
    }
}

App = createForm()(App)

export default connect(getData, { getSelects, setList })(App)