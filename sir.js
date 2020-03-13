// var masterydata = [];
// var mastertdata = [];
// var masterslopedata = [];

var s = [];
var i = [];
var r = [];

days = 365;
freq = 12.0;
maxt = 1.0;
dt = 1;
sliderindex = 1;

for (var i=0;i<len;i++){
    masterydata.push(Math.sin(i/len*maxt*freq));
    mastertdata.push(i/len*maxt);
}

var color = Chart.helpers.color;
        function generateData() {
            var data = [];
            for (var i = 0; i < len; i++) {
                data.push({
                    x: mastertdata[i],
                    y: masterydata[i]
                });
            }
            return data;
        }



        var scatterChartData = {
            datasets: [
            {
                label: 'Approximate Derivative',
                borderColor: window.chartColors.blue,
                backgroundColor: color(window.chartColors.blue).alpha(0.2).rgbString(),
                showLine: true,
                pointRadius: 1,
                fill: false,
                data: generateDataSlope()

            },
            {
                label: 'x(a)',
                borderColor: window.chartColors.red,
                backgroundColor: color(window.chartColors.red).alpha(1.0).rgbString(),
                pointRadius: 5,
                data: generateDataPoint()
            },
            {
                label: 'x(a-h)',
                borderColor: window.chartColors.green,
                backgroundColor: color(window.chartColors.green).alpha(1.0).rgbString(),
                pointRadius: 5,
                data: generateDataPoint2()
            },
            {
                label: 'Function',
                borderColor: window.chartColors.black,
                backgroundColor: color(window.chartColors.black).alpha(1.0).rgbString(),
                showLine: true,
                pointRadius: 1,
                fill: false,
                data: generateData()

            },
            ]
        };

        function generateDataPoint(){
            var data = [];
            sliderindex = document.getElementById('positionSlider').value
            data.push({x: mastertdata[sliderindex],y:masterydata[sliderindex]})
            return data
        }

        function generateDataPoint2(){
            var data = [];
            var dtsliderindex = document.getElementById('dtSlider').value
            sliderindex = document.getElementById('positionSlider').value
            data.push({x: mastertdata[sliderindex-dtsliderindex],y:masterydata[sliderindex-dtsliderindex]})
            return data
        }

        function generateDataSlope(){
            masterslopedata = [];
            var data = []
            var possliderindex = document.getElementById('positionSlider').value
            var dtsliderindex = document.getElementById('dtSlider').value
            var point1 = [mastertdata[possliderindex-dtsliderindex],masterydata[possliderindex-dtsliderindex]]
            var point2 = [mastertdata[possliderindex],masterydata[possliderindex]]
            var m = (point2[1]-point1[1])/(point2[0]-point1[0])
            console.log(m)
            for(var ind = 0;ind<len;ind++){
                masterslopedata.push(m*(mastertdata[ind]-point1[0])+point1[1])
            }
            for(var i =0;i<len;i++){
                if (Math.abs(masterslopedata[i])<2){
                data.push({
                    x: mastertdata[i],
                    y: masterslopedata[i]
                });
            }
        }
        console.log(data.length)
            return data;
        }

        window.onload = function() {
            var ctx = document.getElementById('canvas').getContext('2d');
            window.myScatter = new Chart(ctx, {
                type: 'scatter',
                data: scatterChartData,
                options: {
                    title: {
                        display: false,
                        text: 'Chart.js Scatter Chart'
                    },
                    scales: {
                    yAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: 'x'
                  }
                }],
                xAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: 't'
                  }
                }],
              },
                }
            });
        };

        document.getElementById('positionSlider').addEventListener('change', function(){
            scatterChartData.datasets[1].data = generateDataPoint()
            scatterChartData.datasets[0].data = generateDataSlope()
            scatterChartData.datasets[2].data = generateDataPoint2()
            // console.log(scatterChartData.datasets[1])
            window.myScatter.update();
        });
        document.getElementById('dtSlider').addEventListener('change', function(){
            scatterChartData.datasets[1].data = generateDataPoint()
            scatterChartData.datasets[0].data = generateDataSlope()
            scatterChartData.datasets[2].data = generateDataPoint2()
            // console.log(scatterChartData.datasets[1])
            window.myScatter.update();
        });

        // document.getElementById('randomizeData').addEventListener('click', function() {
        //     scatterChartData.datasets.forEach(function(dataset) {
        //         dataset.data = dataset.data.map(function() {
        //             return {
        //                 x: randomScalingFactor(),
        //                 y: randomScalingFactor()
        //             };
        //         });
        //     });
        //     window.myScatter.update();
        // });
