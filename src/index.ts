import express from 'express'

// ES2015 modules or TypeScript
import * as line from '@line/bot-sdk';

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN as string,
  channelSecret: process.env.CHANNEL_SECRET as string,
};
const app: express.Express = express()
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

const client = new line.Client(config);
function handleEvent(event: line.WebhookEvent) {
  if (event.type === 'postback') {

    console.log(`PostBack:${event.postback.data} User:${event.source.userId} params:${event.postback.params}`);
    if ((event.postback.params as any).action === 'yoyakusuru') {
      return client.replyMessage(event.replyToken, {
        type: 'flex',
        altText: "yoyaku",
        contents: {
          "type": "carousel",
          "contents": [
            {
              "type": "bubble",
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "指名なし"
                  }
                ]
              },
              "footer": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "button",
                    "action": {
                      "type": "postback",
                      "label": "OK",
                      "data": "parson=none"
                    }
                  }
                ]
              },
              "styles": {
                "header": {
                  "separator": false
                }
              }
            },
            {
              "type": "bubble",
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "Aさん"
                  }
                ]
              },
              "footer": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "button",
                    "action": {
                      "type": "postback",
                      "label": "OK",
                      "data": "parson=A"
                    }
                  }
                ]
              }
            }
          ]
        }
      });
    }

    if (event.postback.params) {

    }
  }
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  console.log(`user:${event.source.userId} message:${event.message.text}`);

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: `user:${event.source.userId} message:${event.message.text} らしいよ`
  });
}

console.log("Start!!!");
app.listen(3000);
