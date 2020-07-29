var gulp = require('gulp')
  , gutil = require('gulp-util')
  , changed = require('gulp-changed')
  , ngAnnotate = require('gulp-ng-annotate')
  , browserSync = require('browser-sync')
  , sftp = require('gulp-sftp')
  , stylus = require('gulp-stylus')
  , uglify = require('gulp-uglify')
  , pug = require('gulp-pug')
  , rename = require('gulp-rename')
  , jeet = require('jeet')
  , imageResize = require('gulp-image-resize')
  , isDev = true
  , ftpConf = {
    host: '46.137.127.114'
    , user: 'ubuntu'
    , remotePath: '/var/www/headphoneking'
    , key: '~/.ssh/decode.pem'
  }

  if(gutil.env.prod === true) {
    isDev = false,
    ftpConf = {
      host: ''
      , user: ''
      , pass: ''
      , remotePath: '/var/www'
    }
  }

var reload = browserSync.reload;

gulp.task( 'favicon', function() {
  var src = './app/src/favicon/*'
    , dest = './app/build/'
  return gulp.src( src )
  .pipe( gulp.dest( dest ) )
  .pipe( reload( { stream:true } ) )
} )

gulp.task( 'video', function() {
  var src = './app/src/videos/*'
    , dest = './app/build/videos'
  return gulp.src( src )
  .pipe( gulp.dest( dest ) )
  .pipe( reload( { stream:true } ) )
} )

gulp.task( 'svg', function() {
  var src = './app/src/svg/*'
    , dest = './app/build/images/svg'
  return gulp.src( src )
  .pipe( gulp.dest(dest) )
  .pipe( reload({stream:true}) )
} )

gulp.task('images', function() {
  var src = './app/src/images/*'
    , dest = './app/build/images/display';
  return gulp.src(src)
  .pipe(imageResize({
    width:960
  }))
  .pipe( rename( function( path ) {
    path.basename = path.basename.replace( ' ', '_' );
  }))
  .pipe(gulp.dest(dest))
  .pipe(reload({stream:true}));
});

gulp.task('thumbs', function() {
  var src = './app/src/images/*'
  , dest = './app/build/images/thumbs/';
  return gulp.src(src)
  .pipe(imageResize({
    width:200
  }))
  .pipe( rename( function( path ) {
    path.basename = path.basename.replace( ' ', '_' );
  }))
  .pipe(gulp.dest(dest))
  .pipe(reload({stream:true}));
});

gulp.task('stylus', function() {
  var src = './app/src/stylus/*.styl'
  , dest = './app/build/stylesheets/';
  return gulp.src( src )
  .pipe(isDev === false ? stylus({ 
    compress: true,
    use: jeet }) : stylus())
  .pipe(gulp.dest( dest ))
  .pipe(reload({stream:true}));
});

gulp.task('css', function() {
  var src= './app/src/stylus/*.css'
    , dest = './app/build/stylesheets/';
  return gulp.src( src )
  .pipe( gulp.dest( dest ) )
  .pipe(reload({stream:true}));
});

gulp.task('javascript', function() {
  var src = './app/src/scripts/*.js'
  , dest = './app/build/js/';
  return gulp.src( src )
  //.pipe(isDev === false ? uglify() : gutil.noop())
  .pipe(gulp.dest( dest ))
  .pipe(changed(dest))
  .pipe(ngAnnotate()) 
  .pipe(gulp.dest( dest ))
  .pipe(reload({stream:true}));
});

gulp.task('templates', function() {
  var YOUR_LOCALS = {};
  return gulp.src('./app/src/pug/*.pug')
  .pipe(pug({ locals: YOUR_LOCALS }))
  .pipe(gulp.dest('./app/build/'))
  .pipe(reload({stream:true}));
});

gulp.task('pug-watch', ['templates'], reload);

gulp.task('default', ['favicon', 'video', 'svg', 'images', 'thumbs', 'stylus', 'css', 'templates', 'javascript'], function() {
  browserSync({
    server: './app/build/'
  })

  gulp.watch('./app/src/favicon/*', ['favicon']); 
  gulp.watch('./app/src/videos/*', ['video']); 
  gulp.watch('./app/src/svg/*', ['svg']); 
  gulp.watch('./app/src/images/*', ['images','thumbs']); 
  gulp.watch('./app/src/stylus/*.styl', ['stylus']); 
  gulp.watch('./app/src/pug/**/*.pug', ['pug-watch']); 
  gulp.watch('./app/src/scripts/*.js', ['javascript']);
});

// use gulp deploy --prod 
// for production 
gulp.task('deploy', ['stylus', 'javascript'], function() {
  return gulp.src('./app/build/**/*')
    .pipe(sftp( ftpConf ));
});
