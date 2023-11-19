const clientId = 'dd8233fe305a40698c7596d33b5232ef'; // your clientId
const redirectUrl = 'https://kubarozwadowski.github.io/MelodyMatch/mainPage.html'; // Updated redirect URL
const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const scope = 'user-read-private user-read-email';

// Server-side endpoint for token exchange
const tokenExchangeEndpoint = 'https://your-server.com/exchange-token';

// Function to handle authorization callback
async function handleAuthorizationCallback() {
  console.log('Handling authorization callback...');
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    console.log('Authorization code:', code);
    // Exchange the authorization code for an access token
    const accessToken = await exchangeCodeForToken(code);
    console.log('Access token:', accessToken);

    // Now that you have the access token, fetch the user's data
    fetchUserData(accessToken);
  } else {
    console.error('No authorization code found in the URL.');
  }
}

  // Exchange the authorization code for an access token
  const accessToken = await exchangeCodeForToken(code);

  // Now that you have the access token, fetch the user's data
  fetchUserData(accessToken);
}

// Function to exchange the authorization code for an access token
async function exchangeCodeForToken(code) {
  const response = await fetch(tokenExchangeEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code: code,
    }),
  });

  const data = await response.json();
  return data.access_token;
}

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

// Function to fetch additional user data
async function fetchUserData(accessToken) {
  try {
    // Fetch user data using Spotify API
    const userDataResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      },
    });
    const userData = await userDataResponse.json();

    // Update the DOM with the fetched data
    document.getElementById('profileImage').src = userData.images[0].url;
    document.getElementById('personName').textContent = userData.display_name;
    document.getElementById('personBio').textContent = userData.bio;

    // Assuming top genres, artists, and tracks are arrays of strings
    updateList('topGenresList', userData.top_genres);
    updateList('topArtistsList', userData.top_artists);
    updateList('topSongsList', userData.top_tracks);

  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}

// Function to update a list in the DOM
function updateList(listId, items) {
  const list = document.getElementById(listId);
  list.innerHTML = ''; // Clear existing items

  items.forEach(item => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.textContent = item;
    list.appendChild(listItem);
  });
}

// Assume that somewhere in your code, after successful login, you call handleAuthorizationCallback
function handleLoginCallback() {
  // Handle the callback after successful login (e.g., token exchange)
  handleAuthorizationCallback();
}
