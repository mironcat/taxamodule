<script setup>
import { ref, computed, onMounted } from "vue";
import { DirectusItem } from "../services/PaleobotService";
import AutoComplete from "primevue/autocomplete";
import Panel from "primevue/panel";
import TaxonFields from "./TaxonFields.vue";
import Checkbox from "primevue/checkbox";
import { useToast } from "primevue/usetoast";
const toast = useToast();

const props = defineProps({
  id: {
    type: String,
    default: "1",
  },
  mode: {
    type: String,
    required: true,
    default: "view",
  },
});
const EmptyTaxon = {
  taxonRank: "",
  genus: "",
  kingdom: "",
  phylum: "",
  family: "",
  scientificName: "",
  canonicalName: "",
  gbifkey: null,
};
console.log(props.id);
const itemParams = { table: "taxa", emptyfields: EmptyTaxon };
const taxonItem = new DirectusItem(itemParams);
// taxonItem.getByID(1);
const currentTaxon = ref(EmptyTaxon);
const savedTaxon = ref(Object.assign({}, EmptyTaxon));


onMounted(async () => {
  if (props.mode == "view") {
      const res = await taxonItem.getByID(props.id);
      currentTaxon.value = res;
      savedTaxon.value = Object.assign({}, res);
      // Object.freeze(savedTaxon.value);
  }
    
});
// const currentTaxonChanged =  computed(() => {
//   return savedTaxon.value == currentTaxon.value ? true: false;
// });
const listOfGbifTaxa = ref();
// const gbifService = ref(new GbifService());
const selectedGbifTaxon = ref(EmptyTaxon);
const showSavedMessage = () => {
            toast.add({severity:'success', summary: 'Item created and saved', life: 3000});
    }
const saveToDB = () => {
 
  taxonItem.item =  currentTaxon.value;
  if(!taxonItem.auth){
      taxonItem.authStatic().then((t) => {
            taxonItem.saveToDB().then((res) => {
              currentTaxon.value = res
              savedTaxon.value = Object.assign({}, res);
            });
             showSavedMessage();    
        });
  } else {
    taxonItem.saveToDB().then((t) => (currentTaxon.value = t));
     showSavedMessage();
  }

}


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
    if (taxname.trim().length) {
      fetch(`//api.gbif.org/v1/species/suggest?q=${taxname.trim()}`)
        .then((res) => res.json())
        .then((d) => {
          listOfGbifTaxa.value = d;
          selectedGbifTaxon.value = d[0];
        });
    }
};

const gbifTaxon = computed(() => {
  const {
    key,
    rank,
    genus,
    family,
    phylum,
    kingdom,
    scientificName,
    canonicalName,
  } = selectedGbifTaxon.value;
  return {
    canonicalName,
    taxonRank: rank,
    scientificName,
    genus,
    family,
    phylum,
    kingdom,
    gbifkey: key,
  };
});
</script>

<template>
    <Toast />
    <div class="grid">
      <div class="col-8">
        <Panel header="Taxa">
          <template #icons>
            <span class="mx-2" v-show="currentTaxon.id">ID:{{currentTaxon.id}}</span>
            <span class="mx-2" v-show="currentTaxon.gbifkey">GBIF ID:{{currentTaxon.gbifkey}}</span>
            <Button  v-show="!currentTaxon.id" align="right" label="SAVE TO DB" class="mr-2  p-button-success" @click="saveToDB()" />
            <Button  v-show="currentTaxon.id" align="end" label="UPDATE" class="mr-2"  @click="showSavedMessage()" />
            <Button align="right" label="DISCARD" class="p-button-secondary" @click="currentTaxon = Object.assign({}, savedTaxon)"/>
          </template>
     
              <TaxonFields
                :currentTaxon="currentTaxon"
                @search-taxon="(g) => searchAutoTaxon(g)"
              >
              </TaxonFields>
        </Panel>
      </div>
      <div class="col-4">
        <Panel header="GBIF search tool">
          <div class="field p-fluid">
              <AutoComplete
                v-model="selectedGbifTaxon"
                :delay="250"
                :minLength="2"
                :suggestions="listOfGbifTaxa"
                @complete="searchTaxon($event.query)"
                field="canonicalName"
                key="key"
              >
                <template #item="{ item }">
                  <div>{{ item.scientificName }} ({{ item.kingdom }})</div>
                </template>
              </AutoComplete>
          </div>          


          <div v-show="gbifTaxon.gbifkey" align="left">

                <div
                  v-for="(value, fieldName) in gbifTaxon"
                  :key="fieldName"
                  style="text-align: left"
                >
                 <label class="taxfields" :for="fieldName"
                    ><strong>{{ fieldName }}</strong
                    >:</label
                  >
                  <Button
                    @click="currentTaxon[fieldName] = value"
                    :label="currentTaxon[fieldName] + '<-' + value"
                    class="p-button-text p-button-secondary p-button-sm"
                  ><span  v-if="currentTaxon[fieldName]!=value" >{{currentTaxon[fieldName]}}<i  class="pi pi-arrow-left mx-2"/></span> {{value}}  <i v-if="currentTaxon[fieldName]==value" class="pi pi-check mx-2"/> 
                  </Button>
                </div>
              </div>
          <Button
              v-show="gbifTaxon.gbifkey"
              @click="currentTaxon = gbifTaxon"
              label="Apply all"
              class="p-button-raised p-button-text p-button-success mx-2"
            />
            <Button
              v-show="gbifTaxon.gbifkey"
              @click="
                currentTaxon.kingdom = gbifTaxon.kingdom;
                currentTaxon.phylum = gbifTaxon.phylum;
                currentTaxon.family = gbifTaxon.family;
              "
              label="Apply higher clades"
              class="p-button-raised p-button-text p-button-success"
            />                 
           </Panel>
      </div>
    </div>

<h3>currentTaxon</h3>
  <pre>{{ currentTaxon }}</pre>
<h3>savedTaxon</h3>
  <pre>{{ savedTaxon }}</pre>  
</template>

<style lang="scss" scoped>
::v-deep(.p-autocomplete-input.p-inputtext) {
  background: #3bc3451c;
}
label {
  margin-bottom: 2rem;
  margin-top: 0rem;
}
</style>
