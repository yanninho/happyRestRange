'use strict';
/**
* Extract filters from request
* Example : /test?range=10-20 give req.happyRest.filters = {"offset" : "10", "limit" : "20" }
**/
var txtErrorConf = 'Server middleware are not well configured';

var addAcceptRange = function(req, res) {
    if (!req.happyRest) res.status(500).send({reason : txtErrorConf});
    if (req.resourceName && req.maxResult) {
      res.setHeader('Accept-Range', req.resourceName + ' ' + req.maxResult);    
    }        
}

var addContentRange = function(req, res) {
  if (!req.happyRest) res.status(500).send({reason : txtErrorConf});
  if (req.happyRest.range && req.count) {
    res.setHeader('Content-Range', req.happyRest.range.offset + '-' + req.happyRest.range.limit + '/'+ req.count );
  }      
}

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
    addAcceptRange(req, res);
    res.status(400).send({reason : 'Requested range not allowed'});
  }
  req.happyRest.range = {
    offset : rangeArray[0],
    limit : rangeArray[1],
  }

    next();
  },
  
  setHeader: function(req, res, next) {        
    addAcceptRange(req, res);
    addContentRange(req, res);
    next();    
  },

  addAcceptRange: function(req, res, next) {
    addAcceptRange(req, res);
    next();
  },

  addContentRange: function(req, res, next) {
    addContentRange(req, res);
    next();
  }
};
