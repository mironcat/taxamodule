<script>
// import { Directus } from "@directus/sdk";
// const directus = new Directus("https://paleobot.mironcat.tk");

// import DataTable from 'primevue/datatable';
// import Column from 'primevue/column';
// import TaxaComplete from "../components/TaxaComplete.vue";
import { PaleobotService, DirectusItem } from "../services/PaleobotService";
import TaxaComplete from "../components/TaxaComplete.vue";
import Panel from "primevue/panel";
import { ref, onMounted } from "vue";
export default {
  components: {
    TaxaComplete, Panel
  },
  setup() {
    const taxonList = ref();
    const paleobotService = new PaleobotService();

    onMounted(() => {
      paleobotService.authStatic();
      paleobotService.getAllTaxa(100).then((data) => {
        // console.log(data);
        taxonList.value = data;
      });
    });
    return { taxonList, paleobotService };
  },
};
</script>
<template>
<Panel header="Taxa">   
  <div align="left">
    <Button
      @click="$router.push('/taxa/new')"
      icon="pi pi-plus"
      label="CREATE"
      class="p-button-success mx-2 my-2"
    />
  </div>
  <div>
 
    <DataTable :value="taxonList" sortField="id" :sortOrder="-1" responsiveLayout="scroll">
      <Column
        headerStyle="width: 4rem; text-align: center"
        bodyStyle="text-align: center; overflow: visible"
      >
        <template #body="row">
          <router-link :to="`/taxa/${row.data.id}`" tag="button"
            >view</router-link
          >
        </template>
      </Column>
      <Column
        field="scientificName"
        header="scientificName"
        :sortable="true"
      ></Column>
      <Column field="kingdom" header="kingdom" :sortable="true"></Column>
      <Column field="phylum" header="phylum" :sortable="true"></Column>
      <Column field="family" header="family" :sortable="true"></Column>
      <Column field="genus" header="genus" :sortable="true"></Column>
      <Column
        field="taxonRemarks"
        header="taxonRemarks"
        :sortable="true"
      ></Column>
      <Column field="taxonRank" header="taxonRank" :sortable="true"></Column>
      <Column field="id" header="id" :sortable="true"></Column>
    </DataTable>
  </div>
</Panel>  
  <!-- <pre>  {{taxonList}} </pre> -->
</template>