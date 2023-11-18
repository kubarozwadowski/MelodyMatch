const clientId = 'dd8233fe305a40698c7596d33b5232ef'; // your clientId
const redirectUrl = 'https://kubarozwadowski.github.io/MelodyMatch/mainPage.html'; // Updated redirect URL
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

function loginWithSpotifyClick() {
  redirectToSpotifyAuthorize();
}

async function fetchUserData(userId) {
  try {
    // Fetch top genres
    const topGenresResponse = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=long_term`, {
      headers: {
        'Authorization': 'Bearer ' + currentToken.access_token,
      },
    });
    const topGenresData = await topGenresResponse.json();
    const topGenres = topGenresData.items.map(artist => artist.genres).flat();
    
    // Fetch top artists
    const topArtistsResponse = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=long_term`, {
      headers: {
        'Authorization': 'Bearer ' + currentToken.access_token,
      },
    });
    const topArtistsData = await topArtistsResponse.json();
    const topArtists = topArtistsData.items.map(artist => artist.name);

    // Fetch top tracks
    const topTracksResponse = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=long_term`, {
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

function navigateToUserProfile() {
  const userId = prompt('Enter user ID:'); // You can replace this with your UI mechanism
  if (userId) {
    fetchUserData(userId);
  }
}

// Assume that somewhere in your code, after successful login, you call handleLoginCallback
function handleLoginCallback() {
  // Add your logic here to handle the callback after successful login
  // For example, you might want to fetch the access token and user data

  // After processing, redirect to another page (e.g., index.html)
  window.location.href = 'index.html';

  // Fetch additional user data (top genres, top artists, top tracks, and display name)
  fetchUserData();
}
