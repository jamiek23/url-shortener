require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { parseURL, shortenURL, expandURL, InvalidURLError, NotFoundError } = require('./lib/shorten-url');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))

function newURL(req, res, failureMessage) {
	parseURL(req.body.url).then(shortenURL).then(({ url, _id }) => {
		res.json({original_url: url, short_url: _id});
	}).catch(err => {
		if(err instanceof InvalidURLError) {
			res.status(400).json({error: failureMessage});
		}
		else {
			console.error(err);
			res.status(500).json({error: 'An error occurred creating the short URL. Please try again or report this bug.'});
		}
	});
}

function getURL(req, res) {
	const { id } = req.params;
	expandURL(id).then(shortenedURL => {
		res.redirect(301, shortenedURL.url);
	}).catch(e => {
		if(e instanceof NotFoundError) {
			return res.status(404).sendFile(`${__dirname}/public/404.html`);
		}
		else {
			console.error(e);
			return res.status(500).json({'error': e});
		}
	});
}

/**
 * Creates a new short URL. This method complies with the FreeCodeCamp spec.
 */
app.post('/api/shorturl/new', (req, res) => {
	newURL(req, res, 'invalid URL');
});

/**
 * Redirects a short URL to it's original one. This method complies with the 
 * FreeCodeCamp spec.
 */
app.get('/api/shorturl/:id', (req, res) => {
	getURL(req, res);
});

/**
 * Creates a new short URL. This version lives a more human-readable path with 
 * a more human-readable message, but is otherwise identical to 
 * /api/shorturl/new.
 */
app.post('/api/new', (req, res) => {
	newURL(req, res, 'An invalid URL was provided. Check that the site exists and try again.');
});

/**
 * Redirects a short URL to it's original one. Other than the path, it is
 * identical /api/shorturl/:id.
 */
app.get('/:id', (req, res) => {
	getURL(req, res);
});

app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/public/index.html`);
});

app.use((req, res, next) => {
	res.status(404).sendFile(`${__dirname}/public/404.html`);
})

const listener = app.listen(process.env.PORT || 3000, () => {
	console.log(`Your app is listening on ${listener.address().address}:${listener.address().port}`);
});
