'use strict';


const event_id = window.location.href.split('=').pop();
const events_api_base = 'http://api.hel.fi/linkedevents/v1/event/';



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
    console.log(json.location.position.coordinates[0]); //latitude - karttaa varten, ei näkyviin
    console.log(json.location.position.coordinates[1]); //longitude - karttaa varten, ei näkyviin

    const info = document.querySelector('#event_info');
    info.innerHTML ='';

    const title = document.createElement('h3');
    title.textContent = json.name.fi;

    const figure = document.createElement('figure');
    const img = document.createElement('img');

    try{
        img.src = json.images[0].url; //tapahtumaan mahdollisesti liitetty kuva
    }
    catch (e) {
        //img.src = 'noimage_medium.jpg';
    }
    img.alt = 'event image';
    figure.appendChild(img);

    const summary = document.createElement('p');
    summary.className = 'summary';
    summary.innerHTML+=json.description.fi;

    info.appendChild(figure);
    info.appendChild(title);
    info.appendChild(summary);
}