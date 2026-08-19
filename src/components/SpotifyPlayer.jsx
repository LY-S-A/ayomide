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

  const playerRef =
    useRef(null);

  const deviceIdRef =
    useRef(null);

  const progressTimerRef =
    useRef(null);


  const [loggedIn, setLoggedIn] =
    useState(false);

  const [ready, setReady] =
    useState(false);

  const [playing, setPlaying] =
    useState(false);

  const [track, setTrack] =
    useState(null);

  const [position, setPosition] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [connecting, setConnecting] =
    useState(false);


  // ========================================
  // FORMAT TIME
  // ========================================

  const formatTime = (milliseconds) => {

    const totalSeconds =
      Math.floor(
        milliseconds / 1000
      );

    const minutes =
      Math.floor(
        totalSeconds / 60
      );

    const seconds =
      totalSeconds % 60;

    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;

  };


  // ========================================
  // FETCH CURRENT PLAYBACK
  // ========================================

  const fetchCurrentTrack =
    useCallback(async () => {

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

        if (response.status === 204) {

          setTrack(null);
          setPlaying(false);

          return;

        }

        if (!response.ok) {
          return;
        }

        const data =
          await response.json();

        if (data.item) {

          setTrack(data.item);

          setPosition(
            data.progress_ms || 0
          );

          setDuration(
            data.item.duration_ms || 0
          );

          setPlaying(
            data.is_playing
          );

        }

      } catch (err) {

        console.error(
          "Spotify playback error:",
          err
        );

      }

    }, []);


  // ========================================
  // INITIAL AUTH
  // ========================================

  useEffect(() => {

    const initializeAuth =
      async () => {

        const callbackHandled =
          await handleSpotifyCallback();

        if (
          callbackHandled ||
          isSpotifyLoggedIn()
        ) {

          setLoggedIn(true);

        }

      };

    initializeAuth();

  }, []);


  // ========================================
  // LOAD CURRENT SONG
  // ========================================

  useEffect(() => {

    if (!loggedIn) {
      return;
    }

    fetchCurrentTrack();

    const interval =
      setInterval(
        fetchCurrentTrack,
        5000
      );

    return () =>
      clearInterval(interval);

  }, [
    loggedIn,
    fetchCurrentTrack,
  ]);


  // ========================================
  // LOAD SDK
  // ========================================

  useEffect(() => {

    if (!loggedIn) {
      return;
    }

    if (
      window.Spotify
    ) {

      initializePlayer();

      return;

    }

    window.onSpotifyWebPlaybackSDKReady =
      () => {

        initializePlayer();

      };


    function initializePlayer() {

      if (playerRef.current) {
        return;
      }

      playerRef.current =
        new window.Spotify.Player({

          name:
            "Ayomide Portfolio",

          volume: 0.5,

          getOAuthToken:
            async (callback) => {

              const token =
                await getSpotifyToken();

              callback(token);

            },

          enableMediaSession:
            true,

        });


      // ====================================
      // READY
      // ====================================

      playerRef.current.addListener(
        "ready",
        ({ device_id }) => {

          deviceIdRef.current =
            device_id;

          setReady(true);

          console.log(
            "Spotify player ready:",
            device_id
          );

        }
      );


      // ====================================
      // NOT READY
      // ====================================

      playerRef.current.addListener(
        "not_ready",
        () => {

          setReady(false);

        }
      );


      // ====================================
      // PLAYER STATE
      // ====================================

      playerRef.current.addListener(
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


      // ====================================
      // ERRORS
      // ====================================

      playerRef.current.addListener(
        "initialization_error",
        ({ message }) => {

          console.error(
            "Spotify initialization error:",
            message
          );

          setError(message);

        }
      );


      playerRef.current.addListener(
        "authentication_error",
        ({ message }) => {

          console.error(
            "Spotify authentication error:",
            message
          );

          setError(
            "Spotify authentication expired."
          );

        }
      );


      playerRef.current.addListener(
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


      playerRef.current.addListener(
        "playback_error",
        ({ message }) => {

          console.error(
            "Spotify playback error:",
            message
          );

          setError(message);

        }
      );


      playerRef.current.addListener(
        "autoplay_failed",
        () => {

          setError(
            "Click play to start Spotify."
          );

        }
      );


      playerRef.current.connect();

    }

    return () => {

      if (
        progressTimerRef.current
      ) {

        clearInterval(
          progressTimerRef.current
        );

      }

    };

  }, [loggedIn]);


  // ========================================
  // PROGRESS TIMER
  // ========================================

  useEffect(() => {

    if (
      progressTimerRef.current
    ) {

      clearInterval(
        progressTimerRef.current
      );

    }

    if (!playing) {
      return;
    }

    progressTimerRef.current =
      setInterval(() => {

        setPosition(
          (current) => {

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

    return () =>
      clearInterval(
        progressTimerRef.current
      );

  }, [
    playing,
    duration,
  ]);


  // ========================================
  // LOGIN
  // ========================================

  const handleLogin = async () => {

    setLoading(true);

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


  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {

    if (playerRef.current) {

      playerRef.current.disconnect();

      playerRef.current =
        null;

    }

    logoutSpotify();

    setLoggedIn(false);
    setReady(false);
    setTrack(null);
    setPlaying(false);

  };


  // ========================================
  // PLAY / PAUSE
  // ========================================

  const togglePlay = async () => {

    if (!playerRef.current) {
      return;
    }

    setError("");

    try {

      await playerRef.current
        .togglePlay();

    } catch (err) {

      console.error(err);

      setError(
        "Unable to control Spotify."
      );

    }

  };


  // ========================================
  // NEXT
  // ========================================

  const nextTrack = async () => {

    if (!playerRef.current) {
      return;
    }

    try {

      await playerRef.current
        .nextTrack();

    } catch (err) {

      console.error(err);

    }

  };


  // ========================================
  // PREVIOUS
  // ========================================

  const previousTrack = async () => {

    if (!playerRef.current) {
      return;
    }

    try {

      await playerRef.current
        .previousTrack();

    } catch (err) {

      console.error(err);

    }

  };


  // ========================================
  // TRANSFER TO WEBSITE
  // ========================================

  const transferPlayback = async () => {

    const token =
      await getSpotifyToken();

    const deviceId =
      deviceIdRef.current;

    if (!token || !deviceId) {
      return;
    }

    setConnecting(true);

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

            body: JSON.stringify({

              device_ids: [
                deviceId
              ],

              play: false,

            }),

          }
        );

      if (!response.ok) {

        throw new Error(
          "Unable to transfer playback."
        );

      }

      setError("");

    } catch (err) {

      console.error(err);

      setError(
        "Could not connect Spotify playback."
      );

    } finally {

      setConnecting(false);

    }

  };


  // ========================================
  // OPEN SPOTIFY
  // ========================================

  const openSpotify = () => {

    if (
      track?.external_urls
        ?.spotify
    ) {

      window.open(
        track.external_urls.spotify,
        "_blank",
        "noopener,noreferrer"
      );

    }

  };


  // ========================================
  // NOT LOGGED IN
  // ========================================

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
              Connect your Spotify account to
              show what I'm currently listening to.
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

      </section>

    );

  }


  // ========================================
  // NO TRACK
  // ========================================

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
              Start playing something on Spotify
              and it will appear here.
            </p>

          </div>

          <FaSpotify
            className="spotify-logo"
          />

        </div>

        <div className="spotify-player-actions">

          {ready && (

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

      </section>

    );

  }


  const image =
    track.album?.images?.[0]?.url;


  const artist =
    track.artists
      ?.map((artist) => artist.name)
      .join(", ");


  const progressPercent =
    duration
      ? Math.min(
          100,
          (position / duration) * 100
        )
      : 0;


  return (

    <section className="spotify-player">

      {/* ====================================
          LABEL
      ==================================== */}

      <div className="spotify-player-heading">

        <p className="spotify-label">
          I'M CURRENTLY LISTENING TO
        </p>

        <FaSpotify
          className="spotify-logo"
        />

      </div>


      {/* ====================================
          TRACK
      ==================================== */}

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


      {/* ====================================
          PROGRESS
      ==================================== */}

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


      {/* ====================================
          CONTROLS
      ==================================== */}

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


      {/* ====================================
          FOOTER
      ==================================== */}

      <div className="spotify-footer">

        <div className="spotify-status">

          <span
            className={
              ready
                ? "spotify-status-dot online"
                : "spotify-status-dot"
            }
          />

          <span>

            {ready
              ? "Spotify connected"
              : "Connecting..."}

          </span>

        </div>


        <div className="spotify-footer-actions">

          {ready && (

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
            className="spotify-open"
            onClick={openSpotify}
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
