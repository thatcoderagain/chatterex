export default {

  namespaced: true,

  state: {
    user: null,
  },

  getters: {
    user: (state: any) => state.user,
    id: (state: any) => state.user.id,
    name: (state: any) => state.user.name,
    sex: (state: any) => state.user.sex,
    age: (state: any) => state.user.age,
  },

  mutations: {
    setUser: (state: any, user: any) => {
      state.user = {...user};
    },
    setUserId: (state: any, id: any) => {
      state.user = { ...state.user, id };
    },
    setUserName: (state: any, name: any) => {
      state.user = { ...state.user, name };
    },
    setUserSex: (state: any, sex: any) => {
      state.user = { ...state.user, sex };
    },
    setUserAge: (state: any, age: any) => {
      state.user = { ...state.user, age };
    },
  },

  actions: {
    updateUser: async ({ commit }: any, user: any) => {
      await commit('user/setUser', user, {root: true});
    },
    updateUserId: async ({ commit }: any, id: any) => {
      await commit('user/setUserId', id, {root: true});
    },
    updateUserName: async ({ commit }: any, name: any) => {
      await commit('user/setUserName', name, {root: true});
    },
    updateUserSex: async ({ commit }: any, sex: any) => {
      await commit('user/setUserSex', sex, {root: true});
    },
    updateUserAge: async ({ commit }: any, age: any) => {
      await commit('user/setUserAge', age, {root: true});
    },
  },
};
