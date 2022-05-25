<template>
      <div v-if="$route.params.id=='new'">
                <TaxaComplete id="" mode="new" />
        </div>
        <div v-else>
                <TaxaComplete :id="$route.params.id" mode="view" />
        </div>
</template>
<script setup>
import TaxaComplete from "../components/TaxaComplete.vue";
</script>