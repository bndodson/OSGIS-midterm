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

var getTypeColor = function(site) {
    if (site['drive_thruwalk_up'] === "dt") {
        return "#1f78b4";
    } else if (site['drive_thruwalk_up'] === "wu") {
        return "#e31a1c";
    } else if (site['drive_thruwalk_up'] === "both") {
        return "#6a3d9a";
    } else if (site['drive_thruwalk_up'] === null) {
        return "#d9d9d9";
    }
}

var getFacilityColor = function(site) {
    if (site['facility_type'] === "clinic") {
        return "#a6cee3";
    } else if (site['facility_type'] === "fieldSite") {
        return "#b2df8a";
    } else if (site['facility_type'] === "hospital") {
        return "#33a02c";
    } else if (site['facility_type'] === "phmcHC") {
        return "#fb9a99";
    } else if (site['facility_type'] === "cityHC") {
        return "#fdbf6f";
    } else if (site['facility_type'] === "urgentCare") {
        return "#ff7f00";
    } else if (site['facility_type'] === "drugstore") {
        return "#cab2d6";
    } else if (site['facility_type'] === null) {
        return "#d9d9d9";
    }
}

var page1 = {
    title: "Philadelphia's COVID-19 Testing Site Network",
    content: "In partnership with the Philadelphia Department of Public Health, COVID-19 tests are available throughout the Philadelphia metro area.",
    bbox: [
        [40.081224, -74.833031],
        [39.834641, -75.486374]
    ]
}

var page2 = {
    // color markers by drive_thruwalk_up (dt, wu, both)
    title: "Types of Testing Sites",
    content: "There are 3 types of testing sites: (1) Drive-Thru only, (2) Walk-Up only, and (3) Both Drive-Thru and Walk-Up to serve all members in the community.",
    bbox: [
        [40.081224, -74.833031],
        [39.834641, -75.486374]
    ]
}

var page3 = {
    // filter zip for west philly (19131, 19151, 19139, 19104, 19143, 19142, 19153)
    title: "West Philly",
    content: "The city continues to struggle providing testing sites accessible to all residents in the West Philly area. There are far fewer sites in this area than other parts of the city.",
    bbox: [
        [39.931262, -75.254631],
        [39.983829, -75.181417]
    ]
}

var page4 = {
    // color markers by facility_type (clinic, fieldSite, hospital, phmcHC, cityHC, urgentCare, drugstore)
    title: "Facility Types",
    content: "Testing sites are available at a wide variety of facilities including hospitals, urgent cares, clinics, and the city's health centers. Some private pharmacies also offer COVID-19 testing.",
    bbox: [
        [40.081224, -74.833031],
        [39.834641, -75.486374]
    ]
}

var page5 = {
    // filter to show sites where saturday and sunday columns are not blank
    title: "Weekend Testing",
    content: "Testing at select locations is available on the weekends to accomidate more schedules and make testing convenient.",
    bbox: [
        [40.081224, -74.833031],
        [39.834641, -75.486374]
    ]
}

var slides = [
    page1,
    page2,
    page3,
    page4,
    page5
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