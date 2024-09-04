// src/i18n.js
import { createI18n } from 'vue-i18n'; // 使用 Vue 3
// import VueI18n from 'vue-i18n'; // 使用 Vue 2

import en from './locales/en.json';
import zh from './locales/zh.json';

const messages = {
    en,
    zh
};

const i18n = createI18n({
    locale: 'en', // 设置默认语言
    fallbackLocale: 'en', // 设置回退语言
    messages
});

// 如果使用 Vue 2
// const i18n = new VueI18n({
//   locale: 'en',
//   fallbackLocale: 'en',
//   messages
// });

export default i18n;