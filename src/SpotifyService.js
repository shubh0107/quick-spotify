import SpotifyWebApi from 'spotify-web-api-js';


class SpotifyService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.spotifyApi = new SpotifyWebApi();
    this.spotifyApi.setAccessToken(accessToken);
  }

}



export default SpotifyService;