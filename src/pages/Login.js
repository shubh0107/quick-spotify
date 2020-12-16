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


const Login = props => {
  const [userData, setUserData] = useState(undefined);
  const [accessToken, setAccessToken] = useLocalStorage('accessToken', '');
  // const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  let history = useHistory();
  if (accessToken !== '') {
    history.push('/home');
  }


  const callSpotifyAuthApi = () => {
    const finalAuthUrl = stringifyUrl({
      url: AUTHORIZATION_URL,
      query: AUTHORIZATION_QUERY_2
    });
    window.location.href = finalAuthUrl;
  }

  useEffect(() => {
    const parsedUrl = parse(window.location.hash);
    console.log('location: ', window.hash);
    console.log('PARSED URL: ', parsedUrl);
    if (parsedUrl.state === STATE) {
      if (parsedUrl.error) {
        console.log('ERROR: ', parsedUrl.error);
      } else {
        let accessToken = parsedUrl.access_token;
        // const spotify = new SpotifySerivce(accessToken);
        setAccessToken(accessToken);
        // spotify.spotifyApi.getMe().then(res => {
        //   setUserData(res);
        //   console.log('user data: ', res);
        // }).catch(err => {
        //   console.log('error: ', err);
        // })
        // ACCESS_TOKEN_QUERY.code = code;
        // if (accessToken === '') {
        //   getAccessToken(ACCESS_TOKEN_QUERY)
        // } else {
        //   if (!userData) {
        //     const spotify = new SpotifySerivce(accessToken);
        //     spotify.spotifyApi.getMe().then(res => {
        //       setUserData(res);
        //     }).catch(err => {
        //       console.log('error: ', err);
        //     })
        //   }
        // }
      }
    } else {
      console.log('ERROR: WRONG STATE');
    }
  });


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
      <div className="h-screen flex items-center justify-center bg-black">
        <Button onClick={callSpotifyAuthApi}>
          Login
        </Button>
      </div >
    )
  } else {
    return <div className="">
      {JSON.stringify(userData, undefined, 2)}
    </div>
  }

}

export default Login;