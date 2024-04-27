<template>
  <TableRender
    :schema="schema"
    ref="tableRef"
    :request="
      (e: any) =>
        store.storedYnamics({
          ...(e || {}),
          pageNum: e?.pageNum ?? 1,
          pageSize: e?.pageSize || 10
        })
    "
    :tableProps="{ scroll: { x: 1600 } }"
  >
    <template #formButton
      ><a-button type="primary" class="ml-[10px]" :onClick="goAdd"
        >新建门店动态</a-button
      ></template
    >
    <template #bodyCell="{ data }">
      <div
        v-if="data?.column?.dataIndex === 'options'"
        class="flex justify-start items-center"
      >
        <a-popconfirm
          v-if="statusBtn?.[data?.record?.status]"
          :title="`是否确认${statusBtn?.[data?.record?.status]}`"
          :onConfirm="() => clickMain(data.record)"
          ><a
            type="link"
            class="table-btn text-green-200"
            :style="{ color: statusColorBtn?.[data?.record?.status] }"
            >{{ statusBtn?.[data?.record?.status] }}</a
          ></a-popconfirm
        >

        <a
          type="link"
          v-if="data?.record?.status === 'DRAFT'"
          class="table-btn"
          @click="() => router.push(`/stores/updates/edit/${data.record.id}`)"
          >编辑</a
        >
        <a
          type="link"
          class="table-btn"
          @click="
            () => {
              open = true
              edit(data.record, 'view')
            }
          "
          >详情</a
        >
      </div>
      <template v-else-if="data?.column?.dataIndex === 'status'">{{
        statusMap?.[data?.record?.status] || ''
      }}</template>
      <template v-else>{{ data.customer }}</template>
    </template>
  </TableRender>
  <BusinessModal
    :type="BusinessModalType.动态详情"
    :open="open"
    :formState="formState"
    :onFinish="onFinish"
    :onCancel="() => (open = false)"
  />
</template>

<script lang="ts" setup>
import { TableRender } from 'store-operations-ui'
import { schema } from './config'
import { Store } from 'store-request'
import BusinessModal from '@/components/businessModal/businessModal'
import { BusinessModalType } from '@/components/businessModal/businessModal.type'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const open = ref(false)
const formState = ref({})
const type = ref<'view' | 'edit'>('view')
const router = useRouter()
const tableRef = ref()

const edit = (data: any, t: 'view' | 'edit') => {
  open.value = true
  formState.value = { ...data, modalType: t }
  type.value = t
}

const goAdd = () => {
  router.push('add')
}

const onFinish = () => {}

const store = new Store()

const onDelete = (id: number) => {}
const statusMap = {
  DRAFT: '待发布',
  ACTIVITY: '已发布',
  INACTIVITY: '已下架'
} as Record<any, string>

const statusBtn = {
  DRAFT: '发布',
  ACTIVITY: '下架'
} as Record<any, string>

const statusColorBtn = {
  DRAFT: 'orange',
  ACTIVITY: 'red'
} as Record<any, string>

const clickMain = async (data: any) => {
  if (data.status === 'DRAFT') {
    await store.storedYnamiPublish({
      id: data.id
    })
  }
  if (data.status === 'ACTIVITY') {
    await store.storedYnamiRemove({
      id: data.id
    })
  }

  tableRef.value.run(tableRef.value.params?.[0])
}
</script>
