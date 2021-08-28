const express = require('express'),
      app = express(),
      PORT = process.env.PORT || 3000,
      bodyParser = require('body-parser'),
      path = require('path'),
      AWS = require('aws-sdk'),
      crypto = require('crypto');
      AWS.config.update({region: 'us-east-1', secretAccessKey: 'kMfmiV9eMtr/2QMnSEfI7KSp2OfNTZXiYv6YIJGo', accessKeyId: 'AKIAVH5D53Y5LHFBIZDN'})
      var lexRunTime = new AWS.LexRuntime()


app.use(express.static(path.join(__dirname, 'view')))
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/talkToBot', async (req, res)=>{
  try {
    var lexParams = {
      inputText: req.body.botInput,
      userId: crypto.randomBytes(4).toString('hex'),
      botName: 'help_desk_bot',
      botAlias: 'fit_bot',
      sessionAttributes: {}
    }

    const lexResponse = await lexRunTime.postText(lexParams, (err, data)=>{
      if(err)
        return {message: 'Bot encountered an error while processing your request. Kindly try again or send an email directly to our help team.'}
      else return data
    }).promise()
    res.send(lexResponse.message)
    return
  } catch (error) {
    res.send('Bot encountered an error while processing your request. Kindly try again or send an email directly to our help team.')
  }
})

app.listen(PORT, ()=>{
  console.log(`Listening at http://localhost:${PORT}`)
})