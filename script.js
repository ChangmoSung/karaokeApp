const karaoke = {};

karaoke.apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWRlMWM5MjU5MDk0Y2QwNDNiNzFlNjkwIn0sImlhdCI6MTU3NTA3ODE4MSwiZXhwIjoxNjA2NjE0MTgxfQ.2JdNmIkFzs0iUmtIdrFFYXebQcY9Vat3A8vco60hwcA';

karaoke.baseUrl = 'https://retroapi.hackeryou.com/api';
karaoke.lyricsBaseUrl = 'http://juno-karaoke.herokuapp.com/v1';

karaoke.init = function() {
  $(`.curtain__checkbox`).on(`click`, function() {
    karaoke.setSong();
  })
}

karaoke.getRetroDetails = function() {
  const yearsResponse = $.ajax({
    url: `${karaoke.baseUrl}/years`,
    method: `GET`,
    datatype: `json`,
    data: {
      apiKey: karaoke.apiKey
    }
  })
  return yearsResponse;
}

karaoke.getRandomNumber = function() {
  return Math.floor(Math.random() * 5);
}

karaoke.getRandomYear = function(arrayLength) {
  return Math.floor(Math.random() * arrayLength);
}


karaoke.removeSpaces = function(artist){
  return artist.trim();
}
// Clean up artist name data
karaoke.splitArtistFeatured = function(artist){
    console.log(artist);
  const soloArtist = artist.split('feat.');
  const formattedSoloArtist = soloArtist[0].replace(' and ', '&');
  const formattedSoloArtistNoSpaces = karaoke.removeSpaces(formattedSoloArtist);
  return formattedSoloArtistNoSpaces;
}

karaoke.getLyrics = function(artist, title){
  $.ajax({
    url: `${karaoke.lyricsBaseUrl}/${artist}/${title}`,
    method: 'GET',
    dataType: 'json'
  }).then(function(data){
    console.log(data);
    $('.lyrics').text(data.lyrics);
  })
}


karaoke.setSong = function() {
  const allRetroDetails = karaoke.getRetroDetails();
  console.log(allRetroDetails);
  allRetroDetails.then(function(data) {
    console.log(data);
    const randomNumber = karaoke.getRandomNumber();
    const randomYear = karaoke.getRandomYear(data.length);
    // const year = data[randomYear];
    //why did she set this variable? "year"
    const formattedTitle = data[randomYear].songs[randomNumber].title;
    const formattedArtist = karaoke.splitArtistFeatured(data[randomYear].songs[randomNumber].artist);
    $(`.songTitle`).text(formattedTitle);
    $(`.artist`).text(formattedArtist);
    karaoke.getLyrics(formattedArtist, formattedTitle);
  })
}

$(function() {
  karaoke.init();
});