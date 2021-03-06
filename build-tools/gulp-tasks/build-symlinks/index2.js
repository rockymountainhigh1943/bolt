const gulp = require('gulp');
const delSymlinks = require('del-symlinks');
const vfs = require('vinyl-fs');
const globby = require('globby');
const fs = require('fs');
const gulpConfig = require('../build-patternlab/config.default');
const path = require('path');
const yaml = require('js-yaml');
const merge = require('merge').recursive;
const defaultConfig = require('./config.default');
const argv = require('yargs').argv;
const core = require('@bolt/build-core');
const pkgVersions = require('pkg-versions');
const gutil = require('gulp-util');
const prettyPrint = require('pretty-print');
const latestVersion = require('latest-version');
const packageJson = require('package-json');
const bump = require('bump-regex');
const semver = require('semver');


var cosmiconfig = require('cosmiconfig');
var explorer = cosmiconfig('patternlab');
const patternLabRoot = path.join(gulpConfig.patternLab.configFile, '../..');




function boltPackages(userConfig) {
  const config = merge(defaultConfig, userConfig);
  // const patternsFolder = `${patternLabRoot}/`;


  // let packageTypes = [
  //   'settings',
  //   'tools',
  //   'generic',
  //   'elements',
  //   'objects',
  //   'components',
  //   'themes',
  //   'utilities'
  // ];
  let packageTypes = [
    '@bolt'
    // 'tools',
    // 'generic',
    // 'elements',
    // 'objects',
    // 'components',
    // 'themes',
    // 'utilities'
  ];

  if (argv.filter) {
    // packageTypes = [];
    packageTypes = argv.filter;
    console.log(packageTypes);
    // packageTypes.push(argv.filter);
  }

  const unorderedMatches = {};
  const orderedMatches = {};


  const isProduction = argv.production !== undefined;

  function boltPackagesTask(done) {
    globby(config.packageFolders, {
      follow: true
    }).then((packages) => {
      for (var i = 0; i < packages.length; ++i) {
        const pkg = packages[i];
        const pkgJson = `${pkg}/package.json`;

        if (fs.existsSync(pkgJson)) {
          const pjson = JSON.parse(fs.readFileSync(pkgJson));
          

          if ('private' in pjson && pjson['private'] === true){
            gutil.log(gutil.colors.green(`${pjson.name} is marked as private so it won't be published -- skipping...`));
          } else {
            
           

            // packageJson(pjson.name, { allVersions: true } ).then(json => {
            //   console.log(json.versions);
            //   //=> {name: 'ava', ...} 
            // });

            pkgVersions(pjson.name).then(v => {
              const versions = Array.from(v);
              // console.log(pjson.name);
              // console.log();

              latestVersion(pjson.name).then(version => {
                if (semver.lt(pjson.version, version)){
                  bump(`version: "${version}"`, function (err, out) {
                    console.log(out);
                    gutil.log(gutil.colors.red(`WARNING!! The ${pjson.name} package is currently at version ${pjson.version} which appears to be behind the ${version} version already published to NPM`));

                    gutil.log(gutil.colors.red(`Try updating ${pjson.name} to ${out.new} or greater.`));
                  });
                } else {
                  if (versions.indexOf(pjson.version) > -1) {
                    gutil.log(gutil.colors.red(`Warning! It looks like you've already published ${pjson.name} since the current version is already up on NPM!`));
                  } else {
                    gutil.log(gutil.colors.green(`${pjson.name} version checks out. ✅ `));
                  }
                }
                
                // console.log(version === versions[versions.length - 1]);
                // console.log(' ');
                //=> '0.18.0' 
              });
            });
              

             
          }

          

          if (packageTypes.some(v => pjson.name.indexOf(v) >= 0)) {
            unorderedMatches[pjson.name] = pjson.version;
          }
        }
      };
      Object.keys(unorderedMatches).sort().forEach((key) => {
        orderedMatches[key] = unorderedMatches[key];
      });
      console.log(JSON.stringify(orderedMatches, null, 4));
      console.log(`Showing ${Object.keys(orderedMatches).length} packages.`);
      // console.log(JSON.stringify(orderedMatches), null, '');
      done();
    });
  }

  boltPackagesTask.description = 'Lists out all packages in Bolt';
  boltPackagesTask.displayName = 'bolt:packages';

  boltPackagesTask.flags = {
    '--filter': 'Only display Bolt packages that contain these strings. `ex. gulp bolt:packages --filter=objects --filter=components`'
  };
  return boltPackagesTask;
}
module.exports.boltPackages = boltPackages;




function cleanPatternLabSymlinks() {
  function cleanPatternLabSymlinksTask(done) {

    delSymlinks(['.pattern-lab/source/**/*', '!.pattern-lab/source/_twig-components']).then(() => {
      done();
    });
  }

  cleanPatternLabSymlinksTask.description = 'Automatically clean PL specific symlinks';
  cleanPatternLabSymlinksTask.displayName = 'symlink:clean-patternlab';
  return cleanPatternLabSymlinksTask;
}
module.exports.clean = cleanPatternLabSymlinks;


