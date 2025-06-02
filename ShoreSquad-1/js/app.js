// filepath: /ShoreSquad/ShoreSquad/js/app.js
// ShoreSquad App JS

document.addEventListener('DOMContentLoaded', () => {
  // Initialize map
  initializeMap();
  
  // Load Weather Data
  loadWeatherData();
  
  // Load Team Members
  loadTeamMembers();
  
  // Initialize Join Button
  initializeJoinButton();
  
  // Initialize Add Member Form
  initializeAddMemberForm();
});

// Map Functionality
function initializeMap() {
  const mapContainer = document.getElementById('mapContainer');
  if (!mapContainer) {
    console.error('Map container element not found');
    return;
  }
  const mapboxToken = 'pk.eyJ1Ijoic2hvcmVzcXVhZCIsImEiOiJjbGxqNXJ1bjQwMXB5M2VudWk4ZHI5dDN4In0.Ns8zGS08M8V9HTqaXFS1mQ';
  
  if (typeof mapboxgl === 'undefined') {
    console.error('Mapbox GL JS is not loaded');
    mapContainer.innerHTML = `
      <div style="padding: 2rem; text-align: center; background: rgba(244, 67, 54, 0.1); border-radius: 8px;">
        <p>⚠️ Unable to load the map. Please check your internet connection.</p>
      </div>
    `;
    return;
  }

  try {
    if (!mapboxToken || mapboxToken.includes('YOUR_MAPBOX_ACCESS_TOKEN')) {
      throw new Error('Invalid Mapbox access token. Please replace with a valid token from https://account.mapbox.com/');
    }

    mapboxgl.accessToken = mapboxToken;
    
    // Show loading state
    mapContainer.innerHTML = `
      <div style="padding: 2rem; text-align: center;">
        <p>Loading map...</p>
      </div>
    `;

    const map = new mapboxgl.Map({
      container: 'mapContainer',
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [103.8198, 1.3521],
      zoom: 11,
      maxBounds: [
        [103.6, 1.2],
        [104.0, 1.5]
      ],
      failIfMajorPerformanceCaveat: true
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    const locations = [
      { coords: [103.8198, 1.3521], name: 'East Coast Beach Cleanup', time: 'Sunday, 10 AM' },
      { coords: [103.7500, 1.3960], name: 'Changi Beach Cleanup', time: 'Saturday, 9 AM' },
      { coords: [103.9089, 1.3947], name: 'Pasir Ris Beach Cleanup', time: 'Sunday, 8 AM' }
    ];

    map.on('load', () => {
      locations.forEach(loc => {
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div style="padding: 0.5rem;">
              <strong>${loc.name}</strong><br>
              <span style="color: #2196F3;">Next cleanup: ${loc.time}</span>
            </div>
          `);

        new mapboxgl.Marker({ color: '#FF7043' })
          .setLngLat(loc.coords)
          .setPopup(popup)
          .addTo(map);
      });
    });

    map.on('error', () => {
      console.error('Map loading error');
      mapContainer.innerHTML = `
        <div style="padding: 2rem; text-align: center; background: rgba(244, 67, 54, 0.1); border-radius: 8px;">
          <p>⚠️ Unable to load the map. Please try again later.</p>
        </div>
      `;
    });
  } catch (error) {
    console.error('Map initialization error:', error);
    mapContainer.innerHTML = `
      <div style="padding: 2rem; text-align: center; background: rgba(244, 67, 54, 0.1); border-radius: 8px;">
        <p>⚠️ Unable to load the map. Please try again later.</p>
      </div>
    `;
  }
}

// Weather Functionality
async function loadWeatherData() {
  const weatherInfo = document.getElementById('weatherInfo');
  try {
    const iconsResponse = await fetch('weather-icons.json');
    const iconsData = await iconsResponse.json();
    
    const weatherResponse = await fetch('https://wttr.in/Singapore?format=j1');
    const weatherData = await weatherResponse.json();
    
    if (weatherData.current_condition && weatherData.weather) {
      const current = weatherData.current_condition[0];
      const forecast = weatherData.weather;
      
      const currentWeatherType = getWeatherType(current.weatherDesc[0].value.toLowerCase());
      const currentWeatherIcon = iconsData.weather_icons[currentWeatherType] || iconsData.weather_icons.default;
      
      const html = `
        <div style="display:flex;flex-direction:column;gap:1rem;">
          <div style="display:flex;align-items:center;gap:1rem;padding:1.5rem;background:rgba(33,150,243,0.1);border-radius:8px;">
            <div style="text-align:center;">
              <img src="${currentWeatherIcon.icon}" 
                   alt="${currentWeatherIcon.description}" 
                   style="width:80px;height:80px;">
            </div>
            <div>
              <h4 style="margin:0;font-size:1.5rem;">${current.temp_C}°C</h4>
              <p style="margin:0.5rem 0;text-transform:capitalize;font-size:1.1rem;">${current.weatherDesc[0].value}</p>
              <small>
                Humidity: ${current.humidity}% | 
                Wind: ${current.windspeedKmph} km/h
              </small>
            </div>
          </div>
          
          <div style="overflow-x:auto;">
            <div style="display:flex;gap:1rem;padding:0.5rem;min-width:min-content;">
              ${forecast.map(day => {
                const weatherType = getWeatherType(day.hourly[4].weatherDesc[0].value.toLowerCase());
                const weatherIcon = iconsData.weather_icons[weatherType] || iconsData.weather_icons.default;
                const date = new Date(day.date);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                
                return `
                  <div style="min-width:120px;text-align:center;padding:1rem;background:rgba(33,150,243,0.05);border-radius:8px;transition:transform 0.2s;">
                    <div style="font-weight:bold;margin-bottom:0.5rem;color:#2196F3">${dayName}</div>
                    <div style="font-size:0.9rem;color:#666;margin-bottom:0.5rem">${monthDay}</div>
                    <img src="${weatherIcon.icon}" 
                         alt="${weatherIcon.description}" 
                         style="width:50px;height:50px;margin:0.5rem 0;">
                    <div style="margin-top:0.5rem;">
                      <div style="font-weight:bold;">
                        <span style="color:#FF7043">${Math.round(day.maxtempC)}°</span>
                        <span style="color:#666">/</span>
                        <span style="color:#2196F3">${Math.round(day.mintempC)}°</span>
                      </div>
                      <small style="color:#666;display:block;margin-top:0.5rem;font-size:0.8rem;">
                        ${day.hourly[4].weatherDesc[0].value}<br>
                        Chance of Rain: ${day.hourly[4].chanceofrain}%
                      </small>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      `;
      weatherInfo.innerHTML = html;
    }
  } catch (error) {
    weatherInfo.innerHTML = `
      <div style="padding:1rem;background:rgba(33,150,243,0.1);border-radius:8px;text-align:center;">
        <p style="margin:0;">🌡️ Weather data temporarily unavailable</p>
        <small>Check back in a few minutes</small>
      </div>
    `;
    console.error('Weather API Error:', error);
  }
}

// Helper function to determine weather type
function getWeatherType(description) {
  if (description.includes('sun') || description.includes('clear') && !description.includes('night')) {
    return 'sunny';
  } else if (description.includes('cloud') && description.includes('part')) {
    return 'partly_cloudy';
  } else if (description.includes('cloud')) {
    return 'cloudy';
  } else if (description.includes('rain') || description.includes('drizzle')) {
    return 'rain';
  } else if (description.includes('thunder')) {
    return 'thunderstorm';
  } else if (description.includes('mist') || description.includes('fog')) {
    return 'mist';
  } else if (description.includes('clear') && description.includes('night')) {
    return 'night_clear';
  }
  return 'default';
}

// Team Members Functionality
let teamMembers = [];

async function loadTeamMembers() {
  const crewList = document.getElementById('crewList');
  try {
    const response = await fetch('team.json');
    teamMembers = await response.json();
    renderTeamMembers();
  } catch (error) {
    crewList.innerHTML = '<p>Unable to load team members. Please try again later.</p>';
  }
}

function renderTeamMembers() {
  const crewList = document.getElementById('crewList');
  crewList.innerHTML = teamMembers.map(member => `
    <div class="crew-member" style="display:flex;align-items:center;margin-bottom:1.5rem;gap:1rem;">
      <img src="${member.avatar}" 
           alt="${member.name}" 
           style="width:64px;height:64px;border-radius:50%;object-fit:cover;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
      <div>
        <h4 style="margin:0;">${member.name}</h4>
        <p style="margin:0.25rem 0;color:#2196F3;">${member.role}</p>
        <small style="color:#666;">${member.bio}</small>
      </div>
    </div>
  `).join('');
}

function initializeAddMemberForm() {
  const addMemberBtn = document.getElementById('addCrewMemberBtn');
  const modal = document.getElementById('addMemberModal');
  const closeBtn = modal.querySelector('.close-modal');
  const cancelBtn = modal.querySelector('.cancel-add');
  const form = document.getElementById('addMemberForm');

  addMemberBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  const avatarSelector = document.getElementById('avatarSelector');
  const avatarInput = document.getElementById('memberAvatar');
  
  avatarInput.value = avatarSelector.querySelector('.selected').dataset.avatar;
  
  avatarSelector.addEventListener('click', (e) => {
    const avatarOption = e.target.closest('.avatar-option');
    if (avatarOption) {
      avatarSelector.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
      avatarOption.classList.add('selected');
      avatarInput.value = avatarOption.dataset.avatar;
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newMember = {
      name: document.getElementById('memberName').value,
      role: document.getElementById('memberRole').value,
      bio: document.getElementById('memberBio').value,
      avatar: document.getElementById('memberAvatar').value
    };

    try {
      teamMembers.push(newMember);
      renderTeamMembers();
      modal.style.display = 'none';
      form.reset();

      const successMessage = document.createElement('div');
      successMessage.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background-color: #4CAF50;
        color: white;
        padding: 1rem 2rem;
        border-radius: 6px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      `;
      successMessage.textContent = 'New crew member added successfully!';
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);

    } catch (error) {
      console.error('Error adding new member:', error);
      alert('Failed to add new member. Please try again.');
    }
  });
}

// Join Button Functionality
function initializeJoinButton() {
  const joinBtn = document.getElementById('joinCrewBtn');
  joinBtn.addEventListener('click', () => {
    alert('Thanks for your interest! Join feature coming soon. Stay tuned!');
  });
}