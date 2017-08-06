import axios from 'axios';

export default async function handler(event, context) {
  if (!event.queryStringParameters || !event.queryStringParameters.username) {
    return context.succeed({
      statusCode: 500,
      headers: {
        'Content-Type': 'Content-Type:application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Invalid or No username on Request' }),
    });
  }

  const mediumUsername = event.queryStringParameters.username;

  try {
    const response = await axios.get(`https://medium.com/${mediumUsername}/latest?format=json`);

    const responseData = response.data;
    const escapedJSONString = responseData.replace('])}while(1);</x>', '');
    const parsedJSON = JSON.parse(escapedJSONString);
    const recentPosts = parsedJSON.payload.posts;

    return context.succeed({
      statusCode: 200,
      headers: {
        'Content-Type': 'Content-Type:application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(recentPosts),
    });
  } catch (e) {
    console.error(e);
    console.error(e.meesage);
    return context.succeed({
      statusCode: 500,
      headers: {
        'Content-Type': 'Content-Type:application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(e.message),
    });
  }
}
