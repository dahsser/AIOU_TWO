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

var mymap = L.map('mapid').setView([-12.0197, -77.0492],16);
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
	div.innerHTML +='<b><i>Investigación de Operaciones 2</i></b>';
	div.innerHTML +='<br><i>Universidad Nacional de Ingenieria</i>';
	
	return div;
}
legend.addTo(mymap);

//Label
/*label = new L.Tooltip()
label.setContent("Qué onda que pex :v")
var labelLocation = new L.LatLng(-12.0152751,-77.0507482);
label.setLatLng(labelLocation)
mymap.showLabel(label);*/


ul = document.getElementById("myUL");
places.sort(function(a,b){
	return a.name.toUpperCase().localeCompare(b.name.toUpperCase());
});
(function(){
	for (var i=0;i<places.length;i+=1) {
    	var place = places[i];
    	if(i<=8){
    		ul.innerHTML+="<a  class='list-group-item list-group-item-action' href='#' onclick='return Marker("+place.latlon.lat+","+place.latlon.lon+")'>"+place.name+"</a>";
    	}else{
    		ul.innerHTML+="<a  class='list-group-item list-group-item-action' style='display: none; href='#' onclick='return Marker("+place.latlon.lat+","+place.latlon.lon+")'>"+place.name+"</a>";
    	}
    	
	}
})();

function Buscador(){
	var input, filter, ul, li, a, i,count=0;
    input = document.getElementById('searchinput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    as = ul.getElementsByTagName('a');

    for (i = 0; i <as.length; i++) {
     	a=as[i];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1 && count<=10) {
            a.style.display = "";
            count+=1;
        } else {
            a.style.display = "none";
        }
    }
}
var marker;
var marker2;
function Marker(lat,lng){
	if(marker!=undefined)marker.removeFrom(mymap)
	var point=[lat,lng];
	destLat=lat;
	destLon=lng;
	marker = L.marker(point);
	marker.addTo(mymap);
}
function Marker2(lat,lng){
	if(marker2!=undefined)marker2.removeFrom(mymap)
	var point=[lat,lng];
	marker2 = L.marker(point);
	marker2.addTo(mymap);
}
function Distance(p1,p2){
	var R = 6371e3;
	var φ1 = p1.lat*Math.PI/180;
	var φ2 = p2.lat*Math.PI/180;
	var Δφ = (p2.lat-p1.lat)*Math.PI/180;
	var Δλ = (p2.lon-p1.lon)*Math.PI/180;
	var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
       		Math.cos(φ1) * Math.cos(φ2) *
        	Math.sin(Δλ/2) * Math.sin(Δλ/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	return  R * c;
}

/*
var queue = new PriorityQueue({ comparator: function(a, b) { return b - a; }})
var lowest = queue.dequeue(); // returns 5
console.log(lowest);*/

//Agregar Puerta 3 5 6
document.getElementById("pt3").addEventListener("click", 
	function(){
		capturarClick({latlng:{lat:-12.0245646,lng:-77.0481607}})
	}
);
document.getElementById("pt5").addEventListener("click", 
	function(){
		capturarClick({latlng:{lat:-12.0179405,lng:-77.0508984}})
	}
);
document.getElementById("pt6").addEventListener("click", 
	function(){
		capturarClick({latlng:{lat:-12.0151859,lng:-77.0517763}})
	}
);


var orLat,orLon;
var destLat,destLon;
function capturarClick(e) {
    orLat = e.latlng.lat.toFixed(7);
    orLon = e.latlng.lng.toFixed(7);
    var texto=document.getElementById("origen");
    mymap.off('click', capturarClick);
	texto.value= orLat+","+orLon;
	Marker2(orLat,orLon);

}
function SeleccionarOrigen(){
	mymap.on('click', capturarClick);
}
function Go(){
	dijkstra({lat:orLat,lon:orLon},{lat:destLat,lon:destLon});
}
var polyline;
function dijkstra(origen,destino){
	if(polyline!=undefined){
		console.log("entro");
		polyline.removeFrom(mymap);
	}
	//find dest point
	var distancias = new Array(edges.length);
	var padres = new Array(edges.length);
	var visto = new Array(edges.length);
	var distActual=distActual2=Infinity;
	var indexOri,indexDest;
	for(var x=1;x<edges.length;x+=1){
		var distancia=Distance(destino,edges[x].latlng);
		if(distancia<45 && distancia<distActual){
			indexDest=x;
			distActual=distancia;
		}
		distancia=Distance(origen,edges[x].latlng);
		if(distancia<45 && distancia<distActual2){
			indexOri=x;
			distActual2=distancia;
		}
	}
	destino=edges[indexDest];
	origen=edges[indexOri];
	for(var x=0;x<edges.length;x+=1){
		distancias[x]=1000000000;
		padres[x] = null;
		visto[x] = false;
	}
	
	var queue = new PriorityQueue({ comparator: function(a, b){
		return a.dist - b.dist;
	}});
	distancias[indexOri]=0;
	queue.queue({i:indexOri,dist:0});
	//console.log(queue);
	//console.log(indexOri,indexDest);
	while(queue.length!=0){
		var u=queue.dequeue();
		//console.log("u.i:",u.i);
		//console.log("dist:",u.dist);
		//console.log(edges[u.i].rela);
		visto[u.i]=true;
		for(var i=0;i<edges[u.i].rela.length;i+=1){
			if(visto[edges[u.i].rela[i]]==false  && distancias[edges[u.i].rela[i]]> distancias[u.i]+Distance(edges[u.i].latlng,edges[edges[u.i].rela[i]].latlng)){
				console.log("update dist:",distancias[u.i]+Distance(edges[u.i].latlng,edges[edges[u.i].rela[i]].latlng));
				distancias[edges[u.i].rela[i]]=distancias[u.i]+Distance(edges[u.i].latlng,edges[edges[u.i].rela[i]].latlng);
				padres[edges[u.i].rela[i]]=u.i;
				queue.queue({i:edges[u.i].rela[i],dist:distancias[edges[u.i].rela[i]]});
			}
		}

	}
	var last=indexDest;
	var route=[];
	/*for(var x=1;x<Math.min(padres.length,36);x+=1){
		console.log(x,padres[x]);
	}*/
	while(last!=null){
		route.push(last);
		last=padres[last];
	}
	route.reverse();
	var latlngs = [[orLat,orLon]];
	for(var i=0;i<route.length;i+=1){
		latlngs.push([edges[route[i]].latlng.lat,edges[route[i]].latlng.lon]);
	}
	latlngs.push([destLat,destLon]);
	console.log(latlngs);
	polyline = L.polyline(latlngs,{color: 'black'});
	polyline.addTo(mymap);
}








