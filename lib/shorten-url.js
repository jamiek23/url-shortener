const { nanoid } = require('nanoid');
const { resolve } = require('dns').promises;
const mongoose = require('mongoose');
const { Schema } = mongoose;

const { InvalidURLError, NotFoundError } = require('./errors');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

const ShortURLSchema = new Schema({
	_id: String,
	url: { type: String, required: true, unique: true, index: true },
	created: Date
});

const ShortURL = mongoose.model('ShortURL', ShortURLSchema);

function tryNewURL(url) {
	try {
		return new URL(url);
	}
	catch {
		return null;
	}
}

async function parseURL(url) {
	const myurl = tryNewURL(url);
	if(!myurl) {
		throw new InvalidURLError('URL is not in a valid format');
	}
	const queries = await Promise.allSettled([
		resolve(myurl.hostname, 'A'),
		resolve(myurl.hostname, 'AAAA')
	]);
	if(queries.filter(query => query.status === 'fulfilled').length < 1) {
		throw new InvalidURLError('Hostname does not have A or AAAA RRs');
	}
	return myurl;
}

async function shortenURL(url) {
	const dbRecord = await ShortURL.findOne({ url });
	if(dbRecord) {
		return dbRecord;
	}
	const _id = nanoid(12);
	const shortenedURL = await ShortURL.create({ _id, url, created: new Date()});
	return shortenedURL;
}

async function expandURL(id) {
	const shortenedURL = await ShortURL.findById(id);
	if(!shortenedURL) {
		throw new NotFoundError('URL not found');
	}
	return shortenedURL;
}

module.exports = { parseURL, shortenURL, expandURL, InvalidURLError, NotFoundError };