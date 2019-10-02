#!/usr/bin/env node
/**
 * Created by mario (https://github.com/hyprstack) on 01/10/2019.
 */
const fs = require('fs');
const util = require('util');
const path = require('path');
const Twitter = require('twitter');
const {isNil} = require('lodash');
const {
  consumer_key,
  consumer_secret,
  access_token_key,
  access_token_secret,
  writeSystem
} = require('./configs.js');

const writeFile = util.promisify(fs.writeFile);

async function getTweets(twitterClient, twitterHandler, numberOfTweets) {
  try {
    const params = {
      q: `to:${twitterHandler}`,
      count: numberOfTweets,
      include_entities: true,
      result_type: 'recent'
    };

    const {statuses: tweets} = await twitterClient.get(`search/tweets.json`, params);
    return tweets.map(tweet => {
      const {
        retweeted_status,
        id_str,
        text,
        in_reply_to_status_id_str
      } = tweet;

      return {
        tweetId: id_str,
        tweetMessage: text,
        isReTweetOf: !isNil(retweeted_status) ? {tweetId: retweeted_status.id_str} : null,
        isResponseTo: !isNil(in_reply_to_status_id_str) ? {tweetId: in_reply_to_status_id_str} : null
      }
    });
  } catch (e) {
    throw e;
  }
}

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

    if (writeSystem === 'file') {
      await writeFile(`${path.join(__dirname, 'tweetMentions.json')}`, Buffer.from(JSON.stringify(tweets, null, 2)));
    }
  } catch (err) {
    console.log('err', err);
    process.exit(1);
  }
}

run();
