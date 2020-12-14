export const CLIENT_ID = 'ef63912df461471e88ae3535565584b0';
export const CODE_VERIFIER = 'pGORwWuRVw0Si4JE8u0tRzqUfv~v8FgOe5-FDThHxLg6~IgeNqMI8bH6rN4bUl8plxEJqE5uX1sOFF0qQC9AKFMmrFJq~B-rO.FSIRHHCWyOEsU72WuHmXv9ndTdYzxc';
export const CODE_CHALLENGE = 'A8qIxXBySssf5hZDmqIhEGZs0o2CXMBplm30mJbogtw'
export const REDIRECT_URI = 'http://localhost:3000/';
export const STATE = 'shubham0107';

export const ACCESS_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
export const AUTHORIZATION_URL = 'https://accounts.spotify.com/authorize';
export const SCOPES = [
  'user-read-recently-played',
  'app-remote-control',
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-top-read'
];

export const ALL_SCOPES = [
  'ugc-image-upload',
  'user-read-recently-played',
  'user-top-read',
  'user-read-playback-position',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'app-remote-control',
  'streaming',
  'playlist-modify-public',
  'playlist-modify-private',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-follow-modify',
  'user-follow-read',
  'user-library-modify',
  'user-library-read',
  'user-read-email',
  'user-read-private'
];

// for PKCE flow
export const AUTHORIZATION_QUERY = {
  client_id: CLIENT_ID,
  response_type: 'code',
  redirect_uri: REDIRECT_URI,
  code_challenge_method: 'S256',
  code_challenge: CODE_CHALLENGE,
  state: STATE,
  scope: ALL_SCOPES
};

// for implicit grant
export const AUTHORIZATION_QUERY_2 = {
  client_id: CLIENT_ID,
  response_type: 'token',
  redirect_uri: REDIRECT_URI,
  state: STATE,
  scope: ALL_SCOPES,
  show_dialog: false
};

export const ACCESS_TOKEN_QUERY = {
  client_id: CLIENT_ID,
  grant_type: 'authorization_code',
  code: '',
  redirect_uri: REDIRECT_URI,
  code_verifier: CODE_VERIFIER
}