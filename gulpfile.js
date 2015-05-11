var gulp = require('gulp'),
    connect = require('gulp-connect'),
    opn = require('opn'),
    less = require('gulp-less'),
    clean = require('gulp-clean'),
    wiredep = require('wiredep').stream,
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    sftp = require('gulp-sftp');

require('./ftp-auth.js');


//launching local server
gulp.task('connect', function() {
    connect.server({
        root: __dirname,
        livereload: true,
        port: 8889
    });
    opn('http://localhost:8889/app/');
});

gulp.task('html', function () {
    gulp.src('./app/*.html')
        .pipe(connect.reload());
});

gulp.task('css', function () {
    gulp.src('./app/css/*.css')
        .pipe(connect.reload());
});

gulp.task('js', function () {
    gulp.src('./app/js/*.js')
        .pipe(connect.reload());
});

gulp.task('less', function () {
    return gulp.src('./app/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('./app/css/'));
});

gulp.task('bower', function () {
    gulp.src('./app/index.html')
        .pipe(wiredep({
            directory: 'app/bower'
        }))
        .pipe(gulp.dest('./app'));
});

//tracking changes
gulp.task('watch', function () {
    gulp.watch(['./app/*.html'], ['html']);
    gulp.watch(['./app/css/*.css'], ['css']);
    gulp.watch(['./app/js/*.js'], ['js']);

    gulp.watch(['./app/less/*.less'], ['less']);
    gulp.watch(['bower.json'], ['bower']);
});

gulp.task('default', ['connect', 'watch']);



gulp.task('clean-dist', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});


gulp.task('build', ['clean-dist'], function () {
    var assets = useref.assets();

    return gulp.src('app/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

//building dist
gulp.task('make-dist', ['build'], function () {

    return gulp.src(['app/images/**/*'])
        .pipe(gulp.dest('dist/images'));
});


gulp.task('deploy-dist', function () {
    return gulp.src('dist/**/*')
        .pipe(sftp({
            host: ftp.host,
            user: ftp.user,
            pass: ftp.pass,
            port: ftp.port,
            remotePath: ftp.remotePath
        }));
});