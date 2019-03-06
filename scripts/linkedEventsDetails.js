'use strict';


const event_id = window.location.href.split('=').pop();
const events_api_base = 'http://api.hel.fi/linkedevents/v1/event/';
const map = L.map('map').setView([60.170887,24.941531], 10);



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
    info.innerHTML ='';

    const title = document.createElement('h3');
    title.textContent = json.name.fi;

    const img = document.createElement('img');

    try{
        img.src = json.images[0].url; //tapahtumaan mahdollisesti liitetty kuva
    }
    catch (e) {
        //img.src = 'noimage_medium.jpg';
    }
    img.alt = 'event image';
    img.className='event_image';

    const summary = document.createElement('p');
    summary.className = 'summary';
    summary.innerHTML+=json.description.fi;

    const start_time = document.createElement('p');
    start_time.className='start_time';
    start_time.textContent = json.start_time;

    const end_time = document.createElement('p');
    end_time.className='end_time';
    end_time.textContent = json.end_time;

    const location_name = document.createElement('p');
    location_name.className='location_name';
    location_name.textContent = json.location.name.fi;

    const street_address = document.createElement('p');
    street_address.className='street_address';
    street_address.textContent = json.location.street_address.fi + ', ' + json.location.address_locality.fi;

    info.appendChild(img);
    info.appendChild(title);
    info.appendChild(summary);
    info.appendChild(start_time);
    info.appendChild(end_time);
    info.appendChild(location_name);
    info.appendChild(street_address);

    const lat = json.location.position.coordinates[0]; //latitude - karttaa varten, ei näkyviin
    const lon = json.location.position.coordinates[1]; //longitude - karttaa varten, ei näkyviin

    // Näytetään kartta ja copyright oikeudet alakulmassa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Lisätään markkeri jossa tapahtuma sijaitsee
    L.marker([lon,lat]).addTo(map)
        .bindPopup(street_address)
        .openPopup();
}



