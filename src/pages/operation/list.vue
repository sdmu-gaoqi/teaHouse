<template>
  <TableRender
    :schema="schema"
    :request="
      (params) => {
        return getList({
          ...(params || {}),
          pageNum: params?.pageNum || 1,
          pageSize: params?.pageSize || 20
        })
      }
    "
  >
    <template #bodyCell="{ data }">
      <div
        v-if="data?.column?.dataIndex === 'options'"
        class="flex justify-center items-center"
      >
        <a
          type="link"
          class="table-btn last"
          @click="
            () => {
              open = true
            }
          "
          >详情</a
        >
      </div>
      <template v-else-if="data?.column?.dataIndex.startsWith('payMethod_')">{{
        formatMoney(data?.record?.payMethodInfoMap?.[data?.column?.dataIndex])
      }}</template>
      <template v-else>{{ data?.customer || data.text }}</template>
    </template>
  </TableRender>
  <BusinessModal
    :type="BusinessModalType.营业额详情"
    :open="open"
    :title="title"
    :onCancel="() => (open = false)"
    :formState="formState"
  />
</template>

<script lang="ts" setup>
// data?.record?.payMethodInfoMap?.[data?.column?.dataIndex]
import { TableRender } from 'store-operations-ui'
import { schema } from './config'
import { useRouter } from 'vue-router'
import BusinessModal from '@/components/businessModal/businessModal'
import { BusinessModalType } from '@/components/businessModal/businessModal.type'
import { ref } from 'vue'
import { request } from 'store-request'
import { formatMoney } from '@/utils'

const router = useRouter()

const open = ref(false)
const title = ref('营业额详情')
const formState = ref({})

const getList = (data: any) =>
  request
    .request({
      url: '/report/turnover/list',
      method: 'post',
      data
    })
    .then((res: any) => {
      const returnData = {
        ...(res || {}),
        rows: res?.rows?.map((item) => {
          const payMethodInfoMap = Object.fromEntries(
            item?.payMethodInfo?.map((i) => [i?.payMethodKey, i?.totalPayPrice])
          )

          return {
            ...item,
            payMethodInfoMap
          }
        })
      }
      return returnData
    })

const goAdd = () => {
  router.push('/operation/add')
}
</script>
