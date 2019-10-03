/**
 * Created by mario (https://github.com/hyprstack) on 03/10/2019.
 */
const {isNil} = require('lodash');

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

module.exports = {
  getTweets
};
