<script setup lang="ts">
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'
</script>

<template>
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>关于我们</template>


    <a href="https://vuejs.org/" target="_blank" rel="noopener">小悬AI助手是由JR-AI开发的生成式AI助手，目前仅作为科研研究使用</a>
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>注意事项</template>

    该项目仅用于科研研究使用，请勿用于生成非法内容
  </WelcomeItem>

</template>
