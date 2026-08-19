// import React, {
//     useCallback,
//     useEffect,
//     useState,
// } from "react";

// import {
//     FaSpotify,
//     FaExternalLinkAlt,
// } from "react-icons/fa";

// import {
//     getSpotifyToken,
//     handleSpotifyCallback,
//     isSpotifyLoggedIn,
//     loginWithSpotify,
//     logoutSpotify,
// } from "../spotify/spotifyAuth";

// import "../styles/spotify-player.css";


// const SpotifyPlayer = () => {

//     const [loggedIn, setLoggedIn] =
//         useState(false);

//     const [track, setTrack] =
//         useState(null);

//     const [loading, setLoading] =
//         useState(false);

//     const [error, setError] =
//         useState("");


//     /* ========================================
//        FETCH CURRENT TRACK
//     ======================================== */

//     const fetchCurrentTrack =
//         useCallback(
//             async () => {

//                 const token =
//                     await getSpotifyToken();


//                 if (!token) {

//                     console.log(
//                         "Spotify token missing."
//                     );

//                     return;

//                 }


//                 try {

//                     const response =
//                         await fetch(
//                             "https://api.spotify.com/v1/me/player/currently-playing",
//                             {

//                                 method: "GET",

//                                 headers: {
//                                     Authorization:
//                                         `Bearer ${token}`,
//                                 },

//                             }
//                         );


//                     console.log(
//                         "Spotify currently-playing status:",
//                         response.status
//                     );


//                     /* ==================================
//                        NOTHING PLAYING
//                     ================================== */

//                     if (
//                         response.status === 204
//                     ) {

//                         console.log(
//                             "Spotify returned 204 — no currently playing track."
//                         );


//                         setTrack(null);

//                         setError("");

//                         return;

//                     }


//                     /* ==================================
//                        UNAUTHORIZED
//                     ================================== */

//                     if (
//                         response.status === 401
//                     ) {

//                         console.error(
//                             "Spotify token is invalid or expired."
//                         );


//                         setError(
//                             "Spotify session expired. Please reconnect."
//                         );


//                         return;

//                     }


//                     /* ==================================
//                        FORBIDDEN
//                     ================================== */

//                     if (
//                         response.status === 403
//                     ) {

//                         console.error(
//                             "Spotify denied playback access."
//                         );


//                         setError(
//                             "Spotify playback permission was not granted."
//                         );


//                         return;

//                     }


//                     /* ==================================
//                        OTHER ERROR
//                     ================================== */

//                     if (
//                         !response.ok
//                     ) {

//                         const errorText =
//                             await response.text();


//                         console.error(
//                             "Spotify API error:",
//                             response.status,
//                             errorText
//                         );


//                         return;

//                     }


//                     /* ==================================
//                        PARSE RESPONSE
//                     ================================== */

//                     const data =
//                         await response.json();


//                     console.log(
//                         "Spotify playback data:",
//                         data
//                     );


//                     /* ==================================
//                        NO ITEM
//                     ================================== */

//                     if (
//                         !data?.item
//                     ) {

//                         setTrack(null);

//                         return;

//                     }


//                     /* ==================================
//                        SET TRACK
//                     ================================== */

//                     setTrack(
//                         data.item
//                     );


//                     setError("");

//                 } catch (error) {

//                     console.error(
//                         "Spotify current track error:",
//                         error
//                     );

//                     setError(
//                         "Unable to read Spotify playback."
//                     );

//                 }

//             },
//             []
//         );


//     /* ========================================
//        INITIALIZE SPOTIFY AUTH
//     ======================================== */

//     useEffect(() => {

//         const initializeSpotify =
//             async () => {

//                 try {

//                     /*
//                      * Handle Spotify callback.
//                      */

//                     const callbackHandled =
//                         await handleSpotifyCallback();


//                     /*
//                      * Check login state again
//                      * after callback.
//                      */

//                     if (
//                         callbackHandled ||
//                         isSpotifyLoggedIn()
//                     ) {

//                         setLoggedIn(true);

//                     }

//                 } catch (error) {

