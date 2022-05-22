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
  <TaxaComplete :sourceTaxon="sourceTaxon" mode="view" />
  <p>
    <Button label="new" />
    <Button label="edit" @click="getTaxonByID(2)" />
  </p>
  <pre>{{ sourceTaxon }}</pre>    
</template>