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
    //document.querySelector("#about").style.display = "none";
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

    for (let i = 0; i < json.data.length; i++) {
        if (json.data[i].id === lastEventID) {
            continue;
        }
        const li = document.createElement('li');
        const title = document.createElement('h3');
        const titleLink = document.createElement('a');
        const divMain = document.createElement('div');
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
            //img.src = 'noimage_medium.jpg';
        }
        img.alt = 'event image';
        img.className = 'event_image_list';
        picLink.appendChild(img);
        figure.appendChild(picLink);

        const summary = document.createElement('div');
        summary.className = 'summary_list';
        if (json.data[i].description !== null)
            summary.innerHTML = json.data[i].description.fi;

        const textBox = document.createElement('div');
        textBox.className = 'textBox_list';

        const start_time = document.createElement('p');
        start_time.className = 'start_time_list';
        if (json.data[i].start_time !== null) {
            const date = new Date(json.data[i].start_time);
            start_time.textContent = 'Aloitus: ' + listDate(date);
        }
        const end_time = document.createElement('p');
        end_time.className = 'end_time_list';
        if (json.data[i].end_time !== null) {
            const date = new Date(json.data[i].end_time);
            end_time.textContent = 'Loppu: ' + listDate(date);
        }
        const location_name = document.createElement('p');
        location_name.className = 'location_name_list';
        if (json.data[i].location.name !== null)
            location_name.textContent = json.data[i].location.name.fi;
        if (json.data[i].location.name !== null)
            location_name.textContent = "Paikka: " + json.data[i].location.name.fi;

        const street_address = document.createElement('p');
        street_address.className = 'street_address_list';
        street_address.textContent = "Osoite: ";
        if (json.data[i].location.street_address !== null)
            street_address.textContent += json.data[i].location.street_address.fi + ', ';
        if (json.data[i].location.address_locality !== null)
            street_address.textContent += json.data[i].location.address_locality.fi;


        const address_info = document.createElement('div');
        address_info.className = 'address_info_list';
        address_info.appendChild(location_name);
        address_info.appendChild(street_address);

        textBox.appendChild(title);
        //textBox.appendChild(summary);
        divMain.appendChild(start_time);
        divMain.appendChild(end_time);
        divMain.appendChild(textBox);
        divMain.appendChild(address_info);

        //li.appendChild(start_time);
        //li.appendChild(end_time);
        li.appendChild(figure);
        li.appendChild(divMain);
        //li.appendChild(textBox);
        //li.appendChild(address_info);

        list.appendChild(li);
        lastEventID = json.data[i].id;

        if (loadMoreActive === false && i >= 2 && json.meta.next !== null) {
            loadMoreActive = true;
            loadMoreAnchor = li;
        }
    }

    const results = json.meta.count; //hakutulosten määrä
    document.querySelector('#search_results').textContent = 'Search results: ' + results;

    const pages = document.querySelector('#search_pages');
    pages.innerHTML = '';
    /*
    const totalPages = Math.ceil( parseInt(results)/20);
    console.log(totalPages);
    const maxPages = 5;
    let pageLinks = (totalPages<maxPages)?totalPages:maxPages;
    for(let i = 0; i<pageLinks;i++){
        const li = document.createElement('li');
        li.textContent='1';
        pages.appendChild(li);
    }

    const previous = document.createElement('a');
    previous.textContent = '<';
    if (json.meta.previous !== null) {
        previous.href = '#';
        previous.setAttribute('onclick', 'previousPage()');
    }

    const next = document.createElement('a');
    next.textContent = '>';
    if (json.meta.next !== null) {
        next.href = '#';
        next.setAttribute('onclick', 'nextPage()');
    }

    pages.appendChild(document.createElement('li').appendChild(previous));
    pages.appendChild(document.createElement('li').appendChild(next));

    */
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
