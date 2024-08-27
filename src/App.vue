<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import MenuBar from "@/components/MenuBar.vue";
import LeftMenuBar from "@/components/LeftMenuBar.vue";
import BottomMenuBar from "@/components/BottomMenuBar.vue";
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header class="menu-bar">
        <MenuBar msg=""></MenuBar>
      </el-header>
      <el-container class="main-container">
        <el-aside class="left-section">
          <LeftMenuBar></LeftMenuBar>
        </el-aside>
        <el-main class="right-section">
          <transition name="slide">
            <RouterView />
          </transition>
        </el-main>
      </el-container>
      <el-footer class="bottom-menu-bar">
        <BottomMenuBar></BottomMenuBar>
      </el-footer>
    </el-container>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.menu-bar {
  width: 100vw; /* Ensure MenuBar takes full viewport width */
  position: fixed; /* Keep MenuBar at the top */
  top: 0;
  left: 0;
  z-index: 1000; /* Ensure it's above other content */
  box-sizing: border-box;
  padding: 0; /* Reset padding to ensure full width */
}

.main-container {
  display: flex;
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
  padding-top: 56px; /* Adjust this value based on MenuBar height */
  background-color: #393838;
}

.left-section {
  width: 200px; /* Fixed width for left section */
  height: calc(100vh - 56px); /* Full height minus MenuBar height */
  position: fixed; /* Keep left-section fixed */
  top: 56px; /* Adjust this value based on MenuBar height */
  left: 0;
  background-color: #292828; /* Background color for left section */
  box-shadow: 2px 0 5px rgba(0,0,0,0.1); /* Optional shadow for visual separation */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  border-right: 1px solid #97989a;
}

.right-section {
  margin-left: 50px; /* Same width as left-section */
  width: calc(100% - 50px);
  padding: 0.2rem; /* Optional padding for main content */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

}

.bottom-menu-bar {
  display: none; /* Hidden by default */
  width: 100vw;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 -2px 5px rgba(0,0,0,0.1);
  background-color: #292828;
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

/* Responsive adjustments */
@media (max-width: 1024px) {
  .left-section {
    width: 150px;
  }
  .right-section {
    margin-left: 150px;
    width: calc(100% - 150px);
  }

  nav {
    font-size: 0.8rem;
  }
}

@media (max-width: 600px) {
  .main-container {
    width: 100%; /* Ensure main-container takes full width on mobile */
    flex-direction: column; /* Stack left and right sections vertically */
    background-color: #393838;
  }

  .left-section {
    display: none; /* Hide left-section on mobile */
  }

  .right-section {
    margin-left: 0;
    width: 100%; /* Ensure right-section takes full width on mobile */
  }

  .bottom-menu-bar {
    display: block; /* Show bottom menu bar on mobile */
  }

  nav {
    font-size: 0.8rem;
  }
}

@media (min-width: 600px) {
  .left-section {
    width: 200px;
  }
  .right-section {
    width: calc(100% - 200px);
    padding: 0 0 0 135px;
  }

  nav {
    font-size: 1rem;
  }
}
</style>