//                     console.error(
//                         "Spotify initialization error:",
//                         error
//                     );


//                     setError(
//                         "Unable to connect to Spotify."
//                     );

//                 }

//             };


//         initializeSpotify();

//     }, []);


//     /* ========================================
//        POLL CURRENT TRACK
//     ======================================== */

//     useEffect(() => {

//         if (!loggedIn) {

//             return;

//         }


//         /*
//          * Fetch immediately.
//          */

//         fetchCurrentTrack();


//         /*
//          * Check every 10 seconds.
//          */

//         const interval =
//             setInterval(
//                 fetchCurrentTrack,
//                 10000
//             );


//         return () => {

//             clearInterval(
//                 interval
//             );

//         };

//     }, [
//         loggedIn,
//         fetchCurrentTrack,
//     ]);


//     /* ========================================
//        LOGIN
//     ======================================== */

//     const handleLogin =
//         async () => {

//             try {

//                 setLoading(true);

//                 setError("");

//                 await loginWithSpotify();

//             } catch (error) {

//                 console.error(
//                     "Spotify login error:",
//                     error
//                 );


//                 setError(
//                     "Unable to connect to Spotify."
//                 );


//                 setLoading(false);

//             }

//         };


//     /* ========================================
//        LOGOUT
//     ======================================== */

//     const handleLogout =
//         () => {

//             logoutSpotify();

//             setLoggedIn(false);

//             setTrack(null);

//             setError("");

//         };


//     /* ========================================
//        OPEN SPOTIFY
//     ======================================== */

//     const openSpotify =
//         () => {

//             if (
//                 !track?.external_urls?.spotify
//             ) {

//                 return;

//             }


//             window.open(
//                 track.external_urls.spotify,
//                 "_blank",
//                 "noopener,noreferrer"
//             );

//         };


//     /* ========================================
//        OPEN SPOTIFY HOME
//     ======================================== */

//     const openSpotifyHome =
//         () => {

//             window.open(
//                 "https://open.spotify.com",
//                 "_blank",
//                 "noopener,noreferrer"
//             );

//         };


//     /* ========================================
//        CONNECT SPOTIFY
//     ======================================== */

//     if (!loggedIn) {

//         return (

//             <section className="spotify-player">

//                 <div className="spotify-player-heading">

//                     <div>

//                         <p className="spotify-label">
//                             I'M CURRENTLY LISTENING TO
//                         </p>


//                         <h2 className="spotify-empty-title">
//                             Connect Spotify
//                         </h2>

//                     </div>


//                     <FaSpotify
//                         className="spotify-logo"
//                     />

//                 </div>


//                 <p className="spotify-description">

//                     Connect Spotify to show what
//                     I'm currently listening to.

//                 </p>


//                 <button
//                     type="button"
//                     className="spotify-connect-button"
//                     onClick={handleLogin}
//                     disabled={loading}
//                 >

//                     <FaSpotify />

//                     {loading
//                         ? "Connecting..."
//                         : "Connect Spotify"}

//                 </button>


//                 {error && (

//                     <p className="spotify-error">
//                         {error}
//                     </p>

//                 )}

//             </section>

//         );

//     }


//     /* ========================================
//        NOTHING PLAYING
//     ======================================== */

//     if (!track) {

//         return (

//             <section className="spotify-player">

//                 <div className="spotify-player-heading">

//                     <div>

//                         <p className="spotify-label">
//                             I'M CURRENTLY LISTENING TO
//                         </p>


//                         <h2 className="spotify-empty-title">
//                             Nothing playing
//                         </h2>

//                     </div>


//                     <FaSpotify
//                         className="spotify-logo"
//                     />

//                 </div>


//                 <p className="spotify-description">

//                     Start playing something on Spotify
//                     and it will appear here.

//                 </p>


//                 <div className="spotify-empty-footer">

//                     <button
//                         type="button"
//                         className="spotify-open"
//                         onClick={openSpotifyHome}
//                     >

//                         Open Spotify

//                         <FaExternalLinkAlt />

//                     </button>


//                     <button
//                         type="button"
//                         className="spotify-logout"
//                         onClick={handleLogout}
//                     >
//                         Disconnect
//                     </button>

