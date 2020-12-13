export const CLIENT_ID = 'ef63912df461471e88ae3535565584b0';
export const CODE_VERIFIER = 'pGORwWuRVw0Si4JE8u0tRzqUfv~v8FgOe5-FDThHxLg6~IgeNqMI8bH6rN4bUl8plxEJqE5uX1sOFF0qQC9AKFMmrFJq~B-rO.FSIRHHCWyOEsU72WuHmXv9ndTdYzxc';
export const CODE_CHALLENGE = 'A8qIxXBySssf5hZDmqIhEGZs0o2CXMBplm30mJbogtw'
export const REDIRECT_URI = 'http://localhost:3000/';
export const STATE = 'shubham0107';

export const ACCESS_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

export const AUTHORIZATION_URL = 'https://accounts.spotify.com/authorize';
export const AUTHORIZATION_QUERY = {
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

export const ACCESS_TOKEN_QUERY = {
  client_id: CLIENT_ID,
  grant_type: 'authorization_code',
  code: '',
  redirect_uri: REDIRECT_URI,
  code_verifier: CODE_VERIFIER
}