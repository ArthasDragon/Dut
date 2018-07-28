module.exports = {
	plugins: [
		require("precss")(),
		// require('postcss-import'),
		/*
         可以配置'ie 6-8'或者'> 1%'或者'last 2 versions'
         */
		require("autoprefixer")({
			browsers: ["last 2 versions"]
		}),
		require("cssnano")({
			// safe:false
		})
		// require('postcss-pxtorem')({
		//     /*
		//      rootValue,取决于设计稿是按照什么设备的尺寸来设计的，
		//      那这就是对应于为该尺寸媒体查询@media的那个html font-size值
		//      */
		//     rootValue: 75,
		//     unitPrecision: 5,//保留几位小数点
		//     /*
		//      希望哪些属性能从px转为rem,
		//      *表示所有的属性，!表示排除某个属性
		//      */
		//     propList: ['*', '!font-size'],
		//     selectorBlackList: [],//
		//     replace: true,
		//     /*
		//      在media中的px是否也进行转换:
		//      @media only screen and (min-width: 1080px)
		//      */
		//     mediaQuery: false,
		//     minPixelValue: 0
		// })
		// require('postcss-assets')({
		//     relative: true,
		//     // 配置图片所在位置， 例如我的图片存在与 assets/images 文件夹里面
		//     loadPaths: ['assets/imgs/'],
		//     //使图片缓存无效
		//     // cachebuster: true
		// }),
		// require("postcss-cssnext")({}),
		//处理雪碧图
		// require('postcss-sprites')({})
	]
};
