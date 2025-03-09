// assets/js/scripts.js

// Immediately create and add the loader before DOMContentLoaded
(function() {
    // Add loader HTML and styles to prevent FOUC (Flash of Unstyled Content)
    const loaderHTML = `
        <div class="page-loader" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #ffffff; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 9999;">
            <div class="loader-circle" style="width: 40px; height: 40px; border: 3px solid #f3f3f3; border-top: 3px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <div class="loader-text" style="margin-top: 15px; font-family: Arial, sans-serif; color: #333; font-size: 16px;">Loading...</div>
        </div>
        <style>
            body { opacity: 0; }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    // We need to insert this as early as possible, before any HTML renders
    document.addEventListener('DOMContentLoaded', function() {
        document.body.style.opacity = '1';
    });
    
    // Add loader immediately
    document.write(loaderHTML);
})();

document.addEventListener('DOMContentLoaded', function() {
    // Add full CSS styles
    const styles = document.createElement('style');
    styles.textContent = `
        body {
            margin: 0;
            overflow-x: hidden;
            transition: opacity 0.3s ease;
        }

        .page-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s ease-out, visibility 0.5s ease-out;
        }

        .loader-circle {
            width: 40px;
            height: 40px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        .loader-text {
            margin-top: 15px;
            font-family: Arial, sans-serif;
            color: #333;
            font-size: 16px;
        }

        .page-content {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styles);
    
    // Create content wrapper for animation
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'page-content';
    
    // Move all existing body content (except loader) into the wrapper
    Array.from(document.body.children).forEach(child => {
        if (!child.classList || !child.classList.contains('page-loader')) {
            contentWrapper.appendChild(child);
        }
    });
    document.body.appendChild(contentWrapper);
    
    // Track loading status
    let headerLoaded = false;
    let footerLoaded = false;
    
    // Function to check if everything is loaded
    function checkAllLoaded() {
        if (headerLoaded && footerLoaded) {
            // All components loaded, hide the loader
            setTimeout(() => {
                const loader = document.querySelector('.page-loader');
                const content = document.querySelector('.page-content');
                
                // Hide loader
                if (loader) {
                    loader.style.opacity = '0';
                    loader.style.visibility = 'hidden';
                }
                
                // Show content
                if (content) {
                    content.style.opacity = '1';
                    content.style.transform = 'translateY(0)';
                }
            }, 500); // Short delay to ensure everything is rendered
        }
    }
    
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
            headerLoaded = true;
            checkAllLoaded();
        })
        .catch(error => {
            console.error('Error loading header:', error);
            // Fallback: Add a placeholder header
            document.body.insertAdjacentHTML('afterbegin', '<header><h1>Header Loading Failed</h1></header>');
            headerLoaded = true;
            checkAllLoaded();
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
            footerLoaded = true;
            checkAllLoaded();
        })
        .catch(error => {
            console.error('Error loading footer:', error);
            // Fallback: Add a placeholder footer
            document.body.insertAdjacentHTML('beforeend', '<footer><p>Footer Loading Failed</p></footer>');
            footerLoaded = true;
            checkAllLoaded();
        });
        
    // Fallback in case something goes wrong
    setTimeout(() => {
        const loader = document.querySelector('.page-loader');
        if (loader && loader.style.visibility !== 'hidden') {
            console.warn('Loader timeout reached, forcing page to display');
            const content = document.querySelector('.page-content');
            
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            
            if (content) {
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }
        }
    }, 5000); // 5 second maximum loading time
});