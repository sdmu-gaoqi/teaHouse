<template>
  <FormCard
    :title="'新建门店动态'"
    :footer="{ cancel: true, submit: true }"
    className="formCard"
    :onSubmit="onSubmit"
    :onCancel="() => router.go(-1)"
    :submitLoading="submitLoading"
    :loading="loading"
  >
    <template #content>
      <Form ref="formRef" :model="formState" layout="vertical">
        <a-form-item
          label="动态标题"
          name="title"
          :rules="[{ required: true, message: '请输入标题' }]"
          ><Input v-model:value="formState.title"
        /></a-form-item>
        <a-form-item
          label="封面图片"
          name="image"
          required="true"
          :rules="[{ required: true, message: '请上传封面' }]"
          ><a-upload
            v-model:value="formState.image"
            list-type="picture-card"
            name="file"
            :show-upload-list="false"
            :action="`${ossOrigin}/file/uploadPic`"
            :headers="{
              Authorization: `Bearer ${storage.baseGet('Admin-Token')}`
            }"
            accept="image/jpg,image/png,image/jpeg"
            :before-upload="
              (data) => {
                if (data?.size / 1024 / 1024 > 10) {
                  message.error('图片不能超出10M')
                  return Promise.reject('图片不能超出10M')
                }
                return Promise.resolve()
              }
            "
            @change="
              (file) => {
                uoloadLoading = file?.file?.status === 'uploading'
                const isErr =
                  file?.file?.response?.code != 200 &&
                  file?.file?.status === 'done'
                if (isErr) {
                  message.error(file?.file?.response?.msg)
                  file.fileList?.pop()
                }
                if (file?.file?.response?.data?.filePath) {
                  formState.image = file?.file?.response?.data?.filePath
                }
                uoloadLoading = false
                return file
              }
            "
          >
            <img
              v-if="formState.image"
              :src="`${ossOrigin}${formState.image}`"
              alt="avatar"
              style="width: 100%"
            />
            <div v-if="uoloadLoading">
              <img :src="LoadingSvg" class="w-[50%]" />
              <div>上传中</div>
            </div>
            <div v-if="!uoloadLoading && !formState.image">上传图片</div>
          </a-upload>
        </a-form-item>
        <a-form-item
          label="内容"
          name="valueHtml"
          class="mb-0 contentField"
          :rules="[
            { required: true, message: '请输入内容' },
            {
              validator: (_, val) => {
                if (val === '<p><br></p>' || !val?.trim()) {
                  return Promise.reject('请输入内容')
                }
                return Promise.resolve()
              }
            }
          ]"
          ><Input
            v-model:value="formState.valueHtml"
            style="display: none; height: 0" /></a-form-item
        ><Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editorRef"
          :defaultConfig="toolbarConfig"
          :mode="mode"
        /><Editor
          style="height: 500px; overflow-y: hidden"
          v-model="formState.valueHtml"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="handleCreated"
        />
      </Form>
    </template>
  </FormCard>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, toRaw, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { Input, Form, message } from 'ant-design-vue'
import { FormCard } from 'store-operations-ui'
import useCors from '@/hooks/useCors'
import { nanoid } from 'nanoid'
import { useRoute, useRouter } from 'vue-router'
import { ossOrigin } from '@/constant'
import { Storage } from 'wa-utils'
import LoadingSvg from '@/assets/loading.svg'
import { Store, request } from 'store-request'

export default {
  components: { Editor, Toolbar, Input, Form, FormCard },
  props: {
    defaultValue: String
  },
  setup(props) {
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef()
    const { cos, Bucket, Region } = useCors()
    const store = new Store()
    const params = useRoute()?.params
    const isEdit = params?.type === 'edit'
    const id = params?.id
    const loading = ref(false)

    const router = useRouter()
    const storage = new Storage('local')

    onMounted(async () => {
      if (id) {
        loading.value = true
        try {
          const detail = await store.storedYnamiDetail({ id })
          console.log(detail, 'detail')
          formState.value = {
            title: detail?.data?.title,
            image: detail?.data?.coverFileUrl,
            valueHtml: detail?.data?.content
          }
        } catch (err) {
          loading.value = false
        }
      }
    })

    const formState = ref({
      title: '',
      image: '',
      valueHtml: ''
    })
    const formRef = ref()
    const uoloadLoading = ref(false)
    const submitLoading = ref(false)
    // 内容 HTML

    // https://www.cnblogs.com/-roc/p/16400965.html
    const toolbarConfig = {
      excludeKeys: [
        'insertVideo',
        'uploadVideo',
        'editVideoSize',
        'group-video',
        'fullScreen'
      ]
    }
    const uploadConfig = {
      // 自定义增加 http  header
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      // 自定义图片上传
      async customUpload(file, insertFn) {
        const key = nanoid() || ''
        console.log(file, 'file')
        const formData = new FormData()
        formData.append('file', file)
        const res = await request.request({
          url: '/file/uploadPic',
          method: 'post',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        const fileUrl = res?.data?.filePath
        insertFn(`${ossOrigin}${fileUrl}`)
      }
    }
    const editorConfig = {
      placeholder: '请输入内容...',
      MENU_CONF: {
        uploadImage: uploadConfig
      }
    }

    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor == null) return
      editor.destroy()
    })

    const handleCreated = (editor) => {
      editorRef.value = editor // 记录 editor 实例，重要！
    }

    const onSubmit = () => {
      formRef.value.validateFields().then(async (res) => {
        submitLoading.value = true
        try {
          if (!isEdit) {
            await store.storedYnamicAdd({
              content: res?.valueHtml,
              coverFileId: res?.image?.replace('/file/download/', ''),
              title: res?.title
            })
          } else {
            await store.storedYnamiUpdate({
              content: res?.valueHtml,
              coverFileId: res?.image?.replace('/file/download/', ''),
              title: res?.title,
              id
            })
          }
          submitLoading.value = false
          message.success('保存成功')
          router.push('/stores/updates/list')
        } catch (err) {
          submitLoading.value = false
        }
      })
    }

    return {
      editorRef,
      mode: 'default', // 或 'simple'
      toolbarConfig,
      editorConfig,
      handleCreated,
      onSubmit,
      formRef,
      formState,
      cos,
      Bucket,
      Region,
      router,
      storage,
      ossOrigin,
      uoloadLoading,
      LoadingSvg,
      Promise: Promise,
      submitLoading
    }
  }
}
</script>

<style lang="scss">
.formCard {
  .ant-card-body {
    .ant-form {
      padding: 20px 50px;
    }
  }
  .contentField {
    .ant-form-item-control-input {
      display: none;
    }
  }
}
</style>
