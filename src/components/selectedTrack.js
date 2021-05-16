import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SpotifyService from '../SpotifyService';


const Close = props => {
  return <svg {...props} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
}

const SelectedTrack = ({ selectedTrack, setSelectedTrack, setCurrentTrack, accessToken }) => {
  const spotify = useRef(null);
  spotify.current = new SpotifyService(accessToken);
  const { id, album, name, artists } = selectedTrack;
  const [artistTracks, setArtistTracks] = useState(null);
  const { images } = album;


  console.log('shubham: selected track: ', selectedTrack)


  useEffect(() => {
    spotify.current.spotifyApi.getArtistTopTracks(artists[0].id, 'IN').then(resp => {
      console.log('shubham TRACKS RESPONSE: ', resp);
      if (resp.tracks)
        setArtistTracks(resp.tracks);
    }).catch(err => {
      console.log('Error: ', err);
    })

    // return () => {
    //   cleanup
    // }
  }, [artists])


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
      className="z-10 fixed top-36 w-full h-full px-8 bg-transparent text-white"
      layoutId={`selected-track-parent-${selectedTrack.id}`}
    >
      <Close
        className="text-white w-6 h-6 float-right cursor-pointer -mt-16 right-2 fixed"
        onClick={() => { setSelectedTrack(null); }}
      />

      <div className="grid grid-cols-2 gap-x-8 justify-items-stretch">

        <motion.div className="z-20 justify-self-center"
          key={`small-preview-${id}`}
          layoutId={`selected-track-image-${id}`}
        >
          <img src={images[0].url} alt={name} className="" />
        </motion.div>

        <div className="">
          <motion.h2
            className="inline-flex text-4xl leading-tight"
            layoutId={`selected-track-name-${id}`}
          >
            {name}
          </motion.h2>
          <br />
          <motion.h3
            className="inline-flex text-md italic"
            layoutId={`selected-track-artist-name-${id}`}
          >
            {artistName}
          </motion.h3>
          <br />


          {artistTracks ?
            <div className="mt-2">
              <h3 className="text-md leading-none mt-6 mb-3">
                Top Tracks for <span className="text-green-500">{artistName}</span> -
              </h3>
              <ArtistTracks tracks={artistTracks} />
            </div>
            : ''
          }
        </div>

      </div>
    </motion.div>

  )
}


export default SelectedTrack;

const variants = {
  hidden: i => ({
    opacity: 0,
    height: 0,
    // marginTop: 0,
    y: -30
  }),
  visible: i => ({
    opacity: 1,
    height: '100%',
    // minHeight: 'auto',
    // marginTop: 10,
    y: 0,
    transition: {
      delay: i * 0.1,
      // staggerChildren: 0.3,
      duration: 0.3
    },
    // exit: {
    //     opacity: 0,
    //     y: -
    // }
  }),
}

const ArtistTracks = ({ tracks }) => {


  return (
    <motion.ul className="flex flex-0 flex-col">
      <AnimatePresence>
        {tracks.map((track, index) => (
          <Track track={track} i={index} />
        ))}
      </AnimatePresence>
    </motion.ul>
  )
}



const Track = ({ track, i }) => {
  const { name, album: { images } } = track;
  // console.log('ALBUM: ', album)
  return (
    <motion.li
      className="inline-flex flex-shrink-0 items-center bg-gray-900 overflow-hidden h-full pt-4"
      custom={i}
      initial="hidden"
      animate="visible"
      variants={variants}
      exit="hidden"
      key={`{$name}-${i}`}
      style={{ zIndex: 10 - i, paddingTop: i === 0 ? 0 : '' }}
    >
      <motion.div className="w-10 h-10">
        <img src={images[1].url} alt={name} className="rounded-full" />
      </motion.div>
      <motion.div className="pl-4">
        {name}
      </motion.div>
    </motion.li >
  )
}