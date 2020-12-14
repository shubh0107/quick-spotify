import { useEffect, useState, useRef } from 'react';
import useLocalStorage from "../hooks/useLocalStorage";
import { useHistory } from 'react-router-dom';
import SpotifyService from '../SpotifyService';
import './Home.scss';



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
      let promise1 = spotify.current.spotifyApi.getMyTopTracks({
        limit: 50,
        time_range: 'short_term',
        offset: 0
      });
      let promise2 = spotify.current.spotifyApi.getMyTopTracks({
        limit: 50,
        time_range: 'medium_term',
        offset: 0
      });
      let promise3 = spotify.current.spotifyApi.getMyTopTracks({
        limit: 50,
        time_range: 'long_term',
        offset: 0
      });

      Promise.all([promise1, promise2, promise3])
        .then(res => {
          console.log('response: ', res);
          // let finalArray = [];

          // res.map(resData => {
          //   if (resData.items.length > 0) {
          //     finalArray = finalArray.concat(resData.items);
          //   }
          // })
          setTopTracks(res);
        }).catch(err => {
          console.log('error: ', err);
          if (err.status === 401) {
            setAccessToken('');
          }
        })
    }
  }, [accessToken, history, spotify])

  if (!topTracks) {
    return <div>Loading....</div>
  }

  if (topTracks) {
    return <div className="main-container-home">

      <TopSongs tracks={topTracks[0].items} />
      <TopSongs tracks={topTracks[1].items} />
      <TopSongs tracks={topTracks[2].items} />
    </div>
  }
}



const TopSongs = ({ tracks }) => {
  const currentAudio = useRef(null);

  function playAudio(url) {
    currentAudio.current = new Audio(url);
    currentAudio.current.muted = false;
    currentAudio.current.play();
  }

  function stopAudio(url) {
    currentAudio.current.pause();
  }




  return (
    <div className="top-songs-container">
      <div className="tracks">
        {tracks.map(track => {
          const { id, name, album } = track;
          const { images } = album;

          return (
            <div className="track-container" key={id}>
              <div className="image"
                onMouseEnter={e => playAudio(track.preview_url)}
                onMouseLeave={e => stopAudio(track.preview_url)}
              >
                <img src={images[2].url} alt="song-img" />
              </div>
              {/* <h3>{name}</h3> */}
            </div>
          )
        })}
      </div>
    </div>
  )
}


export default Home;