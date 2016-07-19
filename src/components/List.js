// 动态数据列表
import React, { Component, PropTypes } from 'react'
import { Input, Select, Button, DatePicker, Form, Row, Col, Icon, message, Spin } from 'antd'

const Option = Select.Option
const createForm = Form.create
const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker

// 创建对象时设置初始化信息
const headers = new Headers()

// 设置请求头
headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')

class List extends Component {
    constructor(props) {
        super(props)
        this.state = {
            iconLoading: false
        }
    }

    // 拉取状态
    handleSubmit = e => {
        e.preventDefault()

        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                message.info('请选择时间范围')
                return
            }

            if (!this.props.lists.length) {
                message.info('请添加拉取路径列表')
                return
            }

            this.setState({ iconLoading: true })

            let startDate = new Date(values.times[0]),
                endDate = new Date(values.times[1]),
                sYear = startDate.getFullYear(),
                sMonth = startDate.getMonth() + 1,
                sDate = startDate.getDate(),
                eYear = endDate.getFullYear(),
                eMonth = endDate.getMonth() + 1,
                eDate = endDate.getDate();

            sMonth < 10 ? sMonth = '0' + sMonth : ''
            sDate < 10 ? sDate = '0' + sDate : ''
            eMonth < 10 ? eMonth = '0' + eMonth : ''
            eDate < 10 ? eDate = '0' + eDate : ''

            let request = new Request('/pull_logs/', {
                headers,
                method: 'POST',
                credentials: 'include',
                body: `paths=${JSON.stringify(this.props.lists)}&start=${sYear}-${sMonth}-${sDate}&end=${eYear}-${eMonth}-${eDate}`
            })

            fetch(request)
                .then((res) => { return res.json() })
                .then((data) => {
                    if (data.status !== 500) {
                        this.props.saveLog(data.result)
                        this.props.clearPaths()
                        this.setState({iconLoading: false})
                    } else {
                        message.error(data.msg)
                    }
                })
        })
    }

    // 更新路径
    handleChange = (e) => {
        this.props.handleChange(e.target)
    }

    render() {
        const { getFieldProps } = this.props.form

        const timeProps = getFieldProps('times', {
            rules: [
                { required: true, type: 'array', message: '请选择时间范围' },
            ]
        })

        return(
            <Form inline form={this.props.form}>
                <Spin size="large" tip="正在加载数据..." spinning={this.state.iconLoading}>
                    <ul className="list-group mt50 list-box">
                        {   
                            !this.props.logs.length ?
                                this.props.lists.map((e, index) => 
                                    <li className="list-group-item clearfix" key={index}>
                                        <row>
                                            <Col span={6}>{e.product}</Col>
                                            <Col span={6}>{e.ip}</Col>
                                            <Col span={9}>
                                                <Input
                                                    id={index}
                                                    style={{width: '80%'}}
                                                    placeholder="请输入路径" 
                                                    value={e.path}
                                                    onChange={this.handleChange}
                                                />
                                            </Col>
                                            <Col span={3}>
                                                <Button type="dashed" icon="copy" onClick={this.props.copy.bind(this, e)}>
                                                    拷贝
                                                </Button>
                                                &nbsp;&nbsp;&nbsp;
                                                <Button type="dashed" icon="cross-circle" onClick={this.props.delete.bind(this, index)}>
                                                    删除
                                                </Button>
                                            </Col>
                                        </row>
                                    </li>
                                )
                            :
                                this.props.logs.map((e, index) => 
                                    <li className="list-group-item clearfix" key={index}>
                                        <row>
                                            <Col span={6}>{e.product}</Col>
                                            <Col span={6}>{e.ip}</Col>
                                            <Col span={9}>{e.path}</Col>
                                            <Col span={3}>
                                                {
                                                    e.status ? <a href={e.msg} target="_blank">下载</a> : <span className="text-danger">{e.msg}</span>
                                                }
                                            </Col>
                                        </row>
                                    </li>
                                )
                        }
                    </ul>
                </Spin>
                <div className="text-center">
                    <RangePicker {...timeProps} />
                </div>
                <div className="text-center mt50">
                    <Button 
                        type="primary" 
                        icon="cloud-download-o" 
                        loading={this.state.iconLoading} 
                        onClick={this.handleSubmit}
                    >
                        拉取日志
                    </Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button type="ghost" icon="reload" onClick={this.props.clear}>
                        清空列表
                    </Button>
                </div>
            </Form>
        )
    }
}

List.propTypes = {
    lists: PropTypes.arrayOf(PropTypes.shape({
        product: PropTypes.string.isRequired,
        ip: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired
    }).isRequired).isRequired
}

List = createForm()(List)

export default List