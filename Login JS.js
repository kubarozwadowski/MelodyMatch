const clientId = 'dd8233fe305a40698c7596d33b5232ef'; // your clientId
// Use only one of the following lines for redirectUrl
const redirectUrl = 'https://kubarozwadowski.github.io/MelodyMatch/mainPage.html'; // Updated redirect URL
// OR
// const redirectUrl = 'https://kubarozwadowski.github.io/MelodyMatch/'; // your redirect URL - must be localhost URL and/or HTTPS

const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const scope = 'user-read-private user-read-email';

function redirectToSpotifyAuthorize() {
  const authUrl = new URL(authorizationEndpoint);
  const params = {
    response_type: 'code',
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUrl,
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
}

// Click handler
function loginWithSpotifyClick() {
  redirectToSpotifyAuthorize();
}

// Function to fetch additional user data
async function fetchUserData() {
  try {
    // Fetch top genres
    const topGenresResponse = await fetch('https://api.spotify.com/v1/me/top/artists?time_range=long_term', {
      headers: {
        'Authorization': 'Bearer ' + currentToken.access_token,
      },
    });
    const topGenresData = await topGenresResponse.json();
    const topGenres = topGenresData.items.map(artist => artist.genres).flat();
    
    // Fetch top artists
    const topArtistsResponse = await fetch('https://api.spotify.com/v1/me/top/artists?time_range=long_term', {
      headers: {
        'Authorization': 'Bearer ' + currentToken.access_token,
      },
    });
    const topArtistsData = await topArtistsResponse.json();
    const topArtists = topArtistsData.items.map(artist => artist.name);

    // Fetch top tracks
    const topTracksResponse = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=long_term', {
      headers: {
        'Authorization': 'Bearer ' + currentToken.access_token,
      },
    });
    const topTracksData = await topTracksResponse.json();
    const topTracks = topTracksData.items.map(track => track.name);

    // Fetch user profile (display name)
    const userProfileResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': 'Bearer ' + currentToken.access_token,
      },
    });
    const userProfileData = await userProfileResponse.json();
    const displayName = userProfileData.display_name;

    // Log or use the fetched data as needed
    console.log('Top Genres:', topGenres);
    console.log('Top Artists:', topArtists);
    console.log('Top Tracks:', topTracks);
    console.log('Display Name:', displayName);
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}

// Existing code...

// Assume that somewhere in your code, after successful login, you call handleLoginCallback
function handleLoginCallback() {
  // Add your logic here to handle the callback after successful login
  // For example, you might want to fetch the access token and user data

  // After processing, redirect to another page (e.g., index.html)
  window.location.href = 'index.html';

  // Fetch additional user data (top genres, top artists, top tracks, and display name)
  fetchUserData();
}

// Existing code...
