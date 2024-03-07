<template>
  <TableRender
    :schema="schema"
    :request="store.loginList"
    :tableProps="{ scroll: { x: 1600 } }"
  >
    <template #bodyCell="{ data }">
      <div
        v-if="data?.column?.dataIndex === 'options'"
        class="flex justify-center items-center"
      >
        <a
          type="link"
          class="table-btn"
          @click="() => edit(data.record, 'edit')"
          >编辑</a
        >
        <a
          type="link"
          class="table-btn last"
          @click="() => edit(data.record, 'view')"
          >查看</a
        >
      </div>
      <template v-else>{{ data.text }}</template>
    </template>
  </TableRender>
  <BusinessModal
    :type="BusinessModalType.门店详情"
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

const open = ref(false)
const formState = ref({})
const type = ref<'view' | 'edit'>('view')

const edit = (data: any, t: 'view' | 'edit') => {
  open.value = true
  formState.value = { ...data, modalType: t }
  type.value = t
}

const onFinish = () => {}

const store = new Store()
</script>
