// * Google Custom Search JSON API * //
require('dotenv').config();
const axios = require('axios');

async function searchImages(query, numResults = 10) {
    try {
        const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
                key: process.env.GOOGLE_API_KEY,
                cx: process.env.SEARCH_ENGINE_ID,
                q: query,
                searchType: 'image',
                num: numResults,
                start: (offset - 1) * numResults + 1
            }
        });

        const images = response.data.items.map(item => ({
            title: item.title,
            link: item.link,
            snippet: item.snippet
        }));

        return images;
    } catch (err) {
        console.error('Error al realizar la búsqueda de imágenes:', err);
        throw err;
    }
};

module.exports = searchImages;