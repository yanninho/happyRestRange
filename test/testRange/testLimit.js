var express = require('express'), 
	request = require('supertest'),
	should = require('chai').should(),
    extractRange = require('../../extractRange');

var app = express();

app.use(function(req, res, next){
	req.happyRest = {};
	req.happyRest.range = {offset:5, limit:9};
	req.count = 10;
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
	    	res.headers['content-range'].should.equal('5-9/10');
	    	res.headers['accept-range'].should.equal('test 10');
	    	res.headers['link'].should.equal('0-4;rel=first,0-4;rel=prev,undefined,5-9;rel=last');
	    	done();
	    });
    });
});