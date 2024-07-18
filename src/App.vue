<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import MenuBar from "@/components/MenuBar.vue";
</script>

<template>
  <div class="container_bar">
    <MenuBar msg=""></MenuBar>
  </div>
  <div class="container">
    <header>
      <div class="left-section">
        <!-- Your content here -->
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
.container_bar {
  display: flex;
  flex-direction: column;
  width: 100vw; /* Ensure container takes full viewport width */
  box-sizing: border-box;
  position: fixed; /* Keep MenuBar at the top */
  top: 0;
  left: 0;
  z-index: 1000; /* Ensure it's above other content */
}

/* Add padding to the top of the container to avoid overlap with fixed MenuBar */
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
  padding-top: 20px; /* Adjust this value based on MenuBar height */
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
  gap: 1rem;
  margin-left: 2%;
}

.right-section {
  width: 100rpx;
  margin-left: auto;
}

.logo {
  width: 50px;
  height: 50px;
  align-self: center;
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
    align-self: center;
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
    width: 10px;
    height: 10px;
  }

  nav {
    font-size: 0.8rem;
  }

  main {
    height: 100%;
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
    align-self: center;
  }

  main {
    height: 90%;
  }
}
</style>