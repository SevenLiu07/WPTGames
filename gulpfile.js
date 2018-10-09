/*
 执行步骤：
 *
 * 1.先删除 static 目录下所有文件；
 * 2.执行 gulp min;
 *
 *
 * */

var gulp   = require('gulp');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var del = require('del');
var replace = require('gulp-replace');
var runSequence = require('gulp-run-sequence');
var uglify = require('gulp-uglify');
var  minifycss = require('gulp-minify-css');
var  concat = require('gulp-concat');
var assetRev = require('gulp-asset-rev');
var eslint = require('gulp-eslint');
var smushit = require('gulp-smushit');

//var preprocess = require('gulp-preprocess');

var baseLobby = "lobby";

/*清空文件夹*/
gulp.task('cleanStatic', function (cb) {
    return  del([
        'dist/wpt/**/*',
        'dist/*.html',
        'dist/**/*'
    ], cb)
});

/*清空文件夹*/
gulp.task('clean:min', function (cb) {
    return  del([
        'dist/wpt/module/**/js/*',
        'dist/wpt/module/**/css/*',
        '!dist/wpt/module/'+baseLobby+'/js/*',
        '!dist/wpt/module/lobby/css/*',
        '!dist/wpt/module/facebook/js/*',
        '!dist/wpt/module/facebook/css/*',
        '!dist/wpt/module/index/js/*',
        '!dist/wpt/module/index/css/*'
    ], cb)
});



/*压缩css 生成md5文件*/
gulp.task('cssMinInventory', function () {
    return    gulp.src('wpt/www/module/inventory/css/*.css')
        .pipe(minifycss())
        .pipe(rev())
        .pipe(gulp.dest('dist/wpt/module/inventory/css'))
        .pipe( rev.manifest() ) //MD5  生成manifest文件
        .pipe( gulp.dest( 'rev/css' ) );
});


/*压缩js 生成md5文件*/
gulp.task('scriptsMinInventory', function () {
    return   gulp.src('wpt/www/module/inventory/js/*.js')
        .pipe(uglify())    //压缩
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/module/inventory/js'))
        .pipe( rev.manifest() )  //生成manifest文件
        .pipe( gulp.dest( 'rev/js' ) );
});


gulp.task('cssMinStore', function () {
    return    gulp.src('wpt/www/module/store/css/*.css')
        .pipe(minifycss())
        .pipe(rev())
        .pipe(gulp.dest('dist/wpt/module/store/css'))
        .pipe( rev.manifest() ) //MD5  生成manifest文件
        .pipe( gulp.dest( 'rev/css' ) );
});


/*压缩js 生成md5文件*/
gulp.task('scriptsMinStore', function () {
    return   gulp.src('wpt/www/module/store/js/*.js')
        .pipe(uglify())    //压缩
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/module/store/js'))
        .pipe( rev.manifest() )  //生成manifest文件
        .pipe( gulp.dest( 'rev/js' ) );
});


gulp.task('cssMinAccount', function () {
    return    gulp.src('wpt/www/module/account/css/*.css')
        .pipe(minifycss())
        .pipe(rev())
        .pipe(gulp.dest('dist/wpt/module/account/css'))
        .pipe( rev.manifest() ) //MD5  生成manifest文件
        .pipe( gulp.dest( 'rev/css' ) );
});


/*压缩js 生成md5文件*/
gulp.task('scriptsMinAccount', function () {
    return   gulp.src('wpt/www/module/account/js/*.js')
        .pipe(uglify())    //压缩
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/module/account/js'))
        .pipe( rev.manifest() )  //生成manifest文件
        .pipe( gulp.dest( 'rev/js' ) );
});

gulp.task('cssMinPayment', function () {
    return    gulp.src('wpt/www/module/pay/css/*.css')
        .pipe(minifycss())
        .pipe(rev())
        .pipe(gulp.dest('dist/wpt/module/pay/css'))
        .pipe( rev.manifest() ) //MD5  生成manifest文件
        .pipe( gulp.dest( 'rev/css' ) );
});




/*压缩js 生成md5文件*/
gulp.task('scriptsMinPayment', function () {
    return   gulp.src('wpt/www/module/pay/js/*.js')
        .pipe(uglify())    //压缩
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/module/pay/js'))
        .pipe( rev.manifest() )  //生成manifest文件
        .pipe( gulp.dest( 'rev/js' ) );
});



