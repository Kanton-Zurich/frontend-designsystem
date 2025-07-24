import chalk from 'chalk';
import fancyLog from 'fancy-log';
import log from 'gulplog';

export default function Logger(pluginName) {
  /**
   * Simple info logger
   * @param {*} msg - Log content
   */
  const info = (msg) => {
    log.info(chalk.cyan(pluginName), msg);
  };

  /**
   * Debug logger
   * @param {*} msg - Log content
   * @param {*} [extendedMsg] - Extended log content
   */
  const debug = (msg, extendedMsg) => {
    log.debug(chalk.cyan(pluginName), msg, extendedMsg ? `\n${extendedMsg}` : '');
  };

  /**
   * Error logger
   * @param {Error} err
   * @param {boolean} [dev] - Whether we are in dev mode. Process exits otherwise.
   */
  const error = (err, dev) => {
    const stack = err.stack /* && err.showStack */ ? `\n${chalk.red(err.stack)}` : '';

    // We cannot properly use `gulplog.error` outside of `gulp-cli` (i.e. in tests)
    // Falling back to fancy-log instead
    fancyLog(
      chalk.cyan(pluginName),
      err.plugin ? chalk.cyan(`(${err.plugin})`) : '',
      err.fileName ? chalk.yellow(err.fileName) : '',
      chalk.red(err.message),
      stack
    );

    if (!dev) {
      process.exit(1);
    }
  };

  return {
    info,
    debug,
    error,
  };
}
