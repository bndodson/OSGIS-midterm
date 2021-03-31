var mapOpts = {
    center: [0, 0],
    zoom: 2
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
    title: "page1",
    content: "This is the content for page 1.",
    bbox: [
        [34.813803317113155, -14.150390625],
        [59.44507509904714, 30.3662109375]
    ]
}

var page2 = {
    title: "page2",
    content: "This is the content for page 2.",
    bbox: [
        [-45.76752296214988, 105.205078125],
        [-2.0210651187669897, 160.3125]
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
    markers = data.map(function(capital) {
        return L.marker([capital.CapitalLatitude, capital.CapitalLongitude])
    })
    markers.forEach(function(marker) { marker.addTo(map) })

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

$.ajax('https://raw.githubusercontent.com/CPLN692-MUSA611-Open-Source-GIS/datasets/master/json/world-country-capitals.json').done(function(json) {
    var parsed = JSON.parse(json)
    data = parsed.map(function(datum) {
        datum.CapitalLatitude = Number(datum.CapitalLatitude)
        datum.CapitalLongitude = Number(datum.CapitalLongitude)
        return datum
    })

    buildPage(slides[currentPage])
})

$('#next').click(nextPage)
$('#prev').click(prevPage)