$(document).ready(function(){

  if($('#barChart').length){
    var ctx = document.getElementById('barChart');
    ctx.height = 125;
    var ctx = document.getElementById("barChart").getContext('2d');
    var barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          datasets: [{
              barPercentage: 0.5,
              categoryPercentage: 1.0,
              barThickness: 6,
              maxBarThickness: 9,
              minBarLength: 2,
          }]
        },
        data: {
          labels: ['2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018'],
            
            datasets: [{
                label: 'sales',
                data: [72, 50, 10, 7, 55, 45, 29, 6],
                backgroundColor: "#4941e9",
                borderWidth: 0
            }, {
                label: 'visitor',
                data: [55, 69, 55, 63, 50, 50, 15, 6],
                backgroundColor: "#a00af6",
                borderWidth: 0
               
            },
            {
                label: 'Revenue',
                data: [15, 55, 70, 59, 45, 5, 20, 8],
                backgroundColor: "#5ae2cd",
                borderWidth: 0
               
            }]
        },
        options: {
          scaleShowVerticalLines: false,
          responsive: true,
          scales: {
              xAxes: [{
                  categoryPercentage: 0.6,
                  barPercentage: 0.5,
                  display: false,
                  scaleLabel: {
                      display: true,
                  },
                  gridLines: false,
              }],
              yAxes: [{
                  categoryPercentage: 0.35,
                  barPercentage: 0.70,
                  display: true,
                  scaleLabel: {
                      display: false,
                      labelString: 'Value'
                  },
                  gridLines: {
                      drawBorder: false,
                      offsetGridLines: false,
                      drawTicks: false,
                      borderDash: [3, 4],
                      zeroLineWidth: 1,
                      zeroLineBorderDash: [3, 4]
                  },
                  ticks: {
                      max: 100,                            
                      stepSize: 10,
                      display: true,
                      beginAtZero: true,
                      fontSize: 13,
                      fontColor: "#666",
                      padding: 20
                  }
              }]
          }
      }
    });
  }


  // LINE CHART
  if ($('#lineChart').length) {
    var ctx = document.getElementById( "lineChart" );
    ctx.height = 125;
    new Chart(document.getElementById("lineChart"), {
      type: 'line',
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{ 
            data: [86,3314,3306,3006,3107,3111,3133,3221,3783,4478],
            label: "sales",
            borderColor: "#4941e9",
            pointBackgroundColor: "#4941e9",
            pointBorderColor: "#4941e9",
            fill: false
          }, { 
            data: [2282,2350,2411,2502,2635,2809,2947,2402,3700,5267],
            label: "income",
            borderColor: "#5ae2cd",
            pointBackgroundColor: "#5ae2cd",
            pointBorderColor: "#5ae2cd",
            fill: false
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Characterstic of business'
        }
      }
    });
  }


  // PIE CHART
  if($('#pie-chart').length){
      var ctx = document.getElementById('pie-chart');
      ctx.height=125;
      new Chart(document.getElementById("pie-chart"), {
        type: 'pie',
        data: {
          labels: ["primary", "secondary", "info", "light", "success"],
          datasets: [{
            label: "Population (millions)",
            backgroundColor: ["#4941e9", "#f92b8b","#06caff","#5ae2cd","#34dd87"],
            data: [2478,5267,3734,2784,3003]
          }]
        },
        options: {
          title: {
            display: true,
          }
        }
    });
  }

  // COMBO BAR CHART
   if($('#comboChart').length){
      var ctx = document.getElementById('comboChart');
      ctx.height = 125;
      var chartData = {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [{
          type: 'line',
          label: 'Dataset 1',
          borderColor: "#4941e9",
          pointBackgroundColor: "#4941e9",
          backgroundColor: ["#4941e9"],
          borderWidth: 2,
          fill: false,
          data: [0, 48, 4, 5, 6, 4, 2]
        }, {
          type: 'bar',
          label: 'Dataset 2',
          backgroundColor: ["#f92b8b", "#4941e9","#06caff", "#34dd87", "#4941e9", "#06caff", "#4941e9"],
          data: [55, 48, 40, 50, 50, 40, 30],
        }, {
          type: 'bar',
          label: 'Dataset 3',
          backgroundColor: ["#06caff", "#f92b8b","#5ae2cd", "#5ae2cd", "#f92b8b", "#5ae2cd", "#34dd87"],
          data: [-30, -38, 20, -55, -35, -40, -50],
        }]

      };
      var ctx = document.getElementById('comboChart');
      window.myMixedChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          responsive: true,
          title: {
            display: true,
            text: 'Combo Bar Line Chart'
          },
          tooltips: {
            mode: 'index',
            intersect: true
          }
        }
      });
    }

});

