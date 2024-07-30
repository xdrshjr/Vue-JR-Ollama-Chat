<template>
  <el-row class="tac">
    <el-col :span="24">
      <el-menu
          active-text-color="#ffd04b"
          background-color="#292828"
          class="el-menu-vertical-demo"
          default-active="2"
          text-color="#fff"
          @open="handleOpen"
          @close="handleClose"
          @select="handleSelect"
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon><location /></el-icon>
            <span>AI画图</span>
          </template>
          <el-menu-item-group title="动漫画图">
            <el-menu-item index="1-1">动漫1</el-menu-item>
            <el-menu-item index="1-2">动漫2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="风格转换">
            <el-menu-item index="1-3">风格1</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-menu-item index="2">
          <el-icon><icon-menu /></el-icon>
          <span>聊天助手（本地）</span>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon><icon-menu /></el-icon>
          <span>聊天助手（联网AI）</span>
        </el-menu-item>
        <el-menu-item index="5">
          <el-icon><icon-menu /></el-icon>
          <span>辩论Agent</span>
        </el-menu-item>
        <el-menu-item index="3">
          <el-icon><icon-menu /></el-icon>
          <span>关于我们</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
import {useRouter} from "vue-router";
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const router = useRouter()

const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
  if (key === '3') {
    router.push('/home')
  }
  if (key === '2') {
    router.push('/about')
  }
  if (key === '4') {
    router.push('/agent_search')
  }
  if (key === '5') {
    router.push('/agent_debate')
  }
}
</script>

<style scoped>
.el-menu-vertical-demo {
  padding: 0;
  border: none;
}
</style>