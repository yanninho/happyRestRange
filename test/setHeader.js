var express = require('express'), 
	request = require('supertest'),
	should = require('chai').should(),
    extractRange = require('../extractRange');

var app = express();

app.use(function(req, res, next){
	req.happyRest = {};
	req.happyRest.range = {offset:48, limit:55};
	req.count = 975;
	req.maxResult = 10;
	req.resourceName = "test";
	next();
});

app.use(extractRange.setHeader);

app.use(function(req, res, next){
  res.end(JSON.stringify(req.happyRest.range));
});

describe('setHeader()', function(){
    it('should put headers on response', function(done){
    	request(app)
    	.get('/test')
	    .end(function(err, res) {
	    	should.exist(res.headers['content-range']);
	    	should.exist(res.headers['accept-range']);
	    	should.exist(res.headers['link']);
	    	res.headers['content-range'].should.equal('48-55/975');
	    	res.headers['accept-range'].should.equal('test 10');
	    	res.headers['link'].should.equal('0-7;rel=first,40-47;rel=prev,56-63;rel=next,968-975;rel=last');
	    	done();
	    });
    });
});