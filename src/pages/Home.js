import { useEffect } from 'react';
import useLocalStorage from "../hooks/useLocalStorage";
import { useHistory } from 'react-router-dom';

const Home = props => {


  const [accessToken, setAccessToken] = useLocalStorage('accessToken');
  let history = useHistory();


  console.log('access token: ', accessToken);


  useEffect(() => {
    if (!accessToken || accessToken === '') {
      history.push('/');
    }
  }, [accessToken, history])


  return <div>Home</div>
}


export default Home;