const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swig = require('swig');  //引入swig模版引擎
const mysql = require('mysql'); //引入mysql

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
const port = 3300;

// 设置 mysql
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: 'bambi_test1'
});

app.use(express.static(path.join(__dirname, 'public'))); //指定静态资源路径

// view engine setup
app.set('views', './views'); //指定模版文件路由为 public/views （前面指定了静态资源目录）
app.set('view engine', 'html'); //模版文件为 html 文件
app.engine('html', swig.renderFile); //渲染引擎为swig

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 指定路由
app.use('/', indexRouter);
app.use('/users', usersRouter);

// 模拟一个接口
app.get('/saveUser', (req, res) => {
  console.log(req.query);
  // 接收数据
  let userData = {
    user_name: req.query.username,
    user_pwd: req.query.username
  };
  // 连接数据库
  connection.connect(function (err) {
    if (err) {
      console.error('========= error connecting: =========' + err.stack);
      return;
    }
    console.log('connected as id ' + connection.threadId);
  });
  // 插入数据
  connection.query('INSERT INTO users SET ?', userData, function (error, results, fields) {
    if (error) {
      res.status(500);
      res.json({ success: 'no', msg: error.stack });
    } else {
      res.json({ success: 'ok', msg: 'success' });
    }
  });
  connection.end();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log('Server_' + port + 'start!');
});

module.exports = app;