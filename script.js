$(function() {
    
    const karaoke = {};

    karaoke.apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWQzOGFkNzJlZjk1NjQwNDZmYzRhNzFlIn0sImlhdCI6MTU2Mzk5NTUwNywiZXhwIjoxNTk1NTMxNTA3fQ.76ZKK_sn1sUCtRdD9FlTlPaQmtMYzIpKFJqb15XZshQ";

    karaoke.retroBaseUrl = 'https://retroapi.hackeryou.com/api';
    karaoke.lyricsBaseUrl = 'https://api.lyrics.ovh/v1';

    karaoke.lyricsSection = $('.lyrics');
    karaoke.titleSection = $('.songTitle');
    karaoke.artistSection = $('.artist');
    karaoke.curtains = $('.curtain__checkbox');

    /*
        The array of objects contains one object per year, so use the array to grab a random year object based on the overall length of the array.
    */
    karaoke.getRandomYear = (data) => {
        // The top range of the random number is decided by the number of years returned.
        return Math.floor(Math.random() * (data.length - 1));
    }

    karaoke.getRandomNum = () => {
        // Just need a number between 0 and 5.
        return Math.floor(Math.random() * 5);
    }

    /*
        Make the call to the retroAPI /years endpoint to grab.
    */
    karaoke.getRetroDetails = () => {
        const yearsResponse = $.ajax({
            url: `${karaoke.retroBaseUrl}/years`,
            method: 'GET',
            dataType: 'json',
            data: {
                apiKey: karaoke.apiKey
            }
        });
        return yearsResponse;
    }

    /*
        Need specific formatting, or else the lyrics API doesn't appreciate us
        Some stipulations:
        1. Doesn't work if the keyword 'feat' or 'featuring' is used.
        2. Replace the word 'and' with the '&' symbol.
    */
    karaoke.splitArtistFeatured = (artist) => {
        const soloArtist = artist.split("feat.");
        const formattedSoloArtist = soloArtist[0].replace('and', '&')
        const formattedSoloArtistNoSpaces = karaoke.removeSpaces(formattedSoloArtist);
        return formattedSoloArtistNoSpaces;
    }


    karaoke.removeSpaces = (artist) => {
        // Trim method eliminates leading and trailing spaces.
        return artist.trim();
    }

    /*
        This will make the call to the lyrics API to get the desired song lyrics.
    */
    karaoke.getLyrics = (title, artist) => {
        // Make call to lyrics ovh API and pass in the artist and song desired.
        $.ajax({
            url: `${karaoke.lyricsBaseUrl}/${artist}/${title}`,
            method: 'GET',
            dataType: 'json'
        }).then(function(data) {
            // Append the lyrics to the appropriate section on the page.
            karaoke.lyricsSection.append(data.lyrics);
        })
    }

    /*
        Add all of the necessary song information to the page behind the curtains.
    */
    karaoke.setSong = () => {
        const allRetroDetails = karaoke.getRetroDetails();

        // Provides a way to execute callback functions based on zero or more thenable objects.
        $.when(allRetroDetails).done(function(data) {
            const randomYear = karaoke.getRandomYear(data);
            const randomSong = karaoke.getRandomNum();

            const formattedTitle = data[randomYear].songs[randomSong].title;
            const formattedArtist =  karaoke.splitArtistFeatured(data[randomYear].songs[randomSong].artist);
            karaoke.titleSection.append(formattedTitle);
            karaoke.artistSection.append(formattedArtist);
            karaoke.getLyrics(formattedTitle, formattedArtist);
        });
    }

    /*
        Clear out the song related information, and fetch another song to display.
    */
    karaoke.refreshSong = () => {
        // Reset song title.
        karaoke.titleSection.empty();
        // Reset artist.
        karaoke.artistSection.empty();
        // Reset lyrics data.
        karaoke.lyricsSection.empty();

        karaoke.setSong();
    }

    karaoke.init = () => {
        let curtainOpens = 0;
        // This will set an initial song to display behind the curtain.
        karaoke.setSong();

        // This is just to keep track of when we're clicking on the full page.
        karaoke.curtains.on('click', function() {
            if (curtainOpens % 2 === 0) {
                karaoke.refreshSong();
            }
            curtainOpens = curtainOpens + 1;
        })

    }

    karaoke.init();

});