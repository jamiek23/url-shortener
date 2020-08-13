/**
 * Custom error class that others extend from. All this does is make sure the
 * `name` attributes matches the constructing class name.
 */
class ShortenURLError extends Error {
    constructor(msg) {
        super(msg);
        this.name = this.constructor.name;    
    }
}

/**
 * Thrown when a specified URL is invalid. This could be because it is
 * incorrectly formatted, or does not have A/AAAA RRs.
 */
class InvalidURLError extends ShortenURLError {}

/**
 * Thrown when a short URL specified does not exist.
 */
class NotFoundError extends ShortenURLError {}