/* Require jQuery as a dep for Bootstrap JS */
window.jQuery = window.$ = require('./../../node_modules/jquery');

/* Require selective bootstrap components */
require('./../../node_modules/bootstrap-sass/assets/javascripts/bootstrap/collapse')

/* Require your custom CSS, let Parcel do the rest */
require('./../scss/boot.scss')
