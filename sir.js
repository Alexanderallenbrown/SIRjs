var masterydata = [];
var mastertdata = [];
// var masterslopedata = [];

var S = [];
var I = [];
var R = [];
var t=[];

var Sref = [];
var Iref = [];
var Rref = [];
var tref=[];

var days = 365;
var dt = .1;
var sliderindex = 1;
var pop = 1000000;

var len = days/dt;

var cpd = document.getElementById('contactSlider').value;
var infectivity = document.getElementById('infectivitySlider').value;
var duration = document.getElementById('durationSlider').value;
var interventionday = document.getElementById('interventiondaySlider').value;
var interventionrate = document.getElementById('interventionrateSlider').value;


function runSIRref(){
  //set up simulation
  Sref = [];
  Iref = [];
  Rref = [];
  Sref.push(pop);
  Iref.push(1);
  Rref.push(0);
  tref.push(dt);
  //run simulation for all timesteps
  for(var k=1;k<len;k++){
    //fraction Srefusceptible
    frs = Sref[k-1]/pop;//fraction Srefusceptible
    //contacts per day between Iref and others before and after social distancing
    //these assume even mixing of Iref and Sref on any given day.
    var true_infectivity = infectivity;
    contacts = cpd*Iref[k-1];
    //dangerous contacts?
    dangerous = frs*contacts;
    //infections?
    infections = dangerous*true_infectivity;
    //how many recoveries?
    recoveries = 1.0/duration*Iref[k-1];
    //update stocks
    Sref.push(Sref[k-1]+dt*(-infections));
    Iref.push(Iref[k-1]+dt*(infections-recoveries));
    Rref.push(Rref[k-1]+dt*(recoveries));
    //update time
    tref.push(tref[k-1]+dt);
  }
}

function runSIR(){
  //set up simulation
  S = [];
  I = [];
  R = [];
  S.push(pop);
  I.push(1);
  R.push(0);
  t.push(dt);
  //run simulation for all timesteps
  for(var k=1;k<len;k++){
    //fraction Susceptible
    frs = S[k-1]/pop;//fraction Susceptible
    //contacts per day between I and others before and after social distancing
    //these assume even mixing of I and S on any given day.
    var true_infectivity = infectivity;
    if(t[k-1]<interventionday) {
      contacts = cpd*I[k-1];
    }
    else{
      contacts = cpd*(100-interventionrate)/100.0*I[k-1];
      true_infectivity = (100-interventionrate)/100.0*infectivity;
    }
    //dangerous contacts?
    dangerous = frs*contacts;
    //infections?
    infections = dangerous*true_infectivity;
    //how many recoveries?
    recoveries = 1.0/duration*I[k-1];
    //update stocks
    S.push(S[k-1]+dt*(-infections));
    I.push(I[k-1]+dt*(infections-recoveries));
    R.push(R[k-1]+dt*(recoveries));
    //update time
    t.push(t[k-1]+dt);
  }


}

var color = Chart.helpers.color;

runSIR();
runSIRref();


function generateInfectedLine() {
    var data = [];
    for (var i = 0; i < len; i++) {
        data.push({
            x: t[i],
            y: I[i]
        });
    }
    return data;
}

function generateInfectedLineref() {
    var data = [];
    for (var i = 0; i < len; i++) {
        data.push({
            x: tref[i],
            y: Iref[i]
        });
    }
    return data;
}



var scatterChartData = {
    datasets: [
      {
          label: 'Infected (no intervention)',
          borderColor: window.chartColors.black,
          backgroundColor: color(window.chartColors.red).alpha(1.0).rgbString(),
          showLine: true,
          pointRadius: 1,
          fill: false,
          data: generateInfectedLineref()

      },
    {
        label: 'Infected (with intervention)',
        borderColor: window.chartColors.black,
        backgroundColor: color(window.chartColors.black).alpha(1.0).rgbString(),
        showLine: true,
        pointRadius: 1,
        fill: false,
        data: generateInfectedLine()

    },
    ]
};


window.onload = function() {
    var ctx = document.getElementById('canvas').getContext('2d');
    window.myScatter = new Chart(ctx, {
        type: 'scatter',
        data: scatterChartData,
        options: {
            title: {
                display: true,
                text: 'SIR epidemic simulation: Closed Population of 1 Million People'
            },
            scales: {
            yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Number Infected'
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time since first infection (days)'
          }
        }],
      },
        }
    });
};

// var cpd = document.getElementById('contactSlider').value;
// var infectivity = document.getElementById('infectivitySlider').value;
// var duration = document.getElementById('durationSlider').value;
// var interventionday = document.getElementById('interventiondaySlider').value;
// var interventionrate = document.getElementById('interventionrateSlider').value;

document.getElementById('contactSlider').addEventListener('change', function(){
    cpd = document.getElementById('contactSlider').value;
    infectivity = document.getElementById('infectivitySlider').value;
    duration = document.getElementById('durationSlider').value;
    interventionday = document.getElementById('interventiondaySlider').value;
    interventionrate = document.getElementById('interventionrateSlider').value;
    runSIR();
    scatterChartData.datasets[1].data = generateInfectedLine();
    runSIRref();
    scatterChartData.datasets[0].data = generateInfectedLineref();
    window.myScatter.update();
});

document.getElementById('infectivitySlider').addEventListener('change', function(){
    cpd = document.getElementById('contactSlider').value;
    infectivity = document.getElementById('infectivitySlider').value;
    duration = document.getElementById('durationSlider').value;
    interventionday = document.getElementById('interventiondaySlider').value;
    interventionrate = document.getElementById('interventionrateSlider').value;
    runSIR();
    scatterChartData.datasets[1].data = generateInfectedLine();
    runSIRref();
    scatterChartData.datasets[0].data = generateInfectedLineref();
    window.myScatter.update();
});
document.getElementById('durationSlider').addEventListener('change', function(){
    cpd = document.getElementById('contactSlider').value;
    infectivity = document.getElementById('infectivitySlider').value;
    duration = document.getElementById('durationSlider').value;
    interventionday = document.getElementById('interventiondaySlider').value;
    interventionrate = document.getElementById('interventionrateSlider').value;
    runSIR();
    scatterChartData.datasets[1].data = generateInfectedLine();
    runSIRref();
    scatterChartData.datasets[0].data = generateInfectedLineref();
    window.myScatter.update();
});
document.getElementById('interventiondaySlider').addEventListener('change', function(){
    cpd = document.getElementById('contactSlider').value;
    infectivity = document.getElementById('infectivitySlider').value;
    duration = document.getElementById('durationSlider').value;
    interventionday = document.getElementById('interventiondaySlider').value;
    interventionrate = document.getElementById('interventionrateSlider').value;
    runSIR();
    scatterChartData.datasets[1].data = generateInfectedLine();
    runSIRref();
    scatterChartData.datasets[0].data = generateInfectedLineref();
    window.myScatter.update();
});
document.getElementById('interventionrateSlider').addEventListener('change', function(){
    cpd = document.getElementById('contactSlider').value;
    infectivity = document.getElementById('infectivitySlider').value;
    duration = document.getElementById('durationSlider').value;
    interventionday = document.getElementById('interventiondaySlider').value;
    interventionrate = document.getElementById('interventionrateSlider').value;
    runSIR();
    scatterChartData.datasets[1].data = generateInfectedLine();
    runSIRref();
    scatterChartData.datasets[0].data = generateInfectedLineref();
    window.myScatter.update();
});
