// app.js
const clientId = 'dd8233fe305a40698c7596d33b5232ef'; // your clientId
const redirectUrl = 'https://kubarozwadowski.github.io/MelodyMatch/handleSpotifyResponse.html'; // Updated redirect URL
const redirectUrl = 'https://kubarozwadowski.github.io/MelodyMatch/'; // your redirect URL - must be localhost URL and/or HTTPS

const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const scope = 'user-read-private user-read-email';
@@ -17,6 +18,32 @@ function redirectToSpotifyAuthorize() {
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
// After obtaining the authorization code, call handleLoginCallback
const code = args.get('code');
if (code) {
  const token = await getToken(code);
  currentToken.save(token);

  // Remove code from URL so we can refresh correctly.
  const url = new URL(window.location.href);
  url.searchParams.delete("code");

  const updatedUrl = url.search ? url.href : url.href.replace('?', '');
  window.history.replaceState({}, document.title, updatedUrl);

  // Call the function to handle the successful login and redirect
  handleLoginCallback();
}
