'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('import-product')
      .service('myService')
      .getWelcomeMessage();
  },
});
