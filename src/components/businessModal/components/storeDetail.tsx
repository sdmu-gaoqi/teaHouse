import { FormRender } from 'store-operations-ui'
import { SchemaBase } from 'store-operations-ui/dist/formRender/type'
import { defineComponent, toRaw } from 'vue'

const StoreModal = defineComponent({
  props: ['formState', 'modalProps'],
  setup(props, context) {
    const type = props?.formState?.modalType || ('edit' as 'view' | 'edit')
    const formProps =
      type === 'view'
        ? {
            readonly: true,
            bordered: false
          }
        : {}
    context.expose({})
    const schema: SchemaBase = {
      type: 'object',
      rules:
        type === 'view'
          ? {}
          : {
              name: [{ required: true, message: '请输入门店名称' }],
              address: [{ required: true, message: '请输入门店地址' }],
              phone: [{ required: true, message: '请输入预约手机号' }],
              businessHours: [{ required: true, message: '请选择营业时间' }],
              image: [{ required: true, message: '请上传门店图片' }]
            },
      properties: {
        headquartersCode: {
          title: '品牌名称',
          type: 'string',
          props: {
            placeholder: '',
            readonly: true,
            bordered: false,
            ...formProps
          },
          widget: 'input'
        },
        name: {
          title: '门店名称',
          type: 'string',
          props: {
            placeholder: '请输入',
            ...formProps
          },
          required: true,
          message: {
            required: '请输入容纳客数'
          },
          widget: 'input'
        },
        address: {
          title: '地址',
          type: 'string',
          widget: 'input',
          props: formProps
        },
        tel: {
          title: '预约座机',
          type: 'string',
          widget: 'input',
          props: formProps
        },
        phone: {
          title: '预约手机号',
          type: 'string',
          widget: 'input',
          props: formProps
        },
        businessHours: {
          title: '营业时间',
          type: 'string',
          ...(type === 'edit' && {
            widget: 'dateRange',
            type: 'range'
          }),
          props: {
            style: {
              width: '100%'
            }
          }
        },
        remark: {
          title: '门店介绍',
          type: 'string',
          ...(type === 'edit' && {
            widget: 'textArea'
          }),
          span: 24,
          props: formProps
        },
        image: {
          title: '门店图片',
          type: 'string',
          widget: 'uploadMultiple',
          span: 24,
          props: formProps
        }
      },
      displayType: 'row',
      column: 2,
      maxWidth: '340px',
      ...(type === 'view' && {
        footer: {
          submit: false,
          cancel: '返回'
        }
      })
    }
    return () => {
      return <FormRender schema={schema} />
    }
  }
})

export default StoreModal
