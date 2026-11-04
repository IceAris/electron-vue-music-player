<!-- login.vue -->
<template>
  <div>
    <h1>Login</h1>
    <div>
      賬號: <input v-model="username" type="text" placeholder="請輸入賬號" />
      密碼: <input v-model="password" type="password" placeholder="請輸入密碼" />
      <button @click="handleLogin">登入</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 1. 定義向外傳遞的事件
const emit = defineEmits(['login-success'])

const username = ref('')
const password = ref('')
const loading = ref(false) // 做个防重复点击的开关

async function handleLogin() {
  // 1. 先做基础的前端非空校验，省得白跑一趟主进程
  if (!username.value || !password.value) {
    alert('请输入账号和密码')
    return
  }

  loading.value = true

  try {
    // 2. 核心：通过刚才搭建的桥，向主进程发起查库验证！
    const isSuccess = await window.authAPI.login(username.value, password.value)

    if (isSuccess) {
      // 验证通过，通知 App.vue 把 isLoggedIn 改为 true，切换到播放器页面
      emit('login-success')
    } else {
      // 数据库里查无此人或密码错误
      alert('账号或密码错误')
    }
  } catch (err) {
    console.error('通信或主进程出错:', err)
    alert('登录失败，系统异常')
  } finally {
    loading.value = false
  }
}
</script>