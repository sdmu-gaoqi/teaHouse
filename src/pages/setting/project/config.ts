import { ossOrigin } from '@/constant'
import { message } from 'ant-design-vue'
import { TableProps } from 'store-operations-ui'
import { Storage } from 'wa-utils'

const storage = new Storage('local')

export const schema: TableProps['schema'] = {
  title: '菜品列表',
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
          fixed: true,
          title: '菜品编码',
          dataIndex: 'categoryName',
          width: 100
        },
        {
          title: '菜品名称',
          dataIndex: 'serviceName',
          width: 250
        },
        {
          title: '价格 /元',
          dataIndex: 'price',
          format: 'money'
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
    name: {
      title: '菜品名称',
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
    unitPrice: {
      title: '价格',
      type: 'number',
      props: {
        placeholder: '请输入',
        type: 'number'
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
    //       accept: 'image/jpg,image/png,image/jpeg',
    //       action: `${ossOrigin}/file/uploadPic`,
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
    //     },
    //     change: (file: any) => {
    //       const isErr =
    //         file?.file?.response?.code != 200 && file?.file?.status === 'done'
    //       if (isErr) {
    //         message.error(file?.file?.response?.msg)
    //         file.fileList?.pop()
    //       }
    //       return file
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
    }
  },
  displayType: 'row',
  column: 2,
  maxWidth: '340px'
}
