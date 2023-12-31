const clientId = 'dd8233fe305a40698c7596d33b5232ef';
const redirectUrl = 'https://kubarozwadowski.github.io/MelodyMatch/mainPage.html';
const authorizationEndpoint = 'https://accounts.spotify.com/authorize';
const scope = 'user-read-private user-read-email';
const backendUrl = 'https://shimmering-shortbread-025f27.netlify.app/';
const tokenExchangeEndpoint = 'https://accounts.spotify.com/api/token';

// Function to handle authorization callback
async function handleAuthorizationCallback() {
  console.log('Handling authorization callback...');
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    console.log('Authorization code:', code);
    const _accessToken = await exchangeCodeForToken(code);
    setAccessToken(_accessToken);

    // Exchange the authorization code for an access token
    console.log('Access token:', _accessToken);

    // Save access token to cookies
    setCookie('accessToken', _accessToken);

    // Fetch user data and update the DOM
    fetchUserData(_accessToken);

    // Fetch additional Spotify data and save it to the backend
    fetchSpotifyData();
  } else {
    console.error('No authorization code found in the URL.');
  }
}

// Function to exchange the authorization code for an access token
async function exchangeCodeForToken(code) {
  const response = await fetch(tokenExchangeEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUrl}&client_id=${clientId}`,
  });

  const data = await response.json();
  return data.access_token;
}

// Function to set a cookie
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// Function to get a cookie
function getCookie(name) {
  const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
  const cookie = cookies.find(cookie => cookie[0] === name);
  return cookie ? cookie[1] : null;
}


// ... (rest of your code remains the same)

let accessToken; // Variable to store the access token

// Function to set the access token
function setAccessToken(token) {
  accessToken = token;
}



// Function to fetch Spotify data and log to the console
async function fetchSpotifyData() {
  console.log('Fetching Spotify data...');

  if (accessToken) {
    const userDataResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      },
    });

    if (userDataResponse.ok) {
      const userData = await userDataResponse.json();
      console.log('Spotify Data:', userData);

      // Save Spotify data to the backend
      saveSpotifyDataToBackend(userData);
    } else {
      console.error('Failed to fetch user data from Spotify API');
    }
  } else {
    console.error('Access token not found.');
  }
}
// Function to save Spotify data to the backend
async function saveSpotifyDataToBackend(userData) {
  try {
    // Save Data to backend
    await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    // Update the DOM with the fetched data
    // ...

  } catch (error) {
    console.error('Error saving user data to the backend:', error);
  }
}

// Function to get users from the backend
async function getUsersFromBackend() {
  try {
    const response = await fetch(backendUrl);
    const usersData = await response.json();

    // Display user data on the frontend as needed
    console.log('Users Data from Backend:', usersData);

  } catch (error) {
    console.error('Error fetching users from the backend:', error);
  }
}

// Other functions in your code...

// Assume that somewhere in your code, after successful login, you call handleAuthorizationCallback
function handleLoginCallback() {
  // Handle the callback after successful login (e.g., token exchange)
  handleAuthorizationCallback();
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
// Function to fetch additional user data
async function fetchUserData(accessToken) {
  try {
    // Fetch user data using Spotify API
    const userDataResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      },
    });

    if (!userDataResponse.ok) {
      throw new Error('Failed to fetch user data from Spotify API');
    }

    const userData = await userDataResponse.json();

    // Save ID and name to cookies
    setCookie('spotifyUserId', userData.id, 7);
    setCookie('spotifyUserName', userData.display_name || 'Anonymous', 7);

    // Save Data to backend
    saveSpotifyDataToBackend(userData);

    // Update the DOM with the fetched data
    document.getElementById('profileImage').src = userData.images[0].url;
    document.getElementById('personName').textContent = userData.display_name || 'Anonymous';
    document.getElementById('personBio').textContent = userData.bio || 'No bio available';

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

function getData() {
  fetch(backendUrl);
}

// Call handleAuthorizationCallback on page load to check if there is a code in the url params
handleAuthorizationCallback();
