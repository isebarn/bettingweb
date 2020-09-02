<template>
  <v-container>
    <v-row>
      <v-col :cols="match_items.length > 0 ? 3 : 12">
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
            :headers="league_headers"
            :items="league_items"
            :search="search"
            @click:row="selectLeague"
          />
        </v-card>
      </v-col>
      <v-col v-if="match_items.length > 0" :cols="matches.length > 0 ? 3 : 9">
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
          <v-data-table
            :headers="match_overview_headers"
            :items="match_items"
            @click:row="selectMatch"
          >
            <template v-slot:item.Match="{ item }">
              <span>{{ item._home.Value }} - {{ item._away.Value }}</span></br>
              <span>{{ formatDate(item.Time) }}</span></br>
            </template>
            <template v-slot:item.1="{ item }">
              <td><span> {{ item.odds[item.odds.length -1].home }}</span></td>
            </template>
            <template v-slot:item.X="{ item }">
              <td><span> {{ item.odds[item.odds.length -1].draw }}</span></td>
            </template>
            <template v-slot:item.2="{ item }">
              <td><span> {{ item.odds[item.odds.length -1].away }}</span></td>
            </template>
            <template v-slot:item.H1="{ item }">
              <td><span> {{ item.odds[item.odds.length -1].H1 }}</span></td>
            </template>
            <template v-slot:item.H2="{ item }">
              <td><span> {{ item.odds[item.odds.length -1].H2 }}</span></td>
            </template>
            <template v-slot:item.O="{ item }">
              <td><span> {{ item.odds[item.odds.length -1].O }}</span></td>
            </template>
            <template v-slot:item.U="{ item }">
              <td><span> {{ item.odds[item.odds.length -1].U }}</span></td>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col v-if="matches.length" cols="6">
        <v-row v-for="match in matches" :key="match.Id">
          <v-container fluid>
            <v-card>
              <v-card-title primary-title>
                {{ match._home.Value + ' - ' + match._away.Value + ' - ' + formatDate(match.Time) }}
              </v-card-title>
              <v-data-table
                :headers="match_headers"
                :items="match.odds"
                dense
                hide-default-footer
                disable-pagination
              >
                <template v-slot:item.Time="{ item }">
                  <span> {{ item.Date === null ? formatTime(item.Time) : formatDate(item.Time) }}</span>
                </template>
                <template v-slot:item.1="{ item }">
                  <FootballRow :display="item.home" :compare-to="item._1" pa-0 ma-0 />
                </template>
                <template v-slot:item.X="{ item }">
                  <FootballRow :display="item.draw" :compare-to="item._X" pa-0 ma-0 />
                </template>
                <template v-slot:item.2="{ item }">
                  <FootballRow :display="item.away" :compare-to="item._2" pa-0 ma-0 />
                </template>

                <template v-slot:item.H1="{ item }">
                  <FootballRow :display="item.H1" :compare-to="item._H1" pa-0 ma-0 />
                </template>
                <template v-slot:item.H2="{ item }">
                  <FootballRow :display="item.H2" :compare-to="item._H2" pa-0 ma-0 />
                </template>
                <template v-slot:item.O="{ item }">
                  <FootballRow :display="item.O" :compare-to="item._O" pa-0 ma-0 />
                </template>
                <template v-slot:item.U="{ item }">
                  <FootballRow :display="item.U" :compare-to="item._U" pa-0 ma-0 />
                </template>
              </v-data-table>
            </v-card>
            <v-divider />
          </v-container>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from 'moment'
import FootballRow from '~/components/FootballRow.vue'
export default {
  components: {
    FootballRow
  },

  fetch () {
    const self = this
    this.$api.League.list()
      .then(function (response) {
        console.log(response.data)
        self.league_items = response.data
      })
      .catch(function (error) {
        console.log(error)
      })
      .then(function () {
        self.loading = false
      })
  },

  data () {
    return {
      god: false,
      search: '',
      matches: [],
      league_items: [],
      league_headers: [
        {
          text: 'League',
          value: 'Value'
        }
      ],
      match_items: [],
      match_overview: [
        {
          text: 'Match',
          value: 'Match'
        },
        {
          text: 'Time',
          value: 'Time',
          align: 'end'
        },
        {
          text: '1',
          value: '1',
          align: 'end'
        },
        {
          text: 'x',
          value: 'X',
          align: 'end'
        },
        {
          text: '2',
          value: '2',
          align: 'end'
        },
        {
          text: 'H1',
          value: 'H1',
          align: 'end'
        },
        {
          text: 'H2',
          value: 'H2',
          align: 'end'
        },
        {
          text: 'O',
          value: 'O',
          align: 'end'
        },
        {
          text: 'U',
          value: 'U',
          align: 'end'
        }
      ],
      match_headers: [
        {
          text: 'Time',
          value: 'Time',
          align: 'end'
        },
        {
          text: '1',
          value: '1',
          align: 'end'
        },
        {
          text: 'x',
          value: 'X',
          align: 'end'
        },
        {
          text: '2',
          value: '2',
          align: 'end'
        },
        {
          text: 'H1',
          value: 'H1',
          align: 'end'
        },
        {
          text: 'H2',
          value: 'H2',
          align: 'end'
        },
        {
          text: 'O',
          value: 'O',
          align: 'end'
        },
        {
          text: 'U',
          value: 'U',
          align: 'end'
        }
      ]
    }
  },

  computed: {
    match_overview_headers () {
      return this.matches.length > 0
        ? this.match_overview.filter(x => ['Match'].includes(x.value))
        : this.match_overview
    }
  },

  methods: {
    sameDay (d1, d2) {
      return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    },

    selectLeague (item) {
      const self = this
      this.$api.League.league({ league: item.Id })
        .then(function (response) {
          for (let i = 0; i < response.data.matches.length; i++) {
            const match = response.data.matches[i]

            const odd = {}
            odd.home = match._1
            odd.draw = match._X
            odd.away = match._2
            odd.H1 = match._H1
            odd.H2 = match._H2
            odd.O = match._O
            odd.U = match._U
            odd._1 = 0
            odd._X = 0
            odd._2 = 0
            odd._H1 = 0
            odd._H2 = 0
            odd._O = 0
            odd._U = 0
            odd.Time = new Date(match.Created)
            odd.Date = null
            match.odds.unshift(odd)

            if (match.odds.length > 1) {
              for (let j = 1; j < match.odds.length; j++) {
                const odd = match.odds[j]
                const oddBefore = match.odds[j - 1]
                odd.home = Math.round(100 * (odd._1 / 100 + oddBefore.home)) / 100
                odd.draw = Math.round(100 * (odd._X / 100 + oddBefore.draw)) / 100
                odd.away = Math.round(100 * (odd._2 / 100 + oddBefore.away)) / 100
                odd.H1 = Math.round(100 * (odd._H1 / 100 + oddBefore.H1)) / 100
                odd.H2 = Math.round(100 * (odd._H2 / 100 + oddBefore.H2)) / 100
                odd.O = Math.round(100 * (odd._O / 100 + oddBefore.O)) / 100
                odd.U = Math.round(100 * (odd._U / 100 + oddBefore.U)) / 100
                odd.Time = new Date(odd.Time)
                odd.Date = self.sameDay(odd.Time, match.odds[j - 1].Time) ? null : odd.Time
              }
            }
          }
          // console.log(response.data.matches)
          self.match_items = response.data.matches
          console.log(self.match_items)
        })
        .catch(function (error) {
          console.log(error)
        })
        .then(function () {
          self.loading = false
        })
    },

    selectMatch (item) {
      console.log(item)
      this.matches = [item]
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
