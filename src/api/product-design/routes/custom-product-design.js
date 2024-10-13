module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/product-designs/import',
      handler: 'custom-product-design.importData',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};