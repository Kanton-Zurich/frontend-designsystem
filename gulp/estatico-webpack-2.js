import Plugin from './estatico-plugin-2';
import Logger from './estatico-logger';

// We export webpack to allow for complete flexibility in config overwrite
import webpack from 'webpack';
import webpackConfig from '../webpack.config';

/**
 * Default config
 * @param {object} env - Optional environment config, e.g. { dev: true }
 * @return {object}
 */
const defaults = () => ({
  webpack: webpackConfig,
  logger: new Logger('estatico-webpack'),
});

/**
 * Task function
 * @param {object} config - Complete task config
 * @param {object} env - Environment config, e.g. { dev: true }
 * @param {object} [watcher] - Watch file events (requires `@unic/estatico-watch`)
 * @return {object} gulp stream
 */
const task = (config, env = {}, cb) => {
  // webpack node interface doc: https://webpack.js.org/api/node/
  const compiler = webpack(config.webpack);

  const callback = (error, stats) => {
    // webpack error handling https://webpack.js.org/api/node/#error-handling
    const info = stats.toJson();

    // error reports only webpack config errors
    if (error) {
      return cb(error);
    }

    // stats.hasErrors() reports webpack compilation errors
    if (stats.hasErrors()) {
      cb(info.errors);
    } else {
      cb();
    }

    if (!env.watch) {
      compiler.close((err) => {
        if (err) {
          config.logger.error(err);
        }
      });
    }
    return compiler;
  };

  if (env.watch) {
    compiler.watch({}, callback);
  } else {
    compiler.run(callback);
  }
};

/**
 * @param {object|func} options - Custom config
 *  Either deep-merged (object) or called (func) with defaults
 * @param {object} env - Optional environment config, e.g. { dev: true }, passed to defaults
 * @return {func} Task function from above with bound config and env
 */
export default (options, env = {}) =>
  new Plugin({
    defaults,
    options,
    task,
    env,
  });

/**
 * Export webpack
 */
export { webpack };
