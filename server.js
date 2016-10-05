var express = require('express')
var app = express();
var app = express();

app.configure(function () {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
});

// app.get('/users', user.findAll);
// app.get('/users/:id', user.findById);
// app.post('/users', user.addUser);


var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('users/user.db');

db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS usertb (name TEXT, year INTEGER, major TEXT)");
    db.run("INSERT INTO usertb (name, year, major) VALUES (?, ?, ?)", "kaelan cooter",2016, "computer science");
    db.run("INSERT INTO usertb (name, year, major) VALUES (?, ?, ?)", "ninad limaye", 2016, "information assurance");
});

app.use(express.static('public'));

app.get('/users', function(req, res, next) {
  db.all("SELECT name FROM usertb", function(err, rows){
  	if (err!== null) {
  	  next(err);
  	} else {
  	  res.send(rows);
  	}
  });
});

app.post('/users',function(req, res, next) {
  var name = req.body.name;
  var year = req.body.year;
  var major = req.body.major;
  console.log(name, year, major)
  var sqlRequest = "INSERT INTO 'usertb' (name, year, major) " +
               "VALUES('" + name + "', '" + year + "', '" + major + "')"
  db.run(sqlRequest, function(err) {
    if(err !== null) {
      next(err);
    } else {
      res.send({ name: name, year: year, major: major});
    }
  });
});

app.get('/user', function (req, res, next) {
  var name = req.query.name;
  if (!name) {
    res.send(400);
  } else {
    var sqlRequest = "SELECT * FROM `usertb` WHERE usertb.name = '" + name + "'"
    console.log('Request:')
    console.log(sqlRequest)
    db.all(sqlRequest, function(err, result) {
      if(err !== null) {
        next(err);
      } else {
        if (result && result[0]) {
          res.send(result[0])
        } else {
          res.send({});
        }
      }
    });
  }
})


app.listen(3000);
console.log('Listening on port 3000...');

// app.get('/', function(req, res) {
//   res.sendfile('./public/index.html')
// });
