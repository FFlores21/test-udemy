const packageJSON = require('../../package.json')

export const environment = {
  production: true,
  version: packageJSON['version'],
  host: 'https://allasenlinea.com:9505/'
};
