import React from 'react'
import useLocalStorage from '../hooks/useLocalStorage'



// all possible actions
const SPOTIFY_ACTIONS = {
  setAccessToken: 'setAccessToken',
  setTopTracks: 'setTopTracks',
  setCurrentTrack: 'setCurrentTrack',
  setSelectedTrack: 'setSelectedTrack'
}

// reducer for spotify context
// function spotifyReducer(state, action) {
//   console.log('shubham : ', {
//     action,
//     state
//   })
//   switch (action.type) {
//     case SPOTIFY_ACTIONS.setAccessToken:
//       return {
//         ...state,
//         accessToken: action.payload
//       }
//     case SPOTIFY_ACTIONS.setTopTracks:
//       return {
//         ...state,
//         topTracks: action.payload
//       }
//     case SPOTIFY_ACTIONS.setCurrentTrack:
//       return {
//         ...state,
//         currentTrack: action.payload
//       }
//     case SPOTIFY_ACTIONS.setSelectedTrack:
//       return {
//         ...state,
//         selectedTrack: action.payload
//       }

//     default:
//       throw new Error(`Unhandled action type: ${action.type}`)
//   }
// }


function useSpotifyReducerWithLocalStorage(state, action) {
  const [accessToken, setAccessToken] = useLocalStorage('accessToken', '');

  const spotifyReducer = React.useCallback((state, action) => {
    switch (action.type) {
      case SPOTIFY_ACTIONS.setAccessToken:
        setAccessToken(action.payload);
        return {
          ...state,
          accessToken: action.payload
        }
      case SPOTIFY_ACTIONS.setTopTracks:
        return {
          ...state,
          topTracks: action.payload
        }
      case SPOTIFY_ACTIONS.setCurrentTrack:
        return {
          ...state,
          currentTrack: action.payload
        }
      case SPOTIFY_ACTIONS.setSelectedTrack:
        return {
          ...state,
          selectedTrack: action.payload
        }

      default:
        throw new Error(`Unhandled action type: ${action.type}`)
    }
  }, [setAccessToken]);


  return React.useReducer(spotifyReducer, {
    ...INITIAL_STATE,
    accessToken
  })

}

// the spotify context that will wrap the application
const SpotifyContext = React.createContext();
SpotifyContext.displayName = 'SpotifyContext';

const INITIAL_STATE = {
  accessToken: '',
  topTracks: null,
  currentTrack: null,
  selectedTrack: null
}

// Provider component for the SpotifyContext
function SpotifyProvider({ children }) {
  const [state, disaptch] = useSpotifyReducerWithLocalStorage();

  const value = [state, disaptch];
  return <SpotifyContext.Provider value={value}>{children}</SpotifyContext.Provider>
}


function useSpotify() {
  const context = React.useContext(SpotifyContext);
  if (context === undefined) throw new Error('useSpotify must be used within SpotifyProvider');
  return context;
}


export { SpotifyProvider, useSpotify, SPOTIFY_ACTIONS }