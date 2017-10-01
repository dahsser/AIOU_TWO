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
var mymap = L.map('mapid');
var countriesLayer=L.geoJson(
	lines,
	{style:GetCountriesStyle('white','green')}
).addTo(mymap);
index=1;
L.geoJson(
	multilines,
	{style:GetCountriesStyle('white','#009933')}
).addTo(mymap);
index=2;
L.geoJson(
	multipolygons,
	{style:GetCountriesStyle('#b64a33','black')}
).addTo(mymap);
index=1;
L.geoJson(
	points,
	{style:GetCountriesStyle('white','white')}
).addTo(mymap);
mymap.fitBounds(countriesLayer.getBounds());


var legend = L.control({position:'bottomright'});
legend.onAdd = function(mymap){
	var div = L.DomUtil.create('div','legend');
	var grades=[12345,9999999];
	div.innerHTML +='<i>Investigación de Operaciones 2<i>';
	div.innerHTML +='<br><h3>Universidad Nacional de Ingenieria</h3>';
	return div;
}
legend.addTo(mymap);