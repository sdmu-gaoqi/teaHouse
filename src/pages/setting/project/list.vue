<template>
  <TableRender :schema="schema" :request="goodsListRequest" ref="tableRef">
    <template #formButton
      ><a-button
        type="primary"
        :onClick="goAdd"
        class="ml-[10px]"
        v-if="editProject"
        >新增菜品</a-button
      ></template
    >
    <template #bodyCell="{ data }">
      <div
        v-if="data?.column?.dataIndex === 'options'"
        class="flex justify-center items-center"
      >
        <a
          type="link"
          class="table-btn"
          v-if="editProject"
          @click="
            () => {
              $router.push(`/project/edit/${data?.record?.id}`)
            }
          "
          >编辑</a
        >
        <a-popconfirm
          title="是否确认删除"
          v-if="editProject"
          :onConfirm="
            () => {
              common
                .deleteProject({
                  serviceProjectId: data.record.id,
                  serviceName: data.record.serviceName
                })
                .then(() => {
                  message.success('删除成功')
                  const params = {
                    ...(toRaw(tableRef.params?.[0]) || {}),
                    pageNum: 1
                  }
                  tableRef.run(params)
                })
            }
          "
          ><a type="link" class="table-btn-danger last" @click="() => {}"
            >删除</a
          ></a-popconfirm
        >
      </div>
      <template v-else-if="data.customer">{{ data.customer }}</template>
      <template v-else>{{ data.text }}</template>
    </template></TableRender
  >
  <BusinessModal
    :type="BusinessModalType.编辑菜品"
    :open="open"
    :onCancel="() => (open = false)"
    :formState="detail"
    :onFinish="onFinish"
  ></BusinessModal>
</template>

<script lang="ts" setup>
import { TableRender } from 'store-operations-ui'
import { schema } from './config'
import { useRouter } from 'vue-router'
import { CommonService } from 'store-request'
import { message } from 'ant-design-vue'
import { ref, toRaw } from 'vue'
import BusinessModal from '@/components/businessModal/businessModal'
import { BusinessModalType } from '@/components/businessModal/businessModal.type'
import { useAccess } from '@/hooks'
import request from '@/service'
import { goodsListRequest } from '@/service/goods'

const { editProject } = { editProject: true }

const open = ref(false)
const detail = ref<any>({})

const tableRef = ref()

const common = new CommonService()

const router = useRouter()
const goAdd = () => {
  router.push('/project/add')
}
const onFinish = async (value: any) => {
  await common.updateProject({
    ...value,
    serviceProjectId: detail.value?.id,
    ...(value?.image?.[0]?.response?.data?.fileId && {
      coverFileId: value?.image?.[0]?.response?.data?.fileId
    })
  })
  message.success('编辑成功')
  open.value = false
  tableRef.value?.reset?.()
}
</script>
