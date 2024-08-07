<template>
  <TableRender
    :schema="schema"
    :request="storeListRequest"
    :tableProps="{ scroll: { x: 1600 } }"
    ref="tableRef"
  >
    <!-- <template #formButton
      ><a-button type="primary" :onClick="goAdd" class="ml-[10px]"
        >新增门店</a-button
      ></template
    > -->
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
          >详情</a
        >
      </div>
      <template v-else>{{ data.text }}</template>
    </template>
  </TableRender>
</template>

<script lang="ts" setup>
import { TableRender } from 'store-operations-ui'
import { schema } from './config'
import { Store } from 'store-request'
import { ref } from 'vue'
import { storeListRequest } from '@/service/store'

const open = ref(false)
const formState = ref<any>({})
const type = ref<'view' | 'edit'>('view')
const tableRef = ref()

const edit = (data: any, t: 'view' | 'edit') => {
  open.value = true
  formState.value = {
    ...data,
    modalType: t,
    headquartersName: data.headquartersName
  }
  type.value = t
}

const store = new Store()
</script>
