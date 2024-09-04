<template>
  <div class="common-layout">
    <iframe
        src="https://marker-pdf-jr.nas.cpolar.cn/"
        frameborder="0"
        class="embedded-page"
        scrolling="no"
    ></iframe>
  </div>
</template>


<script lang="ts" setup>
import { onMounted } from "vue";

onMounted(() => {
  // Any additional setup logic
});
</script>

<style scoped>
.common-layout {
  height: 100vh;
  width: 88vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.embedded-page {
  flex-grow: 1;
  width: 100%;
  height: 100%;
  border: none;
}

@media (max-width: 768px) {
  .common-layout {
    width: 100vw;
    margin-left: 0;
  }
}
</style>
