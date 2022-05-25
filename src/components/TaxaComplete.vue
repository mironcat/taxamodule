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
  if (props.mode == 'view') currentTaxon.value = await taxonItem.getByID(props.id);
});


const listOfGbifTaxa = ref();
// const gbifService = ref(new GbifService());
const selectedGbifTaxon = ref(EmptyTaxon);

const searchTaxon = (taxname) => {
  // setTimeout(() => {
    if (taxname.trim().length) {
      fetch(`//api.gbif.org/v1/species/suggest?q=${taxname.trim()}`)
        .then((res) => res.json())
        .then((d) => (listOfGbifTaxa.value = d));
    }
  // }, 250);
};
const searchAutoTaxon = (taxname) => {
  setTimeout(() => {
    if (taxname.trim().length) {
      fetch(`//api.gbif.org/v1/species/suggest?q=${taxname.trim()}`)
        .then((res) => res.json())
        .then((d) =>{
          listOfGbifTaxa.value = d;
          selectedGbifTaxon.value=d[0];
        } );
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
    <TaxonFields :currentTaxon=currentTaxon
                  @search-taxon="(g) => searchAutoTaxon(g)"
                > 
          <AutoComplete
            v-model="selectedGbifTaxon"
            :delay="1000"
            :minLength="2"
            :suggestions="listOfGbifTaxa"
            @complete="searchTaxon($event.query)"
            field="scientificName"
            key="key"
            inputClass="p-invalid"
         >
            <template #item="{ item }">
              <div>{{ item.scientificName }} ({{ item.kingdom }})</div>
            </template>
          </AutoComplete>
    </TaxonFields> 
    <div v-show="gbifTaxon.gbifkey">   
      <div align="left">
        <Button @click="currentTaxon = gbifTaxon" label="Apply all" class="p-button-raised p-button-text p-button-success mr-2" />
        <Button @click="currentTaxon.kingdom=gbifTaxon.kingdom; currentTaxon.phylum=gbifTaxon.phylum; currentTaxon.family=gbifTaxon.family;" label="Apply higher taxonomy only" class="p-button-raised p-button-text p-button-success" />    
      </div>
      <div v-for="(value, fieldName) in gbifTaxon" :key="fieldName" style="text-align:left">
          <!-- <li>{{fieldName}}- {{value}} </li> -->
        <!-- <Checkbox :id="fieldName" name="field" :value="fieldName" v-model="selectedGbifFields" /> -->
        <label :for="fieldName"><strong>{{fieldName}}</strong>: {{value}}
                <Button  @click="currentTaxon[fieldName]=value" label="^" class="p-button-text p-button-secondary" />
        </label> 

         <!-- <Button @click="currentTaxon[fieldName]=value" icon="pi pi-plus" class="p-button-rounded p-button-text" /> -->
      </div>

    </div>
        <!-- <pre>{{ listOfGbifTaxa }}</pre> -->
  </Panel>
</template>

<style lang="scss" scoped>
.p-inputtext.p-invalid.p-component {
    border-color: #35dc6d;
}
</style>