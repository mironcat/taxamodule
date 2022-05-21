<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <!-- <HelloWorld msg="Hello Vue 3 + Vite" /> -->

  <TaxaComplete :sourceTaxon=sourceTaxon mode="view"/>
  <p> <Button label="new" /> </p>
</template>
<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
// import HelloWorld from './components/HelloWorld.vue'
import TaxaComplete from './components/TaxaComplete.vue';
import { ref } from "vue";
const sourceTaxon = ref({
  taxonRank:'',
  genus: "",
  kingdom: "",
  phylum: "",
  family: "",
  scientificName: "safas",  
});
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
