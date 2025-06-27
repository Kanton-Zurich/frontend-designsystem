import Plugin from './estatico-plugin-2';
import Logger from './estatico-logger';

import gulp from 'gulp';
import plumber from 'gulp-plumber';
import changed from 'gulp-changed-in-place';
import eslint from 'gulp-eslint';
import through from 'through2';
import chalk from 'chalk';
import path from 'path';

/**
 * Default config
 * @param {object} env - Optional environment config, e.g. { dev: true }
 * @return {object}
 */
const defaults = (env) => ({
  src: null,
  srcBase: null,
  dest: null,
  watch: null,
  plugins: {
    eslint: {
      fix: env.fix,
    },
    changed: {
      firstPass: true,
    },
  },
  logger: new Logger('estatico-eslint-2'),
});

/**
 * Task function
 * @param {object} config - Complete task config
 * @param {object} env - Optional environment config, e.g. { dev: true }
 * @return {object} gulp stream
 */
const task = (config, env = {}) =>
  gulp
    .src(config.src, {
      base: config.srcBase,
    })

    // Prevent stream from unpiping on error
    .pipe(plumber())

    // Do not pass unchanged files
    .pipe(config.plugins.changed ? changed(config.plugins.changed) : through.obj())

    // Lint and log formatted results, optionally auto-fix files
    .pipe(eslint(config.plugins.eslint).on('error', (err) => config.logger.error(err, env.dev)))
    .pipe(eslint.formatEach())
    .pipe(
      through.obj((file, enc, done) => {
        if (file.eslint && (file.eslint.errorCount > 0 || file.eslint.fixed)) {
          const relFilePath = path.relative(config.srcBase, file.path);

          if (file.eslint.errorCount > 0) {
            config.logger.error(
              {
                message: 'Linting error (details above)',
                fileName: relFilePath,
              },
              env.dev
            );
          }

          // Only keep file in stream if it was fixed
          if (file.eslint.fixed) {
            config.logger.info(
              `Automatically fixed linting issues in ${chalk.yellow(
                relFilePath
              )}. Set "plugins.eslint.fix" to false to disable this functionality.`
            );

            return done(null, file);
          }
        }

        return done();
      })
    )

    // Optionally write back to disc
    .pipe(config.plugins.eslint.fix ? gulp.dest(config.dest) : through.obj());

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
