import { useEffect, useState, useRef } from 'react';
import './Home.scss';
import { useHistory } from 'react-router-dom';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import SpotifyService from '../SpotifyService';
import { Header, Modal, SelectedTrack, TopSongs, TrackPreview } from '../components';
import { useSpotify, SPOTIFY_ACTIONS } from '../spotifyContext'

const Home = props => {
  const [{ accessToken, topTracks, currentTrack, selectedTrack }, dispatch] = useSpotify();
  const [modalVisibility, setModalVisibility] = useState(true);
  let history = useHistory();
  const spotify = useRef(null);

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
          // setTopTracks(res);
          dispatch({
            type: SPOTIFY_ACTIONS.setTopTracks,
            payload: res
          });
        }).catch(err => {
          console.log('error: ', err);
          if (err.status === 401) {
            // setAccessToken('');
            dispatch({
              type: SPOTIFY_ACTIONS.setAccessToken,
              payload: ''
            });
          }
        })
    }
  }, [accessToken, history, spotify, dispatch])

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
                getTrackDetails={getTrackDetails}
              />
              <h3 className="mb-2">Last 6 Months</h3>
              <TopSongs
                tracks={topTracks[1].items}
                getTrackDetails={getTrackDetails}
              />
              <h3 className="mb-2">All Time</h3>
              <TopSongs
                tracks={topTracks[2].items}
                getTrackDetails={getTrackDetails}
              />
            </motion.div>

            <div
            // className="py-5 w-1/2"
            >
              <AnimatePresence>
                {currentTrack ?
                  <TrackPreview getTrackDetails={getTrackDetails} />
                  : ''
                }
              </AnimatePresence>
            </div>
            {/* <div> */}
            {/* <Button onClick={() => setOpenModal(true)}>Open</Button> */}
            {/* </div> */}
            <Modal visible={modalVisibility} setModalVisibility={setModalVisibility} />
          </div>
          <AnimatePresence>
            {selectedTrack && <SelectedTrack selectedTrack={selectedTrack} />}
          </AnimatePresence>
        </AnimateSharedLayout>
      </div>
    )
  }
}



export default Home;