<script setup lang="ts">
import { ref } from 'vue'
import {RouterLink} from "vue-router";
const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
defineProps<{
  msg: string
}>()
</script>

<template>
  <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      :ellipsis="false"
      background-color="#343537"
      text-color="#fff"
      active-text-color="#ffd04b"
      @select="handleSelect"
  >
    <el-menu-item index="0">
      <img
          style="width: 35px; height: 35px;"
          src="/logo.png"
          alt="Element logo"
      />
      <p style="font-size: 18px; margin-left: 5px">{{ $t('app_name') }}</p>
    </el-menu-item>
    <div class="flex-grow" />
    <el-menu-item index="1">{{ $t('ai_tools') }}</el-menu-item>
    <el-sub-menu index="2">
      <template #title>{{ $t('user_info') }}</template>
      <el-menu-item index="2-1">开发中</el-menu-item>
      <el-menu-item index="2-2">开发中</el-menu-item>
      <el-menu-item index="2-3">开发中</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>开发中</template>
        <el-menu-item index="2-4-1">开发中</el-menu-item>
        <el-menu-item index="2-4-2">开发中</el-menu-item>
        <el-menu-item index="2-4-3">开发中</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
  </el-menu>

</template>

<style scoped>
.el-menu-demo {
  width: 100%;
}
.flex-grow {
  flex-grow: 1;
}
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings {
  display: flex;
  justify-content: center; /* 中心对齐整个greetings容器 */
}

.text-container {
  text-align: center; /* 中心对齐文本容器内的文本 */
}

@media (min-width: 1024px) {
  .text-container {
    text-align: left;
  }
}

@media (max-width: 768px) {
  .greetings {
    display: flex;
    flex-direction: row;
    justify-content: left;
  }

  h1 {
    font-size: 1.7rem; /* 调整字体大小 */
  }

  h3 {
    display: none; /* 隐藏h3 */
  }
}
</style>