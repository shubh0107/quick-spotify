import { useEffect } from 'react';
import axios from 'axios';
import { parseUrl, stringifyUrl, stringify } from 'query-string';
import './App.scss';

const CLIENT_ID = 'ef63912df461471e88ae3535565584b0';
const CODE_VERIFIER = 'pGORwWuRVw0Si4JE8u0tRzqUfv~v8FgOe5-FDThHxLg6~IgeNqMI8bH6rN4bUl8plxEJqE5uX1sOFF0qQC9AKFMmrFJq~B-rO.FSIRHHCWyOEsU72WuHmXv9ndTdYzxc';
const CODE_CHALLENGE = 'A8qIxXBySssf5hZDmqIhEGZs0o2CXMBplm30mJbogtw'
const REDIRECT_URI = 'http://localhost:3000/';
const STATE = 'shubham0107';

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

const url = 'https://accounts.spotify.com/authorize';
const query = {
  client_id: CLIENT_ID,
  response_type: 'code',
  redirect_uri: REDIRECT_URI,
  code_challenge_method: 'S256',
  code_challenge: CODE_CHALLENGE,
  state: STATE,
  scope: [
    'user-read-recently-played',
    'app-remote-control',
    'streaming',
    'user-read-email',
    'user-read-private'
  ]
};

const queryForToken = {
  client_id: CLIENT_ID,
  grant_type: 'authorization_code',
  code: '',
  redirect_uri: REDIRECT_URI,
  code_verifier: CODE_VERIFIER
}


function App() {

  const login = () => {
    const finalAuthUrl = stringifyUrl({
      url,
      query
    });
    window.location.href = finalAuthUrl;
  }

  useEffect(() => {
    const parsedUrl = parseUrl(window.location.href);
    console.log('PARSED URL: ', parsedUrl);


    if (parsedUrl.query.state === STATE) {
      if (parsedUrl.query.error) {
        console.log('ERROR: ', parsedUrl.query.error);
      } else {
        let code = parsedUrl.query?.code;
        queryForToken.code = code;
        axios.post(TOKEN_ENDPOINT, stringify(queryForToken)).then(res => {
          console.log('RESPONSE: ', res);
        }).catch(err => {
          console.log('ERROR: ', err);
        })

      }
    } else {
      console.log('ERROR: WRONG STATE');
    }

  })


  return (
    <div className="main-container">
      <button className="login-button" onClick={login}>
        Login
      </button>
    </div>
  );
}

export default App;
// function generateCodeVerifier() {
//   var code_verifier = generateRandomString(128)
//   document.getElementById("code_verifier").value = code_verifier
// }
// function generateRandomString(length) {
//   var text = "";
//   var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
//   for (var i = 0; i < length; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return text;
// }
// function generateCodeChallenge(code_verifier) {
//   return code_challenge = base64URL(CryptoJS.SHA256(code_verifier))
// }

// function base64URL(string) {
//   return string.toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
// }

// function submit() {
//   var code_verifier = document.getElementById("code_verifier").value
//   var code_challenge = generateCodeChallenge(code_verifier)
//   document.getElementById("code_challenge").innerHTML = code_challenge
//   document.getElementById("code_challenge_div").style.display = "block"
// }
