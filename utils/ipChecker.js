const geoip = require('geoip-lite');

function checkIP(userIP, userAgent) {
  const geo = geoip.lookup(userIP);
  const address = geo ? geo.region : 'Unknown';
  const city = geo ? geo.city : 'Unknown';
  const country = geo ? geo.country : 'Unknown';
  const region = geo ? geo.region : 'Unknown';

  return {
    ip: userIP,
    pass: (country === 'US' && region === 'GA') || (process.env.DEV),
    address: address,
    city: city,
    country: country,
    region: region,
    deviceType: userAgent
  };
}

module.exports = {
  checkIP
};
