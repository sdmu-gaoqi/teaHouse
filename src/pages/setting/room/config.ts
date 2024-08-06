import { TableProps } from 'store-operations-ui'

export const schema: TableProps['schema'] = {
  title: '包厢列表',
  form: {
    search: true,
    export: false,
    reset: true,
    fields: [
      {
        type: 'search',
        label: '包厢号',
        key: 'code'
      },
      {
        type: 'search',
        label: '包厢名称',
        key: 'name'
      },
      {
        type: 'select',
        label: '包厢类型',
        key: 'category'
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
          title: '序号',
          dataIndex: 'card',
          width: 100,
          isIndex: true
        },
        {
          title: '包厢号',
          dataIndex: 'code'
        },
        {
          title: '包厢名称',
          dataIndex: 'name'
        },
        {
          title: '包厢类型',
          dataIndex: 'category'
        },
        {
          title: '最低消费/元',
          dataIndex: 'lowestSpendPrice'
        },
        {
          title: '消费时长/小时',
          dataIndex: 'lowestSpendPrice'
        },
        {
          title: '超时收费/元',
          dataIndex: 'lowestSpendPrice'
        },
        {
          title: '启用状态',
          dataIndex: 'status'
        },
        {
          title: '容纳客数',
          dataIndex: 'capacityNum'
        },
        {
          title: '创建日期',
          dataIndex: 'createTime',
          format: 'time'
        },
        {
          title: '修改日期',
          dataIndex: 'updateTime',
          format: 'time'
        },
        {
          title: '操作',
          dataIndex: 'options',
          fixed: 'right'
        }
      ]
    }
  ],
  options: {}
}

export const editSchema = {
  type: 'object',
  rules: {
    coode: {
      required: true,
      message: '请输入包厢号'
    },
    category: {
      required: true,
      message: '请选择包厢类型'
    },
    lowestPrice: {
      required: true,
      message: '请输入最低消费'
    },
    overtimeDuration: {
      required: true,
      message: '请输入消费时长'
    },
    overtimeUnitPrice: {
      required: true,
      message: '请输入超时收费'
    }
  },
  properties: {
    code: {
      title: '包厢号',
      type: 'string',
      props: {
        placeholder: '请输入'
      },
      required: true,
      widget: 'input'
    },
    name: {
      title: '包厢名称',
      type: 'string',
      props: {
        placeholder: '请输入'
      },
      required: true,
      message: {
        required: '请输入包厢名称'
      },
      widget: 'input'
    },
    category: {
      title: '包厢类型',
      type: 'string',
      props: {
        options: [] as any[]
      },
      required: true,
      widget: 'select'
    },
    isLowest: {
      title: '是否有最低消费',
      type: 'string',
      widget: 'radio',
      defaultValue: 1,
      props: {
        options: [
          { label: '否', value: 0 },
          { label: '是', value: 1 }
        ]
      }
    },
    capacityNum: {
      title: '容纳人数',
      type: 'number',
      widget: 'input',
      props: {
        precision: 0
      }
    },
    lowestPrice: {
      title: '最低消费',
      type: 'number',
      widget: 'input',
      defaultValue: '0',
      props: {
        placeholder: '请输入',
        suffix: 'money',
        type: 'number'
      }
    },
    overtimeDuration: {
      title: '消费时长',
      type: 'number',
      widget: 'input',
      defaultValue: '0',
      props: {
        placeholder: '请输入',
        suffix: '小时',
        type: 'number',
        precision: 0
      }
    },
    overtimeUnitPrice: {
      title: '超时收费',
      type: 'number',
      widget: 'input',
      defaultValue: '0',
      props: {
        placeholder: '请输入',
        suffix: 'money',
        type: 'number'
      }
    },
    remark: {
      title: '备注',
      type: 'string',
      widget: 'textArea',
      span: 24
    }
  },
  displayType: 'row',
  column: 2,
  maxWidth: '340px'
}
