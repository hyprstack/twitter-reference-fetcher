<!--
  Title: twitter-mentions-fetcher
  Description: Fetches references given a twitter handler, up to 100 latest mentions.
  Author: hyprstack
  -->
# twitter-mentions-fetcher

Fetches references given a twitter handler, up to 100 latest mentions

In order to run this you will need a twitter api key.
To get one please follow ["twitter api key"](https://blog.rapidapi.com/how-to-use-the-twitter-api/#how-to-get-a-twitter-api-key)
You will need to register for a twitter developer account and then create an app.

To run `node index.js <handle> <# of tweets>`

The config file should contain the following:
```javascript 1.8
const configs = {
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: '',
  writeSystem: 'file'
};

module.exports = configs;
```
