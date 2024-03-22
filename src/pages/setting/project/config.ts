import { message } from 'ant-design-vue'
import { TableProps } from 'store-operations-ui'
import { Storage } from 'wa-utils'

const storage = new Storage('local')

export const schema: TableProps['schema'] = {
  title: '服务项目列表',
  form: {
    search: true,
    export: false,
    reset: true,
    fields: [
      {
        type: 'search',
        label: '服务项目',
        key: 'serviceName'
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
          title: '项目编号',
          dataIndex: 'id',
          width: 100
        },
        {
          title: '服务项目',
          dataIndex: 'serviceName',
          width: 250
        },
        {
          title: '项目价格 /元',
          dataIndex: 'price',
          format: 'money'
        },
        {
          title: '项目时长/分钟',
          dataIndex: 'duration',
          width: 150
        },
        {
          title: '启用状态',
          dataIndex: 'enabled'
        },
        {
          title: '所属门店',
          dataIndex: 'storeName'
        },
        {
          title: '排钟提成/元',
          dataIndex: 'pzRoyalty',
          format: 'money'
        },
        {
          title: '点钟提成/元',
          dataIndex: 'dzRoyalty',
          format: 'money'
        },
        {
          title: '是否参与折扣优惠',
          dataIndex: 'canDiscount',
          options: [
            { label: '是', value: 1 },
            { label: '否', value: 0 }
          ]
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
    serviceName: [{ required: true, message: '请输入' }],
    price: [{ required: true, message: '请输入' }],
    duration: [{ required: true, message: '请输入' }],
    dzRoyalty: [{ required: true, message: '请输入' }],
    pzRoyalty: [{ required: true, message: '请输入' }]
  },
  properties: {
    'op-group-0': {
      title: '项目基础信息'
    },
    serviceName: {
      title: '项目名称',
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
    price: {
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
        suffix: 'time',
        precision: 0
      },
      widget: 'input'
    },
    store: {
      title: '所属门店',
      type: 'string',
      widget: 'input',
      props: {
        readonly: true,
        bordered: false
      }
    },
    canDiscount: {
      title: '是否参与折扣优惠',
      widget: 'radio',
      type: 'string',
      defaultValue: 1,
      props: {
        options: [
          { label: '是', value: 1 },
          { label: '否', value: 0 }
        ]
      }
    },
    // image: {
    //   title: '封面图片',
    //   type: 'uploadMultiple',
    //   span: 24,
    //   props: {
    //     uploadProps: {
    //       max: 1,
    //       accept: 'image/*',
    //       action: 'http://111.229.138.125:8080/file/uploadPic',
    //       headers: {
    //         Authorization: `Bearer ${storage.baseGet('Admin-Token')}`
    //       },
    //       beforeUpload: (data: any) => {
    //         if (data?.size / 1024 / 1024 > 10) {
    //           message.error('图片不能超出10M')
    //           return Promise.reject('图片不能超出10M')
    //         }
    //         return true
    //       }
    //     }
    //   }
    // },
    remark: {
      title: '备注',
      type: 'string',
      props: {
        placeholder: '请输入'
      },
      widget: 'textArea',
      span: 24
    },
    'op-group-1': {
      title: '项目提成信息'
    },
    'op-desc-1': {
      title: '注(线下：顾客直接在收银台买单；线上：顾客在美团团购买单)'
    },
    pzRoyalty: {
      title: '线下排钟提成',
      type: 'number',
      props: {
        placeholder: '请输入',
        suffix: 'money',
        type: 'number'
      },
      widget: 'input'
    },
    dzRoyalty: {
      title: '线下点钟提成',
      type: 'number',
      props: {
        placeholder: '请输入',
        suffix: 'money',
        type: 'number'
      },
      widget: 'input'
    },
    pzRoyaltyOl: {
      title: '线上排钟提成',
      type: 'number',
      props: {
        placeholder: '请输入',
        suffix: 'money',
        type: 'number'
      },
      widget: 'input'
    },
    dzRoyaltyOl: {
      title: '线上点钟提成',
      type: 'number',
      props: {
        placeholder: '请输入',
        suffix: 'money',
        type: 'number'
      },
      widget: 'input'
    },
    ztRoyalty: {
      title: '线下自推提成',
      type: 'number',
      props: {
        placeholder: '请输入',
        suffix: 'money',
        type: 'number'
      },
      widget: 'input'
    },
    ztRoyaltyOl: {
      title: '线上自推提成',
      type: 'number',
      props: {
        placeholder: '请输入',
        suffix: 'money',
        type: 'number'
      },
      widget: 'input'
    }
  },
  displayType: 'row',
  column: 2,
  maxWidth: '340px'
}
