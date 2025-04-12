    const options = { timeZone: 'America/New_York', hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const newYorkTime = new Date().toLocaleTimeString('en-US', options);
    console.log("Current time in New York:", newYorkTime);



let citiesData = [];  // Final array that will hold all searchable destinations

// Function to load and prepare data from the JSON file
function loadDestinationData() {
  fetch('./travel_recommendation_api.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load destination data');
      }
      return response.json();
    })
    .then(data => {
      // Extract city data from countries
      const countryCities = data.countries.flatMap(country =>
        country.cities.map(city => ({
          ...city,
          category: 'Country',
          parentName: country.name
        }))
      );

      // Add other categories like temples and beaches (if they exist)
      const temples = data.temples?.map(temple => ({
        ...temple,
        category: 'Temple'
      })) || [];

      const beaches = data.beaches?.map(beach => ({
        ...beach,
        category: 'Beach'
      })) || [];

      // Combine all into one array
      citiesData = [...countryCities, ...temples, ...beaches];

      console.log('✅ All destination data loaded:', citiesData);
    })
    .catch(error => {
      console.error('❌ Error loading data:', error.message);
    });
}

// Call the function when the page loads
loadDestinationData();

// Handle search
function executeSearch() {
    const input = document.getElementById('searchInput').value.trim().toLowerCase(); // Get search term
    const cityDisplay = document.getElementById('cityDisplay');
    const resultsContainer = document.getElementById('searchResults');
    
    // Clear previous search results and city details
    resultsContainer.innerHTML = '';
    cityDisplay.innerHTML = '';
    
    // Ensure the user has entered something before proceeding
    if (input === '') {
      cityDisplay.innerHTML = '<p class="paragraph2">Please enter a destination to search.</p>';
      return;
    }
    
    // Filter the citiesData based on the search term
    const matches = citiesData.filter(item =>
      item.name.toLowerCase().includes(input) || item.description.toLowerCase().includes(input)
    );
    
    // If no match is found, show a message
    if (matches.length === 0) {
      resultsContainer.innerHTML = '<p>No matching destinations found.</p>';
      return;
    }
  
    // Display the details of the first match (default) when search is clicked
    const firstMatch = matches[0];
    cityDisplay.innerHTML = `
    <div class="text-content">
    <img src="${firstMatch.imageUrl}" alt="${firstMatch.name}" width="300">
     <div class="text-container">
      <h3>${firstMatch.name}</h3>
      <p>${firstMatch.description}</p>
      <button type="button" id="visit">Visit</button>
     </div>
    </div>
    `;
  }
  


// Show city details when a result is clicked
function showCity(item) {
  const cityDisplay = document.getElementById('cityDisplay');
  cityDisplay.innerHTML = `
    <h2>${item.name}</h2>
    <p><strong>Category:</strong> ${item.category}</p>
    ${item.parentName ? `<p><strong>Country:</strong> ${item.parentName}</p>` : ''}
    <p>${item.description}</p>
    <img src="${item.imageUrl}" alt="${item.name}" width="300">
  `;
}

// Handle reset
function resetSearch() {
  document.getElementById('searchInput').value = '';
  document.getElementById('searchResults').innerHTML = '';
  document.getElementById('cityDisplay').innerHTML = '';
}


document.getElementById("alertButton").addEventListener("click", function(event) {
    event.preventDefault(); // This prevents navigation to recommendation.html
    alert("Coming Soon!");
});