/* eslint-disable no-undef,no-unused-vars */

const app = feathers()
  .configure(feathers.hooks())
  .configure(feathers.rest('http://localhost:3030').axios(window.axios));
