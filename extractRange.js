'use strict';
/**
* Extract filters from request
* Example : /test?range=10-20 give req.happyRest.filters = {"offset" : "10", "limit" : "20" }
**/

module.exports = function(maxResult) {
  return function extractRange(req, res, next) {
  	if (!maxResult) maxResult = 50;
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
  };
};
