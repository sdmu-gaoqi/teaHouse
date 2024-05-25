/**
 * @file 会员结算
 * */
import common from '@/servers/common'
import { MemberType, payTypes } from '@/types'
import { formatMoney } from '@/utils'
import { Input, Modal, Radio, Switch, Table, message } from 'ant-design-vue'
import {
  FormCard,
  FormRender,
  FormRenderProps,
  Schema,
  TableRender
} from 'store-operations-ui'
import { Member } from 'store-request'
import {
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  toRaw,
  unref,
  watch
} from 'vue'
import { useRequest } from 'vue-hooks-plus'
import { cloneDeep, debounce, isEmpty, sleep } from 'wa-utils'
import '../styles/memberSettlement.form.scss'

const member = new Member()

const payKey = 'payMethod'

const schema: Schema = {
  type: 'object',
  rules: {
    [payKey]: [{ required: true, message: '请选择支付方式' }],
    meituan: [{ required: true, message: '请输入美团金额' }],
    payPrice: [{ required: true, message: '请输入实收金额' }]
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
            label: '第三方平台',
            value: '2'
          }
        ]
      },
      widget: 'radio'
    },
    memberType: {
      title: '会员类型',
      defaultValue: MemberType.折扣卡,
      widget: 'radio',
      props: {
        options: [
          { label: '折扣卡', value: MemberType.折扣卡 },
          { label: '次卡', value: MemberType.次卡 }
        ]
      },
      'ui:hidden': 'formState.value.settleType != 1'
    },
    memberId: {
      title: '查找会员',
      type: 'string',
      placeholder: '请输入手机号查询会员',
      search: {
        key: 'searchPhone',
        label: 'memberName1',
        value: 'id',
        request: (data: any) =>
          member.list(data).then((res: any) => {
            res.rows = res.rows?.map((item: any, index: number) => ({
              ...item,
              memberName1: `${item?.memberName} (会员卡号:${item?.memberNo}-手机号${item?.phone})${
                item.timesProjectName
                  ? ` 次卡项目：${item?.timesProjectName}`
                  : ''
              }`,
              id: `${item.memberId}_${index + 1}`
            }))
            return res
          }),
        dataKey: 'rows',
        // format: (v: any) => {
        //   const o = v?.map((item: any, index: number) => ({
        //     ...item,
        //     memberName1: `${item?.memberName} (会员卡号:${item?.memberNo}-手机号${item?.phone})`,
        //     id: `${item.memberId}_${index + 1}`
        //   }))
        //   return o
        // },
        params: {
          memberType: 1
        }
      },
      widget: 'searchSelect',
      'ui:hidden': 'formState.value.settleType != 1'
    },
    memberTable: {
      slots: {
        customRender: 'memberTable'
      },
      'ui:hidden':
        'formState.value.settleType != 1 || formState.value.memberType != 1'
    },
    ckMemberTable: {
      slots: {
        customRender: 'ckMemberTable'
      },
      'ui:hidden':
        'formState.value.settleType != 1 || formState.value.memberType != 2'
    },
    projectTable: {
      slots: {
        customRender: 'projectTable'
      }
    },
    'op-group-1': {
      title: '活动优惠',
      'ui:hidden': 'formState.value.settleType != 0'
    },
    msTable: {
      slots: {
        customRender: 'msTable'
      },
      'ui:hidden': 'formState.value.settleType != 0'
    },
    receivePrice: {
      title: '应收金额',
      labelClass: 'text-orange-500 text-[14px]',
      type: 'string',
      widget: 'input',
      span: 13,
      props: {
        readonly: true,
        bordered: false,
        style: {
          color: '#f97316',
          fontWeight: 'bold'
        }
      },
      'ui:hidden':
        '(formState.value.settleType == 1 && !formState.value?.memberId?.memberId)'
    },
    meituan: {
      defaultValue: '0',
      labelClass: 'text-orange-500 text-[14px]',
      title: '美团金额',
      type: 'string',
      span: 12,
      widget: 'input',
      props: {
        style: {
          color: '#f97316',
          fontWeight: 'bold'
        }
      },
      'ui:hidden': 'formState.value.settleType != 2'
    },
    timesDeductPrice: {
      title: '次卡抵扣金额',
      labelClass: 'text-orange-500 text-[14px]',
      type: 'string',
      span: 24,
      widget: 'input',
      props: {
        readonly: true,
        bordered: false,
        style: {
          color: '#f97316',
          fontWeight: 'bold'
        }
      },
      'ui:hidden':
        '!formState.value.memberId || formState.value.memberType != 2'
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
    payPrice: {
      title: '实收金额',
      labelClass: 'text-orange-500 text-[14px]',
      type: 'string',
      span: 12,
      widget: 'input',
      props: {
        style: {
          color: '#f97316',
          fontWeight: 'bold'
        }
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
    // store3: {
    //   title: '支付方式',
    //   type: 'string',
    //   widget: 'input',
    //   defaultValue: '按次卡',
    //   colClass: 'cika',
    //   props: {
    //     readonly: true,
    //     bordered: false
    //   },
    //   'ui:hidden':
    //     'formState.value.settleType != 1  || formState.value.memberId?.memberType != 2'
    // },
    // store4: {
    //   title: '支付方式',
    //   type: 'string',
    //   widget: 'input',
    //   defaultValue: '美团核销',
    //   props: {
    //     readonly: true,
    //     bordered: false
    //   },
    //   'ui:hidden': 'formState.value.settleType != 2'
    // },
    // z1: {
    //   widget: 'input',
    //   type: 'string',
    //   defaultValue: '扣除',
    //   span: 2,
    //   colClass: 'z1',
    //   props: {
    //     readonly: true,
    //     bordered: false
    //   },
    //   'ui:hidden':
    //     'formState.value.settleType != 1  || formState.value.memberId?.memberType != 2'
    // },
    // useTimes: {
    //   widget: 'input',
    //   type: 'number',
    //   span: 3,
    //   colClass: 'useTimes',
    //   props: {
    //     suffix: '次',
    //     min: 0,
    //     precision: 0
    //   },
    //   label: '扣除',
    //   'ui:hidden':
    //     'formState.value.settleType != 1  || formState.value.memberId?.memberType != 2'
    // },
    // z2: {
    //   widget: 'input',
    //   type: 'string',
    //   colStyle: {},
    //   span: 6,
    //   colClass: 'z2',
    //   defaultValue: '还剩余 0 次',
    //   props: {
    //     readonly: true,
    //     bordered: false
    //   },
    //   'ui:hidden':
    //     'formState.value.settleType != 1  || formState.value.memberId?.memberType != 2'
    // },
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
    const memberList = ref<any>([])
    const yhItems = ref<any[]>([])
    const msList = ref<any>([])
    const { run, data, params } = useRequest(common.preSettle, {
      manual: true,
      onSuccess: (res: any) => {
        const v = {
          orderNo: res?.data?.orderNo,
          receivePrice: formatMoney(res?.data?.originalPrice),
          replenishPrice: formatMoney(res?.data?.replenishPrice || 0),
          discountPrice: formatMoney(res?.data?.discountPrice || 0),
          payPrice: formatMoney(res?.data?.payPrice),
          meituan: formatMoney(res.data?.payPrice),
          timesDeductPrice: formatMoney(res.data?.timesDeductPrice)
        }
        formRef.value.changeState(v)
        formRef.value.formRef.clearValidate()
        defaultValue.value = {
          ...v,
          metaData: res?.data,
          projectList: res?.data?.preOrderItemList?.map((item: any) => ({
            ...item,
            unitPrice: formatMoney(item?.unitPrice),
            money: formatMoney(
              (item?.originalPrice || 0) - (item?.discountPrice || 0)
            ),
            discountPrice: formatMoney(item?.discountPrice)
          }))
        }
        const ids = res?.data?.preOrderItemList
          ?.map((item: any) => item?.serviceProjectId)
          .join(',')
        getMsIds(ids)
      },
      onError: (err: any) => {
        if (err?.code === 1025) {
          formRef.value.changeState({
            settleType: '0',
            discountPrice: '0'
          })
          message.error('会员卡余额为0,无法会员下单')
        }
        if (err?.code === 1000005) {
          formRef.value.changeState({
            memberId: undefined,
            'memberId-search': undefined,
            memberTable: [],
            ckMemberTable: []
          })
          memberList.value = []
        }
        if (err?.code === 2000102) {
          message.error('此项目已不在秒杀时间范围内,请重新选择!')
        } else if (err?.code === 2000101) {
          message.error('促销活动不存在')
        } else if (err?.code === 2000001) {
          message.error('订单号已存在')
        } else if (err?.code === 2000003) {
          message.error('订单不存在')
        } else if (err?.code === 2000004) {
          message.error('订单已提交')
        }
      }
    })
    const { data: msPr, loading } = useRequest(common.msProjectList)
    const { run: getMsIds } = useRequest(
      (ids: any) => {
        return common
          .markIds({
            params: {
              projectIds: ids
            }
          })
          .then((res: any) => {
            msList.value = res?.data
          })
      },
      {
        manual: true
      }
    )
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

    onUnmounted(() => {
      if (schema?.properties?.memberId?.search?.params) {
        schema.properties.memberId.search.params = {
          memberType: 1
        }
      }
    })

    // 根据优惠设置项目信息
    const memoProject = (yhList: any[], projectList: any[]) => {
      const items = projectList?.map((item: any) => {
        const yhItems = yhList?.filter(
          (i: any) => i.projectId === item.serviceProjectId
        )
        const promotionInfoList = yhItems?.map((i: any) => ({
          promotionId: i?.seckillId + '',
          promotionItemId: i?.id + ''
        }))
        return {
          serviceProjectId: item.serviceProjectId,
          promotionInfoList
        }
      })
      return items
    }

    const changeYhList = (yhList: any[]) => {
      const orderItemList = memoProject(
        yhList,
        defaultValue?.value?.projectList
      )
      return common
        .preSettle({
          ...params.value?.[0],
          orderItemList
        })
        .then((res: any) => {
          const v = {
            orderNo: res?.data?.orderNo,
            receivePrice: formatMoney(res?.data?.receivePrice),
            replenishPrice: formatMoney(res?.data?.replenishPrice || 0),
            discountPrice: formatMoney(res?.data?.discountPrice || 0),
            payPrice: formatMoney(res?.data?.payPrice),
            meituan: formatMoney(res.data?.payPrice)
          }
          formRef.value.changeState(v)
          formRef.value.formRef.clearValidate()
          defaultValue.value = {
            ...v,
            metaData: res?.data,
            projectList: res?.data?.preOrderItemList?.map((item: any) => ({
              ...item,
              unitPrice: formatMoney(item?.unitPrice),
              money: formatMoney(
                (item?.originalPrice || 0) - (item?.discountPrice || 0)
              ),
              discountPrice: formatMoney(item?.discountPrice)
            }))
          }
          const ids = res?.data?.preOrderItemList
            ?.map((item: any) => item?.serviceProjectId)
            .join(',')
          getMsIds(ids)
        })
        .catch((err) => {
          if (err?.code === 1025) {
            formRef.value.changeState({
              settleType: '0',
              discountPrice: '0'
            })
            message.error('会员卡余额为0,无法会员下单')
          }
          if (err?.code === 2000102) {
            message.error('此项目已不在秒杀时间范围内,请重新选择!')
          } else if (err?.code === 2000101) {
            message.error('促销活动不存在')
          } else if (err?.code === 2000001) {
            message.error('订单号已存在')
          } else if (err?.code === 2000003) {
            message.error('订单不存在')
          } else if (err?.code === 2000004) {
            message.error('订单已提交')
          }
          return Promise.reject()
        })
    }

    const changeNum = debounce(
      (value: any, { receivePrice, settleType }: any) => {
        const inputValue = value.target.value
        const orderItemList = memoProject(
          yhItems.value,
          defaultValue?.value?.projectList
        )
        if (isNaN(Number(inputValue))) {
          value.target.value = 0
          run({
            ...params.value?.[0],
            payPrice: 0,
            settleType,
            orderItemList
          })
          return message.error('请输入正确的数字')
        }
        if (+inputValue >= +receivePrice) {
          message.error('实收金额不能大于应收金额')
          value.target.value = 0
          run({
            ...params.value?.[0]
          })
        } else {
          run({
            ...params.value?.[0],
            payPrice: value.target.value,
            settleType,
            orderItemList
          })
        }
      },
      1500
    )

    return () => {
      return (
        <FormRender
          schema={schema}
          onFinish={(v) => {
            Modal.confirm({
              content: (
                <div>
                  <p>
                    当前订单为
                    {
                      {
                        0: '非会员',
                        1: '会员',
                        2: '第三方平台'
                      }[v?.settleType as number]
                    }
                    订单
                  </p>
                  <p>实收金额为{v?.payPrice},确定结算此订单吗?</p>
                </div>
              ),
              cancelText: '取消',
              okText: '确认',
              onOk: () => {
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
                  discountPrice: defaultValue?.value?.metaData?.discountPrice,
                  remark: v?.remark || '',
                  receivePrice: formatMoney(v?.receivePrice),
                  payMethod: v?.payMethod,
                  originalPrice: defaultValue?.value?.metaData?.originalPrice,
                  orderItemList: toRaw(
                    defaultValue?.value?.projectList?.map((item: any) => {
                      return {
                        ...item,
                        zt: item?.zt ? 1 : 0
                      }
                    })
                  ),
                  promotionList: toRaw(
                    defaultValue?.value?.metaData?.promotionInfoList
                  ),
                  payPrice: v?.payPrice,
                  timesDeductPrice:
                    defaultValue?.value?.metaData?.timesDeductPrice
                }
                if (v?.settleType === '1' && !v?.memberId?.memberId) {
                  return message.error('请选择会员')
                }
                if (props?.onFinish) {
                  props.onFinish(value)
                }
              }
            })
          }}
          onCancel={props.onCancel}
          onFieldChange={async (key, value) => {
            await sleep(0)
            const formValue = formRef.value.formRef.getFieldsValue()
            const settleType = +formValue.settleType
            const receivePrice = formValue?.receivePrice
            const payPrice = formValue?.payPrice
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
                })
              } else if (tab === '2') {
                run({
                  orderId,
                  orderNo,
                  settleType: '2'
                })
              } else {
                if (user?.memberId) {
                  run({
                    orderId,
                    orderNo,
                    settleType: '1',
                    ...(user.memberType === MemberType.次卡 && {
                      memberTimesId: user.memberTimesId
                    }),
                    memberId: user?.memberId,
                    phone: user?.phone
                  })
                }
              }
            }
            if (key === 'memberId') {
              selectUser.value = value.option
              if (value.option) {
                memberList.value = [
                  {
                    memberNo: value?.option?.memberNo,
                    memberName: value?.option?.memberName,
                    phone: value?.option?.phone,
                    memberTypeName:
                      value.option?.memberType === MemberType.折扣卡
                        ? '折扣卡'
                        : '次卡',
                    discountRate: `${value?.option?.discountRate * 10}折`,
                    availableBalance: formatMoney(
                      value?.option?.availableBalance
                    ),
                    project: value?.option?.timesProjectName,
                    totalRewardTimes: value?.option?.totalRewardTimes,
                    availableRewardTimes: value?.option?.availableRewardTimes
                  }
                ]
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
                  })
                }
              }
            }
            if (key === 'payPrice') {
              if (!payPrice) {
                return
              }
              changeNum(value, {
                payPrice,
                settleType,
                receivePrice
              })
            }
            if (key === 'meituan') {
              if (!value?.target?.value) {
                return
              }
              changeNum(value, {
                payPrice,
                settleType,
                receivePrice
              })
            }
            if (key === 'memberType') {
              const v = value?.target?.value
              formRef.value.changeState({
                memberId: undefined,
                'memberId-search': undefined
              })
              formRef.value.selectSearch(
                '',
                schema?.properties?.memberId,
                'memberId',
                {
                  memberType: v
                }
              )
              memberList.value = []
              if (schema?.properties?.memberId?.search) {
                schema.properties.memberId.search.params = {
                  memberType: v
                }
              }
            }
          }}
          ref={formRef}
          v-slots={{
            projectTable: () => {
              return (
                <>
                  <Table
                    size="small"
                    columns={[
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
                        title: '小计',
                        dataIndex: 'payPrice',
                        slots: {
                          customRender: 'payPrice'
                        }
                      },
                      {
                        title: '是否使用次卡',
                        dataIndex: 'times',
                        slots: {
                          customRender: 'times'
                        }
                        // colSpan: 0
                      },
                      {
                        title: '本次次卡次数',
                        dataIndex: 'timesAmount'
                        // colSpan: 0
                      },
                      {
                        title: '是否自推',
                        dataIndex: 'isZt',
                        slots: {
                          customRender: 'isZt'
                        }
                      }
                    ]}
                    dataSource={defaultValue?.value?.projectList || []}
                    pagination={false}
                    v-slots={{
                      isZt: (data: any) => {
                        return (
                          <Radio.Group
                            value={data.record?.zt || 0}
                            onChange={(v) => {
                              data.record.zt = v.target.value
                            }}
                          >
                            <Radio value={0}>否</Radio>
                            <Radio value={1}>是</Radio>
                          </Radio.Group>
                        )
                      },
                      payPrice: (data: any) => {
                        return formatMoney(data?.text)
                      },
                      times: (data: any) => {
                        return data.text == 1 ? '是' : '否'
                      }
                    }}
                  />
                </>
              )
            },
            memberTable: () => {
              return (
                <>
                  <Table
                    size="small"
                    columns={[
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
                    ]}
                    dataSource={memberList.value}
                    pagination={false}
                    locale={{
                      emptyText: '请选择会员'
                    }}
                  />
                </>
              )
            },
            ckMemberTable: () => {
              return (
                <>
                  <Table
                    size="small"
                    columns={[
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
                        title: '服务项目',
                        dataIndex: 'project'
                      },
                      {
                        title: '会员卡次数',
                        dataIndex: 'totalRewardTimes'
                      },
                      {
                        title: '会员卡剩余次数',
                        dataIndex: 'availableRewardTimes'
                      }
                    ]}
                    dataSource={memberList.value}
                    pagination={false}
                    locale={{
                      emptyText: '请选择会员'
                    }}
                  />
                </>
              )
            },
            msTable: () => {
              return (
                <>
                  <Table
                    pagination={false}
                    columns={[
                      {
                        title: '项目名称',
                        dataIndex: 'projectName'
                      },
                      {
                        title: '单价/原价',
                        dataIndex: 'price',
                        slots: {
                          customRender: 'price'
                        }
                      },
                      {
                        title: '秒杀时段',
                        dataIndex: 'discountTime',
                        slots: {
                          customRender: 'time'
                        }
                      },
                      {
                        title: '秒杀价',
                        dataIndex: 'discountPrice',
                        slots: {
                          customRender: 'price'
                        }
                      },
                      {
                        title: '参与订单结算',
                        dataIndex: '',
                        slots: {
                          customRender: 'opt'
                        }
                      }
                    ]}
                    dataSource={msList.value as any}
                    loading={loading.value}
                    locale={{
                      emptyText: '暂无活动项目'
                    }}
                    v-slots={{
                      price: (data: any) => {
                        return formatMoney(data.text)
                      },
                      time: (data: any) => {
                        return (
                          data.text +
                          (data.record?.discountTimeBeforeAfter === 0
                            ? '前'
                            : '后')
                        )
                      },
                      opt: (data: any) => {
                        return (
                          <div>
                            <Switch
                              checkedChildren={'参与'}
                              unCheckedChildren={'不参与'}
                              checked={yhItems.value?.some(
                                (i: any) => i.id === data?.record?.id
                              )}
                              onChange={(v) => {
                                const oldValue = cloneDeep(yhItems.value)
                                let newItems: any = [...yhItems.value]
                                if (v) {
                                  const selectd = yhItems.value?.find(
                                    (i: any) =>
                                      i.projectId === data?.record?.projectId
                                  )
                                  if (selectd) {
                                    newItems = newItems?.filter(
                                      (item: any) =>
                                        item.projectId !==
                                        data?.record?.projectId
                                    )
                                  }
                                  newItems = [...newItems, data?.record]
                                } else {
                                  newItems = newItems?.filter(
                                    (i: any) => i?.id !== data?.record?.id
                                  )
                                }
                                changeYhList(newItems)
                                  .then(() => {
                                    yhItems.value = newItems
                                  })
                                  .catch((err) => {
                                    if (err?.code === 1025) {
                                      formRef.value.changeState({
                                        settleType: '0',
                                        discountPrice: '0'
                                      })
                                      message.error(
                                        '会员卡余额为0,无法会员下单'
                                      )
                                    }
                                    yhItems.value = oldValue
                                  })
                              }}
                            />
                          </div>
                        )
                      }
                    }}
                    size="small"
                  />
                </>
              )
            }
          }}
        ></FormRender>
      )
    }
  }
})
