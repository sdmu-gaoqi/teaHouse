import { TableProps } from 'store-operations-ui'

export const schema: TableProps['schema'] = {
  title: '门店动态列表',
  form: {
    search: true,
    export: false,
    reset: true,
    fields: [
      {
        type: 'search',
        label: '品牌',
        placeholder: '品牌',
        key: 'headquartersCode'
      },
      {
        type: 'search',
        label: '门店编号',
        placeholder: '门店编号',
        key: 'code'
      },
      {
        type: 'search',
        label: '门店名称',
        key: 'name'
      }
    ]
  },
  tabs: [
    {
      title: '门店动态列表',
      key: 'one',
      columns: [
        {
          fixed: true,
          title: '动态标题',
          dataIndex: 'code',
          width: 100
        },
        {
          title: '发布状态',
          dataIndex: 'headquartersCode'
        },
        {
          title: '发布日期',
          dataIndex: 'name'
        },
        {
          title: '发布人',
          dataIndex: 'address'
        },
        {
          title: '创建日期',
          dataIndex: 'tel'
        },
        {
          title: '创建人',
          dataIndex: 'phone'
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
    project: [{ required: true, message: '请输入' }],
    pirce: [{ required: true, message: '请输入' }],
    duration: [{ required: true, message: '请输入' }],
    store: [{ required: true, message: '请选择' }]
  },
  properties: {
    title: {
      title: '动态标题',
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
    image: {
      title: '封面图片',
      type: 'uploadMultiple',
      props: {
        placeholder: '请输入',
        type: 'number'
      }
    },
    content: {
      title: '内容',
      type: 'number',
      props: {
        placeholder: '请输入',
        suffix: 'time'
      },
      widget: 'input'
    }
  },
  displayType: 'row',
  column: 2,
  maxWidth: '340px'
}
