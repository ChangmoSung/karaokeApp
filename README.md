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

Next, we need to make sure that the data being returned from the Retro API is in an acceptable format that the lyrics API will accept. 