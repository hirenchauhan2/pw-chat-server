/* eslint-disable no-undef */
// eslint-disable-next-line
new Vue({
  el: '#app',
  data: {
    valid: false,
    resetToken: null,
    pass1: '',
    pass1Rules: [
      (v) => !!v || 'Password is required'
    ],
    pass2: '',
    pass2Rules: [
      (v) => !!v || 'Password confirmation is required'
    ],
    hidePass1: true,
    hidePass2: true,
    resetSuccess: false,
    showAlert: false,
    alertIcon: '',
    loading: false,
    alertColor: '',
    message: '',
  },
  methods: {
    changePassword(pass1, pass2) {
      if (!pass1 === pass2) {
        return false;
      }

      if (!this.valid) {
        log('Not valid form');
        return false;
      }
      const token = this.resetToken;
      const authManagement = app.service('authManagement');

      this.loading =  true;
      authManagement.create({ action: 'resetPwdLong',
        value: {
          token, // compares to .resetToken
          password: pass2, // new password
        }
      }).then(result => {
        this.loading = false;
        this.message = 'Your password has been reset. Please log in to app with new password!';
        this.alertColor = 'success';
        this.alertIcon = 'check_circle';
        this.showAlert = true;
        this.resetSuccess = true;
        log('Success ', result);
      })
        .catch(err => {
          this.message = 'Sorry, but we could not reset your password. Please try again';
          this.loading = false;
          this.alertColor = 'error';
          this.alertIcon = 'warning';
          this.showAlert = true;
          log('Error ', err);
        });
    }
  },
  mounted: () => {
    const resetToken = window.resetToken || null;
    this.resetToken = resetToken;
  }
});

// eslint-disable-next-line
const log = (...args) => console.log(args);
