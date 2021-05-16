import { useEffect, useRef, useState } from 'react';
import { Button } from '../components';
import useLocalStorage from '../hooks/useLocalStorage';
import { useHistory } from 'react-router-dom';
import SpotifyService from '../SpotifyService';




const Header = props => {

  const getUserDetails = (accessToken) => {
    const spotifyApi = new SpotifyService(accessToken);
    return spotifyApi.spotifyApi.getMe();
    // .then(resp => {
    //   // setCurrentUser(resp);
    //   return resp;
    // }).catch(err => {
    //   console.log("error in get me: ", err);
    // })
  }

  const [accessToken, setAccessToken] = useLocalStorage('accessToken');
  const [currentUser, setCurrentUser] = useState(accessToken ? () => {
    getUserDetails(accessToken).then(userDetails => {
      return userDetails;
    }).catch(err => {
      return null;
    });
  } : null);

  let history = useHistory();
  const spotify = useRef(null);

  useEffect(() => {
    if (accessToken) {
      getUserDetails(accessToken).then(userDetails => {
        setCurrentUser(userDetails);
      }).catch(err => {
        console.log('error in getting user details: ', err);
      })
    }
    // return () => {
    //   cleanup
    // }
  }, [accessToken])

  async function logout() {
    await setAccessToken('');
    history.push('/');
  }

  return <header className="flex justify-between h-full sticky top-0 px-6 py-4 z-30 bg-gray-900 border-b border-green-500">
    <h1 className="text-3xl text-green-500 font-mono">Quick Spotify</h1>
    <Button onClick={logout} classes="flex items-center">
      Logout
      {currentUser ? <UserImage image={currentUser.images[0]} userName={currentUser.display_name} /> : ''}
    </Button>
  </header>
}

const UserImage = ({ image, userName }) => {
  return <div className="ml-2">
    <img src={image.url} alt={userName} className="h-7 w-7 rounded-full" />
  </div>
}



export default Header;