<template>
  <FormCard title="新增项目">
    <template #content>
      <FormRender
        :on-finish="onFinish"
        :on-cancel="onCancel"
        :schema="editSchema"
        className="pro-form"
        rowClassName="pro-form-row"
        bodyClassName="project-body"
        finishBefore="确认提交此菜品信息吗"
      >
        <template #left>
          <ProjectType
            className="w-[250px]"
            :edit="true"
            ref="treeRef"
          ></ProjectType>
        </template>
      </FormRender>
    </template>
  </FormCard>
</template>

<script lang="ts" setup>
import { FormRender, FormCard } from 'store-operations-ui'
import { editSchema } from './config'
import { useRoute, useRouter } from 'vue-router'
import { debounce, sleep } from 'wa-utils'
import { message } from 'ant-design-vue'
import { useStore } from 'vuex'
import ProjectType from '@/components/ProjectType/projectType'
import { onMounted, ref } from 'vue'
import { ParamsAddGood } from '@/service/typing'
import { addGoodREquest } from '@/service/goods'

const {
  params: { id }
} = useRoute()
const isEdit = !!id
const store = useStore()
const treeRef = ref()

const schema = editSchema
// @ts-ignore
schema.properties.store.defaultValue =
  store?.state?.userInfo?.userInfo?.currentStoreName

const router = useRouter()

// onMounted(async () => {
//   if (id) {
//     const res = await good
//   }
// })

const onFinish = async (value: ParamsAddGood) => {
  // if (!isEdit) {
  //   await addGoodREquest()
  // } else {
  //   await request.request({
  //     url: '/admin-api/admin-api/goods/update',
  //     data: value,
  //     method: 'post'
  //   })
  // }
  await addGoodREquest(value)
  message.success('保存成功')
  await sleep(300)
  router.back()
}

const onCancel = debounce(() => {
  router.back()
})
</script>

<style lang="scss">
.pro-form {
  .wa-form-render {
    display: flex;
  }
  .op-ui-form-render-body {
    padding-top: 0;
  }
  .wa-form-render > div {
    padding: 20px 10px;
  }
  .pro-form-row {
    flex: 1;
    padding-left: 50px !important;
    border-left: 1px solid #eee;
  }
  .project-body {
    padding-left: 0;
  }
}
</style>
