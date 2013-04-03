This repository demonstrates how do I benefit from tiny functional programming tools to 
have my code more declarative.

I'll code a simple app that is supposed to fetch the following data from an ad-hoc API and list
all of them as HTML;

```js
// => /users.json
        [3, 7, 19, 23, 27]
  
// => /users/7.json
        { id: 7, name: 'Smith', age: 21, posts: [3, 11, 12], photos: [19, 23, 39] }
    
// => /posts/11.json
        { id: 11, title: "Hello World", content: "lorem ipsum sit dolor amet" }
    
//  => /photos/19.json
        { id: 19, path: "http://photos.foobar.com/19.jpg" }
```

Let's think about the dependencies we need; a function to query JSON API?

```js
var getJSON = require('get-json');
```

At the first step, we need the list of users so we'll send a request to `/users.json`. 
It's a simple one, so we can do partial application on `getJSON`:

```js
var partial = require('new-partial');

var userIds = partial(getJSON, '/users.json');
```

`userIds` above is a partial application, just another async function, nothing special. It'll send a request to /users.json and
pass you the data once you call it with a callback.

Since we now have the list of users to get, let's get the user data:

```js
var joinParams = require('join-params');

var user = joinParams(getJSON, "/users/{0}.json")
```

This time, we used `join-params` for getting the partial application of `getJSON`. 
[join-params](http://npm.im/join-params) is a fork of [new-partial](http://npm.im/new-partial)
that lets you join the parameters in a single, formatted parameter. See its docs for details.

===============================

Dependencies:

```js
var andThen    = require('andthen'),
    getJSON    = require('get-json'),
    joinParams = require('join-params')
    map        = require('map'),
    partial    = require('new-partial');
```

Implementation:

```js
var getUserIds      = partial(getJSON, '/users.json'),

    getUser         = joinParams(getJSON, '/users/{0}.json'),
    getUsers        = partial(map, getUser),
    
    getAllUsers     = andThen(getUserIds, getUsers),
    
    getPost         = joinParams(getJSON, '/posts/{0}.json'),
    getPosts        = partial(map, getPost),
    
    getPhoto        = joinParams(getJSON, '/photos/{0}.json'),
    getPhotos       = partial(map, getPhoto);
    
    getProfile      = andThen(getUser, 'posts', getPosts, 'photos', getPhotos),
    getProfiles     = partial(map, getProfile),
    getAllProfiles  = andThen(getUserIds, getProfiles);
```

Usage:

```js
getUser(3, function(error, user){
    
    user.name, user.age, user.posts, user.photos
    // => smith, 21, [3, 11, 12], [19, 23, 39]

})
```

```js
getProfile(3, function(error, profile){
    
    profile.name, profile.posts[0].title, profile.photos[0].path
    // => smith, Hello World, http://photos.foobar.com/19.jpg
})
```

```js
getAllUsers(function(error, users){
    
    users.length
    // => 5
    
    users[1].name, users[1].age, users[1].posts, users[1].photos
    // => smith, 21,  [3, 11, 12], [19, 23, 39]
    
})
```

```js
getAllProfiles(function(error, profiles){
    
    profiles.length
    // => 5
    
    profiles[1].name, profiles[1].posts[0].title, profiles[1].photos[0].path
    // => smith, Hello World, http://photos.foobar.com/19.jpg
    
})
```
