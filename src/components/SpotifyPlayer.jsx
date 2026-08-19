import React, {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
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

    const [loggedIn, setLoggedIn] =
        useState(false);

    const [track, setTrack] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    /* ========================================
       FETCH CURRENT TRACK
    ======================================== */

    const fetchCurrentTrack =
        useCallback(
            async () => {

                const token =
                    await getSpotifyToken();


                if (!token) {

                    console.log(
                        "Spotify token missing."
                    );

                    return;

                }


                try {

                    const response =
                        await fetch(
                            "https://api.spotify.com/v1/me/player/currently-playing",
                            {

                                method: "GET",

                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,
                                },

                            }
                        );


                    console.log(
                        "Spotify currently-playing status:",
                        response.status
                    );


                    /* ==================================
                       NOTHING PLAYING
                    ================================== */

                    if (
                        response.status === 204
                    ) {

                        console.log(
                            "Spotify returned 204 — no currently playing track."
                        );


                        setTrack(null);

                        setError("");

                        return;

                    }


                    /* ==================================
                       UNAUTHORIZED
                    ================================== */

                    if (
                        response.status === 401
                    ) {

                        console.error(
                            "Spotify token is invalid or expired."
                        );


                        setError(
                            "Spotify session expired. Please reconnect."
                        );


                        return;

                    }


                    /* ==================================
                       FORBIDDEN
                    ================================== */

                    if (
                        response.status === 403
                    ) {

                        console.error(
                            "Spotify denied playback access."
                        );


                        setError(
                            "Spotify playback permission was not granted."
                        );


                        return;

                    }


                    /* ==================================
                       OTHER ERROR
                    ================================== */

                    if (
                        !response.ok
                    ) {

                        const errorText =
                            await response.text();


                        console.error(
                            "Spotify API error:",
                            response.status,
                            errorText
                        );


                        return;

                    }


                    /* ==================================
                       PARSE RESPONSE
                    ================================== */

                    const data =
                        await response.json();


                    console.log(
                        "Spotify playback data:",
                        data
                    );


                    /* ==================================
                       NO ITEM
                    ================================== */

                    if (
                        !data?.item
                    ) {

                        setTrack(null);

                        return;

                    }


                    /* ==================================
                       SET TRACK
                    ================================== */

                    setTrack(
                        data.item
                    );


                    setError("");

                } catch (error) {

                    console.error(
                        "Spotify current track error:",
                        error
                    );

                    setError(
                        "Unable to read Spotify playback."
                    );

                }

            },
            []
        );


    /* ========================================
       INITIALIZE SPOTIFY AUTH
    ======================================== */

    useEffect(() => {

        const initializeSpotify =
            async () => {

                try {

                    /*
                     * Handle Spotify callback.
                     */

                    const callbackHandled =
                        await handleSpotifyCallback();


                    /*
                     * Check login state again
                     * after callback.
                     */

                    if (
                        callbackHandled ||
                        isSpotifyLoggedIn()
                    ) {

                        setLoggedIn(true);

                    }

                } catch (error) {

                    console.error(
                        "Spotify initialization error:",
                        error
                    );


                    setError(
                        "Unable to connect to Spotify."
                    );

                }

            };


        initializeSpotify();

    }, []);


    /* ========================================
       POLL CURRENT TRACK
    ======================================== */

    useEffect(() => {

        if (!loggedIn) {

            return;

        }


        /*
         * Fetch immediately.
         */

        fetchCurrentTrack();


        /*
         * Check every 10 seconds.
         */

        const interval =
            setInterval(
                fetchCurrentTrack,
                10000
            );


        return () => {

            clearInterval(
                interval
            );

        };

    }, [
        loggedIn,
        fetchCurrentTrack,
    ]);


    /* ========================================
       LOGIN
    ======================================== */

    const handleLogin =
        async () => {

            try {

                setLoading(true);

                setError("");

                await loginWithSpotify();

            } catch (error) {

                console.error(
                    "Spotify login error:",
                    error
                );


                setError(
                    "Unable to connect to Spotify."
                );


                setLoading(false);

            }

        };


    /* ========================================
       LOGOUT
    ======================================== */

    const handleLogout =
        () => {

            logoutSpotify();

            setLoggedIn(false);

            setTrack(null);

            setError("");

        };


    /* ========================================
       OPEN SPOTIFY
    ======================================== */

    const openSpotify =
        () => {

            if (
                !track?.external_urls?.spotify
            ) {

                return;

            }


            window.open(
                track.external_urls.spotify,
                "_blank",
                "noopener,noreferrer"
            );

        };


    /* ========================================
       OPEN SPOTIFY HOME
    ======================================== */

    const openSpotifyHome =
        () => {

            window.open(
                "https://open.spotify.com",
                "_blank",
                "noopener,noreferrer"
            );

        };


    /* ========================================
       CONNECT SPOTIFY
    ======================================== */

    if (!loggedIn) {

        return (

            <section className="spotify-player">

                <div className="spotify-player-heading">

                    <div>

                        <p className="spotify-label">
                            I'M CURRENTLY LISTENING TO
                        </p>


                        <h2 className="spotify-empty-title">
                            Connect Spotify
                        </h2>

                    </div>


                    <FaSpotify
                        className="spotify-logo"
                    />

                </div>


                <p className="spotify-description">

                    Connect Spotify to show what
                    I'm currently listening to.

                </p>


                <button
                    type="button"
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
       NOTHING PLAYING
    ======================================== */

    if (!track) {

        return (

            <section className="spotify-player">

                <div className="spotify-player-heading">

                    <div>

                        <p className="spotify-label">
                            I'M CURRENTLY LISTENING TO
                        </p>


                        <h2 className="spotify-empty-title">
                            Nothing playing
                        </h2>

                    </div>


                    <FaSpotify
                        className="spotify-logo"
                    />

                </div>


                <p className="spotify-description">

                    Start playing something on Spotify
                    and it will appear here.

                </p>


                <div className="spotify-empty-footer">

                    <button
                        type="button"
                        className="spotify-open"
                        onClick={openSpotifyHome}
                    >

                        Open Spotify

                        <FaExternalLinkAlt />

                    </button>


                    <button
                        type="button"
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
       TRACK INFORMATION
    ======================================== */

    const albumImage =
        track.album?.images?.length
            ? track.album.images[0].url
            : null;


    const artistName =
        track.artists
            ?.map(
                artist =>
                    artist.name
            )
            .join(", ");


    const albumName =
        track.album?.name || "";


    /* ========================================
       CURRENTLY PLAYING
    ======================================== */

    return (

        <section className="spotify-player">

            {/* ==================================
                HEADER
            ================================== */}

            <div className="spotify-player-heading">

                <p className="spotify-label">
                    I'M CURRENTLY LISTENING TO
                </p>


                <FaSpotify
                    className="spotify-logo"
                />

            </div>


            {/* ==================================
                TRACK
            ================================== */}

            <div className="spotify-track">

                {albumImage && (

                    <img
                        src={albumImage}
                        alt={`${track.name} album artwork`}
                        className="spotify-cover"
                    />

                )}


                <div className="spotify-track-info">

                    <h2>
                        {track.name}
                    </h2>


                    <p>
                        {artistName}
                    </p>


                    <span>
                        {albumName}
                    </span>

                </div>

            </div>


            {/* ==================================
                CURRENTLY LISTENING INDICATOR
            ================================== */}

            <div className="spotify-current-indicator">

                <span className="spotify-playing-dot" />

                <span>
                    Currently listening
                </span>

            </div>


            {/* ==================================
                FOOTER
            ================================== */}

            <div className="spotify-footer">

                <div className="spotify-status">

                    <span className="spotify-status-dot online" />

                    <span>
                        Spotify
                    </span>

                </div>


                <div className="spotify-footer-actions">

                    <button
                        type="button"
                        className="spotify-open"
                        onClick={openSpotify}
                    >

                        Open in Spotify

                        <FaExternalLinkAlt />

                    </button>


                    <button
                        type="button"
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
