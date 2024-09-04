<template>
  <el-row class="tac">
    <el-col :span="24">
      <el-menu
          active-text-color="#ffd04b"
          background-color="#292828"
          class="el-menu-vertical-demo"
          default-active="2"
          text-color="#fff"
          :default-openeds="['6']"
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
        <el-sub-menu index="6">
          <template #title>
            <el-icon><location /></el-icon>
            <span>写作助手</span>
          </template>
          <el-menu-item-group title="翻译大师">
            <el-menu-item index="6-1">中-英</el-menu-item>
            <el-menu-item index="6-2">英-中</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="润色大师">
            <el-menu-item index="6-3">学术论文润色(中)</el-menu-item>
            <el-menu-item index="6-4">学术论文润色(英)</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-menu-item index="2">
          <el-icon><icon-menu /></el-icon>
          <span>聊天助手（本地）</span>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon><icon-menu /></el-icon>
          <span>超级写作Agent</span>
        </el-menu-item>
        <el-menu-item index="7">
          <el-icon><icon-menu /></el-icon>
          <span>学术PDF转换助手</span>
        </el-menu-item>
        <el-menu-item index="5" disabled>
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
  <div class="version-info">
    <a href="https://vue-jrchat.hk.cpolar.io/home" target="_blank" style="color: #999;">版本号: v1.0.0</a>
  </div>
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
  if (key === '6-1') {
    router.push('/ch_to_en')
  }
  if (key === '6-2') {
    router.push('/en_to_ch')
  }
  if (key === '6-3') {
    router.push('/polishing_ch')
  }
  if (key === '6-4') {
    router.push('/polishing_en')
  }
  if (key === '7') {
    router.push('/pdf_translator')
  }
}
</script>

<style scoped>
.el-menu-vertical-demo {
  padding: 0;
  border: none;
}

.version-info {
  position: fixed;
  bottom: 0;
  left: 100px;
  transform: translateX(-50%);
  width: fit-content;
  padding: 10px;
  /* background-color: rgba(0, 0, 0, 0.5); */
  color: #fff;
  font-size: 15px;
}
</style>