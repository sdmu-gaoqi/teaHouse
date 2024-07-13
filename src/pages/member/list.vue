<template>
  <TableRender
    :schema="schema"
    :changeTab="changeTab"
    :request="member.list"
    :format-params="
      (v: any) => {
        return v
      }
    "
    :table-props="{ scroll: { x: 1690 } }"
    ref="tableRef"
  >
    <template #formButton
      ><a-button
        type="primary"
        class="ml-[10px]"
        :onClick="goAdd"
        v-if="editMember"
        >新增会员</a-button
      ></template
    >
    <template #bodyCell="{ data }">
      <div v-if="data?.column?.dataIndex === 'memberType'">
        <div class="flex font-bold">
          <div class="w-[90px] text-right pr-[10px] shrink-0">会员卡号:</div>
          <div class="ell" :title="data?.record?.memberNo">
            {{ data?.record?.memberNo }}
          </div>
        </div>
        <div class="flex">
          <div class="w-[90px] text-right pr-[10px] shrink-0">会员类型:</div>
          <div
            :class="`${
              data?.record?.memberType === MemberType.次卡
                ? 'text-blue-400'
                : 'text-purple-400'
            }`"
          >
            <a-tag
              color="#2db7f5"
              v-if="data?.record?.memberType === MemberType.折扣卡"
              >折扣卡</a-tag
            >
            <a-tag color="#87d068" v-else>次卡</a-tag>
          </div>
        </div>
        <div class="flex">
          <div class="w-[90px] text-right pr-[10px] shrink-0">会员状态:</div>
          <div
            :class="`${data?.record?.status === 'REFUNDED' && 'text-red-500'}`"
          >
            <a-tag color="#f50" v-if="data?.record?.status === 'REFUNDED'"
              >已退卡</a-tag
            >
            <a-tag color="#108ee9" v-else>正常</a-tag>
          </div>
        </div>
      </div>
      <div v-else-if="data?.column?.dataIndex === 'memberNo'">
        <div class="flex font-bold">
          <div class="w-[60px] text-right pr-[10px] shrink-0">姓 名:</div>
          {{ data?.record?.memberName }}
        </div>
        <div class="flex">
          <div class="w-[60px] text-right pr-[10px] shrink-0">手机号:</div>
          {{ data?.record?.phone }}
        </div>
        <div v-if="data?.record?.memberType === MemberType.次卡" class="flex">
          <div class="w-[60px] text-right pr-[10px] shrink-0">次卡项目:</div>
          <div class="ell" :title="data?.record?.timesProjectName || ''">
            {{ data?.record?.timesProjectName || '' }}
          </div>
        </div>
      </div>
      <div
        v-else-if="data?.column?.dataIndex === 'options'"
        class="flex items-center"
      >
        <a
          type="link"
          class="table-btn"
          v-if="editMember"
          @click="() => $router.push(`/member/edit/${data.record.memberId}`)"
          >编辑</a
        >
        <a
          type="link"
          class="table-btn"
          v-if="memberRecharge"
          :hidden="data?.record?.status !== 'ENABLED'"
          @click="
            () => {
              businessModalType = BusinessModalType.会员充值
              payOpen = true
              formState = data.record
            }
          "
          >充值</a
        >
        <a
          type="link"
          class="table-btn"
          v-if="data?.record?.memberType !== MemberType.次卡"
          @click="
            () => {
              businessModalType = BusinessModalType.会员充值记录
              payOpen = true
              formState = data.record
            }
          "
          >充值记录</a
        >
        <a
          type="link"
          class="table-btn"
          @click="
            () => {
              businessModalType = BusinessModalType.会员消费记录
              payOpen = true
              formState = data.record
            }
          "
          >消费记录</a
        >
        <a
          type="link"
          class="table-btn-danger last"
          v-if="data.record.status === 'ENABLED' && returnMemberCard"
          @click="
            () => {
              businessModalType = BusinessModalType.会员退卡
              payOpen = true
              formState = data.record
            }
          "
          >退卡</a
        >
      </div>
      <template v-else-if="data?.column?.dataIndex === 'status'">
        <div :class="data.record.status === 'ENABLED' ? '' : ' text-red-500'">
          {{ data.record.status === 'ENABLED' ? '正常' : '已退卡' }}
        </div>
      </template>
      <template
        v-else-if="
          data?.column?.dataIndex === 'discountRate' &&
          +data.record.memberType === 1
        "
      >
        {{
          discounts?.find((i) => i?.value === +data?.record?.discountRate)
            ?.label
        }}
      </template>
      <template
        v-else-if="
          data?.column?.dataIndex === 'discountRate' &&
          +data.record.memberType === 2
        "
      >
        <div>
          <!-- <div>次卡项目: {{ data?.record?.totalRewardTimes || 0 }}次</div> -->
          <div>次卡余额: {{ data?.record?.availableRewardTimes || 0 }}次</div>
        </div>
      </template>
      <template v-else-if="data.customer">{{ data.customer }}</template>
      <template v-else>{{ data.text }}</template>
    </template>
  </TableRender>
  <BusinessModal
    :open="payOpen"
    :onFinish="onFinish"
    :onCancel="() => (payOpen = false)"
    :type="businessModalType"
    :formState="formState"
  />
</template>

<script lang="ts" setup>
import { TableRender } from 'store-operations-ui'
import { schema } from './config'
import { useRouter } from 'vue-router'
import BusinessModal from '@/components/businessModal/businessModal'
import { ref } from 'vue'
import {
  BusinessModalType,
  BusinessModalTypes
} from '@/components/businessModal/businessModal.type'
import { Member } from 'store-request'
import { MemberType, memberMap } from '@/types'
import { Modal, message } from 'ant-design-vue'
import { nanoid } from 'nanoid'
import { useAccess } from '@/hooks'
import { discounts } from '@/constant'

const { editMember, memberRecharge, returnMemberCard } = useAccess()

const formState = ref({})
const tableRef = ref()

const member = new Member()

const router = useRouter()

const payOpen = ref(false)
const businessModalType = ref<BusinessModalTypes>(BusinessModalType.会员充值)

const goAdd = () => {
  router.push('/member/add')
}

const changeTab = (tab: any) => {}

const onFinish = async (v: any, type: string) => {
  if (type === 'returnCard') {
    await member.returnCatd(v)
    message.success('退款成功')
    tableRef.value.run(tableRef.value.params?.[0])
    payOpen.value = false
    return
  }
  Modal.confirm({
    title: '提示',
    content: `确定给此会员充值${v?.rechargeBalance}元吗`,
    onOk: async () => {
      const sendValue = {
        memberId: v?.memberId,
        memberName: v?.memberName,
        memberNo: v?.memberNo,
        requestNo: nanoid(),
        memberType: v?.memberType,
        payMethod: v?.payMethod,
        remark: v?.remark,
        phone: v?.phone,
        ...(v?.memberType == MemberType.折扣卡 && {
          discountDepositInfo: {
            rechargeBalance: v?.rechargeBalance,
            giveBalance: +v?.giveBalance > 0 ? v?.giveBalance : null,
            discountRate: v?.discountRate,
            beforeDepositBalance: v?.beforeDepositBalance,
            payMethod: v?.payMethod
          }
        }),
        ...(v?.memberType == MemberType.次卡 && {
          timesDepositInfo: {
            buyAmount: v?.rewardTimes,
            buyPrice: v?.rechargeBalance,
            giveAmount: v?.giveTimes,
            payMethod: v?.payMethod,
            projectId: v?.project?.[0]?.id
          }
        })
      }
      await member.memberPay(sendValue)
      message.success('充值成功')
      tableRef.value.run(tableRef.value.params?.[0])
      payOpen.value = false
    },
    cancelText: '取消'
  })
}
</script>
