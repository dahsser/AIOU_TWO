var colors=['red','blue','green','black'];
var index=1;
function GetCountriesStyle(color1, color2){
	return function CountriesStyle(feature){
		return {
			fillColor: color1,
			weight:2,
			opacity:1,
			color:color2,
			dashArray:3,
			fillOpacity:0.7
		}
	}
}

var mymap = L.map('mapid').setView([-12.0187, -77.0492],16);
var countriesLayer=L.geoJson(
	lines,
	{style:GetCountriesStyle('white','green')}
).addTo(mymap);

//Meter fondo :v
L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a','b','c'],
    maxZoom: 19
}).addTo( mymap );
index=1;
L.geoJson(
	multilines,
	{style:GetCountriesStyle('white','#009933')}
).addTo(mymap);
/*L.geoJson(
	multipolygons,
	{style:GetCountriesStyle('','')}
).addTo(mymap);*/
/*L.geoJson(
	points,
	{style:GetCountriesStyle('white','white')}
).addTo(mymap);*/
//mymap.fitBounds(countriesLayer.getBounds());


var legend = L.control({position:'bottomright'});
legend.onAdd = function(mymap){
	var div = L.DomUtil.create('div','legend');
	var labels = [
		'Population greater than :vv', 
		'Population :vv','acdefg :v'
	];
	var grades=[12345,9999999];
	div.innerHTML +='<b><i>Investigación de Operaciones 2</i></b>';
	div.innerHTML +='<br><i>Universidad Nacional de Ingenieria</i>';
	
	return div;
}
legend.addTo(mymap);

//Label
/*label = new L.Tooltip()
label.setContent("Qué onda que pex :v")
var labelLocation = new L.LatLng(-12.0186886,-77.0503163);
label.setLatLng(labelLocation)
mymap.showLabel(label);*/

function alertLL(e) {
    alert("{lat:"+ e.latlng.lat + ",lon:" + e.latlng.lng+"}");
    //mymap.off('click', alertLL);
}
mymap.on('click', alertLL);




/*var point=[-12.0186886,-77.0503163];
var marker = L.marker(point).addTo(mymap);*/