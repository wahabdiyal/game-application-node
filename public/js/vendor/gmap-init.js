

var map;
$(document).ready(function(){
    map = new GMaps({
        el: '#map',
        lat: -12.043333,
        lng: -77.028333,
        zoomControl : true,
        zoomControlOpt: {
            style : 'SMALL',
            position: 'TOP_LEFT'
        },
        panControl : false,
        streetViewControl : false,
        mapTypeControl: false,
        overviewMapControl: false
    });
});

var map;
$(document).ready(function(){
    map = new GMaps({
        el: '#mapmenu',
        lat: -12.043333,
        lng: -77.028333
    });
    map.setContextMenu({
        control: 'map',
        options: [{
            title: 'Add marker',
            name: 'add_marker',
            action: function(e){
                console.log(e.latLng.lat());
                console.log(e.latLng.lng());
                this.addMarker({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                    title: 'New marker'
                });
                this.hideContextMenu();
            }
        }, {
            title: 'Center here',
            name: 'center_here',
            action: function(e){
                this.setCenter(e.latLng.lat(), e.latLng.lng());
            }
        }]
    });
    map.setContextMenu({
        control: 'marker',
        options: [{
            title: 'Center here',
            name: 'center_here',
            action: function(e){
                this.setCenter(e.latLng.lat(), e.latLng.lng());
            }
        }]
    });
});

var map;
$(function () {
    map = new GMaps({
        el: "#maplayer",
        lat: -12.043333,
        lng: -77.028333,
        zoom: 3
    });

    // map.addLayer('weather', {
    //     clickable: false
    // });
    // map.addLayer('clouds');
});
var map, path, paths;
$(document).ready(function(){
    map = new GMaps({
        el: '#mappolygon',
        lat: -12.040397656836609,
        lng: -77.03373871559225,
        click: function(e){
            console.log(e);
        }
    });

    paths = [
        [
            [
                [-105.00432014465332, 39.74732195489861],
                [-105.00715255737305, 39.74620006835170],
                [-105.00921249389647, 39.74468219277038],
                [-105.01067161560059, 39.74362625960105],
                [-105.01195907592773, 39.74290029616054],
                [-105.00989913940431, 39.74078835902781],
                [-105.00758171081543, 39.74059036160317],
                [-105.00346183776855, 39.74059036160317],
                [-105.00097274780272, 39.74059036160317],
                [-105.00062942504881, 39.74072235994946],
                [-105.00020027160645, 39.74191033368865],
                [-105.00071525573731, 39.74276830198601],
                [-105.00097274780272, 39.74369225589818],
                [-105.00097274780272, 39.74461619742136],
                [-105.00123023986816, 39.74534214278395],
                [-105.00183105468751, 39.74613407445653],
                [-105.00432014465332, 39.74732195489861]
            ],[
            [-105.00361204147337, 39.74354376414072],
            [-105.00301122665405, 39.74278480127163],
            [-105.00221729278564, 39.74316428375108],
            [-105.00283956527711, 39.74390674342741],
            [-105.00361204147337, 39.74354376414072]
        ]
        ],[
            [
                [-105.00942707061768, 39.73989736613708],
                [-105.00942707061768, 39.73910536278566],
                [-105.00685214996338, 39.73923736397631],
                [-105.00384807586671, 39.73910536278566],
                [-105.00174522399902, 39.73903936209552],
                [-105.00041484832764, 39.73910536278566],
                [-105.00041484832764, 39.73979836621592],
                [-105.00535011291504, 39.73986436617916],
                [-105.00942707061768, 39.73989736613708]
            ]
        ]
    ];

    path = [[-12.040397656836609,-77.03373871559225], [-12.040248585302038,-77.03993927003302], [-12.050047116528843,-77.02448169303511], [-12.044804866577001,-77.02154422636042]];

    map.drawPolygon({
        paths: paths,
        useGeoJSON: true,
        strokeColor: '#131540',
        strokeOpacity: 0.6,
        strokeWeight: 6
    });

    map.drawPolygon({
        paths: path,
        strokeColor: '#131540',
        strokeOpacity: 0.6,
        strokeWeight: 6
    });
});