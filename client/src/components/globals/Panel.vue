<template>
  <div class="white elevation-1">
    <v-toolbar flat >
      <v-toolbar-title>{{title}}</v-toolbar-title>
      <slot name="action" />
    </v-toolbar>
    <div class="">
      <slot>
        No slot content defined.
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  props: [
    'title'
  ]
}
</script>
<style scoped>
</style>
