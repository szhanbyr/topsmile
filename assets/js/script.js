// assets/js/scripts.js
document.addEventListener('DOMContentLoaded', function() {
    // Load Header
    fetch('/assets/includes/header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
        })
        .catch(error => {
            console.error('Error loading header:', error);
            // Fallback: Add a placeholder header
            document.body.insertAdjacentHTML('afterbegin', '<header><h1>Header Loading Failed</h1></header>');
        });

    // Load Footer
    fetch('../includes/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
        })
        .catch(error => {
            console.error('Error loading footer:', error);
            // Fallback: Add a placeholder footer
            document.body.insertAdjacentHTML('beforeend', '<footer><p>Footer Loading Failed</p></footer>');
        });
});

