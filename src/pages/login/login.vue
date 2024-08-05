<template>
  <div class="login-wrapper">
    <div class="login-content">
      <Form
        autocomplete="off"
        name="login"
        @onFinishFailed="(value) => console.log(value)"
        class="login-form"
      >
        <div class="login-title text-[#363441] text-[22px] font-bold mb-[30px]">
          <div class="mt-[10px] flex items-center justify-center">
            <span
              :class="`login-tab ${
                loginType === 'userName' && ' loginActiveTab'
              }`"
              @click="() => changeLoginTye('userName')"
              >账号登录</span
            >
            <!-- <div class="w-[1px] h-[16px] bg-slate-600 mx-[20px]" /> -->
            <!-- <span
                :class="`login-tab ${
                  loginType === 'phone' && ' loginActiveTab'
                }`"
                @click="() => changeLoginTye('phone')"
                >手机号登陆</span
              > -->
          </div>
        </div>
        <Form.Item v-bind="validateInfos.account" name="account">
          <Input
            :label="configs.namePlaceholder"
            class="login-input"
            v-model:value="formState.account"
            placeholder="请输入用户名"
            size="large"
          >
            <template #prefix> <user-outlined /> </template>
            ></Input
          >
        </Form.Item>
        <Form.Item v-bind="validateInfos.password" name="password">
          <Input.Password
            :label="configs.passwordPlaceholder"
            class="login-input"
            type="password"
            placeholder="请输入密码"
            v-model:value="formState.password"
            size="large"
          >
            <template #prefix> <user-outlined /> </template>
            <template #suffix v-if="!isAccount">
              <span
                class="cursor-pointer text-primary text-[12px]"
                @click="getCode"
                >{{
                  counter < count && counter > 0
                    ? count - counter
                    : '获取验证码'
                }}</span
              >
            </template>
            >
          </Input.Password></Form.Item
        >
        <Form.Item>
          <Button
            type="primary"
            class="w-[100%] h-[40px] mt-[20px] rounded-[6px]"
            htmlType="submit"
            :loading="loginLoading"
            @click="onFinish"
            >登录</Button
          >
        </Form.Item>
      </Form>
      <div class="login-desc"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue'
import { computed, reactive, ref, watch } from 'vue'
import { Button, Form, Input } from 'ant-design-vue'
import { useInterval } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { Storage } from 'wa-utils'
import { loginRequest } from '@/service/user'

const router = useRouter()

const props = defineProps({
  onFinish: Function,
  getCode: Function,
  loginAfter: Function
})

interface FormState {
  account: string
  password: string
  agree: boolean
}

const formState = reactive<FormState>({
  account: '',
  password: '',
  agree: true
})

const accountConfigs = {
  namePlaceholder: '请输入用户名称',
  passwordPlaceholder: '请输入登录密码',
  title: '账号登录 USER LOGIN',
  checkText: '手机号登陆'
}

const phoneConfigs = {
  namePlaceholder: '请输入手机号码',
  passwordPlaceholder: '请输入验证码',
  title: '手机号登录 USER LOGIN',
  checkText: '账号登陆'
}

const loginType = ref('userName')
const loginLoading = ref(false)
const storage = new Storage('local')

const configs = computed(() => {
  const isAccount = loginType.value === 'userName'
  return isAccount ? accountConfigs : phoneConfigs
})

const rulesRef = computed(() => ({
  account: [
    {
      required: true,
      message: configs.value.namePlaceholder
    }
  ],
  password: [
    {
      required: true,
      message: configs.value.passwordPlaceholder
    }
  ]
}))

const count = 61

const intervalData = useInterval(1000, { controls: true })

const useForm = Form.useForm
const { validateInfos, clearValidate, validate } = useForm(formState, rulesRef)

const { counter, reset, pause, resume } = intervalData

pause()

const getCode = () => {
  validate(['account']).then(() => {
    if (props.getCode) {
      props
        .getCode(formState)
        .then(() => {
          resume()
        })
        .catch(() => {})
    }
  })
}

watch(counter, () => {
  if (counter.value >= count) {
    pause()
    reset()
  }
})

const changeLoginTye = (type: 'userName' | 'phone') => {
  clearValidate()
  loginType.value = type
}

const onFinish = () => {
  validate(['account', 'password']).then((value) => {
    loginRequest(value)
      .then((res) => {
        storage.set('cToken', res?.data?.accessToken)
        router.push('/home')
      })
      .catch((err) => {})
  })
}

const isAccount = computed(() => {
  return loginType.value === 'userName'
})

watch([formState.agree, formState.password], () => {
  if (formState.agree) {
  }
})

const imgCodeUrl = ref('')
const uuid = ref('')
</script>

<style lang="scss">
.login-wrapper {
  width: 100vw;
  height: 100vh;
  overflow: auto;
  user-select: none;
}
.login-content {
  width: 100%;
  height: 100%;
  background-image: url('../assets/loginBanner.jpg');
  background-size: cover;
  background-position: 0 center;
  min-width: 1366px;
  min-height: 756px;
  position: relative;
  padding: 0;
  * {
    box-sizing: border-box;
  }
  .login-form {
    position: absolute;
    background: #fff;
    padding: 30px 80px;
    border-radius: 16px;
    width: 540px;
  }
}

.login-tab {
  font-size: 20px;
  color: #6e7da6;
  cursor: pointer;
}

.loginActiveTab {
  @apply text-primary;
}

.login-input {
  border-radius: 6px;
  width: 100%;
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-transition-delay: 99999s;
  -webkit-transition:
    color 99999s ease-out,
    background-color 99999s ease-out;
}

.login-desc {
  position: absolute;
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);
  &::after {
    width: 100%;
    display: block;
    content: '日新月异公司 版权所有 ICP备: 系统版本号V1.2.0';
    color: #fff;
    text-align: center;
  }
}
</style>
