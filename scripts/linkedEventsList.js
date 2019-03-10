'use strict';

const list = document.querySelector('#events_result');
const search_text = document.querySelector('#search_text');
const search_btn = document.querySelector('#search_btn');

const start_field = document.querySelector('#start_date');
const end_field = document.querySelector('#end_date');

const language = '&language=' + 'fi';
const start_date = '&start=';
const end_date = '&end=';
const sorting = '&sort=end_time';
const pageSize = '&page_size=12';

const events_api_base = 'http://api.hel.fi/linkedevents/v1/event/?include=location&super_event_type=none';

let pageNumber = 1;

let lastEventID;
let loadMoreAnchor;
let loadMoreActive = false;

search_btn.addEventListener('click', function () {
    const header = document.querySelector("#page_header");
    header.scrollIntoView();
    list.innerHTML = '';
    fetchEvents(1);
});


search_text.addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {
        search_btn.click();
    }
});


function fetchEvents(pageNum) {
    pageNumber = pageNum;
    const page = '&page=' + pageNum;
    fetch(events_api_base + '&text=' + search_text.value + language + start_date + start_field.value + end_date + end_field.value + sorting + page + pageSize)
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
    const currentDateTime = new Date();
    const currentDate = currentDateTime.getDate();
    const currentHour = currentDateTime.getHours();

    for (let i = 0; i < json.data.length; i++) {

        if (json.data[i].id === lastEventID) {
            continue;
        }

        const eventStartDateTime = new Date(json.data[i].start_time);
        const eventStartMonth = eventStartDateTime.getMonth();
        const eventStartDate = eventStartDateTime.getDate();
        const eventStartHour = eventStartDateTime.getHours();

        const searchFieldDateFrom = new Date(start_field.valueAsDate);
        const searchMonthFrom = searchFieldDateFrom.getMonth();
        const searchDateFrom = searchFieldDateFrom.getDate();

        if (searchDateFrom === currentDate) {
            if (eventStartDate === currentDate && currentHour > eventStartHour)
                continue;
        }

        if (searchMonthFrom >= eventStartMonth && searchDateFrom > eventStartDate) {
            continue;
        }

        const li = document.createElement('li');
        const title = document.createElement('h3');
        const titleLink = document.createElement('a');
        titleLink.href = 'event_info.html?id=' + json.data[i].id;
        titleLink.target = '_blank';
        titleLink.appendChild(document.createTextNode(json.data[i].name.fi));
        title.appendChild(titleLink);

        const figure = document.createElement('figure');
        const picLink = document.createElement('a');
        picLink.href = 'event_info.html?id=' + json.data[i].id;
        titleLink.target = '_blank';
        const img = document.createElement('img');

        try {
            img.src = json.data[i].images[0].url; //tapahtumaan mahdollisesti liitetty kuva
        } catch (e) {
            img.src = 'https://dummyimage.com/185x110/bfbdbf/000000.png&text=Image+not+available';
        }
        img.alt = 'event image';
        img.className = 'event_image_list';
        picLink.appendChild(img);
        figure.appendChild(picLink);

        const calender = document.createElement('img');
        calender.className = 'thumbnail';
        calender.src = 'pics/calender.png';
        calender.alt = 'Calender thumbnail';

        const clock = document.createElement('img');
        clock.className = 'thumbnail';
        clock.src = 'pics/clock.png';
        clock.alt = 'Clock thumbnail';

        const placeMarker = document.createElement('img');
        placeMarker.className = 'thumbnail';
        placeMarker.src = 'pics/location.png';
        placeMarker.alt = 'Location thumbnail';

        const streetMarker = document.createElement('img');
        streetMarker.className = 'thumbnail';
        streetMarker.src = 'pics/street.png';
        streetMarker.alt = 'Street sign thumbnail';

        const summary = document.createElement('div');
        summary.className = 'summary_list';
        if (json.data[i].description !== null) {
            if (json.data[i].description.fi) {
                summary.innerHTML = json.data[i].description.fi;
            } else if (json.data[i].description.en) {
                summary.innerHTML = json.data[i].description.en;
            } else if (json.data[i].description.sv) {
                summary.innerHTML = json.data[i].description.sv;
            }
        }

        const textBox = document.createElement('div');
        textBox.className = 'textBox_list';

        const dateElement = document.createElement('p');

        let startDate;
        if (json.data[i].start_time !== null) {
            startDate = new Date(json.data[i].start_time);
            dateElement.textContent = listDate(startDate);
        }

        if (json.data[i].end_time !== null) {
            const endDate = new Date(json.data[i].end_time);
            if (endDate.getFullYear() >= startDate.getFullYear() && endDate.getMonth() >= startDate.getMonth() && endDate.getDate() > startDate.getDate())
                dateElement.textContent += " - " + listDate(endDate);
        }

        const event_time = document.createElement('p');
        if (json.data[i].end_time || json.data[i].start_time !== null) {
            const end = new Date(json.data[i].end_time);
            event_time.textContent = listTime(startDate, end);
        }
        if (json.data[i].end_time === null) {
            event_time.textContent = listTime(startDate, null);
        }

        const location_name = document.createElement('p');
        location_name.className = 'location_name_list';
        const street_address = document.createElement('p');
        street_address.className = 'street_address_list';

        if (json.data[i].location !== null) {
            if (json.data[i].location.name !== null)
                location_name.textContent = json.data[i].location.name.fi;
            if (json.data[i].location.name !== null)
                location_name.textContent = json.data[i].location.name.fi;
            if (json.data[i].location.street_address !== null)
                street_address.textContent += json.data[i].location.street_address.fi + ', ';
            if (json.data[i].location.address_locality !== null)
                street_address.textContent += json.data[i].location.address_locality.fi;
        }

        const address_info = document.createElement('div');
        address_info.className = 'address_info_list';

        location_name.appendChild(placeMarker);
        street_address.appendChild(streetMarker);

        address_info.appendChild(location_name);
        address_info.appendChild(street_address);

        dateElement.appendChild(calender);
        event_time.appendChild(clock);

        textBox.appendChild(title);
        textBox.appendChild(dateElement);
        textBox.appendChild(event_time);
        textBox.appendChild(address_info);

        li.appendChild(figure);
        li.appendChild(textBox);
        li.appendChild(summary);

        list.appendChild(li);
        lastEventID = json.data[i].id;


        if (loadMoreActive === false && i >= 2 && json.meta.next !== null) {
            loadMoreActive = true;
            loadMoreAnchor = li;
        }

    }

    const results = json.meta.count; //hakutulosten määrä
    document.querySelector('#search_results').textContent = 'Search results: ' + results;

    if (loadMoreActive === false && json.meta.next !== null) {
        nextPage();
    }
}

function nextPage() {
    fetchEvents(pageNumber + 1);
}

function previousPage() {
    if (pageNumber > 1) {
        fetchEvents(pageNumber - 1);
    }
}

window.onscroll = function () {
    if (loadMoreActive === true) {
        if (loadMoreAnchor.getBoundingClientRect().top <= 0) {
            nextPage();
            loadMoreActive = false;
        }
    }
};
