/* eslint-disable no-undef,no-unused-vars */
const { protocol, host} = window.location
const APP_URL = `${protocol}//${host}`

const app = feathers()
  .configure(feathers.hooks())
  .configure(feathers.rest(APP_URL).axios(window.axios));
