/**
 * @file 订单详情
 * */

import common from '@/servers/common'
import { RoyaltyType } from '@/types'
import { formatMoney } from '@/utils'
import { FormRender, Schema } from 'store-operations-ui'
import { defineComponent, onMounted, ref, watch } from 'vue'

// @ts-nocheck

type Status = 'CREATED' | 'SUBMIT'

const OrderDetail = defineComponent({
  props: {
    formState: Object
  },
  // @ts-ignore
  setup(props: { formState: Record<string, any> }) {
    const formRef = ref()
    const loading = ref(false)
    const schema: Schema = {
      type: 'object',
      properties: {
        status: {
          title: ' 订单状态',
          widget: 'input',
          type: 'string',
          props: {
            readonly: true,
            bordered: false
          }
        },
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
          props: {
            readonly: true,
            bordered: false
          },
          widget: 'input'
        },
        originalPrice: {
          title: '应收金额',
          type: 'string',
          widget: 'input',
          span: 12,
          props: {
            readonly: true,
            bordered: false
          },
          'ui:hidden':
            '(formState.value.settleType == 1 && !formState.value?.memberId?.memberId)'
        },
        receivePrice: {
          title: '实收金额',
          type: 'string',
          span: 24,
          widget: 'input',
          props: {
            readonly: true,
            bordered: false
          },
          'ui:hidden': 'isEmpty(formState.value.receivePrice)'
        },
        discountPrice: {
          title: '优惠金额',
          type: 'string',
          span: 24,
          widget: 'input',
          props: {
            readonly: true,
            bordered: false
          },
          'ui:hidden': 'formState.value.settleType == "美团"'
        },
        payMethod: {
          title: '支付方式',
          type: 'string',
          widget: 'input',
          props: {
            readonly: true,
            bordered: false
          },
          'ui:hidden': 'isEmpty(formState.value.payMethod)'
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
            'isEmpty(formState.value.replenishPrice) || formState.value.replenishPrice == 0 || formState.value.settleType == "美团" || formState.value.settleType == "非会员"'
        },
        remark: {
          title: ' 备注',
          type: 'string',
          widget: 'input',
          props: {
            readonly: true,
            bordered: false
          }
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
                title: '技师',
                dataIndex: 'operateUserName'
              },
              {
                title: '上钟类型',
                dataIndex: 'royaltyType'
              },
              {
                title: '客数',
                dataIndex: 'customNum'
              },
              {
                title: '上钟数',
                dataIndex: 'serviceNum'
              }
            ],
            pagination: false
          }
        }
      },
      displayType: 'row',
      column: 1,
      maxWidth: '340px',
      footer: {
        submit: false,
        cancel: '返回'
      }
    }
    onMounted(async () => {
      if (props?.formState?.orderId) {
        loading.value = true
        try {
          const res = (await common.orderDetail({
            orderId: props.formState.orderId,
            orderNo: props.formState.orderNo
          })) as any
          loading.value = false
          formRef.value.changeState({
            orderNo: res?.data?.orderNo,
            originalPrice: formatMoney(res?.data?.originalPrice),
            receivePrice: formatMoney(
              res.data.settleType == '2'
                ? res?.data?.payPrice
                : res?.data?.payPrice
            ),
            replenishPrice: formatMoney(res?.data?.replenishPrice),
            remark: res?.data?.remark,
            discountPrice: formatMoney(res.data.discountPrice),
            settleType:
              res.data.settleType == '2'
                ? '美团'
                : res.data.settleType == '0'
                ? '非会员'
                : '会员',
            table: res?.data?.orderItemList?.map((item: any) => ({
              ...item,
              money: formatMoney(item?.discountPrice || 0),
              unitPrice: formatMoney(item?.unitPrice),
              royaltyType:
                item.royaltyType === RoyaltyType.排钟 ? '排钟' : '点钟'
            })),
            status: res.data?.status === 'SUBMIT' ? '已结算' : '未结算'
          })
        } catch (err) {
          loading.value = false
        }
      }
    })
    return () => {
      return (
        <FormRender schema={schema} ref={formRef} loading={loading.value} />
      )
    }
  }
})

export default OrderDetail
