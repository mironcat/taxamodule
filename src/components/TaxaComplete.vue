<script setup>
import { ref } from "vue";
// import GbifService from '../services/GbifService';
import AutoComplete from "primevue/autocomplete";
import InputText from "primevue/inputtext";
import Panel from "primevue/panel";
import Dropdown from "primevue/dropdown";
const props = defineProps({
  sourceTaxon: {
    type: Object,
    required: true,
  },
});
const EmptyTaxon = {
  taxonRank:'',
  genus: "",
  kingdom: "",
  phylum: "",
  family: "",
  scientificName: "",  
};
const TaxonRanking =ref([
            {name: 'SPECIES', code: 'SPECIES'},
            {name: 'GENUS', code: 'GENUS'},
            {name: 'FAMILY', code: 'FAMILY'},
            {name: 'ORDER', code: 'ORDER'}
        ]);
const taxa = ref();
// const gbifService = ref(new GbifService());
const currentTaxon = ref(EmptyTaxon)
const selectedGenus = ref(EmptyTaxon);

const searchGenus = (event) => {
  setTimeout(() => {
    if (event.query.trim().length) {
      fetch(`//api.gbif.org/v1/species/suggest?q=${event.query.trim()}`)
        .then((res) => res.json())
        .then((d) => (taxa.value = d));
      // gbifService.value
      //   .getGenusNames(event.query.toLowerCase())
      //   .then((data) => (genera.value = data));
    }
  }, 250);
};
</script>

<template>
  <Panel header="Taxa" width="600">
    <!--  -->
    <div class="p-fluid formgrid grid">
      <div class="field col-12">
        <div class="p-float-label">
          <AutoComplete
            v-model="selectedGenus"
            :suggestions="taxa"
            @complete="searchGenus($event)"
            field="scientificName"
          >
            <template #item="{ item }">
              <div>{{ item.scientificName }} ({{ item.kingdom }})</div>
            </template>
          </AutoComplete>
          <label>GBIF search</label>
        </div>
      </div>
      <div class="field col-12 md:col-10">
        <label for="phoneext">scientificName</label>
        <InputText type="text" v-model="selectedGenus.scientificName" />
      </div>
      <div class="field col-12 md:col-2">
         <label for="phoneext">Rank</label>
        <Dropdown v-model="selectedGenus.rank" :options="TaxonRanking" optionLabel="name" optionValue="code" placeholder="Taxon rank" />
      </div>         
      <div class="field col-12 md:col-6">
        <label>Kingdom</label>
        <InputText type="text" v-model="selectedGenus.kingdom" />
      </div>

      <div class="field col-12 md:col-6">
        <label for="ssn">phylum</label>
        <InputText type="text" v-model="selectedGenus.phylum" />
      </div>

      <div class="field col-12 md:col-6">
        <label for="date">family</label>
        <InputText type="text" v-model="selectedGenus.family" />
      </div>
      

    </div>
    <pre>{{ selectedGenus }}</pre>
   
  </Panel>
</template>
<style lang="scss" scoped>
.sizes {
  .p-inputtext {
    display: block;
    margin-bottom: 0.5rem;
  }
}
.p-fluid {
  margin-top: 1rem;
}
.field * {
  display: blcok;
}
</style>
