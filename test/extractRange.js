var express = require('express')
  , request = require('supertest')
  , extractRange = require('../extractRange');

var app = express();

app.use(extractRange(30));

app.use(function(req, res, next){
  res.end(JSON.stringify(req.happyRest.range));
});

describe('extractRange()', function(){
    it('should extract req.query.range', function(done){
      request(app)
      .get('/test?range=10-20')
      .expect('{"offset":"10","limit":"20"}', done);
    })
 
})
