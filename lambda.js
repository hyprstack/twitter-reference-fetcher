/**
 * Created by mario (https://github.com/hyprstack) on 01/10/2019.
 */
const {DynamoDB} = require('aws-sdk');
const uuid = require('uuidv4').default;
const {getTweets} = require('./tweet-fetcher');

async function uploadToDynamo(tableName, dataRow) {
  const {tweetId} = dataRow;
  try {
    const now = new Date().toISOString();
    const item = {
      id: uuid(),
      createdAt: now,
      ...dataRow
    };

    const params = {
      TableName: tableName,
      Item: item
    };

    const dynamodb = new DynamoDB.DocumentClient();

    return dynamodb.put(params).promise();
  } catch (err) {
    console.log(`Error uploading tweet #${tweetId} to dynamoDb`);
    throw err;
  }
}

async function handler(event, context) {
  try {
    console.log(JSON.stringify(event, null, 2));
    const {
      twitter_consumer_key,
      twitter_consumer_secret,
      twitter_access_token_key,
      twitter_access_token_secret,
      target_twitter_handler,
      number_of_tweets,
      table_name
    } = event;

    const twitterClient = new Twitter({
      consumer_key: twitter_consumer_key,
      consumer_secret: twitter_consumer_secret,
      access_token_key: twitter_access_token_key,
      access_token_secret: twitter_access_token_secret
    });

    const twitterHandler = target_twitter_handler;
    const numberOfTweets = number_of_tweets <= 100 ? number_of_tweets : 50;

    const tweets = await getTweets(twitterClient, twitterHandler, numberOfTweets);

    const promisesToResolve = tweets.map((dataRow) => {
      return uploadToDynamo(table_name, dataRow);
    });

    await Promise.all(promisesToResolve);

    return context.done()
  } catch (e) {
    throw e;
  }
}

exports.tweetHandler = handler;
