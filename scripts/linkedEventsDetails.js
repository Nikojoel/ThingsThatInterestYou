'use strict';


const event_id = window.location.href.split('=').pop();
const events_api_base = 'http://api.hel.fi/linkedevents/v1/event/';
let lon,lat,lonCurrent,latCurrent;
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};


function fetchEventInfo() {
    fetch(events_api_base + event_id + '/?include=location')
        .then(function (result) {
            return result.json();
        }).then(function (json) {
        showEventInfo(json);
    }).catch(function (error) {
        console.log(error);
    });
}

function showEventInfo(json) {
    console.log(json);

    const info = document.querySelector('#event_info');
    info.innerHTML = '';

    const title = document.createElement('h3');
    if (json.name.fi !== null)
        title.textContent = json.name.fi;

    const img = document.createElement('img');

    try {
        img.src = json.images[0].url; //tapahtumaan mahdollisesti liitetty kuva
    } catch (e) {
        //img.src = 'noimage_medium.jpg';
    }
    img.alt = 'event image';
    img.className = 'event_image';

    const summary = document.createElement('p');
    summary.className = 'summary';
    if (json.description !== null) {
        if (json.description.fi) {
            summary.innerHTML = json.description.fi;
        } else if (json.description.en){
            summary.innerHTML = json.description.en;
        } else if (json.description.sv) {
            summary.innerHTML = json.description.sv;
        }
    }

    const start_time = document.createElement('p');
    start_time.className = 'start_time';
  if (json.start_time !== null) {
    const start = new Date(json.start_time);
    start_time.textContent = 'Start time: ' + listDateTime(start);
  }
    const end_time = document.createElement('p');
    end_time.className = 'end_time';
  if (json.end_time !== null) {
    const end = new Date(json.end_time);
    end_time.textContent = 'End time: ' + listDateTime(end);
  } else {
    end_time.textContent = 'End time: not defined';
  }
    const location_name = document.createElement('p');
    location_name.className = 'location_name';
    if (json.location.name !== null)
      location_name.textContent = 'Place: ' + json.location.name.fi;

    const street_address = document.createElement('p');
    street_address.className = 'street_address';

    if (json.location.street_address !== null) {
      street_address.textContent += 'Address: ';
        street_address.textContent += json.location.street_address.fi + ', ';
    }
    if (json.location.address_locality !== null)
        street_address.textContent += json.location.address_locality.fi;

    const info_url = document.createElement('a');
  const buy_ticket = document.createElement('p');
  buy_ticket.className = 'buy_ticket';
    info_url.className = 'info_url';
    if (json.info_url !== null) {
      buy_ticket.textContent = 'More info: ';
        info_url.textContent = json.info_url.fi;
        info_url.href=json.info_url.fi;
    }

    info.appendChild(img);
    info.appendChild(title);
    info.appendChild(summary);
    info.appendChild(start_time);
    info.appendChild(end_time);
    info.appendChild(location_name);
    info.appendChild(street_address);
  info.appendChild(buy_ticket);
    info.appendChild(info_url);

    console.log(location_name);
    console.log(street_address);
    lon = json.location.position.coordinates[1];
    lat = json.location.position.coordinates[0];
    console.log(lon);
    console.log(lat);

    const map = L.map('map').setView([lon, lat], 13);
    // Näytetään kartta ja copyright oikeudet alakulmassa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Lisätään markkeri jossa tapahtuma sijaitsee
    L.marker([lon, lat]).addTo(map)
        .bindPopup(street_address)
        .openPopup();
}
function error() {
    console.log(error);
}

    navigator.geolocation.getCurrentPosition(getCoords, error, options);

// Haetaan käyttäjän coordinaatit
function getCoords(position) {
    latCurrent = position.coords.latitude;
    lonCurrent = position.coords.longitude;
    console.log(latCurrent);
    console.log(lonCurrent);
}

const navAdress = document.getElementById('navAdress');
// Navigoidaan tapahtuman osoitteeseen Google Mapsin avulla
function navigate() {
    navAdress.href = `https://www.google.com/maps/dir/?api=1&origin=${latCurrent},${lonCurrent}&destination=${lon},${lat}`;
    console.log(navAdress.href);
}




