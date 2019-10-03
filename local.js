#!/usr/bin/env node
/**
 * Created by mario (https://github.com/hyprstack) on 03/10/2019.
 */
const fs = require('fs');
const util = require('util');
const path = require('path');
const Twitter = require('twitter');
const {getTweets} = require('./tweet-fetcher');
const {
  consumer_key,
  consumer_secret,
  access_token_key,
  access_token_secret
} = require('./configs.js');

const writeFile = util.promisify(fs.writeFile);

async function run() {
  try {
    const twitterClient = new Twitter({
      consumer_key,
      consumer_secret,
      access_token_key,
      access_token_secret
    });
    const twitterHandler = process.argv[2];
    const numberOfTweets = process.argv[3] <= 100 ? process.argv[3] : 50;

    const tweets = await getTweets(twitterClient, twitterHandler, numberOfTweets);

    await writeFile(`${path.join(__dirname, 'tweetMentions.json')}`, Buffer.from(JSON.stringify(tweets, null, 2)));
  } catch (err) {
    console.log('err', err);
    process.exit(1);
  }
}

run();
