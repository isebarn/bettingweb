<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <LeagueTable :league="league" />
      </v-col>
      <v-col v-if="league != null" cols="3">
        <MatchTable :key="league.Id" />
      </v-col>
      <v-col v-if="competition" cols="6">
        <CompetitionTable :key="competition.Id" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import LeagueTable from '~/components/LeagueTable.vue'
import MatchTable from '~/components/MatchTable.vue'
import CompetitionTable from '~/components/CompetitionTable.vue'
export default {
  components: {
    LeagueTable,
    MatchTable,
    CompetitionTable
  },

  computed: {
    ...mapGetters(['league', 'competition'])
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
