if (process.env.NODE_ENV === 'production') {
  console.log('process.env.NODE_ENV in root = ', process.env.NODE_ENV);
    module.exports = require('./Root.prod');
} else {
    module.exports = require('./Root.dev');
}
