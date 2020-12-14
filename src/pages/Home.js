import { useEffect, useState, useRef } from 'react';
import useLocalStorage from "../hooks/useLocalStorage";
import { useHistory } from 'react-router-dom';
import SpotifyService from '../SpotifyService';

const Home = props => {


  let history = useHistory();
  const [accessToken, setAccessToken] = useLocalStorage('accessToken');
  const [topTracks, setTopTracks] = useState(null);
  const spotify = useRef(null);


  console.log('access token: ', accessToken);


  useEffect(() => {
    if (!accessToken || accessToken === '') {
      history.push('/');
    } else {
      spotify.current = new SpotifyService(accessToken);
      spotify.current.spotifyApi.getMyTopTracks({ 
        limit: 50,
        time_range: 'short_term',
        offset: 0
       }).then(res => {
        console.log('response: ', res);
      }).catch(err => {
        console.log('error: ', err);
      })
    }
  }, [accessToken, history, spotify])


  useEffect(() => {

  }, [])


  return <div>Home</div>
}


export default Home;