import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  Descriptions,
  Badge,
  Modal,
  Button,
  Slider,
  Row,
  Col,
  InputNumber,
} from 'antd'
import { connect } from 'dva'
import { Page } from 'components'
import styles from './index.less'

@connect(({ accountDetail }) => ({ accountDetail }))
class AccountDetail extends PureComponent {
  constructor(props) {
    super(props)
    console.log(props)
    this.state = {
      rendered: false,
      visible: false,
      inputValue: 1,
      detail: props.accountDetail.data,
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  handleAdd = async () => {
    await fetch('http://localhost:8080/balance/add', {
      method: 'POST',
      body: JSON.stringify({
        msisdn: this.state.detail.msisdn,
        amount: this.state.inputValue,
      }),
    })
      .then(response => {
        return response.json()
      })
      .then(d => {
        this.setState({ detail: d.data })
      })
  }

  handleDeduct = async () => {
    await fetch('http://localhost:8080/balance/deduct', {
      method: 'POST',
      body: JSON.stringify({
        msisdn: this.state.detail.msisdn,
        amount: this.state.inputValue,
      }),
    })
      .then(response => {
        return response.json()
      })
      .then(d => {
        this.setState({ detail: d.data })
      })
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }
  onChange = value => {
    this.setState({
      inputValue: value,
    })
  }

  render() {
    const { visible, inputValue } = this.state
    console.log(this.state.detail['msisdn'])
    if (!this.state.rendered) {
      console.log('back')
      console.log(this.props.accountDetail.data)
      this.setState({ detail: this.props.accountDetail.data, rendered: true })
    }
    return (
      <Page inner>
        <Descriptions title="Account Info" bordered>
          <Descriptions.Item label="Msisdn" span={3}>
            {String(this.state.detail['msisdn'])}
          </Descriptions.Item>
          <Descriptions.Item label="Active" span={3}>
            {this.state.detail['active'] ? (
              <Badge
                status="success"
                text={String(this.state.detail['active'])}
              />
            ) : (
              <Badge
                status="error"
                text={String(this.state.detail['active'])}
              />
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Core Balance" span={3}>
            {String(this.state.detail['core_balance'])}&nbsp; &nbsp; &nbsp;{' '}
            <Button type="default" onClick={this.showModal}>
              Modify Balance
            </Button>
          </Descriptions.Item>
          <Descriptions.Item label="Created Time" span={3}>
            {String(this.state.detail['created_at'])}
          </Descriptions.Item>
          <Descriptions.Item label="Updated Time" span={3}>
            {String(this.state.detail['updated_at'])}
          </Descriptions.Item>
          <Descriptions.Item label="Expired Time" span={3}>
            {String(this.state.detail['expired_at'])}
          </Descriptions.Item>
        </Descriptions>
        <Modal
          visible={visible}
          title="Modify Balance"
          onCancel={this.handleCancel}
          footer={[
            <Button key="Add" type="primary" onClick={this.handleAdd}>
              Add
            </Button>,
            <Button key="Deduct" type="danger" onClick={this.handleDeduct}>
              Deduct
            </Button>,
          ]}
        >
          <Descriptions bordered>
            <Descriptions.Item
              className={styles.shortLabel}
              label="Core Balance"
              span={3}
            >
              {String(this.state.detail['core_balance'])}
            </Descriptions.Item>
            <Descriptions.Item
              className={styles.shortLabel}
              label="Modify"
              span={3}
            >
              <Row>
                <Col span={12}>
                  <Slider
                    min={1}
                    max={20}
                    onChange={this.onChange}
                    value={typeof inputValue === 'number' ? inputValue : 0}
                  />
                </Col>
                <Col span={4}>
                  <InputNumber
                    min={1}
                    max={20}
                    style={{ marginLeft: 16 }}
                    value={inputValue}
                    onChange={this.onChange}
                  />
                </Col>
              </Row>
            </Descriptions.Item>
          </Descriptions>
        </Modal>
      </Page>
    )
  }
}

AccountDetail.propTypes = {
  accountDetail: PropTypes.object,
}

export default AccountDetail
