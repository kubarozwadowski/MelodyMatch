// app.js
const clientId = 'dd8233fe305a40698c7596d33b5232ef'; // your clientId
const redirectUrl = 'https://kubarozwadowski.github.io/MelodyMatch/'; // your redirect URL - must be localhost URL and/or HTTPS

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

function handleLoginCallback() {
  // Add your logic here to handle the callback after successful login
  // For example, you might want to fetch the access token and user data

  // After processing, redirect to another page (e.g., index.html)
  window.location.href = 'index.html';
}

// Check if the user is already logged in
if (currentToken.access_token) {
  // If logged in, handle the callback immediately
  handleLoginCallback();
} else {
  // If not logged in, display the login button
  // You can add this logic in your HTML or dynamically create the button here
  const loginButton = document.createElement('button');
  loginButton.textContent = 'Login with Spotify';
  loginButton.addEventListener('click', loginWithSpotifyClick);
  document.body.appendChild(loginButton);
}
