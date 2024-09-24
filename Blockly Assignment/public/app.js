const map = L.map('map').setView([17.385044, 78.486671], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 30,
}).addTo(map);

const carIcon = L.divIcon({
    className: 'car-icon',
html: '<i class="fas fa-car" style="color: black;"></i>',
iconSize: [60, 60],
iconAnchor: [35, 35],

});

const vehicleMarker = L.marker([17.385044, 78.486671], { icon: carIcon }).addTo(map);

let routeControl;
let routePoints = [];
const mapboxAccessToken = 'pk.eyJ1IjoibGlsZXNoIiwiYSI6ImNsemp4ZTc0MzB0aDIya3IxMXF1NWJvbzgifQ.E4mLxZLZCph5ohJB6rtW9w';

document.getElementById('show-route').addEventListener('click', () => {
    const tripType = document.getElementById('trip-select').value;
    let start, end;

    switch (tripType) {
        case 'today':
            start = [17.385044, 78.486671];
            end = [25.43642, 81.84871];
            break;
        case 'yesterday':
            start = [17.395044, 78.486671];
            end = [22.71450, 75.85429];
            break;
        case 'last-week':
            start = [17.515044, 78.486671];
            end = [12.97428,77.59456];
            break;
        default:
            start = [17.855044, 78.486671];
            end = [25.43642, 81.84871];
            break;
    }

    if (routeControl) {
        map.removeControl(routeControl);
    }

    routeControl = L.Routing.control({
        waypoints: [
            L.latLng(start),
            L.latLng(end)
        ],
        router: L.Routing.mapbox(mapboxAccessToken),
        routeWhileDragging: true,
        lineOptions: {
            styles: [{
                color: 'blue',
                opacity: 1.1,
                weight: 5
            }]
        }
    }).addTo(map);

    routeControl.on('routesfound', function(e) {
        routePoints = e.routes[0].coordinates;
    });

    vehicleMarker.setLatLng(start);
    map.panTo(start);
});

document.getElementById('start-movement').addEventListener('click', () => {
    if (routePoints.length === 0) return;

    const totalDuration = 10000;
    const stepTime = totalDuration / routePoints.length;

    let index = 0;

    function move() {
        if (index < routePoints.length) {
            const latlng = L.latLng(routePoints[index].lat, routePoints[index].lng);

            vehicleMarker.setLatLng(latlng);
            map.panTo(latlng);

            index++;
            setTimeout(move, stepTime);
        }
    }

    move();
});