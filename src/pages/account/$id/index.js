import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  Descriptions,
  Badge,
  Modal,
  Button,
  Select,
  Slider,
  Row,
  Col,
  InputNumber,
  Collapse,
} from 'antd'
import { connect } from 'dva'
import { Page } from 'components'
import styles from './index.less'
const { Panel } = Collapse
const { Option } = Select
@connect(({ accountDetail }) => ({ accountDetail }))
class AccountDetail extends PureComponent {
  constructor(props) {
    super(props)
    console.log(props)
    this.state = {
      rendered: false,
      visible: false,
      packageVisible: false,
      inputValue: 1,
      detail: props.accountDetail.data,
      selectedPackage: null,
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  addPackage = () => {
    this.setState({
      packageVisible: true,
    })
  }

  handleAddPackage = async () => {
    await fetch(
      'http://localhost:8080/account/' +
        this.state.detail.msisdn +
        '/package/' +
        this.state.selectedPackage,
      {
        method: 'POST',
      }
    ).then(response => {
      return response.json()
    })
    await fetch('http://localhost:8080/packages/' + this.state.detail.msisdn)
      .then(response => {
        return response.json()
      })
      .then(d => {
        let detail = this.state.detail
        detail.packages = d.data
        this.setState({ detail })
      })
    this.handlePackageCancel()
  }

  handleAdd = async () => {
    let data
    await fetch(
      'http://localhost:3000/uvatel/balances/' + this.state.detail.msisdn,
      {
        method: 'PUT',
        headers: {
          'api-version': 4,
          msisdn: this.state.detail.msisdn,
          package: 'uvatel.lend.us',
          'Sec-Fetch-Mode': 'cors',
          amount: this.state.inputValue,
        },
      }
    )
    await fetch('http://localhost:8080/account/' + this.state.detail.msisdn)
      .then(response => {
        return response.json()
      })
      .then(d => {
        data = d['data']
      })
    await fetch('http://localhost:8080/packages/' + data.msisdn)
      .then(response => {
        return response.json()
      })
      .then(d => {
        data.packages = d.data
        this.setState({ detail: data })
      })
  }

  handleDeduct = async () => {
    let data
    await fetch(
      'http://localhost:3000/uvatel/balances/' + this.state.detail.msisdn,
      {
        method: 'PUT',
        headers: {
          'api-version': 4,
          msisdn: this.state.detail.msisdn,
          package: 'uvatel.lend.us',
          'Sec-Fetch-Mode': 'cors',
          amount: -this.state.inputValue,
        },
      }
    )
    await fetch('http://localhost:8080/account/' + this.state.detail.msisdn)
      .then(response => {
        return response.json()
      })
      .then(d => {
        data = d['data']
      })
    await fetch('http://localhost:8080/packages/' + data.msisdn)
      .then(response => {
        return response.json()
      })
      .then(d => {
        data.packages = d.data
        this.setState({ detail: data })
      })
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  handlePackageCancel = () => {
    this.setState({ packageVisible: false })
  }
  onChange = value => {
    this.setState({
      selectedPackage: value,
    })
  }
  onChangeSlider = value => {
    this.setState({
      inputValue: value,
    })
  }

  renderPackage = packages => {
    if (!packages || packages.length === 0) return
    const content = []
    packages.forEach((pack, index) => {
      content.push(
        <Panel header={pack.package.name} key={index}>
          <Descriptions title="Account Package Info" bordered>
            <Descriptions.Item label="Total" span={3}>
              {String(pack.total)}
            </Descriptions.Item>
            <Descriptions.Item label="Used" span={3}>
              {!pack.used ? (
                <Badge status="success" text="Unused" />
              ) : (
                <Badge status="error" text="Used" />
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Remaining" span={3}>
              {String(pack.remaining)}
            </Descriptions.Item>
            <Descriptions.Item label="Unit" span={3}>
              {String(pack.unit)}
            </Descriptions.Item>
            <Descriptions.Item label="Expired Time" span={3}>
              {String(this.state.detail['expired_at'])}
            </Descriptions.Item>
          </Descriptions>
        </Panel>
      )
    })
    return <Collapse>{content}</Collapse>
  }

  renderPackageSelection = packages => {
    if (!packages || packages.length === 0) return
    const content = []
    packages.forEach((pack, index) => {
      content.push(
        <Option value={pack.name} key={index}>
          {pack.name}
        </Option>
      )
    })
    return (
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Select a package"
        optionFilterProp="children"
        onChange={this.onChange}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {content}
      </Select>
    )
  }
  sleep(milliseconds) {
    var start = new Date().getTime()
    for (var i = 0; i < 1e7; i++) {
      if (new Date().getTime() - start > milliseconds) {
        break
      }
    }
  }

  render() {
    const { visible, inputValue, packageVisible } = this.state
    console.log(this.state.detail['msisdn'])
    if (
      !this.state.detail.msisdn ||
      this.state.detail.msisdn !== this.props.accountDetail.data.msisdn
    ) {
      console.log('back')
      this.setState({ detail: this.props.accountDetail.data })
    }
    // }

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
          <Descriptions.Item label="Packages" span={3}>
            {this.renderPackage(this.state.detail['packages'])}
            <Button
              type="default"
              style={{ marginTop: '30px' }}
              onClick={this.addPackage}
            >
              Add Package
            </Button>
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
                    onChange={this.onChangeSlider}
                    value={typeof inputValue === 'number' ? inputValue : 0}
                  />
                </Col>
                <Col span={4}>
                  <InputNumber
                    min={1}
                    max={20}
                    style={{ marginLeft: 16 }}
                    value={inputValue}
                    onChange={this.onChangeSlider}
                  />
                </Col>
              </Row>
            </Descriptions.Item>
          </Descriptions>
        </Modal>
        <Modal
          visible={packageVisible}
          title="Add Package"
          onCancel={this.handlePackageCancel}
          footer={[
            <Button key="Submit" type="default" onClick={this.handleAddPackage}>
              Submit
            </Button>,
          ]}
        >
          <Descriptions bordered>
            <Descriptions.Item
              className={styles.shortLabel}
              label="Available Packages"
              span={3}
            >
              {this.renderPackageSelection(this.state.detail['all_packages'])}
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
