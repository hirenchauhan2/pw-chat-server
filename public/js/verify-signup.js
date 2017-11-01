/* eslint-disable no-undef */

// eslint-disable-next-line
const appComp = new Vue({
  el: '#app',
  data: {
    showAlert: false,
    alertIcon: '',
    loading: false,
    alertColor: '',
    message: '',
    verifyToken: '',
    verified: false
  },
  mounted: function() {
    this.verifyToken = window.verifyToken ? window.verifyToken.toString() : null;
    console.log('Got verifyToken: ', this.verifyToken); // eslint-disable-line
  },
  methods: {
    verifySignup: function() {
      if(!this.verifyToken) { return false; }
      const token = this.verifyToken;
      const authManagement = app.service('authManagement');

      this.loading = true;
      authManagement.create({
        action: 'verifySignupLong',
        value: token
      })
        .then(result => {
          this.loading = false;
          this.message = 'Your email has been verified. Please log in to app!';
          this.alertColor = 'success';
          this.alertIcon = 'check_circle';
          this.showAlert = true;
          this.verified = true;
          log('Success ', result);
        })
        .catch(err => {
          this.message = 'Sorry, but we could not verify your email.';
          this.loading = false;
          this.alertColor = 'error';
          this.alertIcon = 'warning';

          this.showAlert = true;
          log('Error ', err);
        });
    }
  }
});


const log = (...args) => console.log(args); // eslint-disable-line
