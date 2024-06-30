import { TableProps } from 'store-operations-ui'

export const schema: TableProps['schema'] = {
  title: '订单列表',
  form: {
    search: true,
    export: false,
    reset: true,
    fields: [
      {
        type: 'search',
        label: '订单编号',
        key: 'orderNo'
      },
      {
        type: 'search',
        label: '会员卡号',
        key: 'memberNo',
        activeKey: '1'
      },
      {
        type: 'search',
        label: '项目名称',
        key: 'serviceProjectName',
        activeKey: '0'
      },
      {
        type: 'select',
        label: '支付方式',
        key: 'threePay',
        activeKey: '0'
      },
      {
        type: 'search',
        label: '会员姓名',
        key: 'memberName',
        activeKey: '1'
      },
      {
        type: 'search',
        label: '会员手机号',
        key: 'phone',
        activeKey: '1'
      },
      {
        type: 'range',
        label: '创建日期',
        placeholder: ['开始日期', '结束日期'],
        key: 'createTime',
        format: 'timestamp',
        names: ['startCreateTime', 'endCreateTime']
      },
      {
        type: 'select',
        label: '订单类别',
        key: 'memberType',
        activeKey: '1'
      }
    ]
  },
  tabKey: 'settleType',
  tabs: [
    {
      title: '非会员订单',
      key: '0',
      columns: [
        {
          fixed: true,
          title: '订单编号',
          dataIndex: 'orderNo',
          width: 220
        },
        {
          title: '项目名称',
          dataIndex: 'serviceProjectName'
        },
        {
          title: '订单明细',
          dataIndex: 'price'
        },
        {
          title: '订单状态',
          dataIndex: 'status',
          options: [
            { value: 'SUBMIT', label: '已结算' },
            { value: 'CREATED', label: '未结算' }
          ]
        },
        {
          title: '创建日期',
          dataIndex: 'createTime',
          format: 'time'
        },
        {
          title: '结算日期',
          dataIndex: 'endTime',
          format: 'time'
        },
        {
          fixed: 'right',
          title: '操作',
          dataIndex: 'options',
          options: ['detail'],
          width: 200
        }
      ]
    },
    {
      title: '会员订单',
      key: '1',
      columns: [
        {
          fixed: true,
          title: '订单编号',
          dataIndex: 'orderNo',
          width: 220
        },
        {
          title: '订单类别',
          dataIndex: 'memberType',
          width: 220,
          options: [
            { value: 1, label: '折扣卡' },
            { value: 2, label: '次卡' }
          ]
        },
        {
          title: '项目名称',
          dataIndex: 'serviceProjectName'
        },
        {
          title: '订单明细',
          dataIndex: 'price',
          width: 160
        },
        {
          title: '会员信息',
          dataIndex: 'member',
          width: 200
        },
        {
          title: '订单状态',
          dataIndex: 'status',
          options: [
            { value: 'SUBMIT', label: '已结算' },
            { value: 'CREATED', label: '未结算' }
          ]
        },
        {
          title: '创建日期',
          dataIndex: 'createTime',
          format: 'time',
          width: 200
        },
        {
          title: '结算日期',
          dataIndex: 'endTime',
          format: 'time'
        },
        {
          fixed: 'right',
          title: '操作',
          dataIndex: 'options',
          options: ['detail'],
          width: 200
        }
      ]
    },
    {
      title: '第三方平台订单',
      key: '2',
      columns: [
        {
          fixed: true,
          title: '订单编号',
          dataIndex: 'orderNo',
          width: 220
        },
        {
          title: '项目名称',
          dataIndex: 'serviceProjectName'
        },
        {
          title: '订单明细',
          dataIndex: 'price'
        },
        {
          title: '订单状态',
          dataIndex: 'status',
          options: [
            { value: 'SUBMIT', label: '已结算' },
            { value: 'CREATED', label: '未结算' }
          ]
        },
        {
          title: '支付方式',
          dataIndex: 'threePay'
        },
        {
          title: '创建日期',
          dataIndex: 'createTime',
          format: 'time'
        },
        {
          title: '结算日期',
          dataIndex: 'endTime',
          format: 'time'
        },
        {
          fixed: 'right',
          title: '操作',
          dataIndex: 'options',
          options: ['detail'],
          width: 200
        }
      ]
    }
  ],
  options: {
    level: [
      { label: '1级会员', value: 1 },
      { label: '2级会员', value: 2 }
    ],
    status: [
      { value: 'SUBMIT', label: '已结算' },
      { value: 'CREATED', label: '未结算' }
    ],
    memberType: [
      { label: '折扣会员', value: 1 },
      { label: '次卡会员', value: 2 }
    ],
    threePay: [
      {
        label: '支付宝',
        value: '1'
      },
      {
        label: '微信',
        value: '2'
      },
      {
        label: '收钱吧 ',
        value: '3'
      },
      {
        label: '现金 ',
        value: '4'
      }
    ]
  }
}
