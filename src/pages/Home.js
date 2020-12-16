import { useEffect, useState, useRef } from 'react';
import useLocalStorage from "../hooks/useLocalStorage";
import { useHistory } from 'react-router-dom';
import SpotifyService from '../SpotifyService';
import './Home.scss';



const Home = props => {


  let history = useHistory();
  const [accessToken, setAccessToken] = useLocalStorage('accessToken');
  const [topTracks, setTopTracks] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const spotify = useRef(null);

  // console.log('access token: ', accessToken);


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
        offset: 0,
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
  }, [accessToken, history, spotify, setAccessToken])


  // function setCurrentTrack(track) {
  //   console.log('setting track: ', track)
  //   currentTrack.current = track;
  // }


  function getTrackDetails(trackId) {
    return spotify.current.spotifyApi.getTrack(trackId);
  }

  if (!topTracks) {
    return <div className="h-screen bg-black text-white text-center">Loading....</div>
  }

  if (topTracks) {
    return <div className="h-screen grid grid-cols-2 place-items-auto bg-black text-white p-10">

      <div className="max-h-screen overflow-y-auto px-5 -mx-5">
        <h3 className="mb-2">Last Month</h3>
        <TopSongs tracks={topTracks[0].items} setCurrentTrack={setCurrentTrack} getTrackDetails={getTrackDetails} />
        <h3 className="mb-2">Last 6 Months</h3>
        <TopSongs tracks={topTracks[1].items} setCurrentTrack={setCurrentTrack} getTrackDetails={getTrackDetails} />
        <h3 className="mb-2">All Time</h3>
        <TopSongs tracks={topTracks[2].items} setCurrentTrack={setCurrentTrack} getTrackDetails={getTrackDetails} />
      </div>

      <div className="max-h-screen">
        <TrackPreview track={currentTrack} />
      </div>
    </div>
  }
}



const TopSongs = ({ tracks, setCurrentTrack, getTrackDetails }) => {
  console.log('rendering TOP SONGS:');
  const currentAudio = useRef(null);

  function playAudio(track) {
    setCurrentTrack(track);
    let { id, preview_url } = track;
    if (preview_url) {
      currentAudio.current = new Audio(preview_url);
      currentAudio.current.play();
    } else {
      getTrackDetails(`${id}?market=from_token`).then(trackDetails => {
        console.log('track data: ', trackDetails);
        // setCurrentTrack(trackDetails);
        currentAudio.current = new Audio(trackDetails.preview_url);
        currentAudio.current.play();
      }).catch(err => {
        console.log('error: ', err);
      })
    }
  }

  function stopAudio(url) {
    currentAudio.current.pause();
    setCurrentTrack(null)
  }

  return (
    <div className="grid grid-cols-10 mb-5">
      {tracks.map(track => {
        const { id, name, album } = track;
        const { images } = album;
        return (
          <div
            key={id}
            className="z-0 transform ease-in-out transition hover:scale-150 hover:z-20 hover:shadow-lg"
            onMouseEnter={e => playAudio(track)}
            onMouseLeave={e => stopAudio(track)}
          >
            <img src={images[0].url} alt="song-img" />
          </div>
        )
      })}
    </div>
  )
}


const TrackPreview = ({ track }) => {
  // console.log('track preview: ', track)
  if (track) {
    const { name, album, artists } = track;
    const { images } = album;
    const artistName = artists.reduce(((completeName, artist, index) => {
      if (index === artists.length - 1 && artists.length > 1) {
        completeName += ' & ';
      } else {
        completeName += index !== 0 ? ', ' : '';
      }
      return completeName += ` ${artist.name}`
    }), '');
    return <div className="m-20 mb-0">
      <div className="">
        <img src={images[0].url} alt={name} />
      </div>
      <h2 className="text-2xl mt-2 leading-tight">{name}</h2>
      <h3 className="text-sm italic">{artistName}</h3>
    </div>
  }

  return '';
}


export default Home;