// Initializes the `user-mgmt` service on path `/emails`
const Mailer = require('feathers-mailer');
// const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const XOAuth2 = require('xoauth2');
const fs = require('fs');

const hooks = require('./emails.hooks');

module.exports = function() {
  const app = this;
  const tls = {
    // do not fail on invalid certs
    rejectUnauthorized: false
  };

  const xoauth2Generator = XOAuth2.createXOAuth2Generator(app.get('authentication').gmail);

  xoauth2Generator.on('token', (token) => {
    // eslint-disable-next-line
    console.log('New token for %s: %s', token.user, token.accessToken);
    fs.writeFileSync('token.txt', token.accessToken);
  });

  let transporter;
  // const isProd = process.env.NODE_ENV === 'production';

  // if (!isProd) {
  // transporter = nodemailer.createTransport({
  //   host: 'smtp.ethereal.email',
  //   port: 587,
  //   auth: app.get('authentication').ethereal,
  //   tls
  // });
  // } else if (isProd) {
  transporter = smtpTransport({
    service: 'Gmail',
    auth: {
      xoauth2: xoauth2Generator
    },
    tls
  });
  // }

  transporter
    .verify()
    .then(() => {
      console.log('Server is ready to send emails'); // eslint-disable-line
    })
    .catch(e => { // eslint-disable-line
      console.log('Error verifying '); // eslint-disable-line
    });

  // Initialize our service with any options it requires
  app.use('/emails', Mailer(transporter));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('emails');

  service.hooks(hooks);
};
