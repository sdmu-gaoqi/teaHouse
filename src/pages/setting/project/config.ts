import { ossOrigin } from '@/constant'
import { goodTypeMap } from '@/constant/goods'
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
        label: '菜品编号',
        key: 'code'
      },
      {
        type: 'search',
        label: '菜品名称',
        key: 'name'
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
          dataIndex: 'code',
          width: 100,
          isIndex: true
        },
        {
          fixed: true,
          title: '菜品编码',
          dataIndex: 'code',
          width: 100
        },
        {
          title: '菜品名称',
          dataIndex: 'name',
          width: 250
        },
        {
          title: '单价 /元',
          dataIndex: 'unitPrice',
          format: 'money'
        },
        {
          title: '是否参与折扣',
          dataIndex: 'canDiscount',
          options: [
            { label: '否', value: 0 },
            { label: '是', value: 1 }
          ]
        },
        {
          title: '销售状态',
          dataIndex: 'statis',
          options: [
            { label: '在售', value: 0 },
            { label: '已售完', value: 1 }
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
    type: {
      title: '菜品类型',
      type: 'number',
      props: {
        placeholder: '请输入',
        type: 'number',
        options: Object.entries(goodTypeMap).map(([value, label]) => ({
          label,
          value
        }))
      },
      widget: 'select'
    },
    unitPrice: {
      title: '单价',
      type: 'number',
      props: {
        placeholder: '请输入',
        type: 'number'
      },
      widget: 'input'
    },
    unit: {
      title: '单位',
      type: 'number',
      props: {
        options: [] as any[]
      },
      widget: 'select'
    },
    canDiscount: {
      title: '是否参与优惠折扣',
      type: 'number',
      defaultValue: 1,
      props: {
        options: [
          {
            value: 0,
            label: '否'
          },
          {
            value: 1,
            label: '是'
          }
        ]
      },
      widget: 'radio'
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
