<template>
  <TableRender
    :schema="schema"
    :request="store.loginList"
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
        class="flex justify-center items-center"
      >
        <a
          type="link"
          class="table-btn text-green-200"
          @click="() => router.push(`/updates/edit/${data.record.id}`)"
          >发布</a
        >
        <a
          type="link"
          class="table-btn"
          @click="() => router.push(`/updates/edit/${data.record.id}`)"
          >编辑</a
        >
        <a type="link" class="table-btn" @click="() => (open = true)">详情</a>
        <a-popconfirm
          title="是否确认删除"
          :onConfirm="() => onDelete(data.record?.id)"
        >
          <a type="link" class="table-btn-danger">删除</a>
        </a-popconfirm>
      </div>
      <template v-else>{{ data.text }}</template>
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
</script>
