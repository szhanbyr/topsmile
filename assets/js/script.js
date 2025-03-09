
(function() {
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
          document.documentElement.style.visibility = 'visible';
          // Clean up the initial style
          const loaderStyle = document.getElementById('loader-style');
          if (loaderStyle && loaderStyle.parentNode) {
            loaderStyle.parentNode.removeChild(loaderStyle);
          }
        }, 500);
      }
    }
  }

  // Function to load components
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

    // Fallback timeout
    setTimeout(function() {
      const loader = document.getElementById('page-loader-overlay');
      if (loader && loader.style.opacity !== '0') {
        console.warn('Loader timeout reached, forcing display');
        loader.style.opacity = '0';
        setTimeout(function() {
          if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
          }
          document.documentElement.style.visibility = 'visible';
        }, 500);
      }
    }, 5000);
  }

  // Start loading components when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadComponents);
  } else {
    loadComponents();
  }
})();