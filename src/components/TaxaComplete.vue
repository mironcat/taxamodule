<script setup>
import { ref, onMounted } from "vue";
// import GbifService from '../services/GbifService';
import { DirectusItem } from "../services/PaleobotService";
import AutoComplete from "primevue/autocomplete";
import Panel from "primevue/panel";
import Dropdown from "primevue/dropdown";
import Toolbar from 'primevue/Toolbar';
const props = defineProps({
  id: {
    type: Number,
    default:1
  },
  mode:{
    type: String,
    required: true,
    default:'view'
  }
});
const EmptyTaxon = {
  taxonRank:'',
  genus: "",
  kingdom: "",
  phylum: "",
  family: "",
  scientificName: "",  
};
console.log(props.id);
const itemParams = { table:'taxa', emptyfields: EmptyTaxon }
const taxonItem = new DirectusItem(itemParams);
// taxonItem.getByID(1);
const currentTaxon =  ref(EmptyTaxon);

onMounted(async () => {
  console.log(props.id)
  currentTaxon.value=await taxonItem.getByID((props.id));
});
const TaxonRanking =ref([
            {name: 'SPECIES', code: 'SPECIES'},
            {name: 'GENUS', code: 'GENUS'},
            {name: 'FAMILY', code: 'FAMILY'},
            {name: 'ORDER', code: 'ORDER'}
        ]);
const listOfGbifTaxa = ref();
// const gbifService = ref(new GbifService());

const selectedGbifTaxon = ref(EmptyTaxon);

const searchGenus = (event) => {
  setTimeout(() => {
    if (event.query.trim().length) {
      fetch(`//api.gbif.org/v1/species/suggest?q=${event.query.trim()}`)
        .then((res) => res.json())
        .then((d) => (listOfGbifTaxa.value = d));
      // gbifService.value
      //   .getGenusNames(event.query.toLowerCase())
      //   .then((data) => (genera.value = data));
    }
  }, 250);
};
</script>

<template>
  <Panel header="Taxa">

          <template #icons>
                <Button align="end" label="edit" class="mr-2" />
                <Button align="right" label="new" class="p-button-success" />
          </template>
    <div class="p-fluid formgrid grid">
      
      <div class="field col-12 md:col-10"> 
         <h5 align="left">scientificName </h5>
        <InputText type="text" v-model="currentTaxon.scientificName" />
      </div>
  
      <div class="field col-12 md:col-2">
        <h5 >Rank </h5>    
        <Dropdown v-model="currentTaxon.taxonRank" :options="TaxonRanking" optionLabel="name" optionValue="code" placeholder="Taxon rank" />
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
        <InputText type="text" v-model="currentTaxon.family"  />
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
          <AutoComplete
            v-model="selectedGbifTaxon"
            :suggestions="listOfGbifTaxa"
            @complete="searchGenus($event)"
            field="scientificName"
          >
            <template #item="{ item }">
              <div>{{ item.scientificName }} ({{ item.kingdom }})</div>
            </template>
          </AutoComplete>
      </div>      

    </div>
    <pre>{{ selectedGbifTaxon }}</pre>
   
  </Panel>
</template>
<style lang="scss" scoped>
.sizes {
  .p-inputtext {
    display: block;
    // margin-bottom: 0.5rem;
  }
}
// .p-fluid {
//   margin-top: 1rem;
// }
h5 { margin-bottom: 0.5rem; margin-top: 0.5rem; }
.field * {
  display: blcok;
}
</style>
