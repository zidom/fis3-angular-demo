//由于使用了bower，有很多非必须资源。通过set project.files对象指定需要编译的文件夹和引用的资源
fis.set('project.files', ['*.html','page/**','styles/**', 'map.json', 'components/**', 'libs/**', '!**/*_test.js']);

fis.set('admin', '/admin');//admin目录

//FIS modjs模块化方案，您也可以选择amd/commonjs等
fis.hook('module', {
    mode: 'mod'
});
fis.hook('relative');
fis.match('**', {
    relative: true
})

/*************************目录规范*****************************/
fis.match("**/*", {
    release: '${admin}/$&'
})
//modules下面都是模块化资源
    .match(/^\/components\/(.*)\.(js)$/i, {
        isMod: true,
        id: '$1', //id支持简写，去掉modules和.js后缀中间的部分
        release: '${admin}/$&'
    })
//page下面的页面发布时去掉page文件夹
    .match(/^\/page\/(.*)$/i, {
        useCache: false,
        release: '$1'
        //release: '${admin}/$1'
    })
//一级同名组件，可以引用短路径，比如modules/jquery/juqery.js
//直接引用为var $ = require('jquery');
    .match(/^\/components\/([^\/]+)\/\1\.(js)$/i, {
        id: '$1'
    })
//less的mixin文件无需发布
    .match(/^(.*)mixin\.less$/i, {
        release: false
    })
//页面模板不用编译缓存
    .match(/.*\.(html)$/, {
        useCache: false
    })
    .match(/^\/bower_components\/(.*)/i,{
        release:'${admin}/vendor/$1'
    })


/****************异构语言编译*****************/
//less的编译
//npm install [-g] fis-parser-less
fis.match('**/*.less', {
    rExt: '.css', // from .scss to .css
    parser: fis.plugin('less', {
        //fis-parser-less option
    })
});

//打包与css sprite基础配置
fis.match('::packager', {
    // npm install [-g] fis3-postpackager-loader
    // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
    postpackager: fis.plugin('loader', {
        resourceType: 'mod',
        useInlineMap: true // 资源映射表内嵌
    }),
    packager: fis.plugin('map')
})


/**********************生产环境下CSS、JS压缩合并*****************/
//使用方法 fis3 release prod
fis.media('prod')
    //注意压缩时.async.js文件是异步加载的，不能直接用annotate解析
    .match('**!(.async).js', {
        preprocessor: fis.plugin('annotate'),
        optimizer: fis.plugin('uglify-js')
    })
    .match('**.css', {
        optimizer: fis.plugin('clean-css')
    })
    .match("lib/mod.js", {
        packTo: "/pkg/vendor.js"
    })
    //所有页面中引用到的bower js资源
    .match("bower_components/**/*.js", {
        packTo: "/pkg/vendor.js"
    })
    //所有页面中引用到的bower css资源
    .match("bower_components/**/*.css", {
        packTo: "/pkg/vendor.css"
    });

