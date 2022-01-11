<template>
  <div>
    <img alt="Vue logo" src="./assets/logo.png" />
    <h2>validate-model example</h2>
    <VFormData1 />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FormData1 from './components/FormData1/index.vue';

export default defineComponent({
  components: {
    VFormData1: FormData1,
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