function buildPLSymlinks(symlinkDir) {
  console.log(symlinkDir);

  symlinkDir.forEach(function (symlinkDirConfig) {
    
  // });
  // for (i = 0; i < length; i++) {
  //   var symlinkDirConfig = symlinkDir[i];
    // console.log(symlinkDirConfig);
    if (fs.existsSync(symlinkDirConfig.src)) {
      return vfs.src(symlinkDirConfig.src, {
        followSymlinks: false
      })
        .pipe(vfs.symlink(symlinkDirConfig.dest, {
          relativeSymlinks: true
        }));
    } else {
      console.log(`Warning: the ${symlinkDirConfig.src} path specified in .patternlabrc does not exist!`);
    }
  });
  // }
}

function createPatternLabSymlinks() {
  function createPatternLabSymlinksTask(done) {

    explorer.load('.')
      .then((result) => {
          var symlinkDirs = result.config.symlinkKeys;
          var length = symlinkDirs.length;
          // console.log(symlinkDirs);

        for (var i = 0; i < length; i++) {
          var key = symlinkDirs[i];
          var symlinkDir = result.config[key];
          // console.log(symlinkDir);
          // console.log(key);
          if (symlinkDir.length){
            buildPLSymlinks(symlinkDir);
          } else {
            var symlinkDirArray = [];
            symlinkDirArray.push(symlinkDir);
            buildPLSymlinks(symlinkDirArray);
          }
        }
        done();

      }).catch((parsingError) => {
        // do something constructive
      });
  }

  createPatternLabSymlinksTask.description = 'Automatically create PL specific symlinks';
  createPatternLabSymlinksTask.displayName = 'symlink:patternlab';
  return createPatternLabSymlinksTask;
}
module.exports.create = createPatternLabSymlinks;


// function boltPackages(userConfig) {
//   const config = merge(defaultConfig, userConfig);
//   const patternsFolder = `${patternLabRoot}/`;


//   // let packageTypes = [
//   //   'settings',
//   //   'tools',
//   //   'generic',
//   //   'elements',
//   //   'objects',
//   //   'components',
//   //   'themes',
//   //   'utilities'
//   // ];
//   let packageTypes = [
//     '@bolt'
//     // 'tools',
//     // 'generic',
//     // 'elements',
//     // 'objects',
//     // 'components',
//     // 'themes',
//     // 'utilities'
//   ];

//   if (argv.filter) {
//     // packageTypes = [];
//     packageTypes = argv.filter;
//     console.log(packageTypes);
//     // packageTypes.push(argv.filter);
//   }

//   const unorderedMatches = {};
//   const orderedMatches = {};


//   const isProduction = argv.production !== undefined;

//   function boltPackagesTask(done) {
//     globby(config.packageFolders).then((packages) => {
//       packages.forEach((pkg) => {
//         const pkgJson = `${pkg}/package.json`;

//         if (fs.existsSync(pkgJson)) {
//           const pjson = JSON.parse(fs.readFileSync(pkgJson));

//           if (packageTypes.some(v => pjson.name.indexOf(v) >= 0)) {
//             unorderedMatches[pjson.name] = pjson.version;
//           }
//         }
//       });
//       Object.keys(unorderedMatches).sort().forEach((key) => {
//         orderedMatches[key] = unorderedMatches[key];
//       });
//       console.log(JSON.stringify(orderedMatches, null, 4));
//       console.log(`Showing ${Object.keys(orderedMatches).length} packages.`);
//       // console.log(JSON.stringify(orderedMatches), null, '');
//       done();
//     });
//   }

//   boltPackagesTask.description = 'Lists out all packages in Bolt';
//   boltPackagesTask.displayName = 'bolt:packages';

//   boltPackagesTask.flags = {
//     '--filter': 'Only display Bolt packages that contain these strings. `ex. gulp bolt:packages --filter=objects --filter=components`'
//   };
//   return boltPackagesTask;
// }
// module.exports.boltPackages = boltPackages;


// function patternLabGrav() {
//   function patternLabGravTask(done) {
//     if (fs.existsSync('packages/website/user/themes/bolt/pattern-lab/')) {
//       vfs.src('packages/website/user/themes/bolt/pattern-lab/', {
//         followSymlinks: false
//       })
//         .pipe(vfs.symlink('packages/website-pattern-lab'))
//         .on('end', () => {
//           done();
//         });
//     }
//   }

//   patternLabGravTask.description = 'Symlink Grav w/ Pattern Lab';
//   patternLabGravTask.displayName = 'symlinks:patternLabGrav';
//   return patternLabGravTask;
// }
// module.exports.patternLabGrav = patternLabGrav;


// function cleanSymlinks(userConfig) {
//   const config = merge(defaultConfig, userConfig || {});
//   const patternsFolder = `${patternLabSource}/${config.patternsFolder}/`;

//   function cleanSymlinksTask(done) {
//     delSymlinks([`${patternsFolder}**/*`]).then(() => {
//       done();
//     });
//   }
//   cleanSymlinksTask.description = 'Automatically clean up symlinks';
//   cleanSymlinksTask.displayName = 'symlinks:clean';

//   return cleanSymlinksTask;
// }
// module.exports.clean = cleanSymlinks;


// function watchSymlinks() {
//   function watchSymlinksTask(done) {
//     gulp.watch([
//       './src/_patterns/**/package.json',
//       '!**/node_modules/**'
//     ], () =>
//       core.notify.sh('lerna link', true, (err) => {
//       // core.events.emit('reload', '**/*.html', true);
//         done(err);
//       }));
//   }

//   watchSymlinksTask.displayName = 'symlinks:watch';
//   watchSymlinksTask.description = 'Watch symlink-related files for changes';
//   //
//   return watchSymlinksTask;
// }
// module.exports.watch = watchSymlinks;
