<!-- LanguageSwitcher.vue -->
<template>
  <div>
    <button @click="switchLanguage('en')">English</button>
    /
    <button @click="switchLanguage('zh')">Chinese</button>
  </div>
</template>

<script>
export default {
  methods: {
    switchLanguage(locale) {
      this.$i18n.locale = locale;
    }
  }
}
</script>