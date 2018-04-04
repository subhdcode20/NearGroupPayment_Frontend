const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios')
const cors = require('cors')

const app = express();

// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/json' }));
// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/html' }));
// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));

//enable cors
app.use(cors())

var MolUrlJava = "https://d06651ce.ngrok.io/NG/molPaymentSend"

// app.post('/data/signin', (req, res) => {
//     fs.readFile(path.join(__dirname, '../example/public/data/signin.json'), 'utf8', function(error, content) {
//         var json = JSON.parse(content);
//         res.end(JSON.stringify(json));
//     });
// });

app.post('/molpaymentrequest', function(req, res) {
  let body = req.body
  console.log("body= ", body);
  // res.status(200).send("hello")

  axios.post(MolUrlJava,
    body,
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )
  .then((response) => {
    console.log('mol response = ', response.data);
    // if(response.status == 200) {
      // console.log('mol response success');
      // let {paymentUrl} = response.data
      // that.setState({paymentUrl: paymentUrl}, () => {
      //   console.log('paymentUrl set=', this.state.paymentUrl);
      // })
      res.header("Access-Control-Allow-Origin", "*");
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.status(200).send(response.data);
    // } else {
    //   console.log('mol response error');
    // }
  })
  .catch(e => {
    console.log('mol payment request error ', e);
    throw Error(e)
    res.status(500).json({"error": e})
  })


  // res.header("Access-Control-Allow-Origin", "*");
  // res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // console.log('res:: ', res);
  // res.status(200).send("success");

})

app.get('/getFriends', (req, res) => {
    let json;
    if(req.query.id == 1) {
        json = {
            "friends": [
                {
                    "name": "Rohit",
                    "channelId": "1497165653730393",
                    "imageUrl": "1497165653730393",
                    "meetingId": "39917041"
                },
                {
                    "name": "Dev",
                    "channelId": "app123464761549791",
                    "imageUrl": "app123464761549791",
                    "meetingId": "39917040"
                }
            ],
            "me": {
                "name": "Manas",
                "channelId": "1633552226682996",
                "imageUrl": "1633552226682996"
            }
        }
    } else if(req.query.id == 2) {
        json = {
            "friends": [
                {
                    "name": "Dev",
                    "channelId": "app123464761549791",
                    "imageUrl": "app123464761549791",
                    "meetingId": "39917045"
                },
                {
                    "name": "Manas",
                    "channelId": "1633552226682996",
                    "imageUrl": "1633552226682996",
                    "meetingId": "39917041"
                }
            ],
            "me": {
                "name": "Rohit",
                "channelId": "1497165653730393",
                "imageUrl": "1497165653730393"
            }
        }
    } else if(req.query.id == 3) {
        json = {
            "friends": [
                {
                    "name": "Rohit",
                    "channelId": "1497165653730393",
                    "imageUrl": "1497165653730393",
                    "meetingId": "39917045"
                },
                {
                    "name": "Manas",
                    "channelId": "1633552226682996",
                    "imageUrl": "1633552226682996",
                    "meetingId": "39917040"
                }
            ],
            "me": {
                "name": "Dev",
                "channelId": "app123464761549791",
                "imageUrl": "app123464761549791"
            }
        }
    }
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.end(JSON.stringify(json));
});



app.use(express.static(path.join(__dirname, '../example/public')));
app.use(express.static(path.join(__dirname, '../dist')));


app.listen(8081, '0.0.0.0', err => {
    if (err) {
        console.warn(err);
        return;
    }
    console.info('http://localhost:8081');
});
