/**
 * @file 会员结算
 * */
import common from '@/servers/common'
import { MemberType, payTypes } from '@/types'
import { formatMoney } from '@/utils'
import { Input, message } from 'ant-design-vue'
import {
  FormCard,
  FormRender,
  FormRenderProps,
  Schema
} from 'store-operations-ui'
import { Member } from 'store-request'
import { defineComponent, onMounted, ref, toRaw, watch } from 'vue'
import { useRequest } from 'vue-hooks-plus'
import { cloneDeep, debounce, isEmpty, sleep } from 'wa-utils'
import '../styles/memberSettlement.form.scss'

const member = new Member()

const payKey = 'payMethod'

const schema: Schema = {
  type: 'object',
  rules: {
    [payKey]: [{ required: true, message: '请选择支付方式' }],
    meituan: [{ required: true, message: '请输入美团金额' }]
  },
  properties: {
    orderNo: {
      title: ' 订单编号',
      widget: 'input',
      type: 'string',
      props: {
        readonly: true,
        bordered: false
      }
    },
    settleType: {
      title: '订单类型',
      type: 'string',
      defaultValue: '0',
      props: {
        options: [
          {
            label: '非会员',
            value: '0'
          },
          {
            label: '会员',
            value: '1'
          },
          {
            label: '美团',
            value: '2'
          }
        ]
      },
      widget: 'radio'
    },
    memberId: {
      title: '查找会员',
      type: 'string',
      placeholder: '请输入手机号查询会员',
      search: {
        key: 'searchPhone',
        label: 'memberName1',
        value: 'memberId',
        request: member.list,
        dataKey: 'rows',
        format: (v: any) => {
          return v?.map((item: any) => ({
            ...item,
            memberName1: `${item?.memberName} (会员卡号:${item?.memberNo}-手机号${item?.phone})`
          }))
        }
      },
      widget: 'searchSelect',
      'ui:hidden': 'formState.value.settleType != 1'
    },
    table1: {
      widget: 'table',
      props: {
        columns: [
          {
            title: '会员卡号',
            dataIndex: 'memberNo'
          },
          {
            title: '姓名',
            dataIndex: 'memberName'
          },
          {
            title: '手机号',
            dataIndex: 'phone'
          },
          {
            title: '会员类型',
            dataIndex: 'memberTypeName'
          },
          {
            title: '优惠方式',
            dataIndex: 'discountRate'
          },
          {
            title: '会员卡余额',
            dataIndex: 'availableBalance'
          }
        ],
        pagination: false
      },
      'ui:hidden':
        'formState.value.settleType != 1 || formState.value.memberId?.memberType != 1'
    },
    table2: {
      widget: 'table',
      props: {
        columns: [
          {
            title: '会员卡号',
            dataIndex: 'memberNo'
          },
          {
            title: '姓名',
            dataIndex: 'memberName'
          },
          {
            title: '手机号',
            dataIndex: 'phone'
          },
          {
            title: '会员类型',
            dataIndex: 'memberTypeName'
          },
          {
            title: '优惠方式',
            dataIndex: 'discountRate'
          },
          {
            title: '会员卡余额',
            dataIndex: 'availableBalance'
          }
        ],
        pagination: false
      },
      'ui:hidden':
        'formState.value.settleType != 1 || formState.value.memberId?.memberType != 2'
    },
    table: {
      widget: 'table',
      props: {
        columns: [
          {
            title: '项目名称',
            dataIndex: 'serviceProjectName'
          },
          {
            title: '单价',
            dataIndex: 'unitPrice'
          },
          {
            title: '客数',
            dataIndex: 'customNum'
          },
          {
            title: '上钟数',
            dataIndex: 'serviceNum'
          },
          {
            title: '优惠',
            dataIndex: 'money'
          },
          {
            title: '小计',
            dataIndex: 'discountPrice'
          }
        ],
        pagination: false
      }
    },
    originalPrice: {
      title: '应收金额',
      labelClass: 'text-orange-500 text-[14px]',
      type: 'string',
      widget: 'input',
      span: 13,
      props: {
        readonly: true,
        bordered: false
      },
      'ui:hidden':
        '(formState.value.settleType == 1 && !formState.value?.memberId?.memberId)'
    },
    meituan: {
      defaultValue: '0',
      title: '美团金额',
      type: 'string',
      span: 12,
      widget: 'input',
      'ui:hidden': 'formState.value.settleType != 2'
    },
    receivePrice: {
      title: '实收金额',
      labelClass: 'text-orange-500 text-[14px]',
      type: 'string',
      span: 12,
      widget: 'input',
      // props: {
      //   readonly: true,
      //   bordered: false,
      //   style: {
      //     color: 'red',
      //     fontWeight: 'bold'
      //   }
      // },
      'ui:hidden':
        '(formState.value.settleType == 1 && !formState.value?.memberId?.memberId) || formState.value.settleType == 2'
    },
    discountPrice: {
      defaultValue: '0',
      title: '优惠',
      type: 'string',
      span: 13,
      widget: 'input',
      props: {
        readonly: true,
        bordered: false
        // style: {
        //   color: 'red',
        //   fontWeight: 'bold'
        // }
      },
      'ui:hidden':
        '(formState.value.settleType == 1 && !formState.value?.memberId?.memberId) || formState.value.settleType == 2'
    },
    store2: {
      title: '支付方式',
      type: 'string',
      widget: 'input',
      defaultValue: '折扣卡',
      props: {
        readonly: true,
        bordered: false
      },
      'ui:hidden':
        'formState.value.settleType != 1  || formState.value.memberId?.memberType != 1 || formState.value.settleType == 2'
    },
    占位11: {
      span: 12
    },
    store3: {
      title: '支付方式',
      type: 'string',
      widget: 'input',
      defaultValue: '按次卡',
      colClass: 'cika',
      props: {
        readonly: true,
        bordered: false
      },
      'ui:hidden':
        'formState.value.settleType != 1  || formState.value.memberId?.memberType != 2'
    },
    store4: {
      title: '支付方式',
      type: 'string',
      widget: 'input',
      defaultValue: '美团核销',
      props: {
        readonly: true,
        bordered: false
      },
      'ui:hidden': 'formState.value.settleType != 2'
    },
    z1: {
      widget: 'input',
      type: 'string',
      defaultValue: '扣除',
      span: 2,
      colClass: 'z1',
      props: {
        readonly: true,
        bordered: false
      },
      'ui:hidden':
        'formState.value.settleType != 1  || formState.value.memberId?.memberType != 2'
    },
    useTimes: {
      widget: 'input',
      type: 'number',
      span: 3,
      colClass: 'useTimes',
      props: {
        suffix: '次',
        min: 0,
        precision: 0
      },
      label: '扣除',
      'ui:hidden':
        'formState.value.settleType != 1  || formState.value.memberId?.memberType != 2'
    },
    z2: {
      widget: 'input',
      type: 'string',
      colStyle: {},
      span: 6,
      colClass: 'z2',
      defaultValue: '还剩余 0 次',
      props: {
        readonly: true,
        bordered: false
      },
      'ui:hidden':
        'formState.value.settleType != 1  || formState.value.memberId?.memberType != 2'
    },
    replenishPrice: {
      title: '补充金额',
      widget: 'input',
      type: 'string',
      defaultValue: '0',
      props: {
        min: 1,
        readonly: true,
        bordered: false
      },
      'ui:hidden':
        '(formState.value.settleType == 1 && !formState.value?.memberId?.memberId) || formState.value.settleType == 0 || formState.value.settleType == 2'
    },
    [payKey]: {
      title: '支付方式',
      type: 'string',
      defaultValue: 1,
      props: {
        options: payTypes,
        placeholder: '请选择'
      },
      widget: 'radio',
      'ui:hidden':
        'formState.value.settleType != 0 && (formState.value.replenishPrice || 0) <= 0'
    },
    remark: {
      title: ' 备注',
      type: 'string',
      widget: 'textArea'
    }
  },
  displayType: 'row',
  column: 1,
  maxWidth: '340px',
  footer: {
    submit: '结算',
    cancel: '取消'
  }
}

