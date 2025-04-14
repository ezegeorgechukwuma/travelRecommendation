
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
          category: 'countries',
          parentName: country.name
        }))
      );

      // Add other categories like temples and beaches (if they exist)
      const temples = data.temples?.map(temple => ({
        ...temple,
        category: 'temples'
      })) || [];

      const beaches = data.beaches?.map(beach => ({
        ...beach,
        category: 'beaches'
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
  const input = document.getElementById('searchInput').value.trim().toLowerCase();
  const cityDisplay = document.getElementById('cityDisplay');
  const resultsContainer = document.getElementById('searchResults');

  // Clear previous results
  resultsContainer.innerHTML = '';
  cityDisplay.innerHTML = '';

  if (input === '') {
    cityDisplay.innerHTML = '<p class="paragraph2">Please enter a destination to search.</p>';
    return;
  }

  // Handle category-based search
const validCategories = ['beaches', 'temples', 'countries'];

if (validCategories.includes(input)) {
  const categoryResults = citiesData
    .filter(item => item.category?.toLowerCase() === input)
    .slice(0, 2);

  if (categoryResults.length === 0) {
    resultsContainer.innerHTML = `<p>No ${input} found.</p>`;
    return;
  }

  categoryResults.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('text-content');
    card.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}" width="300">
      <div class="text-container">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <button type="button" id="visit">Visit</button>
      </div>
    `;
    resultsContainer.appendChild(card);
  });

  return;
}


  // Normal search for specific destination
  const matches = citiesData.filter(item =>
    item.name.toLowerCase().includes(input) || item.description.toLowerCase().includes(input)
  );

  if (matches.length === 0) {
    resultsContainer.innerHTML = '<p>No matching destinations found.</p>';
    return;
  }

  // Show first match
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