var Botkit = require('botkit'),
  BeepBoop = require('beepboop-botkit'),
  fs = require('fs'),
  schedule = require('node-schedule'),
  request = require('request');

var controller = Botkit.slackbot();
var beepboop = BeepBoop.start(controller);

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
beepboop.on('botkit.rtm.started', function(bot, resource, meta) {
  var j = schedule.scheduleJob('0 0 21 * * 1-5', function() {
    console.log('node-schedule activated');
    request('http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=cats', function(error, response, body) {
      if (!error && response.statusCode == 200) {
        // parse response and store image url
        var catObj = JSON.parse(body);
        var catGif = catObj.data.image_url;

        bot.api.chat.postMessage({
          channel: resource.SlackIncomingWebhookChannel,
          text: "Here is your daily cat gif meow:\n" + catGif,
          username: 'Random Cat'
        }, function(err, res) {
          if (err) {
            throw new Error('Could not postMessage to #general');
          }
        });

        console.log("Here is your daily cat gif meow: " + catGif + "!");
      }
    });
  });
});
