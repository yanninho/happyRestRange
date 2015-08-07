# happyRestRange
Express middleware which extract range from request

# Example : 

	request : /test?range=10-20
	result : req.happyRest.range =  {"offset":"10","limit":"20"}

# install

npm install happyrestrange

# How to use ?

like all others Express middleware : 

## Application-level : 

var express = require('express')
  , happyRestRange = require('happyRestRange');

var app = express();

app.use(extractRange());

app.use('/test?range=10-20', function (req, res, next) {
  console.log('Range:', req.happyRest.range);
  next();
});

## Application-level : 

var express = require('express')
  , happyRestRange = require('happyRestRange');

var router = express.Router();

router.get('/test?range=10-20', extractRange(), function (req, res, next) {
	  console.log('Range:', req.happyRest.range);
	  next();
	})
