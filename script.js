function isPresent(el, arr) {

  for (var i = 0; i < arr.length; i++) {

    if(arr[i] == el) {

      return true;
    }
  }

  return false;
}

function rand() {

  var rand = Math.round(Math.random() * 255);
  return rand;
}

function randomColor() {

  return "rgb(" + rand() + ", " + rand() + ", " + rand() + ")";
}

function colorFunction(array) {

  var color = [];

  for (var i = 0; i < array.length; i++) {

    color.push(randomColor())
  }

  return color;
}

function addNameToDatalist(inData) {

  $("#names").empty();

  var names = [];

  var source = $("#template").html();
  var compiled = Handlebars.compile(source);

  for (var i = 0; i < inData.length; i++) {

    var name = inData[i].salesman;

    if(!isPresent(name, names)) {

      names.push(name);

      var data = {
        "name": name
      }
      var finalHtml = compiled(data);
      $("#names").append(finalHtml);
    }
  }
}

function drawFirstGaph(inData) {

  var obj = {
    "gennaio": 0,
    "febbraio": 0,
    "marzo": 0,
    "aprile": 0,
    "maggio": 0,
    "giugno": 0,
    "luglio": 0,
    "agosto": 0,
    "settembre": 0,
    "ottobre": 0,
    "novembre": 0,
    "dicembre": 0,
  }

  for (var i = 0; i < inData.length; i++) {

    var date = inData[i].date;
    var amount = inData[i].amount;
    amount = Number(amount);

    var mom = moment(date, "DD/MM/YYYY");
    var monthName = mom.format("MMMM");

    obj[monthName] += amount;
  }

  var ctx = document.getElementById("myChart1");
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Object.keys(obj),
      datasets: [
        {
          data: Object.values(obj),
          label: "amount 2017",
          borderColor: randomColor()
        }
      ]
    }
  });
}

function drawSecondGraph(inData) {

  var names = [];
  var amounts = [];

  for (var i = 0; i < inData.length; i++) {

    var name = inData[i].salesman;

    if(!isPresent(name, names)) {
      names.push(name);
    }
  }

  for (var i = 0; i < names.length; i++) {

    amounts.push(0);
  }

  for (var i = 0; i < inData.length; i++) {

    var amount = inData[i].amount;
    amount = Number(amount);
    var name = inData[i].salesman;

    var ind = names.indexOf(name);
    amounts[ind] += amount;
  }


  var ctx = document.getElementById("myChart2");
  var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: names,
      datasets: [
        {
          data: amounts,
          backgroundColor: colorFunction(names)
        }
      ]
    }
  });
}

function drawThirdGraph(inData) {

  var obj = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  }

  for (var i = 0; i < inData.length; i++) {

    var date = inData[i].date;
    var amount = inData[i].amount;
    amount = Number(amount);

    var mom = moment(date, "DD/MM/YYYY");
    var monthName = mom.format("Q");

    obj[monthName] += amount;
  }

  var ctx = document.getElementById("myChart3");
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Gen-Mar", "Apr-Giu", "Lug-Set", "Ott-Dic"],
      datasets: [
        {
          data: Object.values(obj),
          label: "amount 2017",
          backgroundColor: randomColor(),
          fill: false
        }
      ]
    }
  });
}

function ajax() {

  $.ajax({

    url: "http://157.230.17.132:4001/sales",
    method: "GET",
    data: {},
    success: function(inData) {

      addNameToDatalist(inData);
      drawFirstGaph(inData);
      drawSecondGraph(inData);
      drawThirdGraph(inData);
    },
    error: function() {}
  })
}

function addDataToServer() {

  var date = $(".date").val();
  var month = $(".month").val();
  var year = $(".year").val();

  var completeDate = date + " " + month + " " + year;

  var mom = moment(completeDate, 'D/MMMM/YYYY');

  var amount = $(".amount").val();
  var name = $(".name").val();

  if (mom.isValid() && amount > 0) {

    var outData = {
        "date": mom.format("DD/MM/YYYY"),
        "amount": Number(amount),
        "salesman": name
      }

    console.log(outData);

    $.ajax({
      url: "http://157.230.17.132:4001/sales",
      method: "POST",
      data: outData,
      success: function() {
        ajax();
        },
      error: function() {}
    })
  }
}

function init() {

  moment.locale('it');

  ajax()

  $("#btn").click(function() {

    addDataToServer();
  })
}

$(init)
