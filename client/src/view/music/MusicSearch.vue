<template>
     <v-text-field
      placeholder="Search..."
      single-line
      class="searchBox "
      append-icon="search"
      color="white"
      hint="Search by song title, artist, album, or genre"
      v-model="searchKeyword"
    ></v-text-field>
</template>

<script>
import _ from "lodash";
export default {
  data() {
    return {
      searchKeyword: ""
    };
  },
  watch: {
    searchKeyword: _.debounce(async function(value) {
      const route = {
        name: "music-list"
      };
      if (this.searchKeyword !== "") {
        route.query = {
          search: this.searchKeyword,
          offset: 0
        };
      }
      this.$router.push(route);
    }, 700),
    "$route.query.search": {
      immediate: true,
      handler(value) {
        this.searchKeyword = value;
      }
    }
  }
};
</script>

<style>
</style>
