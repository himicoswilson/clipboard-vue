<template>
  <div class="container">
    <header>
      <div :class="{ select: !isFile }" class="clipboardBtn" @click="showClipboard">剪切板</div>
      <div :class="{ select: isFile }" class="filesBtn" @click="showFiles">文件夹</div>
      <div :style="{ '--margin-left': marginLeftValue }" class="hoverBg"></div>
    </header>
    <ClipboardList v-if="!isFile" />
    <FileList v-if="isFile" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isFile = ref(false)
const marginLeftValue = ref('0.5px')

const showClipboard = () => {
  isFile.value = false
  marginLeftValue.value = '0.5px'
}

const showFiles = () => {
  isFile.value = true
  marginLeftValue.value = '75px'
}
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
header {
  width: 160px;
  height: 39px;
  position: fixed;
  bottom: 20px;
  right: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #000;
  border-radius: 20px;
  border: 2px solid #000;
  box-shadow: 0 0 5px var(--color-white);
  cursor: pointer;
  z-index: 10000;
  .clipboardBtn,
  .filesBtn {
    transition: 0.4s;
    z-index: 1;
    color: #fff;
    line-height: 39px;
    width: 80px;
    display: flex;
    justify-content: center;
  }
  .hoverBg {
    width: 80px;
    height: 34px;
    background-color: #fff;
    transition: 0.4s;
    border-radius: 20px;
    position: absolute;
    margin-left: var(--margin-left);
  }
  .select {
    color: #000;
  }
}
</style>
