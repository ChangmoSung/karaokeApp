# Year-a-oke

Today we're going to build JavaScript application that uses two separate APIs that allow us to pick out a random hit song for us to sing karaoke to.

## Phase 1: Getting a hit song that we are going to want the lyrics to

To get started, let's build out the functionality to choose a random song that we will eventually get the lyrics of. 

### Set up app structure

The first step is to create an object for our app:

```javascript
const karaoke = {};
```

The API call will require an API key. We are going to be using an internal API called `Retro Rewind`. Head to the Retro API developer portal [here](https://hushangni.github.io/retro-api-docs/) to complete your signup / login and access your API token.

We're going to create a property to hold the API key. This will be stored in our karaoke object.

```javascript
const karaoke = {};
karaoke.apiKey = `YOUR_KEY_HERE`;
```

We are going to create an `init` function that will get things started. We'll call this within the document ready, and fill in the code to run on `init` later.

```javascript
karaoke.init = () => {

}
```

We are going to set up a method to call that will go through all of the necessary actions to show a song on our page. We will call this method `setSong`, and the first thing that this method will do is make a call to the RetroAPI.

```javascript
/*
    Aggregates all of the necessary information to display the song details behind the curtain.
*/
karaoke.setSong = () => {

}
```

We are going to want to store the promise that our call to the API returns, as ultimately, we need the results from this API call in order to eventually make the call to our lyrics API.

```javascript
/*
    Aggregates all of the necessary information to display the song details behind the curtain.
*/
karaoke.setSong = () => {
    const allRetroDetails = karaoke.getRetroDetails();
}
```

This will make a call to our method that uses the `/years` endpoint from the API that returns all of the years stored in the retro database.

We will use ajax to make the call. Before we set up the call, for convenience, we can store the baseUrl of the API as a variable on the karaoke object. At the top of your script file, add in the following:

```javascript
karaoke.baseUrl = 'https://retroapi.hackeryou.com/api';
```

API base URLs are a great use case for our const variables.

We should now have all of the information that we need in order to make the call to the Retro API.

```javascript
 karaoke.getRetroDetails = () => {
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
```

Note that we are not using the `.then` method here, as we are interested in actually storing the promise response that is returned from the API call. We want to wait for this promise to resolve before making the next API call to the lyrics API.

The promise is now being stored in the `allRetroDetails` const variable that is inside of the `setSong` method.

We can keep writing the `setSong` method to handle the response from the RetroAPI, clean up the data, and then make the subsequent call to the lyrics API.

We will use the `.when` method which allows us to execute callback functions based on zero or more Thenable objects.

```javascript
 karaoke.setSong = () => {
    const allRetroDetails = karaoke.getRetroDetails();

    // Provides a way to execute callback functions based on zero or more thenable objects.
    $.when(allRetroDetails).done(function(data) {
        
    });
}
```

The response from the API will now be stored inside of the `data` parameter inside of the callback function in the `done` method. It's always a good idea to log out the data response to understand the format that you will be working with.

```javascript
 karaoke.setSong = () => {
    const allRetroDetails = karaoke.getRetroDetails();

    // Provides a way to execute callback functions based on zero or more thenable objects.
    $.when(allRetroDetails).done(function(data) {
        console.log(data);

        /*
            [
                {
                    _id: 1234567,
                    books: [],
                    decade: 1980,
                    movies: [],
                    shows: [],
                    songs: []
                    year: 1980
                },
                {},{} ...
            ]
        */
    });
}
```

We are particularly in the `songs` array, which will have 5 songs representing the top 5 songs of the respective year:

```json
[
    {
        _id: 1234567,
        artist: 'Blondie',
        title: 'Call Me',
        year: 12345678
    },
    {},{} ...
]
```

The artist, and the title, are the pieces of information that we are ultimately after, however, before we get into that, we need to set up the skeleton to be able to retrieve a random song. 

We are firstly going to pick a random year from the overall array, and we are then going to pick a random song from that year. This will help us get a truly random song, that will keep our karaoke super exciting.

We will set up two randomization methods. One to get the random year from the array returned from the retro API. We will then set up a separate randomization method that will return a number to allow us to select a random song from the object that is returned in the previous call. This will look like the following:

```javascript
karaoke.getRandomYear = (data) => {
    // The top range of the random number is decided by the number of years returned.

    // As this is being used for array indexing (which starts at 0), we need to subtract 1 from the overall length.
    return Math.floor(Math.random() * (data.length - 1));
}

karaoke.getRandomNum = () => {
    // Just need a random number between 0 and 5 to select a random song from the array.
    return Math.floor(Math.random() * 5);
}
```

We can now use these methods from within our `setSong` method. 


```javascript
 karaoke.setSong = () => {
    const allRetroDetails = karaoke.getRetroDetails();

    // Provides a way to execute callback functions based on zero or more thenable objects.
    $.when(allRetroDetails).done(function(data) {
        const randomYear = karaoke.getRandomYear(data);
        const randomSong = karaoke.getRandomNum();
    });
}
```

Next, we need to make sure that the data being returned from the Retro API is in a format that the lyrics API will accept. This, unfortunately, comes down to a lot of trial and error, as the API is not documented extensively enough to clarify the exact format that it expects.

Through research, it was determined that the `lyrics.ovh` API, is unable to complete its search when the artist has `feat.` in its name or if there is the word `and`. It also does not handle leading and trailing spaces well. 

We will write some methods to handle data clean up for us, so that we can be confident in the information that we are ultimately sending to the API.

We will write one method called `splitArtistFeatured` to address the inclusion of `feat.` in the artist string, and we will then write a separate method called `removeSpaces` to handle the leading and trailing spaces. 

Let's write the function stub for the `splitArtistFeatured` method. We will pass in a string which will represent the artist that we get back from the retro API:

```javascript
karaoke.splitArtistFeatured = (artist) => {
   
}
```

We will make use of the `split` method which converts a string into an array of substrings. We will call split on the artist parameter that we have passed in.

```javascript
karaoke.splitArtistFeatured = (artist) => {
    const soloArtist = artist.split("feat.");
}
```

`soloArtist` now holds an array of each of the substrings, separated at `feat.` if that string exists. Now that we have access to the first part of the string, prior to the `feat.` string, we can use the `replace` method to replace `and` with `&` (which the lyrics API allows for).

```javascript
karaoke.splitArtistFeatured = (artist) => {
    const soloArtist = artist.split("feat.");
    const formattedSoloArtist = soloArtist[0].replace('and', '&');
}
```

Finally, now that the necessary modifications have been made to the string, we can remove the leading and trailing spaces. Let's make a separate method to do this, so that we can keep each function specific to its purpose.

```javascript
karaoke.removeSpaces = (artist) => {
    
}
```

We will use the built in `trim` method, which does a great job at removing the leading a trailing spaces from a string. This method will remove the necessary spaces and then return the modified string.

```javascript
karaoke.removeSpaces = (artist) => {
    const artistNoSpace = artist.trim();
}
```

We can then just return the string so that anytime we call this function, it simply returns the modified string.

```javascript
karaoke.removeSpaces = (artist) => {
    const artistNoSpace = artist.trim();
    return artistNoSpace;
}
```

Now that we have the function written, we can call it from our `splitArtistFeatured` function.

```javascript
karaoke.splitArtistFeatured = (artist) => {
    const soloArtist = artist.split("feat.");
    const formattedSoloArtist = soloArtist[0].replace('and', '&');
    const formattedSoloArtistNoSpaces = karaoke.removeSpaces(formattedSoloArtist);
}
```

Finally, we can return the nicely formatted artist so that we can ultimately send it to the lyrics API.

```javascript
karaoke.splitArtistFeatured = (artist) => {
    const soloArtist = artist.split("feat.");
    const formattedSoloArtist = soloArtist[0].replace('and', '&');
    const formattedSoloArtistNoSpaces = karaoke.removeSpaces(formattedSoloArtist);
    return formattedSoloArtistNoSpaces;
}
```

We can resume writing our `setSong` method to make use of the formatting methods, and ultimately make the second API call. We will store the formatted song title and the formatted song artist in new variables. 

```javascript
   karaoke.setSong = () => {
    const allRetroDetails = karaoke.getRetroDetails();

    // Provides a way to execute callback functions based on zero or more thenable objects.
    $.when(allRetroDetails).done(function(data) {
        const randomYear = karaoke.getRandomYear(data);
        const randomSong = karaoke.getRandomNum();

        const formattedTitle = data[randomYear].songs[randomSong].title;
        const formattedArist =  karaoke.splitArtistFeatured(data[randomYear].songs[randomSong].artist);
    });
}
```

Now that we have the song title and artist, we can add them to the page. To do this, we need to make sure we have all of our selectors available in our namespaced object. We can go back to the top of the file, and add more variables that will hold all of the necessary selectors. 

The following should be added to the top of the file, and represent all the areas of the page that we will ultimately need to select:

```javascript
karaoke.lyricsSection = $('.lyrics');
karaoke.titleSection = $('.songTitle');
karaoke.artistSection = $('.artist');
karaoke.curtains = $('.curtain__checkbox');
```

We can now add the title and artist information to the page. We will use the `titleSection` and `artistSection` cached selectors.

```javascript
 karaoke.setSong = () => {
    const allRetroDetails = karaoke.getRetroDetails();

    // Provides a way to execute callback functions based on zero or more thenable objects.
    $.when(allRetroDetails).done(function(data) {
        const randomYear = karaoke.getRandomYear(data);
        const randomSong = karaoke.getRandomNum();

        const formattedTitle = data[randomYear].songs[randomSong].title;
        const formattedArist =  karaoke.splitArtistFeatured(data[randomYear].songs[randomSong].artist);
        karaoke.titleSection.append(formattedTitle);
        karaoke.artistSection.append(formattedArist);
    });
}
```

Next, we want to make the second API call. This call will occur within the `when` method callback. We will write a new method, called `getLyrics`, that will be responsible for making our second API call to the lyrics API.

```javascript
karaoke.getLyrics = (title, artist) => {
    
}
```

This method will retrieve the lyrics, and then get them onto the screen. We do not need to return the promise as there are no further API calls that will follow this one, and be based on the results returned from this call.

We can use a template literal string to plug in the necessary information to the API URL to make the request. 

```javascript
karaoke.getLyrics = (title, artist) => {
    $.ajax({
        url: `https://api.lyrics.ovh/v1/${artist}/${title}`,
        method: 'GET',
        dataType: 'json'
    }).then(function(data) {

    })
}
```

In the callback of the `then` method, you now have access to the lyrics information, and can append this to the screen. The `lyricsSection` selector that was cached earlier can be used to append the lyrics onto the screen.

```javascript
karaoke.getLyrics = (title, artist) => {
    // Make call to lyrics ovh API and pass in the artist and song desired.
    $.ajax({
        url: `https://api.lyrics.ovh/v1/${artist}/${title}`,
        method: 'GET',
        dataType: 'json'
    }).then(function(data) {
        // Append the lyrics to the appropriate section on the page.
        karaoke.lyricsSection.append(data.lyrics);
    })
}
```

Now that we have the `getLyrics` method written, we can call it from witin the `.when` method to complete the process of getting the lyrics and then putting them on the screen.

```javascript
 karaoke.setSong = () => {
    const allRetroDetails = karaoke.getRetroDetails();

    // Provides a way to execute callback functions based on zero or more thenable objects.
    $.when(allRetroDetails).done(function(data) {
        const randomYear = karaoke.getRandomYear(data);
        const randomSong = karaoke.getRandomNum();

        const formattedTitle = data[randomYear].songs[randomSong].title;
        const formattedArist =  karaoke.splitArtistFeatured(data[randomYear].songs[randomSong].artist);
        karaoke.titleSection.append(formattedTitle);
        karaoke.artistSection.append(formattedArist);
        karaoke.getLyrics(formattedTitle, formattedArtist);
    });
}
```

Sweet! This application is looking super cool. It's just about ready to be brought on your next night out with the Kool Karaokers, however, we should add in one final feature to tie it all together. We'll add in the ability to randomize the song each time the curtain opens.

We'll go back into the `init` method to write some logic that tracks our clicks on the page. For every even number of clicks, this means that our curtain is opening, and that a new song should be generated, and should replace whatever is currently on the screen.

We'll initialize a variable, `curtainOpens` to 0, to act as a counter for the curtain opening and closing.

```javascript
karaoke.init = () => {
    let curtainOpens = 0;

    karaoke.setSong();
}
```

We will now make use of the modulo operator to determine if we are on an even or odd number of clicks. For each even click, we will call a method that will clean the existing output, and generate a new song.

We will use an event listener to listen for a click on the page, and call a method each time we click (we have CSS tracking if the page is being clicked on).

```javascript
karaoke.init = () => {
    let curtainOpens = 0;

    karaoke.setSong();

    karaoke.curtains.on('click', function() {
        if (curtainOpens % 2 === 0) {
            // Call method that refreshes the song
        }
        curtainOpens = curtainOpens + 1;
    })
}
```

Let's write the method to refresh the song, which will ultimately be called within the if statement.

```javascript
 karaoke.refreshSong = () => {
   
}
```

The first thing that this method will do is target each of the selectors, and empty out the contents that are currently in there.

```javascript
karaoke.refreshSong = () => {
    // Reset song title.
    karaoke.titleSection.empty();
    // Reset artist.
    karaoke.artistSection.empty();
    // Reset lyrics data.
    karaoke.lyricsSection.empty();
}
```

Now that each of the sections are empty, we can call the `setSong` method again, which will go through the process of finding and selecting a random song, getting the lyrics, and putting all of the necessary information on the page - as it had done previously.

```javascript
karaoke.refreshSong = () => {
    // Reset song title.
    karaoke.titleSection.empty();
    // Reset artist.
    karaoke.artistSection.empty();
    // Reset lyrics data.
    karaoke.lyricsSection.empty();

    karaoke.setSong();
}
```

And that's it! Do a hard refresh on the page to get the application to the proper starting point. 

Start clicking on the page, and you should see a new song appearing each time the curtains open!

Well done! You have made a super fun randomized karaoke application. Stretch out your vocal chords, and start singing all of those hit tunes.

