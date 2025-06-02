// ShoreSquad App JS

document.addEventListener('DOMContentLoaded', () => {
  // Initialize map
  if (document.getElementById('mapContainer')) {
    initializeMap();
  }

  // Load Weather Data
  if (document.getElementById('weatherInfo')) {
    loadWeatherData();
  }

  // Load Team Members
  if (document.getElementById('crewList')) {
    loadTeamMembers();
  }

  // Initialize Join Button
  if (document.getElementById('joinCrewBtn')) {
    initializeJoinButton();
  }

  // Initialize Add Member Form
  if (
    document.getElementById('addCrewMemberBtn') &&
    document.getElementById('addMemberModal') &&
    document.getElementById('addMemberForm') &&
    document.getElementById('avatarSelector') &&
    document.getElementById('memberAvatar')
  ) {
    initializeAddMemberForm();
  }
});

// Google Maps Functionality
function initializeMap() {
  const mapContainer = document.getElementById('mapContainer');
  if (!mapContainer) {
    console.error('Map container element not found');
    return;
  }
  // Set map container height if not set
  mapContainer.style.height = '400px';
  // Google Maps center (Singapore)
  const center = { lat: 1.3521, lng: 103.8198 };
  // Create map
  const map = new google.maps.Map(mapContainer, {
    center,
    zoom: 11,
    mapTypeId: 'roadmap',
    streetViewControl: false,
    fullscreenControl: false
  });
  // Cleanup locations
  const locations = [
    { coords: { lat: 1.3039, lng: 103.9121 }, name: 'East Coast Park Cleanup', time: 'Saturday, 8 AM', participants: 22, difficulty: 'Easy' },
    { coords: { lat: 1.3884, lng: 103.9867 }, name: 'Changi Beach Cleanup', time: 'Sunday, 9 AM', participants: 14, difficulty: 'Moderate' },
    { coords: { lat: 1.3802, lng: 103.9637 }, name: 'Pasir Ris Beach Cleanup', time: 'Saturday, 4 PM', participants: 18, difficulty: 'Easy' },
    { coords: { lat: 1.2494, lng: 103.8303 }, name: 'Sentosa Siloso Beach Cleanup', time: 'Sunday, 10 AM', participants: 10, difficulty: 'Easy' }
  ];
  locations.forEach(loc => {
    const marker = new google.maps.Marker({
      position: loc.coords,
      map,
      title: loc.name,
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
        scaledSize: new google.maps.Size(40, 40)
      }
    });
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 1rem; max-width: 250px;">
          <h3 style="color: #2196F3; margin: 0 0 0.5rem 0;">${loc.name}</h3>
          <p style="margin: 0 0 0.5rem 0;"><span style="color: #FF7043;">📅 ${loc.time}</span></p>
          <div style="display: flex; gap: 1rem; font-size: 0.9rem; color: #666;">
            <span>👥 ${loc.participants} joined</span>
            <span>📊 ${loc.difficulty}</span>
          </div>
          <button onclick="handleJoinCleanup('${loc.name}')" class="cleanup-join-btn" style="margin-top:0.5rem;width:100%;background:#2196F3;color:#fff;border:none;padding:0.5rem;border-radius:4px;cursor:pointer;">Join Cleanup</button>
        </div>
      `
    });
    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });
  });
}

// Handle cleanup join button clicks
function handleJoinCleanup(locationName) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background-color: #4CAF50;
    color: white;
    padding: 1rem 2rem;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    z-index: 1000;
  `;
  toast.textContent = `Thanks for your interest in ${locationName}! Join feature coming soon.`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Weather Functionality (Open-Meteo API, Singapore lat/lon)
async function loadWeatherData() {
  const weatherInfo = document.getElementById('weatherInfo');
  if (!weatherInfo) return;
  weatherInfo.innerHTML = '<p>Loading weather...</p>';
  try {
    const resp = await fetch('https://api.open-meteo.com/v1/forecast?latitude=1.3521&longitude=103.8198&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto');
    const data = await resp.json();
    const current = data.current_weather;
    const daily = data.daily;
    const weatherIcons = {
      0: 'https://openweathermap.org/img/wn/01d@2x.png', // Clear
      1: 'https://openweathermap.org/img/wn/02d@2x.png', // Mainly clear
      2: 'https://openweathermap.org/img/wn/03d@2x.png', // Partly cloudy
      3: 'https://openweathermap.org/img/wn/04d@2x.png', // Overcast
      45: 'https://openweathermap.org/img/wn/50d@2x.png', // Fog
      48: 'https://openweathermap.org/img/wn/50d@2x.png',
      51: 'https://openweathermap.org/img/wn/09d@2x.png', // Drizzle
      53: 'https://openweathermap.org/img/wn/09d@2x.png',
      55: 'https://openweathermap.org/img/wn/09d@2x.png',
      61: 'https://openweathermap.org/img/wn/10d@2x.png', // Rain
      63: 'https://openweathermap.org/img/wn/10d@2x.png',
      65: 'https://openweathermap.org/img/wn/10d@2x.png',
      80: 'https://openweathermap.org/img/wn/09d@2x.png', // Showers
      81: 'https://openweathermap.org/img/wn/09d@2x.png',
      82: 'https://openweathermap.org/img/wn/09d@2x.png',
      95: 'https://openweathermap.org/img/wn/11d@2x.png', // Thunderstorm
      96: 'https://openweathermap.org/img/wn/11d@2x.png',
      99: 'https://openweathermap.org/img/wn/11d@2x.png',
    };
    weatherInfo.innerHTML = `
      <div class="weather-card current-weather">
        <img src="${weatherIcons[current.weathercode] || weatherIcons[0]}" alt="Weather icon" style="width:64px;height:64px;vertical-align:middle;">
        <span style="font-size:2rem;vertical-align:middle;">${current.temperature}°C</span>
        <span style="margin-left:1rem;">Wind: ${current.windspeed} km/h</span>
      </div>
      <div class="weather-card forecast">
        <strong>Next 3 days:</strong>
        <div style="display:flex;gap:1rem;">
          ${daily.time.slice(0,3).map((date,i)=>{
            return `<div style='text-align:center;'>
              <div>${new Date(date).toLocaleDateString(undefined,{weekday:'short'})}</div>
              <img src='${weatherIcons[daily.weathercode[i]]||weatherIcons[0]}' style='width:48px;height:48px;'>
              <div>${Math.round(daily.temperature_2m_max[i])}° / ${Math.round(daily.temperature_2m_min[i])}°</div>
              <div style='font-size:0.8em;'>Rain: ${daily.precipitation_sum[i]}mm</div>
            </div>`;
          }).join('')}
        </div>
      </div>
    `;
  } catch (e) {
    weatherInfo.innerHTML = '<p>Weather unavailable.</p>';
  }
}

// Team Members Functionality (localStorage fallback, no fetch)
let teamMembers = [];
async function loadTeamMembers() {
  const crewList = document.getElementById('crewList');
  if (!crewList) return;
  // Try localStorage first
  const local = localStorage.getItem('shoresquad_team');
  if (local) {
    teamMembers = JSON.parse(local);
    renderTeamMembers();
  } else {
    // Fetch from team.json if localStorage is empty
    try {
      const resp = await fetch('team.json');
      if (!resp.ok) throw new Error('team.json not found');
      teamMembers = await resp.json();
      renderTeamMembers();
    } catch (e) {
      crewList.innerHTML = '<p>Unable to load team members. Please try again later.</p>';
    }
  }
}
function renderTeamMembers() {
  const crewList = document.getElementById('crewList');
  if (!crewList) return;
  crewList.innerHTML = teamMembers.map(member => `
    <div class="crew-member">
      <img src="${member.avatar}" alt="${member.name}" style="width:64px;height:64px;border-radius:50%;object-fit:cover;">
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
  addMemberBtn.addEventListener('click', () => { modal.style.display = 'block'; });
  closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
  cancelBtn.addEventListener('click', () => { modal.style.display = 'none'; });
  window.addEventListener('click', (event) => { if (event.target === modal) { modal.style.display = 'none'; } });
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
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newMember = {
      name: document.getElementById('memberName').value,
      role: document.getElementById('memberRole').value,
      bio: document.getElementById('memberBio').value,
      avatar: document.getElementById('memberAvatar').value
    };
    teamMembers.push(newMember);
    localStorage.setItem('shoresquad_team', JSON.stringify(teamMembers));
    renderTeamMembers();
    modal.style.display = 'none';
    form.reset();
    avatarSelector.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
    avatarSelector.querySelector('.avatar-option').classList.add('selected');
    avatarInput.value = avatarSelector.querySelector('.avatar-option').dataset.avatar;
    const successMessage = document.createElement('div');
    successMessage.style.cssText = `position: fixed; bottom: 2rem; right: 2rem; background-color: #4CAF50; color: white; padding: 1rem 2rem; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);`;
    successMessage.textContent = 'New crew member added successfully!';
    document.body.appendChild(successMessage);
    setTimeout(() => successMessage.remove(), 3000);
  });
}