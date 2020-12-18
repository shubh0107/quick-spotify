import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import useLocalStorage from "../hooks/useLocalStorage";
import { useHistory } from 'react-router-dom';
import SpotifyService from '../SpotifyService';
import './Home.scss';
import { Button } from '../components';
import { Modal } from '../components';

const Home = props => {

  let history = useHistory();
  const [accessToken, setAccessToken] = useLocalStorage('accessToken');
  const [topTracks, setTopTracks] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const spotify = useRef(null);

  const [openModal, setOpenModal] = useState(false);


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
          setTopTracks(res);
        }).catch(err => {
          console.log('error: ', err);
          if (err.status === 401) {
            setAccessToken('');
          }
        })
    }
  }, [accessToken, history, spotify, setAccessToken])

  function getTrackDetails(trackId) {
    return spotify.current.spotifyApi.getTrack(trackId);
  }

  if (!topTracks) {
    return <div className="h-screen bg-gray-900 text-white text-center">Loading....</div>
  }

  if (topTracks) {
    return <div className="h-full grid grid-cols-2 place-items-auto bg-gray-900 text-white p-10">

      <div className="px-5 -mx-5">
        <h3 className="mb-2 initial-click">Last Month</h3>
        <TopSongs tracks={topTracks[0].items} setCurrentTrack={setCurrentTrack} getTrackDetails={getTrackDetails} />
        <h3 className="mb-2">Last 6 Months</h3>
        <TopSongs tracks={topTracks[1].items} setCurrentTrack={setCurrentTrack} getTrackDetails={getTrackDetails} />
        <h3 className="mb-2">All Time</h3>
        <TopSongs tracks={topTracks[2].items} setCurrentTrack={setCurrentTrack} getTrackDetails={getTrackDetails} />
      </div>

      <div className="">
        {currentTrack ? <TrackPreview track={currentTrack} getTrackDetails={getTrackDetails} accessToken={accessToken} /> : ''}
      </div>
      <div>
        {/* <Button onClick={() => setOpenModal(true)}>Open</Button> */}
      </div>
      {/* <Modal visible={true} /> */}
    </div>
  }
}



const TopSongs = ({ tracks, setCurrentTrack, getTrackDetails }) => {
  console.log('rendering TOP SONGS:');
  const currentAudio = useRef(null);

  function playAudio(track) {
    // let isPreviousAudioPlaying = currentAudio.current.currentTime > 0 &&
    //  !currentAudio.current.paused && !currentAudio.current.ended && currentAudio.current.readyState > 2;

    // if (isPreviousAudioPlaying) {
    //   currentAudio.current.pause();
    // }

    // if (currentAudio.current && currentAudio.current.currentTime > 0) {
    //   currentAudio.current.pause();
    // }
    setCurrentTrack(track);
    let { id, preview_url } = track;

    if (preview_url) {
      // currentAudio.current = new Audio(preview_url);
      // currentAudio.current.play();
    } else {
      // getTrackDetails(`${id}?market=from_token`).then(trackDetails => {
      //   console.log('track data: ', trackDetails);
      //   // currentAudio.current = new Audio(trackDetails.preview_url);
      //   // currentAudio.current.play();
      // }).catch(err => {
      //   console.log('error: ', err);
      // })
    }
  }

  function stopAudio(url) {
    // currentAudio.current.pause();
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


const TrackPreview = ({ track, getTrackDetails, accessToken }) => {
  // console.log('track preview: ', track)
  let { id, preview_url } = track;
  const currentAudio = useRef(null);

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();



  useEffect(() => {

    function playAudio(url) {
      if (url) {
        currentAudio.current = new Audio(url);
        currentAudio.current.play();
      } else {
        axios.get(`https://api.spotify.com/v1/tracks/${id}?market=from_token`, {
          headers: { 'Authorization': `Bearer ${accessToken}` },
          cancelToken: source.token
        }).then(({data}) => {
          console.log('playng audio: ', data);
          if (data.preview_url) {
            playAudio(data.preview_url);
          }
        }).catch(err => {
          if (axios.isCancel(err)) {
            console.log('Request canceled', err.message);
          } else {
            console.log('error: ', err);
          }
        })
      }

    }

    if (currentAudio.current) {
      currentAudio.current.pause();
    }

    playAudio(preview_url);

    return () => {
      source.cancel('New track received.');

      if (currentAudio.current) {
        currentAudio.current.pause();
      }
    }
  }, [id, preview_url, getTrackDetails, accessToken, source]);


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
    return <div className="sticky top-20 m-20 mb-0">
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