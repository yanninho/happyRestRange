var express = require('express')
  , request = require('supertest')
  , extractRange = require('../extractRange');

var app = express();

app.use(function(req, res, next){
	req.happyRest.range = {offset:10, limit:20};
	req.count = 10;
	req.maxResult = 20;
	req.resourceName = "test";
	next();
});

app.use(extractRange.setHeader);

app.use(function(req, res, next){
  res.end(JSON.stringify(req.happyRest.range));
});

describe('extractRange()', function(){
    it('should extract req.query.range', function(done){
    	request(app)
    	.get('/test')
	    .expect('Content-Range', '10-20/10')
	    .expect('Accept-Range', 'test 20');
	    done();
    })
 
})