export default defineComponent({
  props: {
    onFinish: Function,
    onCancel: Function,
    formState: Object
  },
  // @ts-ignore
  setup: (
    props: FormRenderProps & {
      formState: { orderId: string; orderItemId: string; orderNo: string }
    }
  ) => {
    const formRef = ref()
    const defaultValue = ref<any>({})
    const { run, data, params } = useRequest(common.preSettle, {
      manual: true,
      onSuccess: (res: any) => {
        const v = {
          orderNo: res?.data?.orderNo,
          originalPrice: formatMoney(res?.data?.originalPrice),
          receivePrice: formatMoney(res?.data?.receivePrice),
          replenishPrice: formatMoney(res?.data?.replenishPrice || 0),
          discountPrice: res?.data?.discountPrice,
          oldDiscountPrice: formatMoney(res?.data?.receivePrice),
          table: res?.data?.preOrderItemList?.map((item: any) => ({
            ...item,
            unitPrice: formatMoney(item?.unitPrice),
            money: formatMoney(
              (item?.originalPrice || 0) - (item?.discountPrice || 0)
            ),
            discountPrice: formatMoney(item?.discountPrice)
          }))
        }
        formRef.value.changeState(v)
        defaultValue.value = {
          ...v,
          metaData: res?.data
        }
      },
      onError: (err: any) => {
        if (err?.code === 1025) {
          formRef.value.changeState({
            settleType: '0',
            discountPrice: '0'
          })
          message.error('会员卡余额为0,无法会员下单')
        }
      }
    })
    const selectUser = ref<any>()
    onMounted(() => {
      const orderId = props.formState?.orderId
      const orderNo = props.formState?.orderNo
      if (orderId) {
        run({
          orderId,
          orderNo,
          settleType: 0
        })
      }
    })

    const changeNum = debounce(
      (value: any, { originalPrice, settleType }: any) => {
        const inputValue = value.target.value
        if (isNaN(Number(inputValue))) {
          value.target.value = 0
          run({
            ...params.value?.[0],
            receivePrice: 0,
            settleType
          })
          return message.error('请输入正确的数字')
        }
        if (+inputValue >= +originalPrice) {
          message.error('实收金额不能大于应收金额')
          value.target.value = 0
          run({
            ...params.value?.[0],
            receivePrice: 0,
            settleType
          })
        } else {
          run({
            ...params.value?.[0],
            receivePrice: value.target.value,
            settleType
          })
        }
      },
      500
    )

    return () => {
      return (
        <FormRender
          schema={schema}
          onFinish={(v) => {
            const memberOrderSubmitInfo = {
              discountType: 0,
              memberId: v?.memberId?.memberId,
              phone: v?.memberId?.phone,
              replenishPrice: v?.replenishPrice
            }
            const value = {
              ...(v?.settleType == 1 && {
                memberOrderSubmitInfo
              }),
              orderId: defaultValue?.value?.metaData?.orderId,
              orderNo: v?.orderNo,
              settleType: v?.settleType,
              discountPrice: formatMoney(v?.discountPrice),
              remark: v?.remark || '',
              receivePrice: formatMoney(v?.receivePrice),
              payMethod: v?.payMethod,
              originalPrice: formatMoney(v?.originalPrice)
            }
            if (v?.settleType === '1' && !v?.memberId?.memberId) {
              return message.error('请选择会员')
            }
            if (props?.onFinish) {
              props.onFinish(value)
            }
          }}
          onCancel={props.onCancel}
          onFieldChange={async (key, value) => {
            await sleep(0)
            const formValue = formRef.value.formRef.getFieldsValue()
            const settleType = +formValue.settleType
            const originalPrice = formValue?.originalPrice
            const receivePrice = formValue?.receivePrice
            const orderId = props.formState?.orderId
            const orderNo = props.formState?.orderNo
            const user = formValue?.memberId
            if (key === 'settleType') {
              const tab = value?.target?.value
              if (tab == '0') {
                run({
                  orderId,
                  orderNo,
                  settleType: '0'
                  // memberId: selectUser?.value?.memberId,
                  // phone: selectUser?.value?.phone,
                  // discountPrice: newDiscountedPrice
                })
              } else {
                if (user?.memberId) {
                  const newDiscountedPrice =
                    ((100 - user?.discountRate * 100) / 100) * originalPrice
                  run({
                    orderId,
                    orderNo,
                    settleType: '1',
                    ...(user.memberType === MemberType.次卡 && {
                      memberTimesId: user.memberTimesId
                    }),
                    memberId: user?.memberId,
                    phone: user?.phone
                    // discountPrice: newDiscountedPrice
                  })
                }
              }
              // const newDiscountedPrice = formValue?.memberId
              //   ? ((100 - formValue?.memberId?.discountRate * 100) / 100) *
              //     originalPrice
              //   : 0
              // formRef.value.changeState({
              //   discountPrice:
              //     value?.target?.value == '0' ? 0 : newDiscountedPrice,
              //   ...(value?.target?.value == '0' && {
              //     receivePrice: formValue?.originalPrice
              //   })
              //   ...value?.target?.value == '1' && {
              //   }
              // })
            }
            if (key === 'memberId') {
              selectUser.value = value.option
              if (value.option) {
                const newDiscountedPrice =
                  ((100 - value?.option?.discountRate * 100) / 100) *
                  originalPrice
                formRef.value.changeState({
                  table1: [
                    {
                      memberNo: value?.option?.memberNo,
                      memberName: value?.option?.memberName,
                      phone: value?.option?.phone,
                      memberTypeName: '折扣卡',
                      discountRate: `${value?.option?.discountRate * 10}折`,
                      availableBalance: `${value?.option?.availableBalance}元`
                    }
                  ],
                  table2: [
                    {
                      memberNo: value?.option?.memberNo,
                      memberName: value?.option?.memberName,
                      phone: value?.option?.phone,
                      memberTypeName: '次卡',
                      discountRate: `${value?.option?.totalRewardTimes}次`,
                      availableBalance: `${value?.option?.availableBalance}元`
                    }
                  ]
                  // discountPrice: newDiscountedPrice
                })
                const orderId = props.formState?.orderId
                const orderNo = props.formState?.orderNo

                if (orderId) {
                  run({
                    orderId,
                    orderNo,
                    ...(selectUser.value.memberType === MemberType.次卡 && {
                      memberTimesId: selectUser.value.memberId
                    }),
                    settleType: settleType,
                    memberId: selectUser?.value?.memberId,
                    phone: selectUser?.value?.phone
                    // discountPrice: newDiscountedPrice
                  })
                }
              }
            }
            // if (key === 'discountPrice') {
            //   changeNum(value, {
            //     originalPrice,
            //     settleType
            //   })
            // }
            if (key === 'receivePrice') {
              changeNum(value, {
                receivePrice,
                settleType,
                originalPrice
              })
            }
          }}
          ref={formRef}
        ></FormRender>
      )
    }
  }
})
