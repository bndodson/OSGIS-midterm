var mapOpts = {
    center: [39.9523092490126, -75.19320297314758],
    zoom: 14
};

var map = L.map('map', mapOpts);

var tileOpts = {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
};

var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', tileOpts).addTo(map);

var data;
var markers

var page1 = {
    title: "Center City",
    content: "The locations of active COVID-19 testing sites in Center City Philadelphia",
    bbox: [
        [39.945016, -75.181375],
        [39.958405, -75.141850]
    ]
}

var page2 = {
    title: "West Philly",
    content: "The locations of active COVID-19 testing sites in West Philadelphia",
    bbox: [
        [39.931262, -75.254631],
        [39.983829, -75.181417]
    ]
}

var slides = [
    page1,
    page2
]

var currentPage = 0

var nextPage = function() {
    tearDown()
    var nextPage = currentPage + 1
    currentPage = nextPage
    buildPage(slides[nextPage])
}

var prevPage = function() {
    tearDown()
    var prevPage = currentPage - 1
    currentPage = prevPage
    buildPage(slides[prevPage])
}

var buildPage = function(pageDefinition) {
    markers = data.map(function(e) {
        return L.marker([e.geometry.coordinates[1], e.geometry.coordinates[0]]).addTo(map)
    })

    $('#title').text(pageDefinition.title)
    $('#content').text(pageDefinition.content)
    map.flyToBounds(pageDefinition.bbox)

    if (currentPage === 0) {
        $('#prev').prop("disabled", true)
    } else {
        $('#prev').prop("disabled", false)
    }
    if (currentPage === slides.length - 1) {
        $('#next').prop("disabled", true)
    } else {
        $('#next').prop("disabled", false)
    }
}

var tearDown = function() {
    markers.forEach(function(marker) { map.removeLayer(marker) })
}

$.ajax('https://opendata.arcgis.com/datasets/398ec6ac0b7443babcdd41b40bab3407_0.geojson').done(function(json) {
    data = json.features
    buildPage(slides[currentPage])
})

$('#next').click(nextPage)
$('#prev').click(prevPage)