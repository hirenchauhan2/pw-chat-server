/* eslint-disable no-undef,no-unused-vars */

const app = feathers()
  .configure(feathers.hooks())
  .configure(feathers.rest('/').axios(window.axios));
