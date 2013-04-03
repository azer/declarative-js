This repository demonstrates how do I benefit from tiny functional programming tools to 
have my code more declarative.

```
/users.json
    [3, 7, 19, 23, 27]
    
/users/{3, 7, 19, 23, 27}.json
    { name: 'Smith', age: 21, posts: [3, 11, 12], photos: [19, 23, 39] }
    
/posts/$id.json
    { title: "Hello World", content: "lorem ipsum sit dolor amet" }
    
/photos/$id.json
    { path: "http://photos.foobar.com/$id.jpg" }
```

```js
var comp       = require('comp'),
    getJSON    = require('get-json'),
    joinParams = require('join-params')
    map        = require('map'),
    partial    = require('new-partial');
```

```js
var getUserIds = partial(getJSON, '/users.json'),

    getUser    = joinParams(getJSON, '/users/{0}.json'),
    getUsers   = partial(map, getUser),
    
    getPost    = joinParams(getJSON, '/posts/{0}.json'),
    getPosts   = partial(map, getPost),
    
    getPhoto   = joinParams(getJSON, '/photos/{0}.json'),
    getPhotos  = partial(map, getPhoto);
```
