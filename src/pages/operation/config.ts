import { TableProps } from 'store-operations-ui'

export const schema: TableProps['schema'] = {
  title: '营业额统计',
  form: {
    search: true,
    export: false,
    reset: false,
    fields: [
      {
        type: 'date',
        label: '月份',
        key: 'reportDate',
        format: 'month'
      }
    ]
  },
  tabs: [
    {
      title: '会员订单',
      key: 'one',
      columns: [
        {
          fixed: true,
          title: '日期',
          dataIndex: 'reportDate'
        },
        {
          title: '非会员',
          dataIndex: 'a1',
          children: [
            {
              title: '客数',
              dataIndex: 'customNum0'
            },
            {
              title: '支付宝',
              dataIndex: 'payMethod_1'
            },
            {
              title: '微信',
              dataIndex: 'payMethod_2'
            },
            {
              title: '收钱吧',
              dataIndex: 'payMethod_3'
            },
            {
              title: '现金',
              dataIndex: 'payMethod_4'
            },
            {
              title: '其他',
              dataIndex: 'payMethod_100'
            }
          ]
        },
        {
          title: '会员',
          dataIndex: 'a2',
          children: [
            {
              title: '客数',
              dataIndex: 'customNum1'
            },
            {
              title: '会员充值',
              dataIndex: 'rechargePrice',
              format: 'money'
            },
            {
              title: '会员卡消费',
              dataIndex: 'payPrice1',
              format: 'money'
            },
            {
              title: '不足扣款补充金额',
              dataIndex: 'replenishPrice',
              width: 200,
              format: 'money'
            }
          ]
        },
        {
          title: '第三方平台',
          dataIndex: 'money',
          children: [
            {
              title: '客数',
              dataIndex: 'customNum2'
            },
            {
              title: '消费金额',
              dataIndex: 'payPrice2',
              format: 'money'
            }
          ]
        },
        {
          title: '日总客数',
          dataIndex: 'totalCustomNum',
          fixed: 'right'
        },
        {
          title: '当日营业额',
          dataIndex: 'totalPayPrice',
          format: 'money',
          fixed: 'right'
        }
        // {
        //   fixed: 'right',
        //   title: '操作',
        //   dataIndex: 'options'
        // }
      ]
    }
  ],
  options: {
    status: [
      { label: '正常', value: 1 },
      { label: '禁用', value: 2 }
    ]
  }
}

export const editSchema = {
  type: 'object',
  rules: {
    project: [{ required: true, message: '请输入' }],
    pirce: [{ required: true, message: '请输入' }],
    duration: [{ required: true, message: '请输入' }],
    store: [{ required: true, message: '请选择' }]
  },
  properties: {
    project: {
      title: '服务项目',
      type: 'string',
      props: {
        placeholder: '请输入'
      },
      required: false,
      message: {
        required: ''
      },
      widget: 'input'
    },
    pirce: {
      title: '项目价格',
      type: 'number',
      props: {
        placeholder: '请输入',
        type: 'number'
      },
      widget: 'input'
    },
    duration: {
      title: '项目时长',
      type: 'number',
      props: {
        placeholder: '请输入',
        suffix: 'time'
      },
      widget: 'input'
    },
    store: {
      title: '所属门店',
      type: 'array',
      widget: 'multiSelect',
      props: {
        options: [
          {
            label: 'A',
            value: 'A'
          },
          {
            label: 'B',
            value: 'B'
          }
        ],
        placeholder: '请选择'
      }
    },
    commission: {
      title: '项目排钟提成',
      type: 'number',
      props: {
        placeholder: '请输入',
        suffix: 'money',
        type: 'number'
      },
      widget: 'input'
    },
    commission2: {
      title: '项目点钟提成',
      type: 'number',
      props: {
        placeholder: '请输入',
        suffix: 'money',
        type: 'number'
      },
      widget: 'input'
    },
    remark: {
      title: '备注',
      type: 'string',
      props: {
        placeholder: '请输入'
      },
      widget: 'textArea'
    }
  },
  displayType: 'row',
  column: 2,
  maxWidth: '340px'
}

export type chatType = {
  /**
   * 非会员客数
   * */
  customNum0: number
  /**
   * 会员客数
   * */
  customNum1: number
  /**
   * 第三方消费客数
   * */
  customNum2: number
  payMethodInfo: { payMethodKey: string; totalPayPrice: number }[]
  /**
   * 会员卡消费金额
   * */
  payPrice1: number
  /**
   * 第三方消费金额
   * */
  payPrice2: number
  /**
   * 充值金额
   * */
  rechargePrice: number
  /**
   * 补充金额
   * */
  replenishPrice: number
  /**
   * 报告日期
   * */
  reportDate: string
  status: 'FINISH' | 'INIT'
  storeCode: string
  /**
   * 总客数
   * */
  totalCustomNum: number
  /**
   * 总营业额
   * */
  totalPayPrice: number
}
