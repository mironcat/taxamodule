<script>
// import { Directus } from "@directus/sdk";
// const directus = new Directus("https://paleobot.mironcat.tk");
import Button from "primevue/button";
// import DataTable from 'primevue/datatable';
// import Column from 'primevue/column';
// import TaxaComplete from "../components/TaxaComplete.vue";
import PaleobotService from "../services/PaleobotService";
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
      paleobotService.value
        .getOneTaxaByID(1)
        .then((t) => (selectedTaxon.value = t));
    });
    const taxonList = ref();
    const paleobotService = ref(new PaleobotService());
    const selectedTaxon = ref();
    return { taxonList, paleobotService, selectedTaxon };
  },
};
</script>
<template>
    <div>
        <TaxaComplete :sourceTaxon="selectedTaxon" mode="view" />
            <DataTable :value="taxonList" responsiveLayout="scroll">
                <Column field="scientificName" header="scientificName"></Column>
                <Column field="taxonomicStatus" header="taxonomicStatus"></Column>
                <Column field="taxonRank" header="taxonRank"></Column>
            </DataTable>
        <pre>{{ selectedTaxon }}</pre>
       
    </div>
</template>