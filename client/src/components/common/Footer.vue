<template>
  <v-footer
    dark
  >
   <v-layout
      justify-center
      row
      wrap
    >
      <v-flex
        primary
        lighten-1
        py-2
        text-xs-center
        white--text
        xs12
      >
      <div style="float:right;margin-right:10px"> &copy;2018&nbsp;   <img style="height:15px;margin-top:0px" src="../../assets/logoWhiteWide.svg"/> &nbsp; hatcha82@gmail.com </div>
      </v-flex>
    </v-layout>
    
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    icons: [
      "fab fa-facebook",
      "fab fa-twitter",
      "fab fa-google-plus",
      "fab fa-linkedin",
      "fab fa-instagram"
    ]
  })
};
</script>
