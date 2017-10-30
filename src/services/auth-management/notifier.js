const isProd = process.env.NODE_ENV === 'production';
const path = require('path');
const jade = require('jade');

module.exports = function(app) {
  const returnEmail = app.get('complaint_email') || process.env.COMPLAINT_EMAIL;

  function getLink(type, hash) {
    var port = app.get('port') === '80' || isProd ? '' : ':' + app.get('port');
    var host = app.get('host') === 'HOST' ? 'localhost' : app.get('host');
    var protocol = (app.get('protocol') === 'PROTOCOL') ? 'http': app.get('protocol');

    protocol += '://';
    return `${protocol}${host}${port}/login/${type}/${hash}`;
  }

  function sendEmail(email) {
    return app
      .service('emails')
      .create(email)
      .then(function(result) {
        console.log('Sent email', result); // eslint-disable-line
      })
      .catch(err => {
        console.log('Error sending email', err); // eslint-disable-line
      });
  }

  return {
    // eslint-disable-next-line
    notifier: function(type, user, notifierOptions) {
      const APP_EMAIL = app.get('EMAIL');

      console.log(`-- Preparing email for ${type}`); // eslint-disable-line
      var hashLink;
      var email;
      var emailAccountTemplatesPath = path.join(
        app.get('src'),
        'email-templates',
        'account'
      );
      var templatePath;
      var compiledHTML;
      switch (type) {
      case 'resendVerifySignup': // send another email with link for verifying user's email addr
        hashLink = getLink('verify', user.verifyToken);

        templatePath = path.join(
          emailAccountTemplatesPath,
          'verify-email.jade'
        );

        compiledHTML = jade.compileFile(templatePath)({
          logo: '',
          name: user.name || user.email,
          hashLink,
          returnEmail
        });

        email = {
          from: `PW Chat App <${APP_EMAIL}>`,
          to: user.email,
          subject: 'Confirm Signup',
          html: compiledHTML
        };

        return sendEmail(email);

      case 'verifySignup': // inform that user's email is now confirmed
        hashLink = getLink('verify', user.verifyToken);

        templatePath = path.join(
          emailAccountTemplatesPath,
          'email-verified.jade'
        );

        compiledHTML = jade.compileFile(templatePath)({
          logo: '',
          name: user.name || user.email,
          hashLink,
          returnEmail
        });

        email = {
          from: `PW Chat App <${APP_EMAIL}>`,
          to: user.email,
          subject: 'Thank you, your email has been verified',
          html: compiledHTML
        };

        return sendEmail(email);

      case 'sendResetPwd': // inform that user's email is now confirmed
        hashLink = getLink('reset', user.resetToken);

        templatePath = path.join(
          emailAccountTemplatesPath,
          'reset-password.jade'
        );

        compiledHTML = jade.compileFile(templatePath)({
          logo: '',
          name: user.name || user.email,
          hashLink,
          returnEmail
        });

        email = {
          from: `PW Chat App <${APP_EMAIL}>`,
          to: user.email,
          subject: 'Reset Password',
          html: compiledHTML
        };

        return sendEmail(email);

      case 'resetPwd': // inform that user's email is now confirmed
        hashLink = getLink('reset', user.resetToken);

        templatePath = path.join(
          emailAccountTemplatesPath,
          'password-was-reset.jade'
        );

        compiledHTML = jade.compileFile(templatePath)({
          logo: '',
          name: user.name || user.email,
          hashLink,
          returnEmail
        });

        email = {
          from: `PW Chat App <${APP_EMAIL}>`,
          to: user.email,
          subject: 'Your password was reset',
          html: compiledHTML
        };

        return sendEmail(email);

      case 'passwordChange':
        templatePath = path.join(
          emailAccountTemplatesPath,
          'password-change.jade'
        );

        compiledHTML = jade.compileFile(templatePath)({
          logo: '',
          name: user.name || user.email,
          returnEmail
        });

        email = {
          from: `PW Chat App <${APP_EMAIL}>`,
          to: user.email,
          subject: 'Your password was changed',
          html: compiledHTML
        };

        return sendEmail(email);

      case 'identityChange':
        hashLink = getLink('verifyChanges', user.verifyToken);

        templatePath = path.join(
          emailAccountTemplatesPath,
          'identity-change.jade'
        );

        compiledHTML = jade.compileFile(templatePath)({
          logo: '',
          name: user.name || user.email,
          hashLink,
          returnEmail,
          changes: user.verifyChanges
        });

        email = {
          from: `PW Chat App <${APP_EMAIL}>`,
          to: user.email,
          subject: 'Your account was changed. Please verify the changes',
          html: compiledHTML
        };

        return sendEmail(email);

      default:
        break;
      }
    }
  };
};