/*压缩js 生成md5文件*/
gulp.task('scriptsMinPromotion', function () {
    return   gulp.src('wpt/www/module/promotion/js/*.js')
        .pipe(uglify())    //压缩
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/module/promotion/js'))
        .pipe( rev.manifest() )  //生成manifest文件
        .pipe( gulp.dest( 'rev/js' ) );
});

gulp.task('cssMinPromotion', function () {
    return    gulp.src('wpt/www/module/promotion/css/*.css')
        .pipe(minifycss())
        .pipe(rev())
        .pipe(gulp.dest('dist/wpt/module/promotion/css'))
        .pipe( rev.manifest() ) //MD5  生成manifest文件
        .pipe( gulp.dest( 'rev/css' ) );
});


/*压缩js 生成md5文件*/
gulp.task('scriptsMinPersonal', function () {
    return   gulp.src('wpt/www/module/person/js/*.js')
        .pipe(uglify())    //压缩
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/module/person/js'))
        .pipe( rev.manifest() )  //生成manifest文件
        .pipe( gulp.dest( 'rev/js' ) );
});

gulp.task('cssMinPersonal', function () {
    return    gulp.src('wpt/www/module/person/css/*.css')
        .pipe(minifycss())
        .pipe(rev())
        .pipe(gulp.dest('dist/wpt/module/person/css'))
        .pipe( rev.manifest() ) //MD5  生成manifest文件
        .pipe( gulp.dest( 'rev/css' ) );
});


/*压缩js 生成md5文件*/
gulp.task('scriptsMinLeaderboard', function () {
    return   gulp.src('wpt/www/module/leaderboard/js/*.js')
        .pipe(uglify())    //压缩
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/module/leaderboard/js'))
        .pipe( rev.manifest() )  //生成manifest文件
        .pipe( gulp.dest( 'rev/js' ) );
});

gulp.task('cssMinLeaderboard', function () {
    return    gulp.src('wpt/www/module/leaderboard/css/*.css')
        .pipe(minifycss())
        .pipe(rev())
        .pipe(gulp.dest('dist/wpt/module/leaderboard/css'))
        .pipe( rev.manifest() ) //MD5  生成manifest文件
        .pipe( gulp.dest( 'rev/css' ) );
});


/*压缩js 生成md5文件*/
gulp.task('scriptsMinGamehall', function () {
    return   gulp.src('wpt/www/module/'+baseLobby+'/js/gamehall.js')
        .pipe(uglify())    //压缩
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/module/'+baseLobby+'/js'))
        .pipe( rev.manifest() )  //生成manifest文件
    .pipe( gulp.dest( 'rev/js' ) );
});


/*压缩js 生成md5文件*/
gulp.task('scriptsMinCommon', function () {
    return   gulp.src('wpt/www/common/js/common.js')
        .pipe(uglify())    //压缩
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/common/js/'))
        .pipe( rev.manifest() )  //生成manifest文件
        .pipe( gulp.dest( 'rev/js' ) );
});

/*压缩js 生成md5文件*/
gulp.task('scriptsMinCommon-dufu', function () {
    return   gulp.src('wpt/www/common/js/common-dufu.js')
        .pipe(uglify())    //压缩
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/common/js/'))
        .pipe( rev.manifest() )  //生成manifest文件
        .pipe( gulp.dest( 'rev/js' ) );
});

/*复制静态资源到dist/wpt 目录*/
gulp.task('copy1',  function() {
    return gulp.src([
        'wpt/www/**/**/css/*.css',
        'wpt/www/**/**/js/*.js',
        'wpt/www/common/js/**/*.js',
        'wpt/www/common/widget/*.js',
        'wpt/www/common/widget/**/*.js',
        'wpt/www/model/video.json',
        'wpt/www/**/**/images/*.png',
        'wpt/www/**/**/images/*.gif',
        'wpt/www/**/**/images/*.jpg',
        'wpt/www/**/**/*.html',
        '!wpt/www/module/facebook/horserace/**',
        '!wpt/www/module/poker/**',
        '!wpt/www/module/poker/*'
    ],{base: './wpt/www'})
        .pipe(gulp.dest('dist/wpt'))
});

