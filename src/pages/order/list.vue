<template>
  <TableRender
    :schema="schema"
    v-model:activeKey="activeKey"
    :request="common.orderList"
    ref="tableRef"
    :tableProps="{
      scroll: { x: 1500 }
    }"
  >
    <template #bodyCell="{ data }">
      <template v-if="data.column.dataIndex === 'options'">
        <div class="flex justify-center items-center">
          <div
            v-if="data.record.status === 'CREATED' && orderSettlement"
            type="link"
            style="padding: 0"
            :ghost="true"
            class="table-btn"
            @click="
              () => {
                open = true
                type = BusinessModalType.会员结算
                orderData.orderId = data?.record?.orderId
                orderData.orderNo = data?.record?.orderNo
              }
            "
          >
            结算
          </div>
          <div
            type="link"
            style="padding: 0; padding-left: 10px"
            :ghost="true"
            class="table-btn"
            @click="
              () => {
                open = true
                type = BusinessModalType.订单详情
                orderData.orderId = data?.record?.orderId
                orderData.orderNo = data?.record?.orderNo
              }
            "
          >
            详情
          </div>
        </div></template
      >
      <template v-else-if="data.column.dataIndex === 'status'">
        <div :class="data.record?.status === 'SUBMIT' ? '' : 'text-red-500'">
          {{ data?.customer || data.text }}
        </div>
      </template>
      <template v-else-if="data.column.dataIndex === 'payPrice'">{{
        formatMoney(data?.record?.payPrice || data?.record?.receivePrice)
      }}</template>
      <template v-else-if="data.column.dataIndex === 'price'">
        <div class="flex">
          <div class="w-[70px] text-right font-bold">订单金额：</div>
          {{ formatMoney(data?.record?.originalPrice) }}
        </div>
        <div class="flex">
          <div class="w-[70px] text-right font-bold">优惠金额：</div>
          {{
            data.record?.status === 'SUBMIT'
              ? formatMoney(data?.record?.discountPrice)
              : '--'
          }}
        </div>
        <div class="flex">
          <div class="w-[70px] text-right font-bold">实付金额：</div>
          {{
            data.record?.status === 'SUBMIT'
              ? formatMoney(
                  data?.record?.payPrice ?? 0 ?? data?.record?.receivePrice
                )
              : '--'
          }}
        </div>
      </template>
      <template v-else-if="data.column.dataIndex === 'member'">
        <div class="flex">
          <div class="w-[80px] text-right font-bold">会员类型：</div>
          {{ MemberType[data?.record?.memberType] }}
        </div>
        <div class="flex">
          <div class="w-[80px] text-right font-bold">会员姓名：</div>
          {{ data?.record?.memberName }}
        </div>
        <div class="flex">
          <div class="w-[80px] text-right font-bold">会员卡号：</div>
          {{ data?.record?.memberNo }}
        </div>
        <div class="flex">
          <div class="w-[80px] text-right font-bold">手机号码：</div>
          {{ data?.record?.phone }}
        </div>
      </template>
      <template v-else>{{ data?.customer || data.text }}</template>
    </template>
  </TableRender>
  <BusinessModal
    :open="open"
    :onCancel="() => (open = false)"
    :type="type"
    :formState="orderData"
    :onFinish="onFinish"
  />
</template>

<script lang="ts" setup>
import { TableRender } from 'store-operations-ui'
import { schema } from './config'
import { ref } from 'vue'
import BusinessModal from '@/components/businessModal/businessModal'
import { BusinessModalType } from '@/components/businessModal/businessModal.type'
import common from '@/servers/common'
import { message } from 'ant-design-vue'
import { useAccess } from '@/hooks'
import { formatMoney } from '@/utils'
import { MemberType } from '@/types'
const { orderSettlement } = useAccess()

const access = useAccess()

const orderData = ref({
  orderId: '',
  orderNo: ''
})

const open = ref(false)
const type = ref(BusinessModalType.会员结算)
const tableRef = ref()

const run = () => {
  tableRef.value.run(tableRef.value.params?.[0])
}

const onFinish = async (value: any) => {
  try {
    await common.submitOrder(value)
    message.success('订单结算成功')
    open.value = false
    run()
  } catch (err: any) {
    if (err?.code === 1025) {
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
  }
}

const activeKey = ref('')
</script>
