<script setup>
import { ref } from 'vue';
// import GbifService from '../services/GbifService';
import AutoComplete from 'primevue/autocomplete';
import InputText from 'primevue/inputtext';
import Panel from 'primevue/panel';
const genera = ref();
// const gbifService = ref(new GbifService());
const selectedGenus = ref();

const searchGenus = (event) => {
  setTimeout(() => {
    if (event.query.trim().length) {
      fetch(
        `//api.gbif.org/v1/species/suggest?isExtinct=true&rank=genus&q=${event.query.trim()}`
      )
        .then((res) => res.json())
        .then((d) => (genera.value = d));
      // gbifService.value
      //   .getGenusNames(event.query.toLowerCase())
      //   .then((data) => (genera.value = data));
    }
  }, 250);
};
</script>

<template>
  <Panel header="AutoComplete">
    <div class="p-fluid formgrid grid">
      <div class="field col-12 md:col-6">
        <label for="basic">Basic</label>
        <AutoComplete
          v-model="selectedGenus"
          :suggestions="genera"
          @complete="searchGenus($event)"
          field="genus"
        >
          <template #item="{ item }">
            <div>{{ item.genus }} ({{ item.kingdom }})</div>
          </template>
        </AutoComplete>
      </div>

      <div class="field col-12 md:col-6">
        <label for="basic">Basic</label>
        <InputText type="text" v-model="value" />
      </div>

      <div class="field col-12 md:col-6">
        <label for="ssn">SSN</label>
        <InputText type="text" v-model="value" />
      </div>

      <div class="field col-12 md:col-6">
        <label for="date">Date</label>
        <InputText type="text" v-model="value" />
      </div>

      <div class="field col-12 md:col-6">
        <label for="Phone">Phone</label>
        <InputText type="text" v-model="value" />
      </div>

      <div class="field col-12 md:col-6">
        <label for="phoneext">Phone Ext</label>
        <InputText type="text" v-model="value" />
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

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.field * {
  display: left;
}
</style>
