var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var http = require('http');
var async = require('async');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var exphbs = require('express-handlebars');
var easyimg = require('easyimage');
var _ = require('lodash');
var cv = require('opencv');
var unirest = require('unirest');
var routes = require('./routes/index');
var food = require('./routes/food');
var eat = require('./routes/eat');
var math = require('math');
var Quagga = require('quagga').default;
var exts = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif'
}
var searches;
var ingredients = ["tomato", "pasta"];
var ingredientString = "";
var id = "";

var app = express();
for (var i = 0; i < ingredients.length - 1; i++) {
    ingredientString += ingredients[i] + "%2C";
}
ingredientString += ingredients[ingredients.length - 1];


// view engine setup
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', 'hbs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.post('/food', function (req, res, next) {
    //console.log("got here1");
    next();
}, food);
app.post('/eat', function (req, res, next) {
    //console.log("got here1");
    next();
}, eat);
app.use('/food', function (req, res, next) {
    //console.log("got here2");
    next();
}, food);

/**
 * POST callback for the file upload form. This is where the magic happens.
 */
app.post('/upload', upload.single('file'), function (req, res, next) {
    //console.dir(req.file);
    //console.log(req.file.path);
    // Generate a filename; just use the one generated for us, plus the appropriate extension
    var filename = req.file.filename + exts[req.file.mimetype]
    // and source and destination filepaths
        , src = __dirname + '/' + req.file.path
        , dst = __dirname + '/uploads/' + filename;
    fs.renameSync(src, src + ".jpg");
    src += '.jpg';
    console.log(src);
    Quagga.decodeSingle({
        src: src,
        locate: true,
        numOfWorkers: 0,  // Needs to be 0 when used within node
        inputStream: {
            size: 800  // restrict input-size to be 800px in width (long-side)
        },
        decoder: {
            drawBoundingBox: true,
            showFrequency: false,
            drawScanline: true,
            showPattern: false,
            readers: [
                'code_128_reader',
                'ean_reader',
                'ean_8_reader',
                'code_39_reader',
                'code_39_vin_reader',
                'codabar_reader'
            ],
            multiple: true
        }
        ,
    }, function (result) {
        if (result.codeResult) {
            console.log("result", result.codeResult.code);
        } else {
            console.log("not detected");
        }
    });

    for (var i = 0; i < ingredients.length - 1; i++) {
        ingredientString += ingredients[i] + "%2C";
    }
    ingredientString += ingredients[ingredients.length - 1];
});

app.post('/search', function (req, res, next) {
    unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?ingredients=" + ingredientString + "&limitLicense=false&number=5&ranking=1")
        .header("X-Mashape-Key", "NZwFn2gKm6mshqVHiXXfRc2AoJJap1I2xgHjsnikxAkrQRHJZR")
        .header("Accept", "application/json")
        .end(function (result) {

            var temp = math.floor(math.random() * result.body.length);
            searches = result.body[temp].title;
            id = result.body[temp].id;
            // print title
            console.log("Recipe Title:" + searches);
            console.log("\n");
        });
    unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/" + id + "/summary")
        .header("X-Mashape-Key", "NZwFn2gKm6mshqVHiXXfRc2AoJJap1I2xgHjsnikxAkrQRHJZR")
        .end(function (result) {
            console.log(result.body.summary);
            console.log("\n");
        });
}, eat);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function (err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
