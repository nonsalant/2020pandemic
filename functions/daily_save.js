// https://kentcdodds.com/blog/super-simple-start-to-serverless
// runs @ https://stefanmatei.com/.netlify/functions/randid (125K free req/month)

exports.handler = async event => {
  const prefix = event.queryStringParameters.prefix || 'randid'
  const rando = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 3)
                +'-'+Math.floor(Math.random() * 999);
  return {
    statusCode: 200,
    body: `${prefix}-${rando}`,
  }
}

/**
PHP implementation:
echo 'randid-'.chr(rand(97,122)).chr(rand(97,122)).chr(rand(97,122)).'-'.rand(0,999);

test @ http://www.writephponline.com/
run  @ https://vileworks.com/functions/randid
**/
