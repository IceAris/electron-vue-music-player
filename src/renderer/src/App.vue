<!-- App.vue -->
<script setup>
import { ref } from 'vue'
import login from './login.vue'

// 登入狀態開關
const isLoggedIn = ref(false)

// 播放器相關資料
const playlist = ref([])
const currentSong = ref('')

async function ImportandPlaymusic() {
  // 調用你的 Electron 選擇檔案 API
  const fileurls = await window.ImportandPlaymusicAPI.openFileDialog()
  if (fileurls && fileurls.length > 0) {
    playlist.value = fileurls
    currentSong.value = playlist.value.shift() // 播放第一首
  }
}
</script>

<template>
  <!-- 1. 還沒登入：只顯示 login.vue -->
  <login v-if="!isLoggedIn" @login-success="isLoggedIn = true" />

  <!-- 2. 登入成功後：顯示播放器主功能區 -->
  <div v-else>
    <h2>歡迎進入音樂播放器！</h2>
    
    <button @click="ImportandPlaymusic">導入並播放</button>

    <div style="margin-top: 15px;">
      <!-- 字串非空就是 true，空字串就是 false -->
      <audio 
        v-if="currentSong" 
        :src="currentSong" 
        controls 
        autoplay 
        @ended="currentSong = playlist.shift() || ''"
      ></audio>
    </div>

    <br />
    <button @click="isLoggedIn = false">退出登入</button>
  </div>
</template>

<style scoped>
</style>