//Date function

function setToday() {
  setDate(0);
}
function setTomorrow() {
  setDate(1);
}
function setDate(x) {
  var d = new Date();
  console.log(d.getFullYear() + d.getMonth() + d.getDate());
  var y = d.getFullYear();
  var m = 1 + d.getMonth();
  if (m < 10) {
    m = '0' + m;
  }
  var da = d.getDate()+x;
  if (da < 10) {
    da = '0' + da;
  }
  var date = y + '-' + m + '-' + da;
  document.getElementById('start_date').value = date;
  document.getElementById('end_date').value = date;
}