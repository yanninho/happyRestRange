'use strict';
/**
* Extract filters from request
* Example : /test?range=10-20 give req.happyRest.filters = {"offset" : "10", "limit" : "20" }
**/

module.exports = {
  extractRange: function(req, res, next) {
  	var maxResult = req.maxResult || 50;
    if (!req.happyRest) req.happyRest = {};
    if (req.happyRest.range) return next();

    req.happyRest.range = {};

    var range = req.query.range;  

	var rangeArray = undefined;
	if (!range) {
		rangeArray = [0,maxResult];
	}
	else {		
		rangeArray = range.split('-');
	}

	if (rangeArray[1] > maxResult) {
		throw new Error('Requested range not allowed');		
	}
	req.happyRest.range = {
		offset : rangeArray[0],
		limit : rangeArray[1],
	}

    next();
  },
  
  setHeader: function(req, res, next) {
  	if (!req.happyRest) return res.status(500).send({reason : 'Server middleware are not well configured'});

  	if (req.resourceName && req.maxResult) {
  		res.setHeader('Accept-Range', req.resourceName + ' ' + req.maxResult);  	
  	}

  	if (req.happyRest.range && req.count) {
  		res.setHeader('Content-Range', req.happyRest.range.offset + '-' + req.happyRest.range.limit + '/'+ req.count );
  	}
  	
  	var status = 200;
	if (req.result.length < req.count) {
		status = 206;
	}
	return res.status(status).json(req.result);	 
  }
};
