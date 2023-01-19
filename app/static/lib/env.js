// global, loads before app
const environments = {
  develop: "develop",
  staging: "staging",
  production: "production"
}

// mei-friend version and date
var env = environments.staging;
const heart = '<svg id="heart" height="1em" viewBox="-50 -50 900 880" xmlns="http://www.w3.org/2000/svg"><path d="M384 864c399-314 384-425 384-512s-72-192-192-192-192 128-192 128-72-128-192-128-192 105-192 192-15 198 384 512z" /></svg>';
// Environment message to display in lower left corner of mei-friend footer
var envMsg = 'Hosted by <a href="https://iwk.mdw.ac.at">IWK</a> at <a href="https://mdw.ac.at">mdw</a>, with ' + heart + ' from Vienna. <a href="https://iwk.mdw.ac.at/impressum">Imprint</a>.';
