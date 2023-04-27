<script setup>
import './scss/index.scss'
import { useFinDoxStore } from './stores/findox'
import { onMounted } from 'vue'

const finDoxStore = useFinDoxStore()

onMounted(() => {
  finDoxStore.getData()
})
</script>

<template>
  <div class="wrapper">
    <div v-if="finDoxStore.loading" class="loader">LOADING Data</div>
    <!-- Keep it alive so the UX is better when goint to documents -->
    <router-view v-else v-slot="{ Component }">
      <keep-alive include="DealsView">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<style scoped>
.wrapper {
  padding: 2rem;
}
</style>
