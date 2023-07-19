$(document).ready(function() {

    var data = [{
        label: "sales",
        data: 25,
        color: "#4941e9",
    }, {
        label: "customer",
        data: 25,
        color: "#f92b8b",
    }, {
        label: "visitor",
        data: 25,
        color: "#06caff",
    }, {
        label: "income",
        data: 25,
        color: "#5ae2cd",
    }];

    var plotObj = $.plot($("#flot-pie-chart"), data, {
        series: {
            pie: {
            	innerRadius: 0.5,
                show: true
            }
        },
        grid: {
            hoverable: true
        },
        tooltip: true,
        tooltipOpts: {
            content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
            shifts: {
                x: 20,
                y: 0
            },
            defaultTheme: false
        }
    });

    $.plot("#flotBar1", [{
		  data: [[0, 9], [2, 6], [4, 7], [6, 13],[8,7], [10,7],[12,4], [14,13]]
		}], {
		  series: {
		    bars: {
		      show: true,
		      lineWidth: 0,
		      fillColor: '#4941e9'
		    }
		  },
		  grid: {
		    borderWidth: 1,
		    borderColor: '#f1f1f1'
		  },
		  yaxis: {
		    tickColor: '#f1f1f1',
		    font: {
		      color: '#666',
		      size: 10
		    }
		  },
		  xaxis: {
		    tickColor: '#f1f1f1',
		    font: {
		      color: '#666',
		      size: 10
		    }
		  }
		});

	var saleCust = [[0, 1], [2, 3], [3,5], [3, 5], [4, 7], [5, 8], [7, 9]];
	var incomeCust = [[0, 2], [1, 3], [2,5], [3, 3], [4, 5], [5, 6], [7,10]];

   var plot = $.plot($('#flotLine1'),[
    {
      data: saleCust,
      label: 'sales',
      color: '#4941e9'
    },
    {
      data: incomeCust,
      label: 'income',
      color: '#f92b8b'
    }],
    {
      series: {
        lines: {
          show: true,
          lineWidth: 5
        },
        shadowSize: 0
      },
      points: {
        show: false,
      },
      legend: {
        noColumns: 1,
        position: 'nw'
      },
      grid: {
        hoverable: true,
        clickable: true,
        borderColor: '#ddd',
        borderWidth: 0,
        labelMargin: 5,
        backgroundColor: '#fff'
      },
      yaxis: {
        min: 1,
        max: 15,
        color: '#f1f1f1',
        font: {
          size: 11,
          color: '#666'
        }
      },
      xaxis: {
        color: '#f1f1f1',
        font: {
          size: 11,
          color: '#666'
        }
      }
    });
   var data = [],
        totalPoints = 300;

    function getRandomData() {

        if (data.length > 0)
            data = data.slice(1);

        // Do a random walk

        while (data.length < totalPoints) {

            var prev = data.length > 0 ? data[data.length - 1] : 50,
                y = prev + Math.random() * 10 - 5;

            if (y < 0) {
                y = 0;
            } else if (y > 100) {
                y = 100;
            }

            data.push(y);
        }

        // Zip the generated y values with the x values

        var res = [];
        for (var i = 0; i < data.length; ++i) {
            res.push([i, data[i]])
        }

        return res;
    }

    // Set up the control widget

    var updateInterval = 30;
    $("#updateInterval").val(updateInterval).change(function () {
        var v = $(this).val();
        if (v && !isNaN(+v)) {
            updateInterval = +v;
            if (updateInterval < 1) {
                updateInterval = 1;
            } else if (updateInterval > 3000) {
                updateInterval = 3000;
            }
            $(this).val("" + updateInterval);
        }
    });

    var plot = $.plot("#floatrealtime", [getRandomData()], {
        series: {
            shadowSize: 0 // Drawing is faster without shadows
        },
        yaxis: {
            min: 0,
            max: 100
        },
        xaxis: {
            show: false
        },
        colors: ["#f92b8b"],
        grid: {
            color: "transparent",
            hoverable: true,
            borderWidth: 0,
            backgroundColor: '#FFF'
        },
        tooltip: true,
        tooltipOpts: {
            content: "Y: %y",
            defaultTheme: false
        }


    });

    function update() {

        plot.setData([getRandomData()]);
        // Since the axes don't change, we don't need to call plot.setupGrid()
        plot.draw();
        setTimeout(update, updateInterval);
    }

    update();
});

