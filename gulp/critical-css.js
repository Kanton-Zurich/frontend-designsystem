const gulp = require('gulp');
const fs = require('fs');
const minimalcss = require('minimalcss');
const path = require('path');
const http = require('http');

gulp.task('critical', (callback) => {
  const staticBasePath = './dist';
  const staticServe = function (req, res) {
    const resolvedBase = path.resolve(staticBasePath);
    const safeSuffix = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
    const fileLoc = path.join(resolvedBase, safeSuffix);

    fs.readFile(fileLoc, (err, data) => {
      if (err) {
        res.writeHead(404, 'Not Found'); // eslint-
        res.write('404: File Not Found!');
        return res.end();
      }

      res.statusCode = 200;

      res.write(data);
      return res.end();
    });
  };

  const httpServer = http.createServer(staticServe);

  httpServer.listen(8080);

  minimalcss
    .minimize({ urls: ['http://localhost:8080/pages/barebone/barebone.html'] })
    .then((result) => {
      fs.writeFileSync('dist/assets/css/critical.css', result.finalCss);
      httpServer.close();
      callback();
    })
    .catch((error) => {
      console.error(`Failed the minimize CSS: ${error}`);
      callback();
    });
});
