import { discounts } from '@/constant'
import { MemberType, payTypes } from '@/types'
import { formatMoney } from '@/utils'
import { Input } from 'ant-design-vue'
import { FormRender, FormRenderProps, Schema } from 'store-operations-ui'
import { defineComponent, onMounted, ref, toRaw } from 'vue'
import BusinessModal from '../businessModal'
import { BusinessModalType } from '../businessModal.type'
import { PlusOutlined } from '@ant-design/icons-vue'

const schema: Schema = {
  type: 'object',
  rules: {
    payType: [{ required: true, message: '请选择充值方式' }],
    rechargeBalance: [{ required: true, message: '请输入充值金额' }],
    discountRate: [{ required: true, message: '请输入折扣' }],
    memberType: [{ required: true, message: '请选择会员类型' }],
    rewardTimes: [{ required: true, message: '请输入优惠次数' }],
    project: [{ required: true, message: '请选择服务项目' }]
  },
  properties: {
    'op-group-0': {
      title: ' 基础信息'
    },
    memberType: {
      title: '会员类型',
      type: 'string',
      props: {
        disabled: true,
        options: [
          {
            label: 'A.折扣卡',
            value: MemberType.折扣卡
          },
          {
            label: 'B.次卡',
            value: MemberType.次卡
          }
        ]
      },
      widget: 'radio'
    },
    'op-group-1': {
      title: '充值信息'
    },
    memberNo: {
      title: '会员卡号',
      type: 'string',
      widget: 'input',
      props: {
        readonly: true,
        bordered: false
      }
    },
    memberName: {
      title: '姓名',
      type: 'string',
      widget: 'input',
      props: {
        readonly: true,
        bordered: false
      }
    },
    phone: {
      title: '手机号',
      type: 'string',
      widget: 'input',
      defaultValue: '13567676767',
      props: {
        readonly: true,
        bordered: false
      }
    },
    project: {
      title: '服务项目',
      span: 13,
      slots: {
        customRender: 'selectProject'
      },
      'ui:hidden': "formState.value.memberType != '2'"
    },
    rechargeBalance: {
      title: '充值金额',
      type: 'number',
      widget: 'input',
      props: {
        type: 'number'
      }
    },
    giveBalance: {
      title: '赠送金额',
      type: 'number',
      widget: 'input',
      props: {
        type: 'number'
      },
      'ui:hidden': 'formState.value.memberType === 2'
    },
    discountRate: {
      title: '折扣',
      type: 'string',
      widget: 'input',
      props: {
        // type: 'number'
        options: discounts
      },
      'ui:hidden': 'formState.value.memberType === 2'
    },
    rewardTimes: {
      title: '优惠次数',
      type: 'number',
      widget: 'input',
      props: {
        type: 'number',
        precision: 0
      },
      'ui:hidden': 'formState.value.memberType === 1'
    },
    giveTimes: {
      title: '赠送次数',
      type: 'number',
      widget: 'input',
      defaultValue: '0',
      props: {
        type: 'number',
        precision: 0
      },
      'ui:hidden': 'formState.value.memberType === 1'
    },
    payMethod: {
      title: '充值方式',
      type: 'string',
      props: {
        options: payTypes,
        placeholder: '请选择'
      },
      widget: 'radio'
    },
    beforeDepositBalance: {
      title: '充值前金额',
      type: 'string',
      widget: 'input',
      props: {
        readOnly: true,
        bordered: false,
        style: {
          color: 'red',
          fontWeight: 'bold'
        }
      }
    },
    money4: {
      title: '充值后金额',
      type: 'string',
      widget: 'input',
      props: {
        readOnly: true,
        bordered: false,
        style: {
          color: 'red',
          fontWeight: 'bold'
        }
      }
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
    submit: '确定充值',
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
    props: FormRenderProps & { formState: Record<string, any>; onFinish?: any }
  ) => {
    const formRef = ref()
    const open = ref(false)
    const formState = ref<any>({
      selectList: undefined,
      type: 'radio',
      lastSelect: undefined
    })
    onMounted(() => {
      if (formRef.value.changeState) {
        const beforeDepositBalance = formatMoney(
          props.formState?.availableBalance
        )
        formRef.value.changeState({
          ...props?.formState,
          beforeDepositBalance:
            Number(beforeDepositBalance) > 0 ? beforeDepositBalance : 0,
          payMethod: 1
        })
      }
    })
    return () => {
      return (
        <>
          <FormRender
            schema={schema}
            onFinish={props.onFinish}
            onCancel={props.onCancel}
            ref={formRef}
            v-slots={{
              selectProject: () => {
                return (
                  <Input
                    readonly
                    placeholder="请选择"
                    value={formState?.value?.selectList?.[0]?.projectName}
                    // @ts-ignore
                    onClick={() => (open.value = true)}
                    class="projectBox"
                    suffix={
                      <div
                        class="cursor-pointer"
                        onClick={() => (open.value = true)}
                      >
                        <PlusOutlined />
                        点击选择项目
                      </div>
                    }
                  />
                )
              }
            }}
            onFieldsChanged={(v) => {
              formRef.value.changeState({
                money4: formatMoney(
                  (+v.beforeDepositBalance || 0) +
                    (+v.rechargeBalance || 0) +
                    (+v.giveBalance || 0)
                )
              })
            }}
          />
          <BusinessModal
            type={BusinessModalType.选择项目}
            open={open.value}
            modalProps={{
              okText: '确定',
              cancelText: '返回',
              onOk: () => {
                formRef.value.formRef.clearValidate(['project'])
                open.value = false
                formRef.value.changeState({
                  project: formState.value.selectList
                })
                formState.value.lastSelect = formState.value.selectList
              },
              onCancel: () => {
                open.value = false
                console.log(toRaw(formState))
                formState.value.selectList = formState.value.lastSelect
              }
            }}
            changeState={(v: any) => {
              formState.value.lastSelect = formState.value.selectList
              formState.value.selectList = v
            }}
            formState={formState.value}
          />
        </>
      )
    }
  }
})
