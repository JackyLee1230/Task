var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var store = require('store2');

var monk = require('monk');
var db = monk('localhost:27017/task');

var mreferrer = require('monkeys-referrer');

var app = express();
app.disable('etag');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var indexRouter = require('./routes/index');
app.use('/', indexRouter);


app.use(function (req, res, next) {
  req.db = db;
  next();
});


app.get('/visit', function (req, res) {
  var db = req.db;
  var collection = db.get('col');
  var referrer = req.header('referrer');
  mreferrer.referrer.parse(req.url, referrer, function (err, desc) {
    req.referrer = desc;
    let src = desc.referrer.type;
    //find if the name exists and inc by 1, if not create one
    collection.find({ name: src }, function (err, docs) {
      if (docs.length == 0) {
        collection.insert({ name: src, count: 1 });
      }
      else {
        collection.update({ name: src }, { $inc: { count: 1 } });
      }
    });
  });
  return res.send("thanks for visiting! your visit is recorded");
});

app.get('/analytics', function (req, res) {
  var db = req.db;
  var collection = db.get('col');
  var result = "<script>function rem(){document.querySelectorAll('.values').forEach(e => e.remove());} </script ><title>Traffic Analytics</title><h1>Analytics (Real-time)</h1> <button type='button' onclick='rem()'>Remove all updates below</button> <p class='values' style='font-weight:bold'>" + (new Date).toLocaleString() + ": ";
  collection.find({}).then((docs) => {
    for (let i = 0; i < docs.length; i++) {
      result += docs[i].name + " has " + docs[i].count + " visits. &nbsp;";
      store(docs[i].name, docs[i].count);
    }
    result += "</p>";
    res.write(result);
  });
  setInterval(loop, 1000);
  function loop() {
    var diff = false;
    var result = "<p class='values' style='font-weight:bold'>" + (new Date).toLocaleString() + ": ";
    collection.find({}).then((docs) => {
      for (let i = 0; i < docs.length; i++) {
        result += docs[i].name + " has " + docs[i].count + " visits. &nbsp;";
        n = "direct";
        // console.log(store(docs[i].name), docs[i].count);
        if (store(docs[i].name) != docs[i].count) {
          store.set(docs[i].name, docs[i].count);
          diff = true;
        }
      }
      result += "</p>";
      // if the value retrieved differs from last stored value, update the value on the page
      if (diff) { res.write(result) }
    });
  }
});


var port = 8081;
app.listen(port);
console.log('Server listening on localhost:' + port);

module.exports = app;
