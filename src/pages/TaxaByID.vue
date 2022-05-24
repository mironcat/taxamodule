<template>
        <TaxaComplete :id="$route.params.id" mode="view" />
</template>
<script setup>
import TaxaComplete from "../components/TaxaComplete.vue";
</script>