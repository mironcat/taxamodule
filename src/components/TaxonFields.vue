<script setup>
import Dropdown from 'primevue/dropdown';
const props = defineProps({
  currentTaxon: {
    type: Object,
    required: true,
  },
});
const TaxonRanking = [
  { name: 'SPECIES', code: 'SPECIES' },
  { name: 'GENUS', code: 'GENUS' },
  { name: 'FAMILY', code: 'FAMILY' },
  { name: 'ORDER', code: 'ORDER' },
];
</script>
<template>
     <div class="p-fluid formgrid grid">
      <div class="field col-12 md:col-10">
        <h5 align="left">scientificName</h5>
        <InputText type="text" v-model="currentTaxon.scientificName" />
      </div>

      <div class="field col-12 md:col-2">
        <h5>Rank</h5>
        <Dropdown
          v-model="currentTaxon.taxonRank"
          :options="TaxonRanking"
          optionLabel="name"
          optionValue="code"
          placeholder="Taxon rank"
        />
      </div>
      <div class="field col-12 md:col-4">
        <h5 align="left">Kingdom</h5>
        <InputText type="text" v-model="currentTaxon.kingdom" />
      </div>

      <div class="field col-12 md:col-4">
        <h5 align="left">Phylum</h5>
        <InputText type="text" v-model="currentTaxon.phylum" />
      </div>

      <div class="field col-12 md:col-4">
        <h5 align="left">Family</h5>
        <InputText type="text" v-model="currentTaxon.family" />
      </div>
      <div class="field col-12 md:col-6">
        <h5 align="left">Genus</h5>
        <InputText type="text" v-model="currentTaxon.genus" />
      </div>
      <div class="field col-12 md:col-6">
        <h5 align="left">Canonical name</h5>
        <InputText type="text" v-model="currentTaxon.canonicalName" />
      </div>
      <div class="field col-12">
        <h5>GBIF search tool</h5>
        <!-- autocomplete -->
              <slot></slot> 
        <!--   -------  -->
      </div>
    </div>
</template>