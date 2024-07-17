<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="greetings">
    <div class="text-container">
      <h1 class="green">{{ msg }}</h1>
      <h3 class="welcome">
        欢迎来到JRchat
      </h3>
    </div>
  </div>
</template>

<style scoped>
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