<template>
  <v-container>
    <v-row>
      <v-col :cols="league_matches.length > 0 ? 3 : 12">
        <v-card>
          <v-card-title>
            Leagues
            <v-spacer />
            <v-text-field
              v-model="league_search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            />
          </v-card-title>
          <v-data-table
            :headers="league_headers"
            :items="league_items"
            :search="league_search"
            :loading="leagues_loading"
            class="elevation-0"
            @click:row="selectLeague"
          />
        </v-card>
      </v-col>
      <v-col
        v-if="league_matches.length > 0"
        :cols="competition ? 3 : 9"
      >
        <v-card>
          <v-card-title>
            Matches
            <v-spacer />
            <v-text-field
              v-model="match_search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            />
          </v-card-title>
          <v-data-table
            :headers="league_matches_headers"
            elevation-0
            :items="league_matches"
            :loading="loading_league_matches"
            :search="match_search"
            :custom-filter="matchSearchFilter"
            class="elevation-0"
            @click:row="selectCompetition"
          >
            <template v-slot:item.Match="{ item }">
              <span>{{ item.home.Value }} - {{ item.away.Value }}</span></br>
              <span>{{ formatDate(item.competition.Date) }}</span></br>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col v-if="competition" cols="6">
        <v-card-title>
          Markets
          <v-spacer />
          <v-text-field
            v-model="market_search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          />
        </v-card-title>
        <v-data-table
          :headers="market_headers"
          :items="competition.markets"
          :loading="loading_competition"
          single-expand
          :search="market_search"
          item-key="Id"
          :expanded.sync="expanded"
          @click:row="selectMarket"
        >
          <template v-slot:expanded-item="{ headers }">
            <td :colspan="headers.length" style="margin: 0px; padding: 0px">
              <v-data-table
                :headers="price_headers"
                :items="prices"
                dense
                :loading="loading_prices"
                :items-per-page="-1"
                hide-default-footer
                hide-default-header
              >
                <template v-slot:item.Value="{ item }">
                  <td :class="[ item.increment == 0 ? 'equal' : (item.increment < 0 ? 'less' : 'more')]">
                    {{ parseFloat(item.Value).toFixed(2) }}
                  </td>
                </template>
                <template v-slot:item.Time="{ item }">
                  <td> {{ item.Day ? formatDate(item.Time) : formatTime(item.Time) }}</td>
                </template>
              </v-data-table>
            </td>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from 'moment'
export default {
  fetch () {
    const self = this
    self.leagues_loading = true
    this.$api.League.list()
      .then(function (response) {
        self.league_items = response.data
      })
      .catch(function (error) {
        console.log(error)
      })
      .then(function () {
        self.leagues_loading = false
      })
  },

  data () {
    return {
      expanded: [],
      loading_prices: false,
      current_market: null,
      prices: [],
      league_search: '',
      match_search: '',
      market_search: '',
      leagues_loading: false,
      loading_league_matches: false,
      competition: null,
      market_headers: [
        {
          text: 'Market',
          value: 'collection.Value'
        }
      ],
      league_matches: [],
      league_matches_headers: [
        {
          text: 'Match',
          value: 'Match'
        }
      ],
      league_items: [],
      league_headers: [
        {
          text: 'League',
          value: 'Value'
        }
      ]
    }
  },

  computed: {
    price_values () {
      return self.prices
    },

    price_headers () {
      const results = []
      if (!this.current_market) { return results }

      // OPTIONS LINE
      if (this.current_market.Headers[0] !== '') {
        return [
          {
            text: 'Result',
            value: 'SN'
          },
          {
            text: this.current_market.collection.Value,
            value: 'Value'
          },
          {
            text: 'Time',
            value: 'Time'
          }
        ]
      }
      // VAL-OPTIONS LINE
      if (this.current_market.Headers[0] === '') {
        results.append({ text: 'Result', value: 'MN' })
        for (let i = 1; this.current_market.Headers.length; i++) {
          results.append({ text: this.current_market.Headers[i].Value, value: 'Value' })
        }

        return results
      }

      for (let i = this.current_market.Headers.length - 1; i >= 0; i--) {
        const item = {}
        item.text = this.current_market.Headers[i]
        item.value = 'Value'
        results.push(item)
      }
      return results
    }
  },

  methods: {
    matchSearchFilter (value, search, item) {
      return item.home.Value.toLowerCase().includes(search.toLowerCase())
    },

    selectMarket (item) {
      if (this.expanded.length > 0 && this.expanded[0] === item) {
        this.expanded = []
        return
      }
      console.log(item)
      this.expanded = [item]
      const self = this
      self.current_market = item
      self.loading_prices = true
      this.$api.Match.prices({ market: item.Id, collection: item.Collection })
        .then(function (response) {
          self.prices = response.data
          self.loading_prices = false
        })
        .catch(function (error) {
          console.log(error)
        })
        .then(function () {
        })
    },

    selectCompetition (item) {
      const self = this
      self.loading_competition = true
      this.$api.Match.competition({ competition: item.Competition })
        .then(function (response) {
          self.competition = response.data
          self.loading_competition = false
        })
        .catch(function (error) {
          console.log(error)
        })
        .then(function () {
        })
    },

    selectLeague (item) {
      const self = this
      self.loading_league_matches = true
      this.$api.League.league({ league: item.Id })
        .then(function (response) {
          self.league_matches = response.data.matches
        })
        .catch(function (error) {
          console.log(error)
        })
        .then(function () {
          self.loading_league_matches = false
        })
    },

    formatDate (value) {
      return moment(value).format('YY/MM/DD HH:mm')
    },
    formatTime (value) {
      return moment(value).format('HH:mm')
    }
  }

}
</script>
<style>

.equal {
  background: white
}

.less {
  background: #F9E2E8
}

.more {
  background: #BED9D2
}

  tbody tr:nth-of-type(even) {
    background-color: rgba(236, 237, 237);
  }

  tbody tr:nth-of-type(odd) {
    background-color: rgb(250 ,250, 250);
  }

  .v-data-table-header {
    background-color: rgba(182, 183, 187);
    color: white;
  }

  .v-data-footer {
    background-color: rgb(250 ,250, 250);
  }

  .theme--light.v-data-table thead tr th {
    color: white;
  }

</style>
