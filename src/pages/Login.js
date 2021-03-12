import { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
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

const Login = props => {
  const [userData, setUserData] = useState(undefined);
  const [accessToken, setAccessToken] = useLocalStorage('accessToken', '');
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

  useEffect(() => {
    const parsedUrl = parse(window.location.hash);
    if (parsedUrl.state === STATE) {
      if (parsedUrl.error) {
        setCallingAuthApi(false);
      } else {
        let accessToken = parsedUrl.access_token;
        setAccessToken(accessToken);
      }
    } else {
      // setCallingAuthApi(false);
    }
  }, [setAccessToken, setCallingAuthApi]);


  function getAccessToken(queryForToken) {
    axios.post(ACCESS_TOKEN_ENDPOINT, stringify(queryForToken)).then(res => {
      setAccessToken(res.data.access_token);
      // setIsAuthenticated(res.data);
    }).catch(err => {
      console.log('ERROR: ', err);
    })
  }

  if (accessToken === '') {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="h-full w-2/3 flex flex-col items-center justify-between py-8 px-6">
        <div className="text-green-500 text-6xl font-mono">Quick Spotify</div>
          <Music />
        </div>
          <Button onClick={callSpotifyAuthApi} classes="h-full w-1/3 flex items-center justify-center border-t-0 border-b-0 border-r-0 text-3xl">
            <span className="animate-bounce">Login</span>
          {callingAuthApi &&
              <svg class="animate-spin text-white h-6 w-6 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="#111927" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            }
          </Button>
      </div >
    )
  }

  return '';

}

export default Login;