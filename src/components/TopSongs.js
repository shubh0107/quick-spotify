import React from 'react';
import { motion } from 'framer-motion';
import { useSpotify, SPOTIFY_ACTIONS } from '../spotifyContext';


export default function TopSongs({ tracks, getTrackDetails }) {
  const [{ currentTrack }, dispatch] = useSpotify();
  const currentAudio = React.useRef(null);

  function playAudio(track) {
    let isPreviousAudioPlaying = currentAudio.current && currentAudio.current.currentTime > 0 &&
     !currentAudio.current.paused && !currentAudio.current.ended && currentAudio.current.readyState > 2;

    if (isPreviousAudioPlaying) {
      currentAudio.current.pause();
    }

    if (currentAudio.current && currentAudio.current.currentTime > 0) {
      currentAudio.current.pause();
    }
    // setCurrentTrack(track);
    dispatch({
      type: SPOTIFY_ACTIONS.setCurrentTrack,
      payload: track
    })
    let { id, preview_url } = track;

    if (preview_url) {
      currentAudio.current = new Audio(preview_url);
      currentAudio.current.play();
    } else {
      getTrackDetails(`${id}?market=from_token`).then(trackDetails => {
        console.log('track data: ', trackDetails);
        currentAudio.current = new Audio(trackDetails.preview_url);
        currentAudio.current.play();
      }).catch(err => {
        console.log('error: ', err);
      })
    }
  }

  function stopAudio(url) {
    currentAudio.current.pause();
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
            // onClick={() => setSelectedTrack(track)}
            onClick={() => dispatch({
              type: SPOTIFY_ACTIONS.setSelectedTrack,
              payload: track
            })}

          >
            <img src={images[0].url} alt="song-img" />
          </motion.div>
        )
      })}
    </div>
  )
}