/*复制根目录下所有文件*/
gulp.task('copy2',  function() {
    return gulp.src([
        'js/*.js',
        'css/*.css',
        'image/*',
        'scripts/*.js',
        'facebook/**/**',
        'm/**/**',
        'error.html',
        'closewindow.html',
        'faq.html',
        'favicon.ico',
        'forget_password_mobile.html',
        'game.html',
        'game-flash.html',
        'game_slot.html',
        'leaderBoard_history.html',
        'login.html',
        'mobile-compatible.html',
        'mobile_android.html',
        'mobile_ios.html',
        'password.html',
        'redirectFacebookLoginEntrance.htm',
        'regist.html',
        'rewards_faq.html',
        'terms.html',
        'validate_email_mobile.html'
    ],{base: './'})
        .pipe(gulp.dest('dist'))
});

gulp.task('copy3',  function() {
    return gulp.src([
        'wpt/www/module/poker/**'
    ]) .pipe(gulp.dest('dist/poker'))
});

gulp.task('copy4',  function() {
    return gulp.src([
        '404.html'
    ]) .pipe(gulp.dest('dist/error_pages'))
});

/*压缩根目录下js */
gulp.task('rootJsMin1', function () {
    return   gulp.src('dist/js/*.js')
        .pipe(uglify())    //压缩
        .pipe( gulp.dest( 'dist/js' ) );
});

/*压缩根目录下js */
gulp.task('rootJsMin2', function () {
    return   gulp.src('dist/scripts/*.js')
        .pipe(uglify())    //压缩
        .pipe( gulp.dest( 'dist/scripts' ) );
});

/*压缩根目录下css */
gulp.task('rootCssMin', function () {
    return   gulp.src('dist/css/*.css')
        .pipe(minifycss())    //压缩
        .pipe( gulp.dest( 'dist/css' ) );
});

/*压缩根目录下图片 */
gulp.task('rootImageMin', function () {
    return gulp.src('dist/image/*.{png,jpg,gif,ico}')
        .pipe(smushit({
            verbose: true
        }))
        .pipe(gulp.dest('dist/image'));
});



