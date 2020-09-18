<template>
  <v-container>
    <v-card>
      <v-card-title>
        Matches
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        />
      </v-card-title>
      <v-spacer />
      <v-card-text>
        <v-container>
          <v-row>
            <v-menu
              v-model="menu_start_date"
              :close-on-content-click="true"
              transition="scale-transition"
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="start_date"
                  label="start date"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker v-model="start_date" @input="menu_start_date = false" />
            </v-menu>
          </v-row>
          <v-row>
            <v-menu
              v-model="menu_end_date"
              :close-on-content-click="true"
              transition="scale-transition"
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="end_date"
                  label="end date"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker v-model="end_date" @input="menu_end_date = false" />
            </v-menu>
          </v-row>
        </v-container>
      </v-card-text>
      <v-data-table
        :headers="headers"
        elevation-0
        :items="matches"
        :loading="loading"
        class="elevation-0"
        @click:row="select_competition"
      >
        <template v-slot:item.Match="{ item }">
          <span>{{ item.home.Value }} - {{ item.away.Value }}</span></br>
          <span>{{ formatDate(item.competition.Date) }}</span></br>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
export default {
  fetch () {
    const self = this
    self.loading = true
    this.$api.League.league({ league: this.league.Id })
      .then(function (response) {
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
      items: [],
      menu_start_date: false,
      menu_end_date: false,
      start_date: new Date().toISOString().slice(0, 10),
      end_date: null,
      headers: [
        {
          text: 'Match',
          value: 'Match'
        }
      ],
      search: ''
    }
  },

  computed: {
    ...mapGetters(['league']),

    matches () {
      let results = this.items

      if (this.start_date != null) {
        results = results.filter(x => moment(x.competition.Date) >= moment(this.start_date))
      }

      if (this.end_date != null) {
        results = results.filter(x => moment(x.competition.Date) < moment(this.end_date).add(1, 'days'))
      }

      if (this.search !== '') {
        results = results.filter(x =>
          x.home.Value.toLowerCase().includes(this.search.toLowerCase()) ||
          x.away.Value.toLowerCase().includes(this.search.toLowerCase()))
      }

      return results
    }
  },

  methods: {
    ...mapActions(['select_competition']),

    formatDate (value) {
      return moment(value).format('YY/MM/DD HH:mm')
    }
  }

}
</script>
