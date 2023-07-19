$(document).ready(function() {

    $("span.pie").peity("pie", {
        fill: ['#a00af6', '#f92b8b', '#ffffff'],
    })

    $(".line").peity("line",{
      
    })

    $(".bar").peity("bar", {
        fill: ["#a00af6", "#5ae2cd", "#f92b8b"]
    })

    // Donut chart
  $(".peity-donut").peity("donut", {
        fill: ["#f92b8b", "#4941e9", "#5ae2cd"],
    })

});