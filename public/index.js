document.addEventListener('DOMContentLoaded', () => {
    const urlForm = document.getElementById('url-form');

    const showNotification = function(type, message) {
        const result = document.createElement('div');
        const messageNode = document.createTextNode(message);
        result.className = `notification mt-4 is-${type}`;
        result.innerHTML = `
            <button class="delete"></button>
            <h3 class="is-size-4 has-text-weight-semibold">${type === 'success' ? 'Success' : 'Oops'}</h3>
            ${message}
        `;
        urlForm.after(result);
        result.addEventListener('click', () => {
            result.parentNode.removeChild(result);
        });
    };

    urlForm.addEventListener('submit', e => {
        e.preventDefault();
        const formdata = new FormData(e.target);
        fetch('/api/new', {
            method: 'POST',
            body: `url=${formdata.get('url')}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        .then(res => res.json())
        .then(res => {
            if(res.error) {
                showNotification('danger', res.error);
            }
            else {
                showNotification('success', `A new short URL was created for ${res.original_url} at
                <a href="/${res.short_url}">${res.short_url}</a>.`);
            }
        }).catch(err => {
            showNotification('danger', 'Sorry, an error occurred. This is likely a bug.');
        });
    });
});