var andThen      = require('andthen'),
    getJSON      = require('get-json'),
    joinParams   = require('join-params')
    map          = require('map'),
    partial      = require('new-partial');


var userIds      = partial(getJSON, '/users.json'),

    user         = joinParams(getJSON, '/users/{0}.json'),
    users        = partial(map, getUser),
    
    allUsers     = andThen(getUserIds, getUsers),
    
    post         = joinParams(getJSON, '/posts/{0}.json'),
    posts        = partial(map, getPost),
    
    photo        = joinParams(getJSON, '/photos/{0}.json'),
    photos       = partial(map, getPhoto);
    
    profile      = andThen(getUser, 'posts', getPosts, 'photos', getPhotos),
    profiles     = partial(map, getProfile),
    allProfiles  = andThen(getUserIds, getProfiles);


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
