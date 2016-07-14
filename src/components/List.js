// 动态数据列表
import React, { Component, PropTypes } from 'react'
import { Input, Select, Button, DatePicker, Form, Row, Col, Icon } from 'antd'

const Option = Select.Option
const createForm = Form.create
const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker

class List extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            iconLoading: false
        }
    }

    // 拉取状态
    enterIconLoading = () => {
        this.setState({ iconLoading: true })
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
                <ul className="list-group mt50 list-box">
                    {
                        this.props.lists.map((e, i) => 
                            <li className="list-group-item clearfix" key={i}>
                                <row>
                                    <Col span={6}>{e.product}</Col>
                                    <Col span={6}>{e.host}</Col>
                                    <Col span={9}>
                                        <Input
                                            style={{ width: '80%' }}
                                            placeholder="请填写路径"
                                            defaultValue={e.path}
                                        />
                                    </Col>
                                    <Col span={3}>
                                        <Button type="dashed" icon="cross-circle">
                                            删除
                                        </Button>
                                    </Col>
                                </row>
                            </li>
                        )
                    }
                </ul>
                <div className="text-center">
                    <RangePicker {...timeProps} />
                </div>
                <div className="text-center mt50">
                    <Button type="primary" icon="cloud-download-o" loading={this.state.iconLoading} onClick={this.enterIconLoading}>
                        拉取日志
                    </Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button type="ghost" icon="reload">
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
        host: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired
    }).isRequired).isRequired
}

List = createForm()(List)

export default List