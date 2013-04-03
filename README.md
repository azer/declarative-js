This repository demonstrates how do I benefit from tiny functional programming tools to 
have my code more declarative.

```
/users.json
    [3, 7, 19, 23, 27]
    
/users/7.json
    { id: 7, name: 'Smith', age: 21, posts: [3, 11, 12], photos: [19, 23, 39] }
    
/posts/11.json
    { id: 11, title: "Hello World", content: "lorem ipsum sit dolor amet" }
    
/photos/19.json
    { id: 19, path: "http://photos.foobar.com/19.jpg" }
```

Dependencies:

```js
var comp       = require('comp'),
    getJSON    = require('get-json'),
    joinParams = require('join-params')
    map        = require('map'),
    partial    = require('new-partial');
```

Implementation:

```js
var getUserIds    = partial(getJSON, '/users.json'),

    getUser       = joinParams(getJSON, '/users/{0}.json'),
    getUsers      = partial(map, getUser),
    
    getAllUsers   = comp(getUserIds, getUsers),
    
    getPost       = joinParams(getJSON, '/posts/{0}.json'),
    getPosts      = partial(map, getPost),
    
    getPhoto      = joinParams(getJSON, '/photos/{0}.json'),
    getPhotos     = partial(map, getPhoto);
```

Usage:

```js
getUser(3, function(error, user){
    
    user.name, user.age
    // => smith, 21

})
```

```js
getAllUsers(function(error, users){
    
    users.length
    // => 5
    
    users[1].name, uses[1].age
    // => smith, 21
    
})
```
