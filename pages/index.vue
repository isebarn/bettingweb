<template>
  <v-container>
    <v-row>
      <v-col v-if="loading" cols="6">
        loading
        <v-progress-circular
          indeterminate
          color="primary"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="-1"
        show-expand
      >
        <template v-slot:item.time="{ item }">
          <span>{{ formatDate(item.time) }}</span>
        </template>
        <template v-slot:item._1="{ item }">
          <span>{{ item.odds[item.odds.length - 1].home }}</span>
        </template>
        <template v-slot:item._x="{ item }">
          <span>{{ item.odds[item.odds.length - 1].draw }}</span>
        </template>
        <template v-slot:item._2="{ item }">
          <span>{{ item.odds[item.odds.length - 1].away }}</span>
        </template>
        <template v-slot:expanded-item="{ item, headers }">
          <td :colspan="headers.length">
            <v-data-table
              :headers="odds_headers"
              :items="item.odds"
            >
              <template v-slot:item.time="{ item }">
                <span>{{ formatDate(item.time) }}</span>
              </template>
              <template v-slot:item.home="{ item }">
                <td v-if="item.home_diff==0">
                  <span>
                    {{ item.home }}</span>
                  </span>
                </td>
                <td v-if="item.draw_diff > 0" style="background: green">
                  <span>
                    {{ item.draw }}</span>
                  </span>
                </td>
                <td v-if="item.home_away < 0" style="background: red">
                  <span>
                    {{ item.away }}</span>
                  </span>
                </td>
              </template>
              <template v-slot:item.draw="{ item }">
                <span>{{ item.draw }}</span>
              </template>
              <template v-slot:item.away="{ item }">
                <span>{{ item.away }}</span>
              </template>
            </v-data-table>
          </td>
        </template>
      </v-data-table>
    </v-row>
  </v-container>
</template>

<script>
import moment from 'moment'

export default {
  fetch () {
    const self = this
    self.dison = true
    this.$api.Data.get()
      .then(function (response) {
        console.log(response.data[0])

        const data = response.data
        for (let i = 0; i < response.data.length; i++) {
          const match = response.data[i]
          match.odds[0].home_diff = 0
          match.odds[0].draw_diff = 0
          match.odds[0].away_diff = 0
          for (let j = 1; j < match.odds.length; j++) {
            match.odds[j].home_diff = match.odds[j - 1].home - match.odds[j].home
            match.odds[j].draw_diff = match.odds[j - 1].draw - match.odds[j].draw
            match.odds[j].away_diff = match.odds[j - 1].away - match.odds[j].away
          }
        }

        console.log(data)
        self.items.push(...data)
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
      search: '',
      items: [],
      items_display: [],
      ebookcategories: [],
      ebookcategory: null,
      loading: false,
      odds_headers: [
        {
          text: 'time',
          value: 'time'
        },
        {
          text: '1',
          value: 'home'
        },
        {
          text: 'x',
          value: 'draw'
        },
        {
          text: '2',
          value: 'away'
        }
      ],
      headers: [
        {
          text: 'Home',
          value: 'home'
        },
        {
          text: 'Away',
          value: 'away'
        },
        {
          text: 'Time',
          value: 'time'
        },
        {
          text: '1',
          value: '_1'
        },
        {
          text: 'x',
          value: '_x'
        },
        {
          text: '2',
          value: '_2'
        }
      ]
    }
  },

  methods: {
    formatDate (value) {
      return moment(value).format('YY/MM/DD hh:mm')
    }
  }
}
</script>
