import { Button } from '../components';
import useLocalStorage from '../hooks/useLocalStorage';
import { useHistory } from 'react-router-dom';


const Header = props => {
  const [accessToken, setAccessToken] = useLocalStorage('accessToken');
  let history = useHistory();

  async function logout() {
    await setAccessToken('');
    history.push('/');
  }

  return <header className="flex justify-between h-full sticky top-0 px-6 py-4 z-30 bg-gray-900 border-b border-green-500">
    <h1 className="text-3xl text-green-500 font-mono">Quick Spotify</h1>
    <Button onClick={logout} classes="">
      Logout
    </Button>
  </header>


}



export default Header;