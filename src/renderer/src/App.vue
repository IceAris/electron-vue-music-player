<script setup>
import { ref } from 'vue'

const currentSong = ref('')

async function ImportandPlaymusic() {
  const fileurl = await window.ImportandPlaymusicAPI.openFileDialog()
  if (fileurl) {
    currentSong.value = fileurl
  }
}


</script>

<template>
  <div>
    <p style="text-align: center">Music Player</p>
    <div class="button_continer">
      
      <button @click="ImportandPlaymusic">Import and Play Music</button>
    </div>
  </div>

  <!-- 动态绑定 src -->
  <audio v-if="currentSong" :src="currentSong" controls autoplay class="audio-player"></audio>
</template>

<!-- 样式必须放在单独的 style 标签内 -->
<style scoped>
.button_continer {
  display: flex;
  justify-content: center;
  gap: 10px;
 
}

.audio-player {
  display: block;
  margin: 20px auto 0 auto; /* 居中显示播放器 */
}
</style>