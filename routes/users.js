var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('user.db');

db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS usertb (name TEXT, year INTEGER, major TEXT)");
    db.run("INSERT INTO usertb (name, year, major) VALUES (?, ?, ?)", "kaelan cooter",2016, "computer science");
    db.run("INSERT INTO usertb (name, year, major) VALUES (?, ?, ?)", "ninad limaye", 2016, "information assurance");
});


var express = require('express');
var restapi = express();

exports.findAll = function(req, res) {
   db.get("SELECT * FROM usertb", function(err, row){
        res.json({ row.name : row.year : row.major });
   });
});

exports.addUser = function(req, res) {
  name = req.body.name;
  year = req.body.year;
  major = req.body.major;
  sqlRequest = "INSERT INTO 'usertb' (name, year, major) " +
               "VALUES('" + name + "', '" + year + "', '" + major + "')"
  db.run(sqlRequest, function(err) {
    if(err !== null) {
      next(err);
    }
    else {
      res.redirect('back');
    }
  });
});