//                 </div>


//                 {error && (

//                     <p className="spotify-error">
//                         {error}
//                     </p>

//                 )}

//             </section>

//         );

//     }


//     /* ========================================
//        TRACK INFORMATION
//     ======================================== */

//     const albumImage =
//         track.album?.images?.length
//             ? track.album.images[0].url
//             : null;


//     const artistName =
//         track.artists
//             ?.map(
//                 artist =>
//                     artist.name
//             )
//             .join(", ");


//     const albumName =
//         track.album?.name || "";


//     /* ========================================
//        CURRENTLY PLAYING
//     ======================================== */

//     return (

//         <section className="spotify-player">

//             {/* ==================================
//                 HEADER
//             ================================== */}

//             <div className="spotify-player-heading">

//                 <p className="spotify-label">
//                     I'M CURRENTLY LISTENING TO
//                 </p>


//                 <FaSpotify
//                     className="spotify-logo"
//                 />

//             </div>


//             {/* ==================================
//                 TRACK
//             ================================== */}

//             <div className="spotify-track">

//                 {albumImage && (

//                     <img
//                         src={albumImage}
//                         alt={`${track.name} album artwork`}
//                         className="spotify-cover"
//                     />

//                 )}


//                 <div className="spotify-track-info">

//                     <h2>
//                         {track.name}
//                     </h2>


//                     <p>
//                         {artistName}
//                     </p>


//                     <span>
//                         {albumName}
//                     </span>

//                 </div>

//             </div>


//             {/* ==================================
//                 CURRENTLY LISTENING INDICATOR
//             ================================== */}

//             <div className="spotify-current-indicator">

//                 <span className="spotify-playing-dot" />

//                 <span>
//                     Currently listening
//                 </span>

//             </div>


//             {/* ==================================
//                 FOOTER
//             ================================== */}

//             <div className="spotify-footer">

//                 <div className="spotify-status">

//                     <span className="spotify-status-dot online" />

//                     <span>
//                         Spotify
//                     </span>

//                 </div>


//                 <div className="spotify-footer-actions">

//                     <button
//                         type="button"
//                         className="spotify-open"
//                         onClick={openSpotify}
//                     >

//                         Open in Spotify

//                         <FaExternalLinkAlt />

//                     </button>


//                     <button
//                         type="button"
//                         className="spotify-logout"
//                         onClick={handleLogout}
//                     >

//                         Disconnect

//                     </button>

//                 </div>

//             </div>


//             {error && (

//                 <p className="spotify-error">
//                     {error}
//                 </p>

//             )}

//         </section>

//     );

// };


// export default SpotifyPlayer;

import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    FaPause,
    FaPlay,
    FaStepBackward,
    FaStepForward,
    FaSpotify,
    FaExternalLinkAlt,
} from "react-icons/fa";

import {
    getSpotifyToken,
    handleSpotifyCallback,
    isSpotifyLoggedIn,
    loginWithSpotify,
    logoutSpotify,
} from "../spotify/spotifyAuth";

import "../styles/spotify-player.css";


