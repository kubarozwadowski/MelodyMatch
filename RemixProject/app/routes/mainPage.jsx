
import React from "react";

export default function mainPage() {
  return <div>
    <div class="profile-card" style="width: 40rem;">
      <img id="profileImage" src="" class="card-img-top" alt="Profile Image"/>
        <div class="card-body">
          <h5 id="personName" class="card-title">Person's name here</h5>
          <p id="personBio" class="card-text">Person's bio </p>
        </div>
        <ul class="list-group list-group-flush">
          <li id="topGenresList" class="list-group-item">Top Genres: </li>
          <li id="topArtistsList" class="list-group-item">Top Artists: </li>
          <li id="topSongsList" class="list-group-item">Top Songs: </li>
        </ul>
        <div class="btn-group" role="group" aria-label="Basic mixed styles example" style="display: flex;">
          <button type="button" class="btn btn-danger">No</button>
          <button type="button" class="btn btn-success">Yes</button>
        </div>
    </div>
  </div>
}