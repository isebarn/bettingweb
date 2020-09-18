<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      dense
      :loading="loading"
      :items-per-page="-1"
    >
      <template v-slot:item.Yes.Value="{ item }">
        <td v-if="item.Yes" :class="[ item.Yes.Increment == 0 ? 'equal' : (item.Yes.Increment < 0 ? 'less' : 'more')]">
          {{ parseFloat(item.Yes.Value).toFixed(2) }}
        </td>
      </template>
      <template v-slot:item.No.Value="{ item }">
        <td v-if="item.No" :class="[ item.No.Increment == 0 ? 'equal' : (item.No.Increment < 0 ? 'less' : 'more')]">
          {{ parseFloat(item.No.Value).toFixed(2) }}
        </td>
      </template>
      <template v-slot:item.Value="{ item }">
        <td :class="[ item.increment == 0 ? 'equal' : (item.increment < 0 ? 'less' : 'more')]">
          {{ parseFloat(item.Value).toFixed(2) }}
        </td>
      </template>
      <template v-slot:item.Time="{ item }">
        <span> {{ item.Day ? formatDate(item.Time) : formatTime(item.Time) }}</span>
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  fetch () {
    const self = this
    self.loading = true
    this.$api.Match.prices({ market: this.market.Id, collection: this.market.Collection })
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
      loading: false,
      items: []
    }
  },

  computed: {
    ...mapGetters(['market']),

    headers () {
      const results = []
      if (!this.market) { return results }

      // OPTIONS LINE
      if (this.market.Headers[0] !== '') {
        return [
          {
            text: 'Result',
            value: 'SN'
          },
          {
            text: this.market.collection.Value,
            value: 'Value'
          },
          {
            text: 'Time',
            value: 'Time'
          }
        ]
      }
      // VAL-OPTIONS LINE
      if (this.market.Headers[0] === '') {
        results.push({ text: 'Result', value: 'Description' })
        for (let i = 1; i < this.market.Headers.length; i++) {
          results.push({
            text: this.market.Headers[i],
            value: this.market.Headers[i] + '.Value'
          })
        }
        results.push({ text: 'Time', value: 'Time' })
        return results
      }

      for (let i = this.market.Headers.length - 1; i >= 0; i--) {
        const item = {}
        item.text = this.market.Headers[i]
        item.value = 'Value'
        results.push(item)
      }
      return results
    }
  },

  created () {
    console.log(123)
  },

  methods: {
    formatDate (value) {
      return moment(value).format('YY/MM/DD HH:mm')
    },
    formatTime (value) {
      return moment(value).format('HH:mm')
    }
  }
}
</script>
