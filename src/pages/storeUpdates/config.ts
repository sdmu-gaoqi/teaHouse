import { TableProps } from 'store-operations-ui'

export const schema: TableProps['schema'] = {
  title: '门店动态列表',
  form: {
    search: true,
    export: false,
    reset: true,
    fields: [
      {
        type: 'select',
        label: '状态',
        key: 'status'
      },
      {
        type: 'search',
        label: '动态标题',
        key: 'title'
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
          dataIndex: 'title'
        },
        {
          title: '发布状态',
          dataIndex: 'status'
        },
        {
          title: '发布日期',
          dataIndex: 'releaseTime',
          format: 'date'
        },
        {
          title: '发布人',
          dataIndex: 'releaseByName'
        },
        {
          title: '创建日期',
          dataIndex: 'createTime',
          format: 'date'
        },
        {
          title: '创建人',
          dataIndex: 'createByName'
        },
        {
          title: '操作',
          dataIndex: 'options',
          fixed: 'right'
        }
      ]
    }
  ],
  options: {
    status: [
      {
        label: '待发布',
        value: 'DRAFT'
      },
      {
        label: '已发布',
        value: 'ACTIVITY'
      },
      {
        label: '已下架',
        value: 'INACTIVITY'
      }
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
