import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Avatar } from 'antd'
import { DropOption } from 'components'
import { Trans, withI18n } from '@lingui/react'
import Link from 'umi/link'
import styles from './List.less'

const { confirm } = Modal

@withI18n()
class List extends PureComponent {
  handleMenuClick = (record, e) => {
    const { onDeleteItem, onEditItem, i18n } = this.props

    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: i18n.t`Are you sure delete this record?`,
        onOk() {
          onDeleteItem(record.id)
        },
      })
    }
  }

  render() {
    const { onDeleteItem, onEditItem, i18n, ...tableProps } = this.props

    const columns = [
      {
        title: <Trans>Avatar</Trans>,
        dataIndex: 'avatar',
        key: 'avatar',
        width: 72,
        fixed: 'left',
        render: text => <Avatar style={{ marginLeft: 8 }} src={text} />,
      },
      {
        title: <Trans>Msisdn</Trans>,
        dataIndex: 'msisdn',
        key: 'msisdn',
        render: (text, record) => (
          <Link to={`account/${record.msisdn}`}>{text}</Link>
        ),
      },
      {
        title: <Trans>Active</Trans>,
        dataIndex: 'active',
        key: 'active',
        render: text => <span>{text ? 'Active' : 'Inactive'}</span>,
      },
      {
        title: <Trans>Core Balance</Trans>,
        dataIndex: 'core_balance',
        key: 'core_balance',
      },
      {
        title: <Trans>Create Time</Trans>,
        dataIndex: 'created_at',
        key: 'created_at',
      },
      {
        title: <Trans>Update Time</Trans>,
        dataIndex: 'updated_at',
        key: 'updated_at',
      },
      {
        title: <Trans>Expire Time</Trans>,
        dataIndex: 'expired_at',
        key: 'expired_at',
      },
      {
        title: <Trans>Operation</Trans>,
        key: 'operation',
        fixed: 'right',
        render: (text, record) => {
          return (
            <DropOption
              onMenuClick={e => this.handleMenuClick(record, e)}
              menuOptions={[
                { key: '1', name: i18n.t`Update` },
                { key: '2', name: i18n.t`Delete` },
              ]}
            />
          )
        },
      },
    ]

    return (
      <Table
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: total => i18n.t`Total ${total} Items`,
        }}
        className={styles.table}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    )
  }
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
