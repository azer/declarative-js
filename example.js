var andThen      = require('andthen'),
    joinParams   = require('join-params'),
    map          = require('map'),
    partial      = require('new-partial'),

    getJSON      = require('./api');

var userIds      = partial(getJSON, '/users.json'),

    user         = joinParams(getJSON, '/users/{0}.json'),
    users        = partial(map, user),

    allUsers     = andThen(userIds, users),

    post         = joinParams(getJSON, '/posts/{0}.json'),
    posts        = partial(map, post),

    photo        = joinParams(getJSON, '/photos/{0}.json'),
    photos       = partial(map, photo),

    profile      = andThen(user, 'posts', posts, 'photos', photos),
    profiles     = partial(map, profile),
    allProfiles  = andThen(userIds, profiles);

allProfiles(printProfiles);

function printProfiles(error, profiles){

  profiles.forEach(function(profile){
      
    profile.name
    
    profile.posts
    
    profile.photos

  });

}
