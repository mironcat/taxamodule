<script setup>
import { ref, computed, onMounted } from 'vue';
import { DirectusItem } from '../services/PaleobotService';
import AutoComplete from 'primevue/autocomplete';
import Panel from 'primevue/panel';
import TaxonFields from './TaxonFields.vue';
import Checkbox from 'primevue/checkbox';
const props = defineProps({
  id: {
    type: String,
    default: 1,
  },
  mode: {
    type: String,
    required: true,
    default: 'view',
  },
});
const EmptyTaxon = {
  taxonRank: '',
  genus: '',
  kingdom: '',
  phylum: '',
  family: '',
  scientificName: '',
  canonicalName:'',
  gbifkey:null,
};
console.log(props.id);
const itemParams = { table: 'taxa', emptyfields: EmptyTaxon };
const taxonItem = new DirectusItem(itemParams);
// taxonItem.getByID(1);
const currentTaxon = ref(EmptyTaxon);
const checked  = ref(false);

onMounted(async () => {
  console.log(props.id);
  currentTaxon.value = await taxonItem.getByID(props.id);
});


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
const gbifTaxon = computed(() => {
  const { key, rank, genus, family, phylum, kingdom, scientificName, canonicalName } =  selectedGbifTaxon.value;
  return { gbifkey:key, taxonRank:rank, scientificName, canonicalName, genus, family, phylum, kingdom,  }
})
const selectedGbifFields = ref(Object.keys(EmptyTaxon));
</script>

<template>

  <Panel header="Taxa">
    <template #icons>
      <Button align="end" label="edit" class="mr-2" />
      <Button align="right" label="new" class="p-button-success" />
    </template>
    <TaxonFields :currentTaxon=currentTaxon> 
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
    </TaxonFields>    
    <h5 align="left">Info about taxa from GBIF database </h5>
    <div v-for="(value, fieldName) in gbifTaxon" :key="fieldName" class="field-checkbox">
          <!-- <li>{{fieldName}}- {{value}} </li> -->
        <Checkbox :id="fieldName" name="field" :value="fieldName" v-model="selectedGbifFields" />
        <label :for="fieldName">{{fieldName}}: {{value}}</label> 
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
h5 {
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
}
.field * {
  display: blcok;
}
</style>
