export const state = () => ({
  league: null,
  competition: null,
  market: null
})

export const mutations = {
  league: (state, payload) => {
    state.league = payload
  },

  competition: (state, payload) => {
    state.competition = payload
  },

  market: (state, payload) => {
    state.market = payload
  }
}

export const getters = {
  league: (state) => {
    return state.league
  },

  competition: (state) => {
    return state.competition
  },

  market: (state) => {
    return state.market
  }
}

export const actions = {
  select_league ({ commit }, league) {
    commit('league', league)
  },

  select_competition ({ commit }, competition) {
    commit('competition', competition)
  },

  select_market ({ commit }, market) {
    commit('market', market)
  }
}
