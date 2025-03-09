// Place this in your head tag to ensure it loads first
// <script>
//   // Block rendering and create overlay
//   document.documentElement.style.visibility = 'hidden';
//   window.addEventListener('load', function() {
//     document.documentElement.style.visibility = 'visible';
//   });
// </script>

// assets/js/scripts.js
(function() {
    // Create and append the loader immediately when the script runs
    const loaderStyle = document.createElement('style');
    loaderStyle.innerHTML = `
      #page-loader-overlay {
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
        z-index: 10000;
        transition: opacity 0.5s ease-out;
      }
      .loader-spinner {
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
    `;
    document.head.appendChild(loaderStyle);
  
    // Create the loader element
    const loader = document.createElement('div');
    loader.id = 'page-loader-overlay';
    loader.innerHTML = `
      <div class="loader-spinner"></div>
      <div class="loader-text">Loading...</div>
    `;
    
    // Add the loader to the body
    if (document.body) {
      document.body.appendChild(loader);
    } else {
      // If the body isn't available yet, wait for it
      window.addEventListener('DOMContentLoaded', function() {
        document.body.appendChild(loader);
      });
    }
    
    // Track component loading
    let headerLoaded = false;
    let footerLoaded = false;
    
    // Hide loader when everything is ready
    function hideLoader() {
      if (headerLoaded && footerLoaded) {
        const loader = document.getElementById('page-loader-overlay');
        if (loader) {
          loader.style.opacity = '0';
          setTimeout(function() {
            if (loader.parentNode) {
              loader.parentNode.removeChild(loader);
            }
            // Make page visible if it was hidden
            document.documentElement.style.visibility = 'visible';
          }, 500);
        }
      }
    }
    
    // Function to load components after DOM is ready
    function loadComponents() {
      // Load Header
      const headerRequest = new XMLHttpRequest();
      headerRequest.open('GET', '/assets/includes/header.html', true);
      headerRequest.onreadystatechange = function() {
        if (this.readyState === 4) {
          if (this.status === 200) {
            document.body.insertAdjacentHTML('afterbegin', this.responseText);
          } else {
            console.error('Error loading header');
            document.body.insertAdjacentHTML('afterbegin', '<header><h1>Header Loading Failed</h1></header>');
          }
          headerLoaded = true;
          hideLoader();
        }
      };
      headerRequest.send();
      
      // Load Footer
      const footerRequest = new XMLHttpRequest();
      footerRequest.open('GET', '../includes/footer.html', true);
      footerRequest.onreadystatechange = function() {
        if (this.readyState === 4) {
          if (this.status === 200) {
            document.body.insertAdjacentHTML('beforeend', this.responseText);
          } else {
            console.error('Error loading footer');
            document.body.insertAdjacentHTML('beforeend', '<footer><p>Footer Loading Failed</p></footer>');
          }
          footerLoaded = true;
          hideLoader();
        }
      };
      footerRequest.send();
      
      // Fallback - ensure page becomes visible after 5 seconds max
      setTimeout(function() {
        const loader = document.getElementById('page-loader-overlay');
        if (loader && loader.style.opacity !== '0') {
          console.warn('Loader timeout reached, forcing display');
          if (loader) {
            loader.style.opacity = '0';
            setTimeout(function() {
              if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
              }
              document.documentElement.style.visibility = 'visible';
            }, 500);
          }
        }
      }, 5000);
    }
    
    // Once DOM is ready, load components
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadComponents);
    } else {
      loadComponents();
    }
  })();