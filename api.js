var api   = { "/users.json": [3, 7, 19, 23, 27] },
    names = ['Adam Smith ', 'Kostas Pavlidis', 'Nazim Hikmet', 'Jean-Jacques Rousseau', 'Wang Mang'];

module.exports = getJSON;
module.exports.api = api;

api["/users.json"].forEach(function(id, ind){

  api["/users/" + id + ".json"] = {
    id     : id,
    name   : names[ind],
    age    : Math.floor(Math.random() * 100) + ind,
    posts  : saveAs('posts', ['title', 'content'], [10, 20, 30].map(rnd)),
    photos : saveAs('photos', ['path'], [10, 20, 30].map(rnd))
  };

});

function getJSON(uri, callback){
  callback(undefined, api[uri]);
}

function rnd(n){
  return Math.floor( Math.random() * n );
}

function saveAs(model, fields, content){

  content.forEach(function(id){

    api['/' + model + '/' + id + '.json'] = {
      id: id
    };

    fields.forEach(function(field){
      api['/' + model + '/' + id + '.json'][field] = field + ' #' + id;
    });

  });

  return content;

}
