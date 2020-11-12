import json from 'rollup-plugin-json'
import path from 'path'

export default {
    input: './src/index.js',
    output: {
        name: 'aio',
        file: `./dist/aio.js`,
        format: 'es',
        // amd: {
        //     id:'aio'
        //     // define: 'def'
        // },
        banner: '/* my-library all in one version 0.0.1 */',
        footer: '/* my-library all in one version 0.0.1 */',
        sourcemap: true
    },
    // external:[
    //     path.resolve( './src/foo.js' ),
    //     path.resolve( './src/bar.js' )
    // ],
    plugins:[json()]
    
};

// export default {
//     // 核心选项
//     input,     // 必须
//     external,
//     plugins,
  
//     // 额外选项
//     onwarn,
  
//     // danger zone
//     acorn,
//     context,
//     moduleContext,
//     legacy
  
//     output: {  // 必须 (如果要输出多个，可以是一个数组)
//       // 核心选项
//       file,    // 必须
//       format,  // 必须
//       name,
//       globals,
  
//       // 额外选项
//       paths,
//       banner,
//       footer,
//       intro,
//       outro,
//       sourcemap,
//       sourcemapFile,
//       interop,
  
//       // 高危选项
//       exports,
//       amd,
//       indent
//       strict
//     },
//   };