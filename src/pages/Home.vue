<script setup>
import { Directus } from '@directus/sdk';
const directus = new Directus('https://paleobot.mironcat.tk');
import Button from 'primevue/button';
import TaxaComplete from "../components/TaxaComplete.vue";
import { ref, watchEffect  } from "vue";
let sourceTaxon = ref({});
async function  getTaxonByID(id) {
      this.sourceTaxon = await directus.items('taxa').readOne(id);;
}

watchEffect(async () => {
  // this effect will run immediately and then
  // re-run whenever currentBranch.value changes
  sourceTaxon.value = await directus.items('taxa').readByQuery({
	limit: 100,
}).then(({data}) => data);
})



</script>
<template>
<ul>
    <li> <router-link to="/taxa">List of taxa</router-link> </li>
    <li> <router-link to="/taxa/1">Taxon 1</router-link> </li>
</ul>
  <pre>{{ sourceTaxon }}</pre>    
</template>