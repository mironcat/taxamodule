<script>
// import { Directus } from "@directus/sdk";
// const directus = new Directus("https://paleobot.mironcat.tk");

// import DataTable from 'primevue/datatable';
// import Column from 'primevue/column';
// import TaxaComplete from "../components/TaxaComplete.vue";
import {PaleobotService, DirectusItem } from "../services/PaleobotService";
import TaxaComplete from "../components/TaxaComplete.vue";
import { ref, onMounted } from "vue";
export default {
  components: {
    TaxaComplete
  },
  setup() {
    onMounted(() => {
      paleobotService.value
        .getAllTaxa(100)
        .then((data) => (taxonList.value = data));
      taxonItem.value.getByID(1);
    });
          // paleobotService.value
      //   .getOneTaxaByID(1)
      //   .then((t) => (selectedTaxon.value = t));
    const taxonList = ref();
    const paleobotService = ref(new PaleobotService());
    const taxonItem = ref(new DirectusItem({table:'taxa', emptyfields: {
            taxonRank:'',
            genus: "",
            kingdom: "",
            phylum: "",
            family: "",
            scientificName: "",  
          }
      }));
    return { taxonList, paleobotService, taxonItem };
  },
};
</script>
<template>
    <div>
        <pre>{{ taxonItem.item }}</pre>
        <TaxaComplete id="1" mode="view" />
            <DataTable :value="taxonList" responsiveLayout="scroll">
                <Column field="scientificName" header="scientificName"></Column>
                <Column field="taxonomicStatus" header="taxonomicStatus"></Column>
                <Column field="taxonRank" header="taxonRank"></Column>
            </DataTable>
      
       
    </div>
</template>