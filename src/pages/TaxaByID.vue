<script setup>
import TaxaComplete from "../components/TaxaComplete.vue";
</script>
<template>
     <div align="left" >
             <Button class="mb-2 p-button-secondary" label="BACK" @click="$router.push('/taxa')" />
             <Button v-show="$route.params.id!='new'" @click="$router.push('/taxa/new')" icon="pi pi-plus" label="NEW"   class="p-button-success mb-2 mx-2"/>   
      </div>
      <div v-if="$route.params.id=='new'">
                <TaxaComplete id="" mode="new" />
        </div>
        <div v-else>
                <TaxaComplete :id="$route.params.id" mode="view" />
        </div>
</template>
