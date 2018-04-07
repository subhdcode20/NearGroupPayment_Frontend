let env = process.env.NODE_ENV
import dev from './development'
import prod from './production'
let config = {}

if(env == 'development') {
  console.log('development--');
  config = dev
  console.log('config= ', config);
}
if(env == 'production') {
  console.log('production--');
  config = prod
  console.log('config= ', config);
}

module.exports = config
