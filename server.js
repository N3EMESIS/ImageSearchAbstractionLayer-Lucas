require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const searchTerm = require('./models/searchTerm');

const searchImages = require('./resource/GoogleCustomSearch');

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/searchTerms', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// * Get all search terms from the database * //

app.get('/api/recentsearchs', async (req, res, next) => {
    try {
        const data = await searchTerm.find().exec();
        res.json(data);
    } catch (err) {
        console.error('Error al obtener los términos de búsqueda recientes:', err);
        res.status(500).send('Error al obtener los términos de búsqueda recientes');
    }
});

// * Get call with required and not required params to do a search for an image * //

app.get('/api/imagesearch/:searchVal*', async (req, res, next) => {
    var { searchVal } = req.params;
    var { offset } = req.query;

    try {
        const images = await searchImages(searchVal, 10, offset);

        const newSearchTerm = new searchTerm({
            searchVal,
            searchDate: new Date()
        });
        await newSearchTerm.save();

        res.json(images);
    } catch(err) {
        console.error('Error al guardar en la base de datos:', err);
        res.status(500).send('Error al guardar en la base de datos');
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is Running`);
});