import { createStore } from 'vuex';
import createPersistedState from "vuex-persistedstate";
import user from "./user";
import partner from "@/store/partner";

const store = createStore({
  plugins: [createPersistedState({
    key: 'thatcoderagain.io.chatter',
    storage: window.sessionStorage,
  })],
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    user,
    partner,
  },
});

export default store;
