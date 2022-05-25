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
      <h5>Canonical name</h5>
      <div class="p-inputgroup">
        <InputText type="text" v-model="currentTaxon.canonicalName" />
        <Button
          class="p-button-outlined p-button-success"
          label="g"
          @click="$emit('searchTaxon', currentTaxon.canonicalName)"
        />
      </div>
    </div>
    <div class="field col-12 md:col-2">
      <h5>Rank</h5>
      <Dropdown
        align="left"
        v-model="currentTaxon.taxonRank"
        :options="TaxonRanking"
        optionLabel="name"
        optionValue="code"
        placeholder="Taxon rank"
      />
    </div>
    <div class="field col-12 md:col-8">
      <h5>scientificName</h5>
      <InputText type="text" v-model="currentTaxon.scientificName" />
    </div>

    <div class="field col-12 md:col-4">
      <h5>Genus</h5>
      <div class="p-inputgroup">
        <InputText type="text" v-model="currentTaxon.genus" />
        <Button
          class="p-button-outlined p-button-success"
          label="g"
          @click="$emit('searchTaxon', currentTaxon.genus)"
        />
      </div>
    </div>
    <div class="field col-12 md:col-4">
      <h5>Kingdom</h5>
      <InputText type="text" v-model="currentTaxon.kingdom" />
    </div>

    <div class="field col-12 md:col-4">
      <h5>Phylum</h5>
      <InputText type="text" v-model="currentTaxon.phylum" />
    </div>

    <div class="field col-12 md:col-4">
      <h5>Family</h5>
      <InputText type="text" v-model="currentTaxon.family" />
    </div>

    <div class="field col-12">
      <h5>GBIF search tool</h5>
      <!-- autocomplete -->
      <slot></slot>
      <!--   -------  -->
    </div>
  </div>
</template>
<style lang="scss" scoped>
h5 {
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
  text-align: left;
}
</style>
