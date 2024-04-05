import { ossOrigin } from '@/constant'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { FormRender } from 'store-operations-ui'
import { SchemaBase } from 'store-operations-ui/dist/formRender/type'
import { Store } from 'store-request'
import { defineComponent, onMounted, ref } from 'vue'
import { Storage, isEmpty, isNumber } from 'wa-utils'
import { getParameterByName } from 'wa-utils'
import { isTelNumber } from 'wa-utils/dist/regex/regex'

const StoreModal = defineComponent({
  props: ['formState', 'modalProps'],
  setup(props, context) {
    const type = props?.formState?.modalType || ('edit' as 'view' | 'edit')
    const store = new Store()
    const storage = new Storage('local')
    const formRef = ref()
    const code = props?.formState?.code
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
              phone: [
                { required: true, message: '请输入预约手机号' },
                {
                  validator: (_: any, value: string) => {
                    if (isEmpty(value)) {
                      return Promise.resolve('')
                    } else if (!isTelNumber(value)) {
                      return Promise.reject('请输入正确的手机号')
                    }
                    return Promise.resolve('')
                  }
                }
              ],
              businessHours: [{ required: true, message: '请选择营业时间' }],
              image: [{ required: true, message: '请上传门店图片' }],
              tel: [
                {
                  validator: (_: any, value: string) => {
                    if (isEmpty(value)) {
                      return Promise.resolve('')
                    } else if (!/^[\d\-]+$/.test(value)) {
                      return Promise.reject(
                        '请输入正确的座机号(只能输入数字或-)'
                      )
                    }
                    return Promise.resolve('')
                  }
                }
              ]
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
            widget: 'timeRange',
            type: 'range'
          }),
          ...(type === 'view' && {
            widget: 'input'
          }),
          picker: 'time',
          format: 'time',
          props: {
            style: {
              width: '100%'
            },
            showSecond: false,
            showTime: true,
            ...(type === 'view' && {
              readonly: true,
              bordered: false
            })
          }
        },
        remark: {
          title: '门店介绍',
          type: 'string',
          widget: 'textArea',
          span: 24,
          props: {
            ...formProps,
            ...(type === 'view' && {
              readonly: true,
              bordered: false,
              placeholder: ' '
            })
          }
        },
        image: {
          title: '门店图片',
          type: 'uploadMultiple',
          span: 24,
          props: {
            ...formProps,
            uploadProps: {
              accept: 'image/jpg,image/png,image/jpeg',
              action: `${ossOrigin}/file/uploadPic`,
              headers: {
                Authorization: `Bearer ${storage.baseGet('Admin-Token')}`
              },
              beforeUpload: (data: any) => {
                if (data?.size / 1024 / 1024 > 10) {
                  message.error('图片不能超出10M')
                  return Promise.reject('图片不能超出10M')
                }
                return true
              },
              change: (file: any) => {
                const isErr =
                  file?.file?.response?.code != 200 &&
                  file?.file?.status === 'done'
                if (isErr) {
                  message.error(file?.file?.response?.msg)
                  file.fileList?.pop()
                }
                return file
              }
            }
          }
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
    onMounted(async () => {
      if (code) {
        const res = (await store.detail(code)) as any
        const businessHours = res?.data?.businessHours
          ? res?.data?.businessHours
              ?.split('-')
              ?.map((item: string) => `2020-01-01 ${item}:00`)
          : undefined
        if (formRef.value) {
          formRef.value.changeState({
            name: res?.data?.name,
            address: res?.data?.address,
            phone: res?.data?.phone,
            tel: res?.data?.tel,
            remark: res?.data?.remark,
            image: res?.data?.banner?.map((item: string) => ({
              url: `${ossOrigin}${item}`
            })),
            businessHours:
              type === 'view' ? res?.data?.businessHours : businessHours,
            headquartersCode: getParameterByName('storeHeadquartersCode')
          })
        }
      }
    })
    return () => {
      return <FormRender schema={schema} ref={formRef} />
    }
  }
})

export default StoreModal
