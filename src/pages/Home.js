import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import useLocalStorage from "../hooks/useLocalStorage";
import { useHistory } from 'react-router-dom';
import SpotifyService from '../SpotifyService';
import './Home.scss';
// import { Button } from '../components';
import { Header, Modal, SelectedTrack } from '../components';

// import { useTransition, useSpring, animated } from 'react-spring';

import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';

const Home = props => {

  let history = useHistory();
  const [accessToken, setAccessToken] = useLocalStorage('accessToken');
  const [topTracks, setTopTracks] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [modalVisibility, setModalVisibility] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState(null);

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
    // return <div className="h-full grid grid-cols-2 place-items-auto bg-gray-900 text-white p-10">
    return (
      <div className="relative">
        <AnimateSharedLayout type="crossfade">
          <Header />

          {/* <div className="min-h-screen h-full flex justify-between bg-gray-900 text-white px-10 pb-10"> */}
          <div className="min-h-screen h-full grid grid-cols-2 gap-4 justify-items-center px-4 md:px-8 lg:px-10 pt-10 pb-10 bg-gray-900 text-white ">
            <motion.div
              // className="pt-5 px-5 -mx-5 w-1/2"
              // className="top-36"
              initial={false}
              animate={{
                opacity: selectedTrack ? 0 : 1,
              }}
            >
              <h3 className="mb-2 sticky">Last Month</h3>
              <TopSongs
                tracks={topTracks[0].items}
                currentTrack={currentTrack}
                setCurrentTrack={setCurrentTrack}
                getTrackDetails={getTrackDetails}
                setSelectedTrack={setSelectedTrack}
              />
              <h3 className="mb-2">Last 6 Months</h3>
              <TopSongs
                tracks={topTracks[1].items}
                currentTrack={currentTrack}
                setCurrentTrack={setCurrentTrack}
                getTrackDetails={getTrackDetails}
                setSelectedTrack={setSelectedTrack}
              />
              <h3 className="mb-2">All Time</h3>
              <TopSongs
                tracks={topTracks[2].items}
                currentTrack={currentTrack}
                setCurrentTrack={setCurrentTrack}
                getTrackDetails={getTrackDetails}
                setSelectedTrack={setSelectedTrack}
              />
            </motion.div>

            <div
            // className="py-5 w-1/2"
            >
              <AnimatePresence>
                {currentTrack ?
                  <TrackPreview track={currentTrack}
                    getTrackDetails={getTrackDetails}
                    accessToken={accessToken}
                    selectedTrack={selectedTrack}
                  /> : ''
                }
              </AnimatePresence>
            </div>
            {/* <div> */}
            {/* <Button onClick={() => setOpenModal(true)}>Open</Button> */}
            {/* </div> */}
            <Modal visible={modalVisibility} setModalVisibility={setModalVisibility} />
          </div>
          <AnimatePresence>
            {selectedTrack ?
              <SelectedTrack
                selectedTrack={selectedTrack}
                setSelectedTrack={setSelectedTrack}
                accessToken={accessToken}
              />
              : ''
            }
          </AnimatePresence>
        </AnimateSharedLayout>
      </div>
    )
  }
}



const TopSongs = ({ tracks, currentTrack, setCurrentTrack, getTrackDetails, setSelectedTrack }) => {
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
    // setCurrentTrack(null)
  }

  return (
    <div className="grid grid-cols-5 lg:grid-cols-10 mb-5">
      {tracks.map(track => {
        const { id, name, album } = track;
        const { images } = album;
        return (
          <motion.div
            // layout
            key={id}
            // initial={{ opacity: 1 }}
            // className="z-0 transform ease-in-out transition hover:scale-150 hover:z-20 hover:shadow-lg"
            className="z-0 cursor-pointer"
            // style={{ opacity: currentTrack ? 1 : 0 }}
            onMouseEnter={e => playAudio(track)}
            onMouseLeave={e => stopAudio(track)}
            whileHover={{ scale: 1.5, zIndex: 2 }}
            onClick={() => setSelectedTrack(track)}

          >
            <img src={images[0].url} alt="song-img" />
          </motion.div>
        )
      })}
    </div>
  )
}


const TrackPreview = ({ track, getTrackDetails, accessToken, selectedTrack }) => {
  let { id, preview_url } = track;
  const currentAudio = useRef(null);

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();



  useEffect(() => {

    function playAudio(url) {
      if (url) {
        currentAudio.current = new Audio(url);
        // currentAudio.current.play();
      } else {
        axios.get(`https://api.spotify.com/v1/tracks/${id}?market=from_token`, {
          headers: { 'Authorization': `Bearer ${accessToken}` },
          cancelToken: source.token
        }).then(({ data }) => {
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
      // currentAudio.current.pause();
    }

    playAudio(preview_url);

    return () => {
      source.cancel('New track received.');

      if (currentAudio.current) {
        // currentAudio.current.pause();
      }
    }
  }, [id, preview_url, getTrackDetails, accessToken, source]);

  if (track) {
    const { id, name, album, artists } = track;
    const { images } = album;
    const artistName = artists.reduce(((completeName, artist, index) => {
      if (index === artists.length - 1 && artists.length > 1) {
        completeName += ' & ';
      } else {
        completeName += index !== 0 ? ', ' : '';
      }
      return completeName += ` ${artist.name}`
    }), '');
    return (
      <motion.div
        // className="sticky top-1/4 lg:top-32 md:m-2 lg:m-10 float-right lg:my-0"
        className="sticky top-36 mt-8"
        initial={{ x: 500, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ opacity: 0 }}
        // exit={{ scale: 0, opacity: 0, duration: 0.1 }}
        transition={{
          // stiffness: 90
        }}
        key={`current-track-main-div-${id}`}
        layoutId={`selected-track-parent-${id}`}

      >
        <motion.div className="w-full z-10"
          key={`small-preview-${id}`}
          layoutId={`selected-track-image-${id}`}
          animate={{ opacity: selectedTrack ? 0 : 1 }}
        >
          <img src={images[0].url} alt={name} />
        </motion.div>
        <div className="overflow-hidden mt-2">
          <motion.div
            initial={{ height: 0, y: -60 }}
            animate={{
              height: 'auto',
              y: 0,
              transition: {
                delay: 0.3,
                duration: 0.2,
              }
            }}
          >
            <motion.h2
              className="inline-flex text-2xl leading-tight"
              layoutId={`selected-track-name-${id}`}
            >
              {name}
            </motion.h2>
            <br />
            <motion.h3
              className="inline-flex text-sm italic"
              layoutId={`selected-track-artist-name-${id}`}
              transition={{
                delay: 0.6
              }}
            >
              {artistName}
            </motion.h3>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  return '';
}


export default Home;