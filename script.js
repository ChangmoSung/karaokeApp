$(function() {
    
    const retroApp = {};

    retroApp.apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWQzOGFkNzJlZjk1NjQwNDZmYzRhNzFlIn0sImlhdCI6MTU2Mzk5NTUwNywiZXhwIjoxNTk1NTMxNTA3fQ.76ZKK_sn1sUCtRdD9FlTlPaQmtMYzIpKFJqb15XZshQ";

    retroApp.baseUrl = 'https://retroapi.hackeryou.com/api'

    retroApp.getRandomYear = (data) => {
        // The top range of the random number is decided by the number of years returned
        return Math.floor(Math.random() * (data.length - 1));
    }

    retroApp.getRandomSong = () => {
        return Math.floor(Math.random() * 5);
    }

    retroApp.getYears = () => {
        const yearsResponse = $.ajax({
            url: `${retroApp.baseUrl}/years`,
            method: 'GET',
            dataType: 'json',
            data: {
                apiKey: retroApp.apiKey
            }
        });
        return yearsResponse;
    }

    retroApp.splitArtistFeatured = (artist) => {
        const soloArtist = artist.split("feat.");
        const formattedSoloArtist = soloArtist[0].replace('and', '&')
        const formattedSoloArtistNoSpaces = retroApp.removeSpaces(formattedSoloArtist);
        return formattedSoloArtistNoSpaces;
    }

    retroApp.removeSpaces = (artist) => {
        const artistNoSpace = artist.trim();
        return artistNoSpace;
    }

    retroApp.getLyrics = (chosenSong) => {
        const lyricsResponse = $.ajax({
            url: `https://api.lyrics.ovh/v1/${chosenSong.artist}/${chosenSong.title}`,
            method: 'GET',
            dataType: 'json'
        }).then(function(data) {
            console.log(data);
            $('.results').append(data.lyrics);
        })
        return lyricsResponse;
    }

    retroApp.init = () => {
        const chosenSong = {};
        const allYears = retroApp.getYears();
        $.when(allYears).done(function(data) {
            console.debug(data);
            const randomYear = retroApp.getRandomYear(data);
            const randomSong = retroApp.getRandomSong();
            console.debug(randomYear);
            console.debug(randomSong);
            const formattedTitle = data[randomYear].songs[randomSong].title;
            const formattedArist =  retroApp.splitArtistFeatured(data[randomYear].songs[randomSong].artist);
            console.debug(formattedTitle);
            console.debug(formattedArist);
            $('.songTitle').append(formattedTitle);
            $('.artist').append(formattedArist);
            chosenSong.title = formattedTitle;
            chosenSong.artist = formattedArist;
            return retroApp.getLyrics(chosenSong);
        });
    }

    retroApp.init();

});