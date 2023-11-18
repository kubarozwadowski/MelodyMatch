const clientId = 'dd8233fe305a40698c7596d33b5232ef'; // your clientId
const redirectUrl = 'https://kubarozwadowski.github.io/MelodyMatch/mainPage.html'; // Updated redirect URL
const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const scope = 'user-read-private user-read-email';
console.log("Start");
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
async function fetchUserData(userId) {
  try {
    // Fetch user data using Spotify API
    console.log("Hello test");
    const userDataResponse = await fetch(`https://api.spotify.com/v1/users/${userId}`, {
      headers: {
        'Authorization': 'Bearer ' + currentToken.access_token,
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