/*md5 解决方案*/
gulp.task('min1',["cssMinInventory","scriptsMinInventory"], function () {
    return     gulp.src(['rev/**/*.json',
            'dist/wpt/module/'+baseLobby+'/js/lobby.js'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                '../../module/inventory/js/':  '../../../wpt/module/inventory/js/'
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/'+baseLobby+'/js/') );
});
gulp.task('min2',["cssMinStore","scriptsMinStore"], function () {
    return   gulp.src(['rev/**/*.json',
            'dist/wpt/module/'+baseLobby+'/js/lobby.js'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                '../../module/store/js/':  '../../../wpt/module/store/js/'
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/'+baseLobby+'/js/') );
});
gulp.task('min3',["cssMinAccount","scriptsMinAccount"], function () {
    return  gulp.src(['rev/**/*.json',
            'dist/wpt/module/'+baseLobby+'/js/lobby.js'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                '../../module/account/js/':  '../../../wpt/module/account/js/'
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/'+baseLobby+'/js/') );
});
gulp.task('min4',["cssMinPayment","scriptsMinPayment"], function () {
    return   gulp.src(['rev/**/*.json',
            'dist/wpt/module/'+baseLobby+'/js/lobby.js'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                '../../module/pay/js/':  '../../../wpt/module/pay/js/'
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/'+baseLobby+'/js/') );
});
gulp.task('min5',["cssMinPromotion","scriptsMinPromotion"], function () {
    return  gulp.src(['rev/**/*.json',
            'dist/wpt/module/'+baseLobby+'/js/lobby.js'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                '../../module/promotion/js/':  '../../../wpt/module/promotion/js/'
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/'+baseLobby+'/js/') );
});
gulp.task('min6',["cssMinPersonal","scriptsMinPersonal"], function () {
    return  gulp.src(['rev/**/*.json',
            'dist/wpt/module/'+baseLobby+'/js/lobby.js'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                '../../module/person/js/':  '../../../wpt/module/person/js/'
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/'+baseLobby+'/js/') );
});
gulp.task('min7',["cssMinLeaderboard","scriptsMinLeaderboard"], function () {
    return  gulp.src(['rev/**/*.json',
            'dist/wpt/module/'+baseLobby+'/js/lobby.js'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                '../../module/leaderboard/js/':  '../../../wpt/module/leaderboard/js/'
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/'+baseLobby+'/js/') );
});
gulp.task('min8',["scriptsMinCommon"], function () {
    return  gulp.src(['rev/**/*.json',
            'dist/wpt/module/'+baseLobby+'/js/lobby.js'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                '../../common/js/':  '../../../wpt/common/js/'
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/'+baseLobby+'/js/') );
});

gulp.task('min8-dufu',["scriptsMinCommon-dufu"], function () {
    return  gulp.src(['rev/**/*.json',
            'dist/wpt/module/'+baseLobby+'/js/lobby.js'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                '../../common/js/':  '../../../wpt/common/js/'
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/'+baseLobby+'/js/') );
});

gulp.task('min9',["scriptsMinGamehall"], function () {
    return  gulp.src(['rev/**/*.json',
            'dist/wpt/module/'+baseLobby+'/js/lobby.js'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                '../../module/lobby/js/':  '../../../wpt/module/lobby/js/'
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/'+baseLobby+'/js/') );
});

gulp.task('min9-dufu',["scriptsMinGamehall"], function () {
    return  gulp.src(['rev/**/*.json',
            'dist/wpt/module/'+baseLobby+'/js/lobby.js'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                '../../module/lobby-dufu/js/':  '../../../wpt/module/lobby-dufu/js/'
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/'+baseLobby+'/js/') );
});

/*自动加版本号*/
gulp.task('revLoad1',function() {
    return  gulp.src([
            'dist/wpt/module/index/index.html',
            '!wpt/www/module/index/index_test.html'
        ])
        .pipe(assetRev())
        .pipe( gulp.dest('dist/wpt/module/index/') );
});




gulp.task('revLoadAll', function (cb) {
    runSequence(
        'revLoad1',
        'revLoad1',
        cb);
});






/************************************* model 加版本号 ***************************************************/


/*压缩js 生成md5文件*/
gulp.task('minModel-account', function () {
    return   gulp.src('wpt/www/model/account-model.js')
        .pipe(uglify())    //压缩
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/model'))
        .pipe( rev.manifest() )  //生成manifest文件
        .pipe( gulp.dest( 'rev/js' ) );
});

gulp.task('revModel-account',["minModel-account"], function () {
    return  gulp.src(['rev/**/*.json',
            'dist/wpt/module/account/js/*.js'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                '../../model/':  '../../model/'
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/account/js/') );
});

/*压缩js 生成md5文件*/
gulp.task('minModel-inventory', function () {
    return   gulp.src('wpt/www/model/inventory-model.js')
        .pipe(uglify())    //压缩
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/model'))
        .pipe( rev.manifest() )  //生成manifest文件
        .pipe( gulp.dest( 'rev/js' ) );
});

gulp.task('revModel-inventory',["minModel-inventory"], function () {
    return  gulp.src(['rev/**/*.json',
            'dist/wpt/module/inventory/js/*.js'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                '../../model/':  '../../model/'
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/inventory/js/') );
});


/*压缩js 生成md5文件*/
gulp.task('minModel-leaderboard', function () {
    return   gulp.src('wpt/www/model/leaderboard-model.js')
        .pipe(uglify())    //压缩
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/model'))
        .pipe( rev.manifest() )  //生成manifest文件
        .pipe( gulp.dest( 'rev/js' ) );
});

gulp.task('revModel-leaderboard',["minModel-leaderboard"], function () {
    return  gulp.src(['rev/**/*.json',
            'dist/wpt/module/leaderboard/js/*.js'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                '../../model/':  '../../model/'
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/leaderboard/js/') );
});


/*压缩js 生成md5文件*/
gulp.task('minModel-lobby', function () {
    return   gulp.src('wpt/www/model/lobby-model.js')
        .pipe(uglify())    //压缩
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/model'))
        .pipe( rev.manifest() )  //生成manifest文件
        .pipe( gulp.dest( 'rev/js' ) );
});

gulp.task('revModel-lobby',["minModel-lobby"], function () {
    return  gulp.src(['rev/**/*.json',
            'dist/wpt/module/'+baseLobby+'/js/*.js'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                '../../model/':  '../../model/'
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/'+baseLobby+'/js/') );
});

/*压缩js 生成md5文件*/
gulp.task('minModel-pay', function () {
    return   gulp.src('wpt/www/model/pay-model.js')
        .pipe(uglify())    //压缩
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/model'))
        .pipe( rev.manifest() )  //生成manifest文件
        .pipe( gulp.dest( 'rev/js' ) );
});

gulp.task('revModel-pay',["minModel-pay"], function () {
    return  gulp.src(['rev/**/*.json',
            'dist/wpt/module/pay/js/*.js'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                '../../model/':  '../../model/'
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/pay/js/') );
});


/*压缩js 生成md5文件*/
gulp.task('minModel-person', function () {
    return   gulp.src('wpt/www/model/personal-model.js')
        .pipe(uglify())    //压缩
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/model'))
        .pipe( rev.manifest() )  //生成manifest文件
        .pipe( gulp.dest( 'rev/js' ) );
});

gulp.task('revModel-person',["minModel-person"], function () {
    return  gulp.src(['rev/**/*.json',
            'dist/wpt/module/person/js/*.js'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                '../../model/':  '../../model/'
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/person/js/') );
});


/*压缩js 生成md5文件*/
gulp.task('minModel-promotion', function () {
    return   gulp.src('wpt/www/model/promotion-model.js')
        .pipe(uglify())    //压缩
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/model'))
        .pipe( rev.manifest() )  //生成manifest文件
        .pipe( gulp.dest( 'rev/js' ) );
});

gulp.task('revModel-promotion',["minModel-promotion"], function () {
    return  gulp.src(['rev/**/*.json',
            'dist/wpt/module/promotion/js/*.js'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                '../../model/':  '../../model/'
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/promotion/js/') );
});


/*压缩js 生成md5文件*/
gulp.task('minModel-store', function () {
    return   gulp.src('wpt/www/model/store-model.js')
        .pipe(uglify())    //压缩
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/model'))
        .pipe( rev.manifest() )  //生成manifest文件
        .pipe( gulp.dest( 'rev/js' ) );
});

gulp.task('revModel-store',["minModel-store"], function () {
    return  gulp.src(['rev/**/*.json',
            'dist/wpt/module/store/js/*.js'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                '../../model/':  '../../model/'
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/store/js/') );
});



/*压缩js 生成md5文件*/
gulp.task('minModel-horserace', function () {
    return   gulp.src('wpt/www/model/horserace-model.js')
        .pipe(uglify())    //压缩
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/model'))
        .pipe( rev.manifest() )  //生成manifest文件
        .pipe( gulp.dest( 'rev/js' ) );
});

gulp.task('revModel-horserace',["minModel-horserace"], function () {
    return  gulp.src(['rev/**/*.json',
            'dist/wpt/module/facebook/js/horserace.js'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                '../../model/':  '../../model/'
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/facebook/js/') );
});


/*压缩js 生成md5文件*/
gulp.task('minModel-vote', function () {
    return   gulp.src('wpt/www/model/vote-model.js')
        .pipe(uglify())    //压缩
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/model'))
        .pipe( rev.manifest() )  //生成manifest文件
        .pipe( gulp.dest( 'rev/js' ) );
});

gulp.task('revModel-vote',["minModel-vote"], function () {
    return  gulp.src(['rev/**/*.json',
            'dist/wpt/module/facebook/js/videoVote3.js'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                '../../model/':  '../../model/'
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/facebook/js/') );
});
/************************************* model 加版本号 ***************************************************/



/**
 * 开发环境总打包入口
 * gulp min
 *
 **/
gulp.task('min-dev', function (cb) {
    runSequence(
        'lint',
        'cleanStatic',
        'concatCss',
        'copy1',
        'copy2',
        'copy3',
        'copy4',
        'rootJsMin1',
        'rootJsMin2',
        'rootCssMin',
        'clean:min',
        'min1',
        'min2',
        'min3',
        'min4',
        'min5',
        'min6',
        'min7',
        'min8',
        'min9',
        'revModel-account',
        'revModel-inventory',
        'revModel-leaderboard',
        'revModel-lobby',
        'revModel-pay',
        'revModel-person',
        'revModel-promotion',
        'revModel-store',
        'revModel-vote',
        'revModel-horserace',
        'revLoad1',
        'revLoad1',
        'cleanImg',
        'revAccountImg',
        'revStatic-account',
        'revInventoryImg',
        'revStoreImg',
        'revStatic-store',
        'revPayImg',
        'revStatic-payment',
        'revPersonImg',
        'revPromotionImg',
        'revStatic-promotion',
        'revLeaderboardImg',
        'revLobbyImg',
        'concatCss2',
        cb);
});

/**
 * 独服总打包入口
 * gulp min-dufu
 *
 **/
gulp.task('min-dufu', function (cb) {
    baseLobby = "lobby-dufu";
    runSequence(
        'lint',
        'cleanStatic',
        'concatCss',
        'copy1',
        'copy2',
        'copy3',
        'copy4',
        'rootJsMin1',
        'rootJsMin2',
        'rootCssMin',
        'clean:min',
        'min1',
        'min2',
        'min3',
        'min4',
        'min5',
        'min6',
        'min7',
        'min8-dufu',
        'min9-dufu',
        'revModel-account',
        'revModel-inventory',
        'revModel-leaderboard',
        'revModel-lobby',
        'revModel-pay',
        'revModel-person',
        'revModel-promotion',
        'revModel-store',
        'revModel-vote',
        'revModel-horserace',
        'revLoad1',
        'revLoad1',
        'cleanImg',
        'revAccountImg',
        'revStatic-account',
        'revInventoryImg',
        'revStoreImg',
        'revStatic-store',
        'revPayImg',
        'revStatic-payment',
        'revPersonImg',
        'revPromotionImg',
        'revStatic-promotion',
        'revStatic-vote',
        'revLeaderboardImg',
        'revLobbyImg-dufu',
        'concatCss2',
        'revStatic-index',
        cb);
});


/*合并js*/
gulp.task('concatAccountJs', function() {
    return  gulp.src(['wpt/www/common/js/Barrett.js', 'wpt/www/common/js/BigInt.js', 'wpt/www/common/js/RSA.js',"wpt/www/common/js/CodeManage.js"])
        .pipe(concat('account-common.js'))
        .pipe(uglify())
        .pipe(gulp.dest('wpt/www/common/js/'))
});


/*合并css*/
gulp.task('concatCss', function() {
    return   gulp.src([
            'wpt/www/module/'+baseLobby+'/css/lobby.css',
            'wpt/www/module/inventory/css/inventory.css',
            'wpt/www/module/pay/css/pay.css',
            'wpt/www/module/promotion/css/promotion.css',
            'wpt/www/module/person/css/personal.css',
            'wpt/www/module/store/css/store.css',
            'wpt/www/module/account/css/account.css',
            'wpt/www/module/leaderboard/css/leaderboard.css'
        ])
        .pipe(concat('lobby-min.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('wpt/www/module/lobby/css/'))
});




/*************************************转html static 路径***************************************************/

gulp.task('revStatic-index', function () {
    return  gulp.src(['rev/host.json',
            'wpt/www/module/index/index.html'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                '/wpt/module/lobby/js/':'/wpt/module/lobby-dufu/js/',
                '/wpt/module/lobby/css/':'/wpt/module/lobby-dufu/css/'
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/index/') );
});



gulp.task('revStatic-account', function () {
    return  gulp.src(['rev/image/*.json',
            'wpt/www/module/account/register.html'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                '/wpt/www/module/account/images/':'/wpt/module/account/images/'
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/account/') );
});

gulp.task('revStatic-payment', function () {
    return  gulp.src(['rev/image/*.json',
            'wpt/www/module/pay/payment.html'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                '/wpt/www/module/pay/images/':'/wpt/module/pay/images/',
                "/wpt/www/common/images/":"/wpt/common/images/",
                '/wpt/www/module/promotion/images/':'/wpt/module/promotion/images/'
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/pay/') );
});


gulp.task('revStatic-promotion', function () {
    return  gulp.src(['rev/image/*.json',
            'wpt/www/module/promotion/index.html'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                "/wpt/www/common/images/":"/wpt/common/images/",
                '/wpt/www/module/promotion/images/':'/wpt/module/promotion/images/'
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/promotion/') );
});

gulp.task('revStatic-store', function () {
    return  gulp.src(['rev/image/*.json',
            'wpt/www/module/store/index.html'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                "/wpt/www/common/images/":"/wpt/common/images/",
                '/wpt/www/module/store/images/':'/wpt/module/store/images/'
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/store/') );
});


gulp.task('revStatic-vote', function () {
    return  gulp.src(['rev/host.json',
            'wpt/www/module/facebook/new_vote.html',
            'wpt/www/module/facebook/vote_end.html'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                "/wpt/common/js/":"/wpt/common/js/dufu/"
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/facebook/') );
});



/*************************************转html static 路径***************************************************/



/***************************************** 图片缓存处理开始****************************************************************/
/*
 执行步骤(对图片加版本号)：
 *
 * gulp minAllImg
 *
 * */
gulp.task('concatCss2', function() {
    return  gulp.src([
            'dist/wpt/module/'+baseLobby+'/css/lobby.css',
            'dist/wpt/module/inventory/css/inventory.css',
            'dist/wpt/module/pay/css/pay.css',
            'dist/wpt/module/promotion/css/promotion.css',
            'dist/wpt/module/person/css/personal.css',
            'dist/wpt/module/store/css/store.css',
            'dist/wpt/module/account/css/account.css',
            'dist/wpt/module/leaderboard/css/leaderboard.css'
        ])
        .pipe(concat('lobby-min.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/wpt/module/'+baseLobby+'/css/'))
});
gulp.task('cleanImg', function (cb) {
    return  del([
        'dist/wpt/module/**/css/*.css',
        '!dist/wpt/module/index/css/*.css',
        '!dist/wpt/module/facebook/css/*.css',
        'dist/wpt/module/**/images/*.png',
        'dist/wpt/module/**/images/*.jpg',
        'dist/wpt/module/**/images/*.gif',
        '!dist/wpt/module/index/images/*.png',
        '!dist/wpt/module/index/images/*.jpg',
        '!dist/wpt/module/index/images/*.gif',
        '!dist/wpt/module/facebook/images/*.png',
        '!dist/wpt/module/facebook/images/*.jpg',
        '!dist/wpt/module/facebook/images/*.gif'
    ], cb)
});
/* 图片文件md5*/
gulp.task('revAccountImg',["minAccountImg"], function () {
    return   gulp.src(['rev/image/*.json',
            'wpt/www/module/account/css/*.css'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                "/wpt/www/module/account/images/": "/wpt/module/account/images/"
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/account/css/') );
});


gulp.task('revInventoryImg',["minInventoryImg"], function () {
    return  gulp.src(['rev/image/*.json',
            'wpt/www/module/inventory/css/*.css'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                "/wpt/www/module/inventory/images/": "/wpt/module/inventory/images/"
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/inventory/css/') );
});
gulp.task('revStoreImg',["minStoreImg"], function () {
    return   gulp.src(['rev/image/*.json',
            'wpt/www/module/store/css/*.css'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                "/wpt/www/module/store/images/": "/wpt/module/store/images/"
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/store/css/') );
});
gulp.task('revPayImg',["minPayImg"], function () {
    return  gulp.src(['rev/image/*.json',
            'wpt/www/module/pay/css/*.css'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                "/wpt/www/module/pay/images/": "/wpt/module/pay/images/"
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/pay/css/') );
});
gulp.task('revPersonImg',["minPersonImg"], function () {
    return  gulp.src(['rev/image/*.json',
            'wpt/www/module/person/css/*.css'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                "/wpt/www/module/person/images/": "/wpt/module/person/images/"
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/person/css/') );
});
gulp.task('revPromotionImg',["minPromotionImg"], function () {
    return  gulp.src(['rev/image/*.json',
            'wpt/www/module/promotion/css/*.css'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                "/wpt/www/module/promotion/images/": "/wpt/module/promotion/images/"
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/promotion/css/') );
});

gulp.task('revLeaderboardImg',["minLeaderboardImg"], function () {
    return  gulp.src(['rev/image/*.json',
            'wpt/www/module/leaderboard/css/*.css'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                "/wpt/www/module/leaderboard/images/": "/wpt/module/leaderboard/images/"
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/leaderboard/css/') );
});

gulp.task('revLobbyImg',["minLobbyImg"], function () {
    return  gulp.src(['rev/image/*.json',
            'wpt/www/module/'+baseLobby+'/css/*.css'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                "/wpt/www/module/lobby/images/": "/wpt/module/lobby/images/"
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/'+baseLobby+'/css/') );
});

gulp.task('revLobbyImg-dufu',["minLobbyImg"], function () {
    return  gulp.src(['rev/image/*.json',
            'wpt/www/module/'+baseLobby+'/css/*.css'
        ])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                "/wpt/www/module/lobby-dufu/images/": "/wpt/module/lobby-dufu/images/"
            }
        }) )
        .pipe( gulp.dest('dist/wpt/module/'+baseLobby+'/css/') );
});

/* 图片文件md5*/
gulp.task('minAccountImg', function () {
    return   gulp.src(['wpt/www/module/account/images/*.png','wpt/www/module/account/images/*.jpg','wpt/www/module/account/images/*.gif'])
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/module/account/images/'))
        .pipe( rev.manifest() )  //生成manifest文件
        .pipe( gulp.dest( 'rev/image' ) );
});
/* 图片文件md5*/
gulp.task('minStoreImg', function () {
    return   gulp.src(['wpt/www/module/store/images/*.png','wpt/www/module/store/images/*.jpg','wpt/www/module/store/images/*.gif'])
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/module/store/images/'))
        .pipe( rev.manifest() )  //生成manifest文件
        .pipe( gulp.dest( 'rev/image' ) );
});
/* 图片文件md5*/
gulp.task('minInventoryImg', function () {
    return   gulp.src(['wpt/www/module/inventory/images/*.png','wpt/www/module/inventory/images/*.jpg','wpt/www/module/inventory/images/*.gif'])
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/module/inventory/images/'))
        .pipe( rev.manifest() )  //生成manifest文件
        .pipe( gulp.dest( 'rev/image' ) );
});
/* 图片文件md5*/
gulp.task('minPayImg', function () {
    return   gulp.src(['wpt/www/module/pay/images/*.png','wpt/www/module/pay/images/*.jpg','wpt/www/module/pay/images/*.gif'])
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/module/pay/images/'))
        .pipe( rev.manifest() )  //生成manifest文件
        .pipe( gulp.dest( 'rev/image' ) );
});
/* 图片文件md5*/
gulp.task('minPersonImg', function () {
    return   gulp.src(['wpt/www/module/person/images/*.png','wpt/www/module/person/images/*.jpg','wpt/www/module/person/images/*.gif'])
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/module/person/images/'))
        .pipe( rev.manifest() )  //生成manifest文件
        .pipe( gulp.dest( 'rev/image' ) );
});
/* 图片文件md5*/
gulp.task('minPromotionImg', function () {
    return   gulp.src(['wpt/www/module/promotion/images/*.png','wpt/www/module/promotion/images/*.jpg','wpt/www/module/promotion/images/*.gif'])
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/module/promotion/images/'))
        .pipe( rev.manifest() )  //生成manifest文件
        .pipe( gulp.dest( 'rev/image' ) );
});
/* 图片文件md5*/
gulp.task('minLeaderboardImg', function () {
    return   gulp.src(['wpt/www/module/leaderboard/images/*.png','wpt/www/module/leaderboard/images/*.jpg','wpt/www/module/leaderboard/images/*.gif'])
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/module/leaderboard/images/'))
        .pipe( rev.manifest() )  //生成manifest文件
        .pipe( gulp.dest( 'rev/image' ) );
});
/* 图片文件md5*/
gulp.task('minLobbyImg', function () {
    return   gulp.src(['wpt/www/module/lobby/images/*.png','wpt/www/module/lobby/images/*.jpg','wpt/www/module/lobby/images/*.gif'])
        .pipe(rev())  //MD5
        .pipe(gulp.dest('dist/wpt/module/'+baseLobby+'/images/'))
        .pipe( rev.manifest() )  //生成manifest文件
        .pipe( gulp.dest( 'rev/image' ) );
});


gulp.task('minAllImg', function (cb) {
    runSequence(
        'cleanImg',
        'revAccountImg',
        'revInventoryImg',
        'revStoreImg',
        'revPayImg',
        'revPersonImg',
        'revPromotionImg',
        'revLobbyImg',
        'concatCss2',
        cb);
});



/***************************************** 图片缓存处理结束****************************************************************/



var postcss = require('gulp-postcss');
var px2rem = require('postcss-px2rem');
gulp.task('px2', function() {
    var processors = [px2rem({remUnit: 75})];
    return gulp.src('test/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('src'));
});


/*
 npm install --save-dev gulp-babel
 npm install --save-dev babel-preset-es2015
 npm install --save-dev gulp-eslint
 */
var babel = require("gulp-babel");
/* es6 */
gulp.task("es6", function () {
    return gulp.src("test/*.js")// ES6 源码存放的路径
        .pipe(babel())
        .pipe(gulp.dest("src")); //转换成 ES5 存放的路径
});
gulp.task('auto-es6', function () {
    // 监听文件修改，当文件被修改则执行 script 任务
    gulp.watch("test/*.js", ['es6']);
});


gulp.task('lint', function() {
    return gulp.src(
            [
                'wpt/www/module/**/js/*.js',
                'wpt/www/model/*.js',
                '!wpt/www/module/facebook/**/*.js',
                '!wpt/www/module/**/js/*-min.js'
            ]
        )
        .pipe(eslint())
        .pipe(eslint.format());
});
