'use strict';

const search_text = document.querySelector('#search_text');
const search_btn = document.querySelector('#search_btn');

const language = '&language=' + 'fi';
const start_date = '&start=' + 'today';
const end_date = '&end=' + 'today';

const events_api_base = 'http://api.hel.fi/linkedevents/v1/event/?include=location';

search_btn.addEventListener('click', function () {
    fetchEvents();
});


search_text.addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {
        search_btn.click();
    }
});


function fetchEvents() {
    fetch(events_api_base + '&text=' + search_text.value + language + start_date + end_date)
        .then(function (result) {
            return result.json();
        }).then(function (json) {
        showEventList(json);
    }).catch(function (error) {
        console.log(error);
    });
}

function showEventList(json) {
    console.log(json);

    console.log(json.meta.count); //hakutulosten määrä
    console.log(json.meta.next); //linkki seuraaviin hakutuloksiin, jos enemmän kuin sivullinen (20kpl)
    for (let i = 0; i < json.data.length; i++) {
        console.log(json.data[i].start_time); //tapahtuman alku
        console.log(json.data[i].end_time); //tapahtuman loppu
        console.log(json.data[i].name.fi); //tapahtuman nimi
        console.log(json.data[i].location.position.coordinates[0]); //latitude - karttaa varten, ei näkyviin
        console.log(json.data[i].location.position.coordinates[1]); //longitude - karttaa varten, ei näkyviin
        console.log(json.data[i].location.name.fi); //tapahtumapaikan nimi nimi
        console.log(json.data[i].location.street_address.fi); //katuosoite
        console.log(json.data[i].location.address_locality.fi); //paikkakunta
        console.log(json.data[i].short_description.fi); //lyhyt kuvausteksti
        console.log(json.data[i].description.fi); //täysi kuvaus
        console.log(json.data[i].info_url.fi); //mahdollinen linkki tapahtuman omille sivuille

        console.log(json.data[i].images[0]); //tapahtumaan mahdollisesti liitetty kuva
    }
}
