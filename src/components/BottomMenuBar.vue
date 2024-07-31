<template>
  <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      background-color="#292828"
      mode="horizontal"
      active-text-color="#ffd04b"
      text-color="#fff"
      @select="handleSelect"
  >
    <el-menu-item class="menu-text-class" index="1">聊天</el-menu-item>
<!--    <el-menu-item class="menu-text-class" index="3">联网Agent</el-menu-item>-->
    <el-menu-item class="menu-text-class" index="4">辩论Agent</el-menu-item>
    <el-menu-item class="menu-text-class" index="2">关于</el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const activeIndex = ref('1')
const router = useRouter()

const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
  if (key === '2') {
    router.push('/home')
  }
  if (key === '1') {
    router.push('/about')
  }
  if (key === '3') {
    router.push('/agent_search')
  }
  if (key === '4') {
    router.push('/agent_debate')
  }
}
</script>

<style scoped>
.el-menu-demo {
  padding: 0;
  border: none;
}
.menu-text-class {
  font-size: 14px;
  color: white;
}
</style>