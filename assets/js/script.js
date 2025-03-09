// assets/js/scripts.js

// Self-executing function to add the loader as early as possible
(function() {
    // Create a style element to add CSS for the loader
    const style = document.createElement('style');
    style.textContent = `
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
  
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      body {
        opacity: 0;
        transition: opacity 0.5s ease;
      }
      
      body.content-loaded {
        opacity: 1;
      }
    `;
    
    // Inject the style into the head
    document.head.appendChild(style);
    
    // Create and add the loader div
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
      <div class="loader-circle"></div>
      <div class="loader-text">Loading...</div>
    `;
    
    // Add the loader to the page as soon as the DOM begins to load
    document.addEventListener('DOMContentLoaded', function() {
      document.body.appendChild(loader);
    });
  })();
  
  // Main script executed when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    // Track loading status
    let headerLoaded = false;
    let footerLoaded = false;
    
    // Function to check if everything is loaded
    function checkAllLoaded() {
      if (headerLoaded && footerLoaded) {
        // All components loaded
        setTimeout(() => {
          // Hide loader with smooth fade out
          const loader = document.querySelector('.page-loader');
          if (loader) {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            // Remove loader after transition completes
            setTimeout(() => {
              if (loader && loader.parentNode) {
                loader.parentNode.removeChild(loader);
              }
            }, 500);
          }
          
          // Show body content with fade in
          document.body.classList.add('content-loaded');
        }, 300);
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
        
        if (loader) {
          loader.style.opacity = '0';
          loader.style.visibility = 'hidden';
        }
        
        document.body.classList.add('content-loaded');
      }
    }, 5000); // 5 second maximum loading time
  });