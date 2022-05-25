<script setup>
import { ref, computed, onMounted } from "vue";
import { DirectusItem } from "../services/PaleobotService";
import AutoComplete from "primevue/autocomplete";
import Panel from "primevue/panel";
import TaxonFields from "./TaxonFields.vue";
import Checkbox from "primevue/checkbox";

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
const savedTaxon = ref(EmptyTaxon);


onMounted(async () => {
  if (props.mode == "view") {
      const res = await taxonItem.getByID(props.id);
      currentTaxon.value = res;
      savedTaxon.value = res;
  }
    
});
const currentTaxonChanged =  computed(() => {
  return savedTaxon.value == currentTaxon.value ? true: false;
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
        .then((d) => {
          listOfGbifTaxa.value = d;
          selectedGbifTaxon.value = d[0];
        });
    }
  }, 250);
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
    gbifkey: key,
    taxonRank: rank,
    scientificName,
    canonicalName,
    genus,
    family,
    phylum,
    kingdom,
  };
});
const selectedGbifFields = ref(Object.keys(EmptyTaxon));
</script>

<template>
  <Panel header="Taxa">
    <template #icons>
    
      <Button align="right" label="NEW" class="mr-2  p-button-success" />
      <Button align="end" label="SAVE" class="mr-2" />
      <Button align="right" label="DISCARD" class="p-button-secondary" @click="currentTaxon = savedTaxon"/>
    </template>
      {{savedTaxon}}
    <div class="grid">
      <div class="col-8">
        <TaxonFields
          :currentTaxon="currentTaxon"
          @search-taxon="(g) => searchAutoTaxon(g)"
        >
        </TaxonFields>
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
                field="scientificName"
                key="key"
              >
                <template #item="{ item }">
                  <div>{{ item.scientificName }} ({{ item.kingdom }})</div>
                </template>
              </AutoComplete>
          </div>          


          <div v-show="gbifTaxon.gbifkey" align="left">
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
                  />
                </div>
              </div>
        </Panel>
      </div>
    </div>
  </Panel>
<h3>currentTaxon</h3>
  <pre>{{ currentTaxon }}</pre>
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
