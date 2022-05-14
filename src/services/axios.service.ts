"use strict";

import axios from "axios";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const config = {
  baseURL: process.env.VUE_APP_SERVER_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Content-Type': 'application/json'
  },
  timeout: 60 * 1000,
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    return config;
  },
  function(error) {
    // Do something with request error
    console.error(error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  function(error) {
    // Do something with response error
    let responseData = error.response.data;
    let keys = Object.keys(responseData);
    let errorMessage = 'Something went wrong. Please try again.';
    // eslint-disable-next-line no-prototype-builtins
    if (keys.hasOwnProperty('errors')) {
      responseData = responseData.errors;
      keys = Object.keys(responseData);
      errorMessage = (responseData[keys[0]]);
    } else {
      errorMessage = responseData[keys[0]];
    }
    // if (error.response.status === 422) {
    //
    // }
    console.error(error);
    return Promise.reject(error);
  }
);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
_axios.setAuthorizationHeader = (token) => {
  if (token) {
    _axios.defaults.headers.common.Authorization = token;
  } else {
    delete _axios.defaults.headers.common.Authorization;
  }
};

// // For automatically refresh/update authentication header on load
// import store from '../store';
// const auth = store.getters['authentication/auth'];
// if (auth) {
//   _axios.setAuthorizationHeader(auth.token);
// }

// const AxiosPlugin = {
//   install: function(app: any, options: any) {
//     console.log(app)
//     app.config.globalProperties.axios = _axios;
//     app.config.globalProperties.$axios = _axios;
//   }
// };

export default _axios;
