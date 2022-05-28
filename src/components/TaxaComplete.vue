<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router'
import { Taxon } from "../services/PaleobotService";
import AutoComplete from "primevue/autocomplete";
import Panel from "primevue/panel";
import TaxonFields from "./TaxonFields.vue";
import { useToast } from "primevue/usetoast";
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";

const router = useRouter();
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

const taxonItem = new Taxon();
if ( !taxonItem.authenticated ) taxonItem.authStatic(); // !!
const currentTaxon = taxonItem.currentItem;
const savedTaxon = taxonItem.previousItem;
onMounted(async () => {
  if (props.mode == "view")  taxonItem.getByID(props.id);
});

// --------- GBIF tool ----------------------------------------------------------------
const listOfGbifTaxa = taxonItem.listofgbiftaxons;
const selectedGbifTaxon = taxonItem.selectedgbiftaxon;

const discardStatus = computed (()=>{
  return Object.entries(taxonItem.currentItem.value).toString() != Object.entries(taxonItem.previousItem.value).toString();
});
const gbifTaxon = computed(() => taxonItem.getForrmattedGbifTaxon())


// ---------------- CREATE SAVE DELETE --------------------------------------------------
const showSavedMessage = () => {
            toast.add({severity:'success', summary: 'Item created and saved', life: 3000});
    }
const saveToDB = async () => {
  const newItem= await taxonItem.createOne()
 if (newItem){
   toast.add({severity:'success', summary: 'Item created and saved', life: 3000});
   router.push({ path: '/taxa/'+ newItem.id });   
 } 
}
const updateOne = () => {
 if (taxonItem.updateOne()) toast.add({severity:'success', summary: 'Item updated', life: 3000});
}
const confirm = useConfirm();

const confirmDelete = () => {
    confirm.require({
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        position:'top',
        acceptClass: 'p-button-danger',
        accept: () => {
            taxonItem.deleteOne();
            toast.add({severity:'info', summary:'Confirmed', detail:'Record deleted', life: 1500});
            setTimeout(() => {
              router.push({ path: '/taxa' });
            }, 2000)
        },
        reject: () => {
            // toast.add({severity:'success', summary:'Rejected', detail:'OK. You have rejected', life: 3000});
        }
    });
}


</script>

<template>
    <Toast position="bottom-left" />
    <div class="grid">
      <div class="col-8">
        <Panel header="Taxon">
          <template #icons>
            <!-- <span class="mx-2">{{discardStatus}}</span>
            <span class="mx-2">{{currentTaxon.id>0 & discardStatus}}</span> -->
            <span class="mx-2" v-show="currentTaxon.id">ID:{{currentTaxon.id}}</span>
            <span class="mx-2" v-show="currentTaxon.gbifkey">GBIF ID:{{currentTaxon.gbifkey}}</span>
            <Button  v-show="!currentTaxon.id" align="right" label="Create and save to DB" class="mr-2  p-button-success" @click="saveToDB()" />
          </template>
            <!-- {{props.mode}} -->
              <TaxonFields
                :currentTaxon="currentTaxon"
                @search-taxon="(g) => taxonItem.searchTaxonByGbif({taxname: g, getfirst: true})"
              >
              </TaxonFields>
        <div align="right"> 
          <ConfirmDialog></ConfirmDialog>
          <!-- $router.push({ path: '/taxa' }) -->
          <Button  v-show="currentTaxon.id>0 & discardStatus" label="Update" class="mr-2"  @click="updateOne()" />
          <Button  v-show="discardStatus"  label="Undo" class="p-button-secondary mr-2" @click="currentTaxon = Object.assign({}, savedTaxon)"/>          
          <Button
              @click="confirmDelete()"
              icon="pi pi-trash"
              label="DELETE"
              class="p-button-help"
            />
            </div>              
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
                @complete="taxonItem.searchTaxonByGbif({taxname: $event.query, getfirst: false})"
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
                  ><span v-if="currentTaxon[fieldName]!=value" >{{currentTaxon[fieldName]}}<i  class="pi pi-arrow-left mx-2"/></span> {{value}}  <i v-if="currentTaxon[fieldName]==value" class="pi pi-check mx-2"/> 
                  </Button>
                </div>
              </div>
          <Button
              v-show="gbifTaxon.gbifkey"
              @click="taxonItem.setGbifToCurrent()"
              label="Apply all"
              class="p-button-raised p-button-text p-button-success mx-2"
            />
            <Button
              v-show="gbifTaxon.gbifkey"
              @click="taxonItem.setOnlyHighTaxonomy()"
              label="Apply higher clades"
              class="p-button-raised p-button-text p-button-success"
            />                 
           </Panel>
      </div>
    </div>

  <!-- <h3>taxonItem.currentItem</h3>
    <pre>{{ taxonItem.currentItem }}</pre> -->
  <h3>taxonItem.selectedgbiftaxon</h3>
    <pre>{{ taxonItem.selectedgbiftaxon }}</pre>  
  <h3>gbifTaxon</h3>
    <pre>{{ gbifTaxon }}</pre>      
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
