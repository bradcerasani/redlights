var $ = require('jquery');
var express = require('express');
var request = require('request');
var app = express();
var HueApi = require("node-hue-api").HueApi;

var host = "192.168.100.122",
    username = "3ad334849f9efa2274b278f14d2977f",
    api = new HueApi(host, username);

app.listen(3000);

// Routes

app.get('/', function(req, res){
  res.send('hello world');
  resetLights();
});

app.get('/goal', function(req, res) {
  res.send('Goal!');
  celebrate();
})

function celebrate() {
  api.setGroupLightState(0, {
    "on": true,
    "bri": 255,
    "sat": 255,
    "hue": 0,
    "alert": "lselect",
    "transitiontime": 0
  })
}

resetLights();

function off() {
  api.setGroupLightState(0, {
    "on":true,
    "bri": 255,
    "hue": 30000,
    "sat": 255,
    "transitiontime": 2
  });
}

function resetLights() {
  api.setGroupLightState(0, {
    "on":true,
    "bri": 255,
    "hue": 15000,
    "effect": "none",
    "sat": 125,
    "transitiontime": 1
  })
  .done(console.log("lights are reset"));
}

// GCSB.load({"gid":2013030221,"bc":["US","CA"],"gf":2,"p":2,"sr":392,"cr":false,"a":{"id":3,"ab":"NYR","oi":[13,62,8,30,27,19],"pa":[{"g":2,"s":13},{"g":0,"s":2}],"tot":{"g":2,"s":15}},"h":{"id":5,"ab":"PIT","oi":[29,36,58,3,71,18],"pa":[{"g":0,"s":8},{"g":1,"s":12}],"tot":{"g":1,"s":20}},"le":{"id":292,"p":2,"sip":808,"type":516,"dc":1709,"desc":"2/13:28 - Stoppage (Video Review)"},"tvto":false})


var all = "http://live.nhle.com/GameData/RegularSeasonScoreboardv3.jsonp";
var url = "http://live.nhle.com/GameData/20132014/2013030221/gc/gcsb.jsonp";

var count = 0;
function checkScore() {
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var start = body.indexOf('GCSB.load(');
      var obj = body.slice(start + 10, -1);
      var home, away;
      console.log(body);
      obj = JSON.parse(obj);

      var home = obj.h.tot.g;
      var away = obj.a.tot.g;
      if (home === 2 && away === 3) {
        count++
        console.log("Checked " + count + " times.");
      } else {
        celebrate();
        console.log("Goal!!!");
      }
    }
  });
}

checkScore();

setInterval(checkScore,6000);
