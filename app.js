var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

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
var math = require('math');

var exts = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif'
}
var searches;
var ingredients = ["eggs", "bacon"];
var ingredientString = "";

var app = express();


// view engine setup
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

/**
 * POST callback for the file upload form. This is where the magic happens.
 */
app.post('/upload', upload.single('file'), function (req, res, next) {

    // Generate a filename; just use the one generated for us, plus the appropriate extension
    var filename = req.file.filename + exts[req.file.mimetype]
    // and source and destination filepaths
        , src = __dirname + '/' + req.file.path
        , dst = __dirname + '/public/images/' + filename;

    /**
     * Go through the various steps
     */
    async.waterfall(
        [
            function (callback) {

                /**
                 * Check the mimetype to ensure the uploaded file is an image
                 */
                if (!_.contains(
                        [
                            'image/jpeg',
                            'image/png',
                            'image/gif'
                        ],
                        req.file.mimetype
                    )) {

                    return callback(new Error('Invalid file - please upload an image (.jpg, .png, .gif).'))

                }

                return callback();

            },
            function (callback) {

                /**
                 * Get some information about the uploaded file
                 */
                easyimg.info(src).then(
                    function (file) {

                        /**
                         * Check that the image is suitably large
                         */
                        if (( file.width < 960 ) || ( file.height < 300 )) {

                            return callback(new Error('Image must be at least 640 x 300 pixels'));

                        }

                        return callback();
                    }
                );
            },
            function (callback) {

                /**
                 * Resize the image to a sensible size
                 */
                easyimg.resize(
                    {
                        width: 960,
                        src: src,
                        dst: dst
                    }
                ).then(function (image) {

                    return callback();

                });

            },
            function (callback) {

                /**
                 * Use OpenCV to read the (resized) image
                 */
                cv.readImage(dst, callback);

            },
            function (im, callback) {

                /**
                 * Run the face detection algorithm
                 */
                im.detectObject(cv.FACE_CASCADE, {}, callback);

            }

        ],
        function (err, faces) {

            /**
             * If an error occurred somewhere along the way, render the
             * error page.
             */
            if (err) {

                return res.render(
                    'error',
                    {
                        message: err.message
                    }
                );
            }

            /**
             * We're all good; render the result page.
             */
            return res.render(
                'result',
                {
                    filename: filename,
                    faces: faces
                }
            );

        }
    );

});

app.post('/search', function (req, res, next) {
    unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?ingredients=" + ingredientString + "&limitLicense=false&number=5&ranking=1")
        .header("X-Mashape-Key", "NZwFn2gKm6mshqVHiXXfRc2AoJJap1I2xgHjsnikxAkrQRHJZR")
        .header("Accept", "application/json")
        .end(function (result) {
            searches = result.body[math.floor(math.random() * result.body.length)].title;
            console.log(searches);
        });

});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

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
