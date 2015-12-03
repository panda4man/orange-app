var gulp = require('gulp'),
    sass = require('gulp-sass'),
    bower = require('gulp-bower'),
    gulpFilter = require('gulp-filter'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    plumber = require('gulp-plumber'),
    rm = require('gulp-rm'),
    watch = require('gulp-watch'),
    notify = require('gulp-notify'),
    connect = require('gulp-connect'),
    templateCache = require('gulp-angular-templatecache'),
    minifyHtml = require('gulp-minify-html'),
    addStream = require('add-stream'),
    spawn = require('child_process').spawn,
    node;

var config = {
    css: {
        sassPath: './public/scss/styles/',
        sassImportPath: './public/scss/imports/',
        sassOverridesPath: './public/scss/overrides/',
        destCss: './public/css',
        materialPath: './bower_components/Materialize/sass/',
        fontawesomePath: './bower_components/font-awesome/scss/'
    },
    js: {
        jqueryPath: './bower_components/jquery/dist/',
        materialPath: './bower_components/Materialize/dist/js/',
        socketIOPath: './node_modules/socket.io/node_modules/socket.io-client/',
        src: './public/src/',
        angular: {
            files: ['./bower_components/angular/angular.min.js', './bower_components/angular-ui-router/release/angular-ui-router.min.js', './bower_components/satellizer/satellizer.min.js', './bower_components/angular-http-auth/src/http-auth-interceptor.js', './bower_components/angular-socket-io/socket.min.js'],
            dist: './public/dist/js/all-angular.min.js'
        }
    },
    html: {
        src: './public/templates/**/*.html',
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'orange.templates',
                root: '/cache/',
                standalone: true
            },
            location: './.tmp'
        },
        minify: {
            conditionals: true,
            spare: true,
            empty: true
        }
    }
};

//On Error handler
var onError = function(err) {
    console.log(err);
};

//Install bower components
gulp.task('bower', function() {
    return bower().pipe(gulp.dest('./bower_components'));
});

//Move Font Awesome Icons to public dir
gulp.task('icons-fa', function() { 
    return gulp.src('./bower_components/font-awesome/fonts/**.*') 
        .pipe(gulp.dest('./public/fonts')); 
});

//Move Material Icons to public dir
gulp.task('icons-ma', function() { 
    return gulp.src('./bower_components/Materialize/font/**/**.*') 
        .pipe(gulp.dest('./public/font')); 
});

gulp.task('templateCache', function() {
    return gulp.src(config.html.src)
        .pipe(minifyHtml(config.html.minify))
        .pipe(templateCache(
            config.html.templateCache.file,
            config.html.templateCache.options
        ))
        .pipe(gulp.dest('./.tmp'))
        .pipe(connect.reload());
});

//Clean the dist directory
gulp.task('clean:dist', function() {
    return gulp.src('public/dist/**/*', {
            read: false
        })
        .pipe(rm())
});

gulp.task('css-dev', function() {
    var filter = gulpFilter(['*', '!' + config.css.materialPath], {
        restore: true
    });
    return gulp.src([config.css.sassPath + '*.scss', config.css.sassOverridesPath + '*.scss']) 
        .pipe(plumber())
        .pipe(filter)
        .pipe(sass({ 
                style: 'compressed',
                includePaths: [ config.css.sassImportPath, config.css.materialPath, config.css.fontawesomePath]
            }) 
            .on("error", notify.onError(function(error) { 
                return "Error: " + error.message; 
            })))  
        .pipe(filter.restore)
        .pipe(concat('styles.css'))
        .pipe(gulp.dest(config.css.destCss))
        .pipe(connect.reload());
});

gulp.task('css-prod', function() {
    var filter = gulpFilter(['*', '!' + config.css.materialPath], {
        restore: true
    });
    return gulp.src([config.css.sassPath + '*.scss', config.css.sassOverridesPath + '*.scss']) 
        .pipe(plumber())
        .pipe(filter)
        .pipe(sass({
            includePaths:  [ config.css.sassImportPath, config.css.materialPath, config.css.fontawesomePath]
        }).on('error', sass.logError))
        .pipe(minifyCss({
            processImport: false,
            benchmark: false,
            keepSpecialComments: 0
        }))
        .pipe(filter.restore)
        .pipe(concat('styles.min.css'))
        .pipe(gulp.dest(config.css.destCss))
        .pipe(connect.reload());
});

//Compile all angular sources to be used in the js compilation tasks
gulp.task('angular', function() {
    return gulp.src(config.js.angular.files)
        .pipe(plumber())
        .pipe(concat('all-angular.min.js'))
        .pipe(gulp.dest('./public/dist/js'));
});

gulp.task('js-dev', ['clean:dist', 'angular', 'templateCache'], function() {
    return gulp.src([config.js.jqueryPath + 'jquery.min.js', config.js.socketIOPath + 'socket.io.js', config.js.materialPath + 'materialize.min.js', config.js.angular.dist, './public/src/**/*.js', './.tmp/templates.js'])
        .pipe(plumber())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./public/js/'))
        .pipe(connect.reload());
});

gulp.task('js-prod', ['clean:dist', 'angular', 'templateCache'], function() {
    return gulp.src([config.js.jqueryPath + 'jquery.min.js', config.js.socketIOPath + 'socket.io.js', config.js.materialPath + 'materialize.min.js', config.js.angular.dist, './public/src/**/*.js', './.tmp/templates.js'])
        .pipe(plumber())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest('./public/js/'))
        .pipe(connect.reload());
});

//Server with livereload
gulp.task('server', function() {
    /*
    connect.server({
        root: [__dirname],
        port: 8081,
        livereload: true
    });*/
    if (node) node.kill()
    node = spawn('node', ['app.js'], {
        stdio: 'inherit'
    })
    node.on('close', function(code) {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
});

//Watch all sources to recompile
gulp.task('watch', ['server', 'templateCache'], function() { 
    //Sass that we write in /styles dir
    var css_paths = [config.css.sassPath + '*.scss'].concat([config.css.sassImportsPath + '*.scss']);
    css_paths = css_paths.concat([config.css.sassOverridesPath + '*.scss']);

    gulp.watch(css_paths, {
        interval: 500
    }, ['css-dev', 'css-prod'], function() {
        gulp.run('server');
    }); 

    //Recompile all js for dev
    gulp.watch(config.js.src + '**/*.js', {
        interval: 500
    }, ['js-dev'], function() {
        gulp.run('server');
    });

    //Reload server on template change
    gulp.watch(config.html.src, {
        interval: 500
    }, ['js-dev'], function() {
        gulp.run('server');
    });
});

gulp.task('default', ['server', 'bower', 'icons-fa', 'icons-ma', 'css-dev', 'css-prod', 'js-dev', 'js-prod', 'watch', 'templateCache']);
