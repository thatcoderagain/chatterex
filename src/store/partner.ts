export default {

  namespaced: true,

  state: {
    partner: {id: '', name: '', sex: null},
  },

  getters: {
    partner: (state: any) => state.partner,
  },

  mutations: {
    setPartner: (state: any, partner: any) => {
      state.partner = {...partner};
    },
  },

  actions: {
    updatePartner: async ({ commit }: any, partner: any) => {
      await commit('partner/setPartner', partner, {root: true});
    },
  },
};
