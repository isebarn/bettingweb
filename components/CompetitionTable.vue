<template>
  <v-container>
    <v-card>
      <v-card-title>
        Markets
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
        :loading="loading"
        single-expand
        :search="search"
        item-key="Id"
        :expanded.sync="expanded"
        @click:row="click_market"
      >
        <template v-slot:expanded-item="{ headers }">
          <td :colspan="headers.length" style="margin: 0px; padding: 0px">
            <CollectionTable v-if="market" :key="market.Id" />
          </td>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CollectionTable from '~/components/CollectionTable.vue'
export default {
  components: {
    CollectionTable
  },

  fetch () {
    const self = this
    self.loading = true
    this.$api.Match.competition({ competition: this.competition.Competition })
      .then(function (response) {
        self.items = response.data.markets
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
      expanded: [],
      loading: false,
      items: [],
      search: '',
      headers: [
        {
          text: 'Market',
          value: 'collection.Value'
        }
      ]
    }
  },

  computed: {
    ...mapGetters(['competition', 'market'])
  },

  methods: {
    ...mapActions(['select_market']),

    click_market (item) {
      this.select_market(-1)
      if (this.expanded.length > 0 && this.expanded[0] === item) {
        this.expanded = []
        return
      }
      this.expanded = [item]
      this.select_market(item)
    }
  }
}
</script>
