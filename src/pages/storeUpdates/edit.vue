<template>
  <FormCard
    :title="'新建门店动态'"
    :footer="{ cancel: true, submit: true }"
    className="formCard"
    :onSubmit="onSubmit"
    :onCancel="() => router.go(-1)"
  >
    <template #content>
      <Form ref="formRef" :model="formState" layout="vertical">
        <a-form-item
          label="动态标题"
          name="title"
          :rules="[{ required: true, message: '请输入标题' }]"
          ><Input v-model:value="formState.title"
        /></a-form-item>
        <a-form-item label="封面图片" name="image"
          ><a-upload
            v-model:value="formState.image"
            list-type="picture-card"
            name="image"
            :show-upload-list="false"
            :customRequest="
              async (e, ...o) => {
                const file = e.file
                const key = file?.uid || ''
                await cos.uploadFile({
                  Bucket,
                  Region,
                  Body: file,
                  Key: `${key}${file?.name || ''}`
                })
                formState.image = `https://rxyy-1318831585.cos.ap-shanghai.myqcloud.com/${key}${
                  file?.name || ''
                }`
              }
            "
            ><img
              v-if="formState.image"
              :src="formState.image"
              alt="avatar"
              style="width: 100%"
            />
            <div v-else>上传图片</div></a-upload
          >
        </a-form-item>
        <a-form-item
          label="内容"
          name="valueHtml"
          :rules="[{ required: true, message: '请输入内容' }]"
          ><Input
            v-model:value="formState.valueHtml"
            style="display: none" /></a-form-item
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
import { Input, Form } from 'ant-design-vue'
import { FormCard } from 'store-operations-ui'
import useCors from '@/hooks/useCors'
import { nanoid } from 'nanoid'
import { useRouter } from 'vue-router'

export default {
  components: { Editor, Toolbar, Input, Form, FormCard },
  props: {
    defaultValue: String
  },
  setup(props) {
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef()
    const { cos, Bucket, Region } = useCors()

    const router = useRouter()

    const formState = ref({
      title: '',
      image: '',
      valueHtml: ''
    })
    const formRef = ref()
    // 内容 HTML

    // https://www.cnblogs.com/-roc/p/16400965.html
    const toolbarConfig = {
      excludeKeys: [
        'insertVideo',
        'uploadVideo',
        'editVideoSize',
        'group-video'
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
        await cos.uploadFile({
          Bucket,
          Region,
          Body: file,
          Key: `${key}${file?.name || ''}`
        })
        const fileUrl = `https://rxyy-1318831585.cos.ap-shanghai.myqcloud.com/${key}${
          file?.name || ''
        }`
        insertFn(fileUrl)
      }
    }
    const editorConfig = {
      placeholder: '请输入内容...',
      MENU_CONF: {
        uploadImage: uploadConfig
      }
    }

    onMounted(() => {
      console.log('start')
    })

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
      console.log(toRaw(formRef.value.validateFields), 'formRef')
      formRef.value.validateFields().then((res) => {
        console.log(res, 'rrrrrr')
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
      router
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
}
</style>
