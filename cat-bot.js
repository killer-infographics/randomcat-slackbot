var Botkit = require('botkit'),
    BeepBoop = require('beepboop-botkit'),
    fs = require('fs'),
    schedule = require('node-schedule'),
    request = require('request');

// var scriptDir = __dirname; // current directory of node app

// check if token var is present in run command
// if (!process.env.token) {
//   console.log('Error: Specify token in environment');
//   process.exit(1);
// }

var controller = Botkit.slackbot({
  debug: true
});
var beepboop = BeepBoop.start(controller);

// connect the bot to a stream of messages
// var bot = controller.spawn({
//   token: process.env.SLACK_TOKEN,
//   incoming_webhook: {
//     url: 'https://hooks.slack.com/services/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'
//   }
// });

// bot.startRTM(function(err, bot, payload) {
//   if (err) {
//     throw new Error('Could not connect to Slack');
//   }
// });

// respond with a gif when users dm bot
controller.on('direct_message', function(bot, message) {
  request('http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=cats', function(error, response, body) {
    if (!error && response.statusCode == 200) {
      // parse response and store image url
      var catObj = JSON.parse(body);
      var catGif = catObj.data.image_url;

      // send image to room
      bot.reply(message, "Here is your random cat gif meow:\n" + catGif);
      console.log("Here is your random cat gif meow: " + catGif + "!");
    } else {
      console.log(error);
    }
  });
});

// respond with a message when users mention bot
controller.on('direct_mention,mention', function(bot, message) {
  bot.reply(message, "You found meow! I post a random gif to #cat-gifs once a day meow! If you PM me I'll show you a trick!");
});

// post the gif once a day
var j = schedule.scheduleJob('1 1 15 * * 1-5', function() {
  console.log('node-schedule activated');
  request('http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=cats', function(error, response, body) {
    if (!error && response.statusCode == 200) {
      // parse response and store image url
      var catObj = JSON.parse(body);
      var catGif = catObj.data.image_url;

      // send image to room
      bot.sendWebhook({
        text: "Here is your daily cat gif meow:\n" + catGif,
        channel: '#cat-gifs'
      });

      console.log("Here is your daily cat gif meow: " + catGif + "!");
    }
  });
});
