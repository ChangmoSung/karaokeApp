$(function() {
    
    const karaoke = {};

    karaoke.apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWQzOGFkNzJlZjk1NjQwNDZmYzRhNzFlIn0sImlhdCI6MTU2Mzk5NTUwNywiZXhwIjoxNTk1NTMxNTA3fQ.76ZKK_sn1sUCtRdD9FlTlPaQmtMYzIpKFJqb15XZshQ";

    karaoke.baseUrl = 'https://retroapi.hackeryou.com/api'

    karaoke.lyricsSection = $('.lyrics');
    karaoke.titleSection = $('.songTitle');
    karaoke.artistSection = $('.artist');

    karaoke.getRandomYear = (data) => {
        // The top range of the random number is decided by the number of years returned
        return Math.floor(Math.random() * (data.length - 1));
    }

    karaoke.getRandomNum = () => {
        // Just need a number between 0 and 5
        return Math.floor(Math.random() * 5);
    }

    /*
        Make the call to the retroAPI /years endpoint to grab
    */
    karaoke.getYears = () => {
        const yearsResponse = $.ajax({
            url: `${karaoke.baseUrl}/years`,
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
    */
    karaoke.splitArtistFeatured = (artist) => {
        const soloArtist = artist.split("feat.");
        const formattedSoloArtist = soloArtist[0].replace('and', '&')
        const formattedSoloArtistNoSpaces = karaoke.removeSpaces(formattedSoloArtist);
        return formattedSoloArtistNoSpaces;
    }


    karaoke.removeSpaces = (artist) => {
        const artistNoSpace = artist.trim();
        return artistNoSpace;
    }

    karaoke.getLyrics = (title, artist) => {
        const lyricsResponse = $.ajax({
            url: `https://api.lyrics.ovh/v1/${artist}/${title}`,
            method: 'GET',
            dataType: 'json'
        }).then(function(data) {
            console.log(data.lyrics);
            karaoke.lyricsSection.append(data.lyrics);
        })
        return lyricsResponse;
    }

    karaoke.setSong = () => {
        const allYears = karaoke.getYears();

        $.when(allYears).done(function(data) {
            const randomYear = karaoke.getRandomYear(data);
            const randomSong = karaoke.getRandomNum();

            const formattedTitle = data[randomYear].songs[randomSong].title;
            const formattedArist =  karaoke.splitArtistFeatured(data[randomYear].songs[randomSong].artist);
            karaoke.titleSection.append(formattedTitle);
            karaoke.artistSection.append(formattedArist);
            const title = formattedTitle;
            const artist = formattedArist;
            return karaoke.getLyrics(title, artist);
        });
    }

    karaoke.refreshSong = () => {
        // Reset song title
        karaoke.titleSection.empty();
        // Reset artist
        karaoke.artistSection.empty();
        // Reset lyrics data
        karaoke.lyricsSection.empty();

        karaoke.setSong();
    }

    karaoke.init = () => {
        let curtainOpens = 0;
        karaoke.setSong();

        // This is just to keep track of when we're clicking on the full page.
        $('.curtain__checkbox').on('click', function() {
            if (curtainOpens % 2 === 0) {
                karaoke.refreshSong();
            }
            curtainOpens = curtainOpens + 1;
        })

    }

    karaoke.init();

});