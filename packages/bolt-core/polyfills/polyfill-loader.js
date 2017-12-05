require('es6-promise').polyfill();
require("core-js/modules/es6.array.iterator");
require('core-js/modules/es6.symbol');
require("core-js/modules/es6.array.from");


// export const polyfillLoader = new Promise((resolve, reject) => resolve(5)); 

export const polyfillLoader = new Promise(function (resolve, reject) {
  // setTimeout(() => resolve(4), 2000);
  if (window.customElements !== undefined) {
    Promise.all([
      import(/* webpackMode: "lazy", webpackChunkName: "bolt-wc-polyfill--es5-adapter" */ '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js'),
      import(/* webpackMode: "lazy", webpackChunkName: "bolt-wc-polyfill--sd" */ './wc-polyfill-sd'),
    ])
      .then(() => {
        resolve();
      });
  } else {
    Promise.all([
      import(/* webpackMode: "lazy", webpackChunkName: "bolt-wc-polyfill--ce-sd" */ './wc-polyfill-ce-sd'),
    ])
      .then(() => {
        resolve();
      });
  }
});

// var p2 = Promise.resolve("foo"); 

// export function polyfillLoader(callback) {
  
// }