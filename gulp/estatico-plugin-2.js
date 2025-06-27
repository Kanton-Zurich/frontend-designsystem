import merge from 'lodash.merge';

export default function plugin({ defaults, options, task, env = {} }) {
  // eslint-disable-next-line global-require
  const gulp = require('gulp');

  let config = {};

  // Either merge or transform options
  if (typeof options === 'function') {
    config = options(defaults(env));
  } else {
    config = merge({}, defaults(env), options);
  }

  // Add optional watcher
  if (env.watch && config.watch) {
    const watchConfig = merge(
      {},
      {
        task: task.bind(null, config, env),
      },
      config.watch
    );

    if (config.watch.watcher) {
      // Use custom watcher like `@unic/estatico-watch`
      config.watch.watcher(watchConfig)();
    } else {
      // Create named callback function for gulp-cli to be able to log it
      const cb = {
        [config.watch.name]() {
          return watchConfig.task();
        },
      };

      // Use default gulp watch
      gulp.watch(watchConfig.src, cb[config.watch.name]);
    }
  }

  // Return configured task function
  return task.bind(null, config, env);
}
