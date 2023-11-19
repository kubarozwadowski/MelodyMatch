const clientId = 'dd8233fe305a40698c7596d33b5232ef'; // your clientId
const redirectUrl = 'https://kubarozwadowski.github.io/MelodyMatch/mainPage.html'; // Updated redirect URL
const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const scope = 'user-read-private user-read-email';
const backendUrl = 'https://shimmering-shortbread-025f27.netlify.app/';
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

    // Save access token and code to cookie
    setCookie('accessToken', accessToken, 7);
    setCookie('authorizationCode', code, 7);

    // Fetch user data and update the DOM
    fetchUserData(accessToken);

    /**
    What you should do next:
    - add a button to fetch Spotify data (make sure this works)
    - in the same button, console.log the data from Spotify API
    - call your backend and save the Spotify data to the backend
    - finally, call the backend to get users and display user data
    **/
  } else {
    console.error('No authorization code found in the URL.');
  }
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

function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// Function to get data from cookies
function getCookie(name) {
  const keyValue = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return keyValue ? keyValue[2] : null;
}

// Function to fetch Spotify data and log to the console
async function fetchSpotifyData() {
  const accessToken = getCookie('accessToken');

  if (accessToken) {
    const userDataResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      },
    });

    const userData = await userDataResponse.json();
    console.log('Spotify Data:', userData);
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
async function fetchUserData(accessToken) {
  try {
    // Fetch user data using Spotify API
    const userDataResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      },
    });
    const userData = await userDataResponse.json();
    // Save Data to backend
    await fetch(backendUrl,{
      method: "POST",
      body:userData
    })

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
function getData() {
  fetch(backendUrl);
}
