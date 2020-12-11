const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const  mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { nanoid } = require('nanoid');

const PORT = process.env.PORT || 4040;
const MONGO_URI = 'mongodb://localhost:27017/url_shortner';

const app = express();
mongoose.connect(MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true }).then(x => console.log('Connection to db successful'));
const URL_SCHEMA = new mongoose.Schema({fullUrl: String, shortUrl: String}, {collection: "Url_DATA" });
const URL_MODEL = new mongoose.model('Url_Model', URL_SCHEMA);

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('public/index.html');
});

app.get('/:id', async (req, res) => {
    console.log(`searching for ${req.params.id}`);
    try{
        const result = await URL_MODEL.findOne({shortUrl: req.params.id});
        if (result) {
            // res.send({data: result, msg: 'Data Found'});
            res.redirect(result.fullUrl);
        } else {
            res.send({data: null, msg: 'No Such Url Exists'});
        }
    } catch (e) {
        res.send({data: null, msg: 'Server Error', error: e});
    }
});

app.post('/url', async (req, res) => {
    const shortUrl = nanoid(8);
    console.log(req.body.fullUrl, shortUrl);
    try{
        const result = await URL_MODEL.findOne({fullUrl: req.body.fullUrl});
        if (result) {
            res.send({data: result, msg: 'Inserted Successfully'});
        } else {
            try{
                const result = await URL_MODEL.create({fullUrl: req.body.fullUrl, shortUrl: shortUrl});
                if (result) {
                    res.send({data: result, msg: 'Inserted Successfully'});
                } else {
                    res.send({data: null, msg: 'Insertion Error'});
                }
            } catch (e) {
                res.send({data: null, msg: 'Server Error', error: e});
            }
        }
    } catch (e) {
        res.send({data: null, msg: 'Server Error', error: e});
    }
});

app.listen(PORT, () => {
    console.log(`App running on ${PORT}`);
});
