<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div class="container">
    <header>
      <div class="left-section">
        <img alt="Vue logo" class="logo" src="@/assets/logo.png" />
        <HelloWorld msg="JRchat" />
      </div>
      <div class="right-section">
        <nav>
          <RouterLink to="/about">聊天</RouterLink>
          <RouterLink to="/home">说明</RouterLink>
        </nav>
      </div>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%; /* Ensure container takes full width */
  box-sizing: border-box;
}

header {
  display: flex;
  width: 100%;
}

.right-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.left-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem; /* Add this line to create space between img and HelloWorld */
  margin-left: 2%;
}

.right-section {
  width: 100rpx;
  margin-left: auto;
}

.logo {
  width: 50px; /* Adjust as needed */
  height: 50px;
  align-self: center; /* Centers the logo vertically */
}

nav {
  width: 100%;
  font-size: 1rem;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

main {
  flex: 1;
  width: 100%;
}

@media (max-width: 1024px) {
  header {
    flex-direction: column;
    height: 15%;
  }

  .left-section, .right-section {
    width: 100%;
  }

  .logo {
    width: 50px;
    height: 50px;
    align-self: center; /* Centers the logo vertically */
  }

  nav {
    font-size: 0.8rem;
  }

  main {
    height: 80%;
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .left-section, .right-section {
    width: 100%;
    margin-left: 0;
  }

  .logo {
    width: 50px;
    height: 50px;
  }

  nav {
    font-size: 0.8rem;
  }

  main {
    height: 80%;
    justify-content: center;
  }
}

@media (min-width: 600px) {
  header {
    height: 10%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
  }

  .logo {
    width: 80px;
    height: 80px;
    align-self: center; /* Centers the logo vertically */
  }

  main {
    height: 90%;
  }
}
</style>