<template>
  <div class="m-auto flex h-[100%] justify-center items-center bg-[#eff0f4]">
    <Login
      ref="loginRef"
      class="m-auto"
      :get-code="getCode"
      :login-after="onFinish"
    ></Login>
  </div>
</template>

<script setup lang="ts">
import store from '@/store/store'
import { Login } from 'store-operations-ui'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import user from '../../servers/user'
import { transformRoute } from '@/utils/menu'

const { dispatch } = store
const router = useRouter()

const loginRef = ref(undefined)

interface FormState {
  account: string
  password: string
  code: string
  agree: boolean
  imgCode: string
  uuid?: string
}

const onFinish = (res: any) => {
  const urlSearch = new URLSearchParams(location.search)
  dispatch('userInfo/changeUser', { data: res.user })
  dispatch('userInfo/setPerms', { data: res.permissions })
  dispatch('common/changeMenus', { data: res.permissions })
  transformRoute(res.permissions)
  const oldStr = urlSearch.toString()
  urlSearch.set('storeCode', res?.user?.currentStoreCode)
  const newStr = urlSearch.toString()
  const newHref = `${location.origin}/?${newStr}#/`
  if (oldStr === newStr) {
    location.reload()
  } else {
    location.href = newHref
  }
}

const getCode = (value: FormState) => {
  return Promise.resolve()
}

onMounted(async () => {})
</script>
