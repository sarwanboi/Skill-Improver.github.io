// Get the user's IP address using a third-party API
fetch('https://api.ipify.org?format=json')
  .then(response => response.json())
  .then(data => {
    const ipAddress = data.ip;

    // Get the user's country using a third-party API
    fetch(`https://ipapi.co/${ipAddress}/country_name/`)
      .then(response => response.text())
      .then(country => {
        // Get the current visit count from Local Storage and increment it
        let visitCount = parseInt(localStorage.getItem('visitCount')) || 0;
        visitCount++;
        
        // Store the new visit count and country in Local Storage
        localStorage.setItem('visitCount', visitCount);
        localStorage.setItem('country', country);

        // Display the visit count and country on the HTML page
        const visitCountSpan = document.getElementById('visitCount');
        const countrySpan = document.getElementById('country');
        visitCountSpan.textContent = visitCount;
        countrySpan.textContent = country;
      })
      .catch(error => console.error(error));
  })
  .catch(error => console.error(error));

  