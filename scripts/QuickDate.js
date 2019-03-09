//Date function

function setToday() {
    setStartDate(0);
    setEndDate(0);
}

function setTomorrow() {
    setStartDate(1);
    setEndDate(1);
}

//Gets date, changes it into a date format and sets input end and start date.
function setDate(x) {
    const d = new Date();
    console.log(d.getFullYear() + d.getMonth() + d.getDate());
    const y = d.getFullYear();
    let m = 1 + d.getMonth();
    if (m < 10) {
        m = '0' + m;
    }
    let da = d.getDate() + x;
    if (da < 10) {
        da = '0' + da;
    }

    return y + '-' + m + '-' + da;
}

function setStartDate(x) {
    document.getElementById('start_date').value = setDate(x);
}

function setEndDate(x) {
    document.getElementById('end_date').value = setDate(x);
}

function listDate(x) {
    const date = new Date(x);
    const year = date.getFullYear();
    const month = 1 + date.getMonth();
    const day = date.getDate();
    return day + '.' + month + '.' + year;
}

function listTime(x, y) {
    const startTime = new Date(x);
    const endTime = new Date(y);
    const startH = startTime.getHours();
    let startM = startTime.getMinutes();
    if (startM < 10) {
        startM = '0' + startM;
    }
    const endH = endTime.getHours();
    let endM = endTime.getMinutes();
    if (endM < 10) {
        endM = '0' + endM;
    }

    if (y === null) {
        return startH + ':' + startM + ' - ';
    }
    return startH + ':' + startM + ' - ' + endH + ':' + endM;
}

function listDateTime(x) {
    const date = new Date(x);
    const year = date.getFullYear();
    const month = 1 + date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    let startM = date.getMinutes();
    if (startM < 10) {
        startM = '0' + startM;
    }
    return day + '.' + month + '.' + year + '  ' + hour + ':' + startM;
}