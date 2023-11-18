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

// Function to fetch additional user data
async function fetchUserData(userId) {
  try {
    // Fetch user data using Spotify API
    const userDataResponse = await fetch(`https://api.spotify.com/v1/users/${userId}`, {
      headers: {
        'Authorization': 'Bearer ' + currentToken.access_token,
      },
    });
    const userData = await userDataResponse.json();

    // Update the DOM with the fetched data
    document.getElementById('profileImage').src = userData.images[0].url; // Assuming profile image is an array of images
    document.getElementById('personName').textContent = userData.display_name;
    document.getElementById('personBio').textContent = userData.bio;
    
    // Assuming favorite artist, genre, and song are properties provided by the Spotify API
    document.getElementById('favoriteArtistImage').src = userData.favorite_artist.image_url;
    document.getElementById('favoriteArtist').textContent = 'Favorite Artist: ' + userData.favorite_artist.name;
    document.getElementById('favoriteGenre').textContent = 'Favorite Genre: ' + userData.favorite_genre;
    document.getElementById('favoriteSongImage').src = userData.favorite_song.image_url;
    document.getElementById('favoriteSong').textContent = 'Favorite Song: ' + userData.favorite_song.name;

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
