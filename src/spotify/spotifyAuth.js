const CLIENT_ID =
    process.env.REACT_APP_SPOTIFY_CLIENT_ID;

const REDIRECT_URI =
    window.location.origin;


/* ========================================
   SPOTIFY SCOPES

   Display-only Spotify integration.
   No playback/control permissions needed.
======================================== */

const SCOPES = [
    "user-read-email",
    "user-read-private",
    "user-read-playback-state",
    "user-read-currently-playing",
].join(" ");


const TOKEN_KEY =
    "spotify_token";

const VERIFIER_KEY =
    "spotify_code_verifier";

const STATE_KEY =
    "spotify_auth_state";


/* ========================================
   RANDOM STRING
======================================== */

const generateRandomString = (
    length = 64
) => {

    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let result = "";

    const values =
        window.crypto.getRandomValues(
            new Uint32Array(length)
        );


    for (
        let i = 0;
        i < length;
        i++
    ) {

        result +=
            characters[
                values[i] %
                characters.length
            ];

    }


    return result;

};


/* ========================================
   SHA256
======================================== */

const sha256 = async (
    plain
) => {

    const encoder =
        new TextEncoder();

    const data =
        encoder.encode(plain);

    return window.crypto.subtle.digest(
        "SHA-256",
        data
    );

};


/* ========================================
   BASE64 URL ENCODE
======================================== */

const base64UrlEncode = (
    arrayBuffer
) => {

    return btoa(
        String.fromCharCode(
            ...new Uint8Array(
                arrayBuffer
            )
        )
    )
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

};


/* ========================================
   LOGIN
======================================== */

export const loginWithSpotify =
    async () => {

        if (!CLIENT_ID) {

            console.error(
                "Spotify Client ID is missing."
            );

            return;

        }


        const codeVerifier =
            generateRandomString(128);


        const hashed =
            await sha256(
                codeVerifier
            );


        const codeChallenge =
            base64UrlEncode(
                hashed
            );


        const state =
            generateRandomString(32);


        localStorage.setItem(
            VERIFIER_KEY,
            codeVerifier
        );


        localStorage.setItem(
            STATE_KEY,
            state
        );


        const params =
            new URLSearchParams({

                response_type:
                    "code",

                client_id:
                    CLIENT_ID,

                scope:
                    SCOPES,

                code_challenge_method:
                    "S256",

                code_challenge:
                    codeChallenge,

                redirect_uri:
                    REDIRECT_URI,

                state,

            });


        window.location.href =
            `https://accounts.spotify.com/authorize?${params.toString()}`;

    };


/* ========================================
   HANDLE CALLBACK
======================================== */

export const handleSpotifyCallback =
    async () => {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const code =
            params.get("code");


        const returnedState =
            params.get("state");


        const error =
            params.get("error");


        /*
         * Spotify returned an error.
         */

        if (error) {

            console.error(
                "Spotify authorization error:",
                error
            );

            return false;

        }


        /*
         * No authorization code.
         */

        if (!code) {

            return false;

        }


        /*
         * Validate state.
         */

        const savedState =
            localStorage.getItem(
                STATE_KEY
            );


        if (
            !savedState ||
            savedState !== returnedState
        ) {

            console.error(
                "Spotify state validation failed."
            );

            return false;

        }


        /*
         * Get PKCE verifier.
         */

        const codeVerifier =
            localStorage.getItem(
                VERIFIER_KEY
            );


        if (!codeVerifier) {

            console.error(
                "Spotify code verifier missing."
            );

            return false;

        }


        /*
         * Exchange authorization code
         * for access + refresh token.
         */

        const body =
            new URLSearchParams({

                client_id:
                    CLIENT_ID,

                grant_type:
                    "authorization_code",

                code,

                redirect_uri:
                    REDIRECT_URI,

                code_verifier:
                    codeVerifier,

            });


        const response =
            await fetch(
                "https://accounts.spotify.com/api/token",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded",
                    },

                    body,

                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Spotify token exchange failed:",
                response.status,
                errorText
            );

            return false;

        }


        const data =
            await response.json();


        const expiresAt =
            Date.now() +
            (
                data.expires_in *
                1000
            );


        localStorage.setItem(
            TOKEN_KEY,
            JSON.stringify({

                access_token:
                    data.access_token,

                refresh_token:
                    data.refresh_token,

                expires_at:
                    expiresAt,

            })
        );


        /*
         * Clean temporary OAuth data.
         */

        localStorage.removeItem(
            VERIFIER_KEY
        );

        localStorage.removeItem(
            STATE_KEY
        );


        /*
         * Remove ?code=... from URL.
         */

        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );


        console.log(
            "Spotify authentication successful."
        );


        return true;

    };


/* ========================================
   GET SPOTIFY TOKEN
======================================== */

export const getSpotifyToken =
    async () => {

        const stored =
            localStorage.getItem(
                TOKEN_KEY
            );


        if (!stored) {

            return null;

        }


        let token;


        try {

            token =
                JSON.parse(
                    stored
                );

        } catch (error) {

            console.error(
                "Invalid Spotify token data."
            );

            localStorage.removeItem(
                TOKEN_KEY
            );

            return null;

        }


        /*
         * Existing token still valid.
         */

        if (
            token.expires_at >
            Date.now() + 60000
        ) {

            return token.access_token;

        }


        /*
         * No refresh token.
         */

        if (
            !token.refresh_token
        ) {

            localStorage.removeItem(
                TOKEN_KEY
            );

            return null;

        }


        /*
         * Refresh access token.
         */

        try {

            const body =
                new URLSearchParams({

                    client_id:
                        CLIENT_ID,

                    grant_type:
                        "refresh_token",

                    refresh_token:
                        token.refresh_token,

                });


            const response =
                await fetch(
                    "https://accounts.spotify.com/api/token",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/x-www-form-urlencoded",
                        },

                        body,

                    }
                );


            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Spotify token refresh failed:",
                    response.status,
                    errorText
                );


                localStorage.removeItem(
                    TOKEN_KEY
                );


                return null;

            }


            const data =
                await response.json();


            const updatedToken = {

                access_token:
                    data.access_token,

                refresh_token:
                    data.refresh_token ||
                    token.refresh_token,

                expires_at:
                    Date.now() +
                    (
                        data.expires_in *
                        1000
                    ),

            };


            localStorage.setItem(
                TOKEN_KEY,
                JSON.stringify(
                    updatedToken
                )
            );


            return updatedToken.access_token;

        } catch (error) {

            console.error(
                "Spotify token refresh error:",
                error
            );


            localStorage.removeItem(
                TOKEN_KEY
            );


            return null;

        }

    };


/* ========================================
   LOGOUT
======================================== */

export const logoutSpotify = () => {

    localStorage.removeItem(
        TOKEN_KEY
    );

    localStorage.removeItem(
        VERIFIER_KEY
    );

    localStorage.removeItem(
        STATE_KEY
    );

};


/* ========================================
   AUTH STATUS
======================================== */

export const isSpotifyLoggedIn = () => {

    return Boolean(
        localStorage.getItem(
            TOKEN_KEY
        )
    );

};
