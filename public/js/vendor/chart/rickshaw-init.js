$(document).ready(function() {
	var graph = new Rickshaw.Graph({
		element: document.querySelector("#chart"),
		width: 235,
		height: 85,
		renderer: 'line',
		series: [ {
			data: [ { x: 0, y: 40 }, { x: 1, y: 49 }, { x: 2, y: 38 }, { x: 3, y: 30 }, { x: 4, y: 32 } ],
			color: '#f92b8b'
		} ]
	});
	graph.render();

	var graph = new Rickshaw.Graph({
		element: document.querySelector("#chartscatterplot"),
		width: 235,
		height: 85,
		renderer: 'scatterplot',
		series: [ {
			data: [ { x: 0, y: 40 }, { x: 1, y: 49 }, { x: 2, y: 38 }, { x: 3, y: 30 }, { x: 4, y: 32 } ],
			color: '#34dd87'
		} ]
	});
	graph.render();

	var graph = new Rickshaw.Graph({
		element: document.querySelector("#chartbar"),
		width: 235,
		height: 85,
		renderer: 'bar',
		stack: false,
		series: [ 
			{
				data: [ { x: 0, y: 40 }, { x: 1, y: 49 }, { x: 2, y: 38 }, { x: 3, y: 30 }, { x: 4, y: 32 } ],
				color: '#f92b8b'
			}, {
				data: [ { x: 0, y: 20 }, { x: 1, y: 24 }, { x: 2, y: 19 }, { x: 3, y: 15 }, { x: 4, y: 16 } ],
				color: '#4941e9'

		} ]
	});

	graph.render();
});