const SpotifyPlayer = () => {

    const playerRef = useRef(null);
    const deviceIdRef = useRef(null);
    const sdkIntervalRef = useRef(null);
    const playbackIntervalRef = useRef(null);
    const progressIntervalRef = useRef(null);

    const [loggedIn, setLoggedIn] = useState(false);
    const [sdkReady, setSdkReady] = useState(false);
    const [playerReady, setPlayerReady] = useState(false);

    const [track, setTrack] = useState(null);
    const [playing, setPlaying] = useState(false);

    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);

    const [loading, setLoading] = useState(false);
    const [connecting, setConnecting] = useState(false);

    const [error, setError] = useState("");


    /* ========================================
       FORMAT TIME
    ======================================== */

    const formatTime = (milliseconds = 0) => {

        const totalSeconds =
            Math.floor(milliseconds / 1000);

        const minutes =
            Math.floor(totalSeconds / 60);

        const seconds =
            totalSeconds % 60;

        return `${minutes}:${seconds
            .toString()
            .padStart(2, "0")}`;
    };


    /* ========================================
       FETCH CURRENT SPOTIFY PLAYBACK
    ======================================== */

    const fetchCurrentTrack = useCallback(
        async () => {

            const token =
                await getSpotifyToken();

            if (!token) {
                return;
            }

            try {

                const response =
                    await fetch(
                        "https://api.spotify.com/v1/me/player",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );

                /*
                 * 204 means Spotify currently
                 * has no active playback.
                 */

                if (response.status === 204) {

                    setTrack(null);
                    setPlaying(false);
                    setPosition(0);
                    setDuration(0);

                    return;
                }


                if (response.status === 401) {

                    setError(
                        "Spotify session expired. Please reconnect."
                    );

                    return;
                }


                if (!response.ok) {

                    console.error(
                        "Spotify playback request failed:",
                        response.status
                    );

                    return;
                }


                const data =
                    await response.json();


                if (!data.item) {

                    setTrack(null);
                    setPlaying(false);

                    return;
                }


                setTrack(data.item);

                setPlaying(
                    Boolean(data.is_playing)
                );

                setPosition(
                    data.progress_ms || 0
                );

                setDuration(
                    data.item.duration_ms || 0
                );

            } catch (err) {

                console.error(
                    "Spotify playback error:",
                    err
                );

            }

        },
        []
    );


    /* ========================================
       INITIAL AUTH
    ======================================== */

    useEffect(() => {

        const initializeAuth = async () => {

            try {

                const callbackHandled =
                    await handleSpotifyCallback();

                if (
                    callbackHandled ||
                    isSpotifyLoggedIn()
                ) {

                    setLoggedIn(true);

                }

            } catch (err) {

                console.error(
                    "Spotify authentication error:",
                    err
                );

                setError(
                    "Unable to authenticate with Spotify."
                );

            }

        };

        initializeAuth();

    }, []);


    /* ========================================
       FETCH CURRENT TRACK
    ======================================== */

    useEffect(() => {

        if (!loggedIn) {
            return;
        }

        fetchCurrentTrack();

        playbackIntervalRef.current =
            setInterval(
                fetchCurrentTrack,
                3000
            );

        return () => {

            if (
                playbackIntervalRef.current
            ) {

                clearInterval(
                    playbackIntervalRef.current
                );

            }

        };

    }, [
        loggedIn,
        fetchCurrentTrack,
    ]);


    /* ========================================
       LOAD SPOTIFY SDK
    ======================================== */

    useEffect(() => {

        if (!loggedIn) {
            return;
        }


        const initializeSDK = () => {

            if (
                !window.Spotify
            ) {
                return false;
            }

            setSdkReady(true);

            return true;
        };


        /*
         * SDK might already be loaded.
         */

        if (initializeSDK()) {
            return;
        }


        /*
         * Otherwise wait for it.
         */

        window.onSpotifyWebPlaybackSDKReady =
            () => {

                setSdkReady(true);

            };


        sdkIntervalRef.current =
            setInterval(() => {

                if (window.Spotify) {

                    setSdkReady(true);

                    clearInterval(
                        sdkIntervalRef.current
                    );

                }

            }, 500);


        return () => {

            if (
                sdkIntervalRef.current
            ) {

                clearInterval(
                    sdkIntervalRef.current
                );

            }

        };

    }, [loggedIn]);


    /* ========================================
       INITIALIZE PLAYER
    ======================================== */

    useEffect(() => {

        if (
            !loggedIn ||
            !sdkReady ||
            playerRef.current
        ) {
            return;
        }


        const initializePlayer =
            async () => {

                const token =
                    await getSpotifyToken();

                if (!token) {
                    return;
                }


                const player =
                    new window.Spotify.Player({

                        name:
                            "Ayomide Portfolio",

                        volume: 0.7,

                        getOAuthToken:
                            async (callback) => {

                                const freshToken =
                                    await getSpotifyToken();

                                callback(
                                    freshToken
                                );

                            },

                    });


                playerRef.current =
                    player;


                /* ==================================
                   READY
                ================================== */

                player.addListener(
                    "ready",
                    ({ device_id }) => {

                        console.log(
                            "Spotify Web Player ready:",
                            device_id
                        );

                        deviceIdRef.current =
                            device_id;

                        setPlayerReady(true);

                        setError("");

                    }
                );


                /* ==================================
                   NOT READY
                ================================== */

                player.addListener(
                    "not_ready",
                    ({ device_id }) => {

                        console.log(
                            "Spotify device offline:",
                            device_id
                        );

                        setPlayerReady(false);

                    }
                );


                /* ==================================
                   PLAYER STATE
                ================================== */

                player.addListener(
                    "player_state_changed",
                    (state) => {

                        if (!state) {
                            return;
                        }


                        const currentTrack =
                            state.track_window
                                ?.current_track;


                        if (currentTrack) {

                            setTrack(
                                currentTrack
                            );

                            setPosition(
                                state.position
                            );

                            setDuration(
                                state.duration
                            );

                        }


                        setPlaying(
                            !state.paused
                        );

                    }
                );


                /* ==================================
                   INITIALIZATION ERROR
                ================================== */

                player.addListener(
                    "initialization_error",
                    ({ message }) => {

                        console.error(
                            "Spotify initialization error:",
                            message
                        );

                        setError(
                            message
                        );

                    }
                );


                /* ==================================
                   AUTH ERROR
                ================================== */

                player.addListener(
                    "authentication_error",
                    ({ message }) => {

                        console.error(
                            "Spotify authentication error:",
                            message
                        );

                        setError(
                            "Spotify authentication failed. Please reconnect."
                        );

                    }
                );


                /* ==================================
                   ACCOUNT ERROR
                ================================== */

                player.addListener(
                    "account_error",
                    ({ message }) => {

                        console.error(
                            "Spotify account error:",
                            message
                        );

                        setError(
                            "Spotify Premium is required for browser playback."
                        );

                    }
                );


                /* ==================================
                   PLAYBACK ERROR
                ================================== */

                player.addListener(
                    "playback_error",
                    ({ message }) => {

                        console.error(
                            "Spotify playback error:",
                            message
                        );

                        setError(
                            message
                        );

                    }
                );


                /* ==================================
                   AUTOPLAY
                ================================== */

                player.addListener(
                    "autoplay_failed",
                    () => {

                        setError(
                            "Click play to start Spotify."
                        );

                    }
                );


                /* ==================================
                   CONNECT
                ================================== */

                const connected =
                    await player.connect();


                if (!connected) {

                    console.error(
                        "Spotify player failed to connect."
                    );

                    setError(
                        "Spotify player could not connect."
                    );

                }

            };


        initializePlayer();


        return () => {

            if (
                playerRef.current
            ) {

                playerRef.current.disconnect();

                playerRef.current =
                    null;

            }

        };

    }, [
        loggedIn,
        sdkReady,
    ]);


    /* ========================================
       PROGRESS TIMER
    ======================================== */

    useEffect(() => {

        if (
            progressIntervalRef.current
        ) {

            clearInterval(
                progressIntervalRef.current
            );

        }


        if (!playing) {
            return;
        }


        progressIntervalRef.current =
            setInterval(() => {

                setPosition(
                    current => {

                        if (
                            duration &&
                            current >= duration
                        ) {

                            return duration;
                        }

                        return current + 1000;

                    }
                );

            }, 1000);


        return () => {

            if (
                progressIntervalRef.current
            ) {

                clearInterval(
                    progressIntervalRef.current
                );

            }

        };

    }, [
        playing,
        duration,
    ]);


    /* ========================================
       LOGIN
    ======================================== */

    const handleLogin = async () => {

        setLoading(true);
        setError("");

        try {

            await loginWithSpotify();

        } catch (err) {

            console.error(err);

            setError(
                "Unable to connect to Spotify."
            );

            setLoading(false);

        }

    };


    /* ========================================
       LOGOUT
    ======================================== */

    const handleLogout = () => {

        if (
            playerRef.current
        ) {

            playerRef.current.disconnect();

            playerRef.current =
                null;

        }

        logoutSpotify();

        setLoggedIn(false);
        setSdkReady(false);
        setPlayerReady(false);

        setTrack(null);
        setPlaying(false);

        setPosition(0);
        setDuration(0);

        setError("");

    };


    /* ========================================
       PLAY / PAUSE
    ======================================== */

    const togglePlay = async () => {

        if (
            !playerRef.current
        ) {
            return;
        }

        try {

            setError("");

            await playerRef.current
                .togglePlay();

        } catch (err) {

            console.error(err);

            setError(
                "Unable to control Spotify."
            );

        }

    };


    /* ========================================
       NEXT
    ======================================== */

    const nextTrack = async () => {

        if (
            !playerRef.current
        ) {
            return;
        }

        try {

            await playerRef.current
                .nextTrack();

        } catch (err) {

            console.error(err);

        }

    };


    /* ========================================
       PREVIOUS
    ======================================== */

    const previousTrack = async () => {

        if (
            !playerRef.current
        ) {
            return;
        }

        try {

            await playerRef.current
                .previousTrack();

        } catch (err) {

            console.error(err);

        }

    };


    /* ========================================
       TRANSFER PLAYBACK
    ======================================== */

    const transferPlayback = async () => {

        const token =
            await getSpotifyToken();

        const deviceId =
            deviceIdRef.current;


        if (
            !token ||
            !deviceId
        ) {

            setError(
                "Spotify player is not ready yet."
            );

            return;
        }


        setConnecting(true);
        setError("");


        try {

            const response =
                await fetch(
                    "https://api.spotify.com/v1/me/player",
                    {

                        method: "PUT",

                        headers: {

                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json",

                        },

                        body:
                            JSON.stringify({

                                device_ids: [
                                    deviceId
                                ],

                                play: true,

                            }),

                    }
                );


            if (
                !response.ok &&
                response.status !== 204
            ) {

                const data =
                    await response.json()
                        .catch(() => null);

                console.error(
                    "Transfer playback error:",
                    data
                );

                throw new Error(
                    "Unable to transfer playback."
                );

            }


            await fetchCurrentTrack();

        } catch (err) {

            console.error(err);

            setError(
                "Could not move Spotify playback to this website."
            );

        } finally {

            setConnecting(false);

        }

    };


    /* ========================================
       OPEN SPOTIFY
    ======================================== */

    const openSpotify = () => {

        const url =
            track
                ?.external_urls
                ?.spotify;


        if (url) {

            window.open(
                url,
                "_blank",
                "noopener,noreferrer"
            );

        }

    };


    /* ========================================
       LOGIN SCREEN
    ======================================== */

    if (!loggedIn) {

        return (

            <section className="spotify-player">

                <div className="spotify-player-top">

                    <div>

                        <p className="spotify-label">
                            I'M CURRENTLY LISTENING TO
                        </p>

                        <h2>
                            Connect Spotify
                        </h2>

                        <p className="spotify-description">
                            Connect Spotify to show
                            what I'm currently listening to.
                        </p>

                    </div>

                    <FaSpotify
                        className="spotify-logo"
                    />

                </div>


                <button
                    className="spotify-connect-button"
                    onClick={handleLogin}
                    disabled={loading}
                >

                    <FaSpotify />

                    {loading
                        ? "Connecting..."
                        : "Connect Spotify"}

                </button>


                {error && (

                    <p className="spotify-error">
                        {error}
                    </p>

                )}

            </section>

        );

    }


    /* ========================================
       WAITING FOR SDK
    ======================================== */

    if (!sdkReady) {

        return (

            <section className="spotify-player">

                <div className="spotify-player-top">

                    <div>

                        <p className="spotify-label">
                            I'M CURRENTLY LISTENING TO
                        </p>

                        <h2>
                            Connecting to Spotify...
                        </h2>

                        <p className="spotify-description">
                            Setting up the Spotify player.
                        </p>

                    </div>

                    <FaSpotify
                        className="spotify-logo"
                    />

                </div>

            </section>

        );

    }


    /* ========================================
       NO CURRENT TRACK
    ======================================== */

    if (!track) {

        return (

            <section className="spotify-player">

                <div className="spotify-player-top">

                    <div>

                        <p className="spotify-label">
                            I'M CURRENTLY LISTENING TO
                        </p>

                        <h2>
                            Nothing playing
                        </h2>

                        <p className="spotify-description">
                            Start playing a song on Spotify
                            and it will appear here automatically.
                        </p>

                    </div>


                    <FaSpotify
                        className="spotify-logo"
                    />

                </div>


                <div className="spotify-player-actions">

                    {playerReady && (

                        <button
                            className="spotify-connect-device"
                            onClick={transferPlayback}
                            disabled={connecting}
                        >

                            {connecting
                                ? "Connecting..."
                                : "Play on this website"}

                        </button>

                    )}


                    <button
                        className="spotify-logout"
                        onClick={handleLogout}
                    >
                        Disconnect
                    </button>

                </div>


                {error && (

                    <p className="spotify-error">
                        {error}
                    </p>

                )}

            </section>

        );

    }


    /* ========================================
       TRACK DATA
    ======================================== */

    const image =
        track.album
            ?.images
            ?.length
            ? track.album.images[0].url
            : null;


    const artist =
        track.artists
            ?.map(
                artist =>
                    artist.name
            )
            .join(", ");


    const progressPercent =
        duration
            ? Math.min(
                100,
                (position / duration) * 100
            )
            : 0;


    /* ========================================
       PLAYER
    ======================================== */

    return (

        <section className="spotify-player">

            <div className="spotify-player-heading">

                <p className="spotify-label">
                    I'M CURRENTLY LISTENING TO
                </p>

                <FaSpotify
                    className="spotify-logo"
                />

            </div>


            <div className="spotify-track">

                {image && (

                    <img
                        src={image}
                        alt={track.name}
                        className="spotify-cover"
                    />

                )}


                <div className="spotify-track-info">

                    <h2>
                        {track.name}
                    </h2>

                    <p>
                        {artist}
                    </p>

                    <span>
                        {track.album?.name}
                    </span>

                </div>

            </div>


            <div className="spotify-progress-container">

                <div className="spotify-time">

                    <span>
                        {formatTime(position)}
                    </span>

                    <span>
                        {formatTime(duration)}
                    </span>

                </div>


                <div className="spotify-progress">

                    <div
                        className="spotify-progress-bar"
                        style={{
                            width:
                                `${progressPercent}%`,
                        }}
                    />

                </div>

            </div>


            <div className="spotify-controls">

                <button
                    onClick={previousTrack}
                    aria-label="Previous track"
                >
                    <FaStepBackward />
                </button>


                <button
                    className="spotify-play-button"
                    onClick={togglePlay}
                    aria-label={
                        playing
                            ? "Pause"
                            : "Play"
                    }
                >

                    {playing
                        ? <FaPause />
                        : <FaPlay />}

                </button>


                <button
                    onClick={nextTrack}
                    aria-label="Next track"
                >
                    <FaStepForward />
                </button>

            </div>


            <div className="spotify-footer">

                <div className="spotify-status">

                    <span
                        className={
                            playerReady
                                ? "spotify-status-dot online"
                                : "spotify-status-dot"
                        }
                    />

                    <span>

                        {playerReady
                            ? "Spotify connected"
                            : "Connecting player..."}

                    </span>

                </div>


                <div className="spotify-footer-actions">

                    {playerReady && (

                        <button
                            onClick={transferPlayback}
                            disabled={connecting}
                            className="spotify-transfer"
                        >

                            {connecting
                                ? "Connecting..."
                                : "Play here"}

                        </button>

                    )}


                    <button
                        onClick={openSpotify}
                        className="spotify-open"
                    >

                        Spotify

                        <FaExternalLinkAlt />

                    </button>


                    <button
                        className="spotify-logout"
                        onClick={handleLogout}
                    >
                        Disconnect
                    </button>

                </div>

            </div>


            {error && (

                <p className="spotify-error">
                    {error}
                </p>

            )}

        </section>

    );

};


export default SpotifyPlayer;
