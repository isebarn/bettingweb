<template>
  <v-container>
    <v-card>
      <v-card-title>
        Leagues
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        />
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        :loading="loading"
        @click:row="select_league"
      />
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  fetch () {
    const self = this
    self.loading = true
    this.$api.League.list()
      .then(function (response) {
        console.log(response.data)
        self.items = response.data
        self.loading = false
      })
      .catch(function (error) {
        console.log(error)
      })
      .then(function () {
      })
  },

  data () {
    return {
      search: '',
      items: [],
      headers: [
        {
          text: 'League',
          value: 'Value'
        }
      ]
    }
  },

  methods: {
    ...mapActions(['select_league'])
  }
}
</script>
