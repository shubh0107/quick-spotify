import React from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useSpotify } from '../spotifyContext';


export default function TrackPreview({ getTrackDetails }) {
  const [{ currentTrack, accessToken, selectedTrack }] = useSpotify();
  let { id, preview_url } = currentTrack;
  const currentAudio = React.useRef(null);

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();



  React.useEffect(() => {

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

  if (currentTrack) {
    const { id, name, album, artists } = currentTrack;
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