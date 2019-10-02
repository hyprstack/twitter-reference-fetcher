#!/usr/bin/env node
/**
 * Created by mario (https://github.com/hyprstack) on 01/10/2019.
 */
const Twitter = require('twitter');
const {isNil} = require('lodash');
const {
  consumer_key,
  consumer_secret,
  access_token_key,
  access_token_secret
} = require('./configs.js');

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
    console.log(tweets.length)
    console.log(JSON.stringify(tweets, null, 2));
  } catch (err) {
    console.log('err', err);
    process.exit(1);
  }
}

run();
