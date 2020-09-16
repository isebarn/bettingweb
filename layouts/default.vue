<template>
  <v-app dark>
    <v-container>
      <nuxt />
    </v-container>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        }
      ],
      title: 'Title'
    }
  }
}
</script>
