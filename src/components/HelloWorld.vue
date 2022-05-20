<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';
defineProps({
  msg: String,
});
const count = ref(0);
const Increment = () => count.value++;
const Decrement = () => count.value--;
const loading = ref(false);
const selectedCity1 = ref();
const cities = ref([
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' },
]);
</script>

<template>
  <Card style="width: 30rem; margin-bottom: 2em">
    <template #title>
      {{ selectedCity1 }}
    </template>
    <template #content>
      <Dropdown
        v-model="selectedCity1"
        :options="cities"
        optionLabel="name"
        optionValue="code"
        placeholder="Select a City"
      />
      <Button label="+" @click="Increment()" />
      <Button label="-" @click="Decrement()" />
    </template>
  </Card>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
