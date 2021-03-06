## Declarative Async JavaScript

This repository explains how to benefit from
[tiny](http://npm.im/new-partial)
[functional](http://npm.im/join-params)
[programming](http://npm.im/comp)
[modules](http://npm.im/and-then) to
have your async JavaScript more declarative and readable.

## Index

* [Install & Run the Code Example](#install)
* [First Steps](#first-steps)
* [Fetching Data](#fetching-data)
* [Defining Async Values](#async-values)
* [Defining Async Lists](#async-lists)
* [Combining Values](#combining-values)
* [Final Value: allProfiles](#final-value)
* [See Also](#see-also)

<a name="install"> </a>
### Install & Run the Code Example

The code example I'll be explaining is available as
[example.js](https://github.com/azer/declarative-js/blob/master/example.js)
on this repository. You can run it as follows;

```bash
$ git clone https://github.com/azer/declarative-js.git
$ cd declarative-js
$ npm install
$ node example
```

<a name="first-steps"></a>
### First Steps

The goal of the example code here will be defining **one value** that gives us all the user profiles, like the below piece of code;

```js
allProfiles = andThen(userIds, profiles) // function composition of `userIds` and `profiles`
```

From an API with following end-points:

```
=> /users.json [3, 7, 19, 23, 27]
=> /users/7.json { id: 7, name: 'Smith', age: 21, posts: [3, 11, 12], photos: [19, 23, 39] }
=> /posts/11.json { id: 11, title: "Hello World", content: "lorem ipsum sit dolor amet" }
=> /photos/19.json { id: 19, path: "/photos/19.jpg" }
```

<a name="fetching-data"></a>
### Fetching Data

What do we need first; a function to query the JSON API?

```js
var getJSON = require('get-json');
```

At the first step, we need the full list of users, and will send a request to `/users.json`.
It's a simple one, we can simply do partial application on `getJSON`:

```js
var partial = require('new-partial');

var userIds = partial(getJSON, '/users.json');
```

The `userIds` above is a new function. Once you call it, it'll fetch `/users.json` for you;

```js
userIds(function(error, userIds){

        userIds
        // => [3, 7, 19, 23, 27]

})
```

But we won't need to call it actually. Only the definition of it is needed for us.

<a name="async-values"></a>
### Defining Async Values

The definition of an async value here is the partial application of any async function, just like the `userIds` we
defined above.

As the next step, we'll be defining `user` to get user data from the API. This will be a partial application, 
too, except that we need to format the first parameter this time;

```js
var joinParams = require('join-params');

var user = joinParams(getJSON, "/users/{0}.json")
```

[join-params](http://npm.im/join-params) is a fork of [new-partial](http://npm.im/new-partial)
that lets you join the parameters in a single, formatted parameter. See its docs for details.

<a name="async-lists"></a>
### Defining Async Lists

Defining a list of async value means creating a new partial application of
[map](http://github.com/azer/map.js) with the async value as first parameter.
This abstraction will let us fetch a group of users at once;

```js
var map = require('map');

var users = partial(map, user);
```

At this step, we have user ids and a collection that implements a group of users. All we need is to combine these two together, using
a function composition library, [comp](http://npm.im/comp):

```js
var comp = require('comp');

var allUsers = comp(userIds, users);

allUsers(function(error, allUsers){

        allUses[0].name, allUsers[2].age
        // => Smith, 23

})

```

Another example, partial application of `users` ?

```js
var adminIds = [3, 7, 9];
var admins = partial(users, adminIds);

admins(function(error, admins){

        admins[0].name, admins[1].age, admins[1].photos
        // => "Smith", 21, [7, 13, 37, 43]

})
```

Until this point, we're able to get all users with their data excluding posts and photos, since they require
separate API calls.

Let's define `posts` and `photos`, as well.

```js
var post   = joinParams(getJSON, "/posts/{0}.json"),
    posts  = partial(map, post),

    photo  = joinParams(getJSON, post),
    photos = partial(map, photo);
```

Now we can combine these together and define a value that has everything (posts, photos) about a `user`.

<a name="combining-values"></a>
### Combining Values Together

I'll call the new value `profile`. And we'll use a function composition library called [andthen](http://npm.im/andthen)
to combine `user`, `posts` and `photos` values:

```js
var andThen = require('andthen');

var profile = andThen(user, '.posts', posts, '.photos', photos);
```

andthen is a fork of `comp` that allows you to bind new values to properties of previous values.
The code above will fetch user and pass the `posts` property to `getPosts`, and replace the same property with what
`getPosts` returns. Same as `photos`.

Let's define the plural define of it.

```js
var profiles     = partial(map, profile);
var allProfiles  = comp(getUserIds, profiles);
```

<a name="final-value"></a>
### Final Value: `allProfiles`

Now we have everything we need. Let's show the output:

```js
allProfiles(function(error, profiles){

    if(error) throw error;

    profiles.forEach(function(profile){

            profile.name, profile.age
            // => Smith, 21

            profile.photos[0].path
            // =>  "http://photos.foobar.com/19.jpg"

            profile.posts[0].title
            // => Hello World

    })

})
```

That's all. Check out [the example code](#install) for more experience. Thanks for reading!

<a name="see-also"></a>
### See Also

* [By example: Continuation-passing style in JavaScript](http://matt.might.net/articles/by-example-continuation-passing-style/)
* [Functional Programming / Eloquent JavaScript](http://eloquentjavascript.net/chapter6.html)

![](http://distilleryimage6.s3.amazonaws.com/b501b1409c1811e2af1622000a1fb845_6.jpg)
