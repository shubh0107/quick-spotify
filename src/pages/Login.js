import { useEffect, useLayoutEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import { parse, stringifyUrl, stringify } from 'query-string';
import {
  AUTHORIZATION_URL,
  STATE,
  ACCESS_TOKEN_ENDPOINT,
  AUTHORIZATION_QUERY_2
} from './utilities/constants';
import useLocalStorage from '../hooks/useLocalStorage';
import { Button } from '../components';
import { ReactComponent as Music } from '../assets/music.svg';
import { useSpotify, SPOTIFY_ACTIONS } from '../spotifyContext';

const Login = props => {
  // const [userData, setUserData] = useState(undefined);
  // const [accessToken, setAccessToken] = useLocalStorage('accessToken', '');


  const [{ accessToken }, dispatch] = useSpotify();

  const [callingAuthApi, setCallingAuthApi] = useState(false);
  let history = useHistory();


  if (accessToken !== '') {
    history.push('/home');
  }

  const callSpotifyAuthApi = () => {
    setCallingAuthApi(true);
    const finalAuthUrl = stringifyUrl({
      url: AUTHORIZATION_URL,
      query: AUTHORIZATION_QUERY_2
    });
    window.location.href = finalAuthUrl;
  }

  useLayoutEffect(() => {
    const parsedUrl = parse(window.location.hash);
    if (parsedUrl.state === STATE) {
      if (parsedUrl.error) {
        setCallingAuthApi(false);
      } else {
        let accessToken = parsedUrl.access_token;
        dispatch({
          type: SPOTIFY_ACTIONS.setAccessToken,
          payload: accessToken
        })
      }
    } else {
      // setCallingAuthApi(false);
    }
  }, [dispatch, setCallingAuthApi]);


  // function getAccessToken(queryForToken) {
  //   axios.post(ACCESS_TOKEN_ENDPOINT, stringify(queryForToken)).then(res => {
  //     setAccessToken(res.data.access_token);
  //     // setIsAuthenticated(res.data);
  //   }).catch(err => {
  //     console.log('ERROR: ', err);
  //   })
  // }

  if (accessToken === '') {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="h-full w-2/3 flex flex-col items-center justify-between py-8 px-6">
          <div className="text-green-500 text-6xl font-mono">Quick Spotify</div>
          <Music />
        </div>
        <Button onClick={callSpotifyAuthApi} classes="h-full w-1/3 flex items-center justify-center border-t-0 border-b-0 border-r-0 text-3xl group">
          <div className="flex items-center p-2 rounded-md group-hover:bg-black group-hover:text-white group-hover:animate-bounce transition-colors duration-200">
            Login
            <div className="w-8 h-8 ml-2">
              {callingAuthApi ?
                <svg class="animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="#111927" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                :
                <SpotifyIcon />
              }
            </div>
          </div>
        </Button>
      </div >
    )
  }

  return '';

}


const SpotifyIcon = props => {
  return (
    // <div>
    <svg className="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1333.33 1333.3" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd"><path d="M666.66 0C298.48 0 0 298.47 0 666.65c0 368.19 298.48 666.65 666.66 666.65 368.22 0 666.67-298.45 666.67-666.65C1333.33 298.49 1034.88.03 666.65.03l.01-.04zm305.73 961.51c-11.94 19.58-37.57 25.8-57.16 13.77-156.52-95.61-353.57-117.26-585.63-64.24-22.36 5.09-44.65-8.92-49.75-31.29-5.12-22.37 8.84-44.66 31.26-49.75 253.95-58.02 471.78-33.04 647.51 74.35 19.59 12.02 25.8 37.57 13.77 57.16zm81.6-181.52c-15.05 24.45-47.05 32.17-71.49 17.13-179.2-110.15-452.35-142.05-664.31-77.7-27.49 8.3-56.52-7.19-64.86-34.63-8.28-27.49 7.22-56.46 34.66-64.82 242.11-73.46 543.1-37.88 748.89 88.58 24.44 15.05 32.16 47.05 17.12 71.46V780zm7.01-189.02c-214.87-127.62-569.36-139.35-774.5-77.09-32.94 9.99-67.78-8.6-77.76-41.55-9.98-32.96 8.6-67.77 41.56-77.78 235.49-71.49 626.96-57.68 874.34 89.18 29.69 17.59 39.41 55.85 21.81 85.44-17.52 29.63-55.89 39.4-85.42 21.8h-.03z" fill="#1ed760" fill-rule="nonzero" /></svg>
    // </div>
  )
}

export default Login;