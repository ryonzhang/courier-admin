import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import city from 'utils/city'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}
@withI18n()
@Form.create()
class UserModal extends PureComponent {
  handleOk = () => {
    const { item = {}, onOk, form } = this.props
    const { validateFields, getFieldsValue } = form

    validateFields(errors => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }
      onOk(data)
    })
  }

  render() {
    const { item = {}, onOk, form, i18n, ...modalProps } = this.props
    const { getFieldDecorator } = form

    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal">
          <FormItem label={i18n.t`Msisdn`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('msisdn', {
              initialValue: item.msisdn,
              rules: [
                {
                  required: true,
                  type: 'number',
                },
              ],
            })(<InputNumber />)}
          </FormItem>
          <FormItem label={i18n.t`Active`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('active', {
              initialValue: item.active,
              rules: [
                {
                  required: true,
                  type: 'boolean',
                },
              ],
            })(
              <Radio.Group>
                <Radio value>
                  <Trans>Active</Trans>
                </Radio>
                <Radio value={false}>
                  <Trans>Inactive</Trans>
                </Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem
            label={i18n.t`Core Balance`}
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('core_balance', {
              initialValue: item.core_balance,
              rules: [
                {
                  required: true,
                  type: 'number',
                },
              ],
            })(<InputNumber min={18} max={100} />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

UserModal.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default UserModal
