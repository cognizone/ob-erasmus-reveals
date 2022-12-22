module.exports = [
  {
    context: [''],
    target: 'http://localhost:8080',
    bypass: function (req, res, proxyOptions) {
      if (req.headers.accept && req.headers.accept.indexOf('html') !== -1) {
        return '/index.html';
      }
    },
  },
];
