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
	var grades=[12345,9999999];
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

//Capturacion manual de puntos
/*function alertLL(e) {
    alert("{lat:"+ e.latlng.lat.toFixed(7) + ",lon:" + e.latlng.lng.toFixed(7)+"}");
    //mymap.off('click', alertLL);
}
mymap.on('click', alertLL);*/


/*var point=[-12.0186886,-77.0503163];
var marker = L.marker(point).addTo(mymap);*/

ul = document.getElementById("myUL");
places.sort(function(a,b){
	return a.name.toUpperCase().localeCompare(b.name.toUpperCase());
});
(function(){
	for (var i=0;i<Math.min(places.length,100);i+=1) {
    	var place = places[i];
    	ul.innerHTML+="<li><a href='#' onclick='return Marker("+place.latlon.lat+","+place.latlon.lon+")'>"+place.name+"</a></li>";
	}
})();

function Buscador(){
	var input, filter, ul, li, a, i,count=0;
    input = document.getElementById('searchinput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName('li');

    for (i = 0; i <li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1 && count<=10) {
            li[i].style.display = "";
            count+=1;
        } else {
            li[i].style.display = "none";
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
	alert("go");
	dijkstra({lat:orLat,lon:orLon},{lat:destLat,lon:destLon});
}

function dijkstra(origen,destino){
	//find dest point
	var distancias = new Array(edges.length);
	var padres = new Array(edges.length);
	var visto = new Array(edges.length);
	var distActual=distActual2=Infinity;
	var indexOri,indexDest;
	for(var x=1;x<edges.length;x+=1){
		var distancia=Distance(destino,edges[x].latlng);
		if(distancia<30 && distancia<distActual){
			indexDest=x;
			distActual=distancia;
		}
		distancia=Distance(origen,edges[x].latlng);
		if(distancia<30 && distancia<distActual){
			indexOri=x;
			distActual2=distancia;
		}
	}
	destino=edges[indexDest];
	origen=edges[indexOri];
	for(var x=0;x<edges.length;x+=1){
		distancias[x]=Infinity;
		padres[x] = null;
		visto[x] = false;
	}
	distancias[indexOri]=0;
	var queue = new PriorityQueue({ comparator: function(a, b){
		return b.dist - a.dist;
	}});

	queue.queue({i:indexOri,dist:0});
	console.log(queue)
	return 0;
	while(queue.length!=0){
		var u=queue.dequeue();
		visto[u.i]=true;
		for(var i=0;i<edges[u.i].rela.length;i+=1){
			if(visto[edges[u.i].rela[i]]==false  && distancias[edges[u.i].rela[i]]> distancia[u.i]+Distance(edges[u.i].latlng,edges[edges[u.i].rela[i]].latlng)){
				distancias[edges[u.i].rela[i]]=distancias[edges[u.i]]+Distance(edges[u.i].latlng,edges[edges[u.i].rela[i]].latlng);
				padres[edges[u.i].rela[i]]=u.i;
				queue.queue({i:edges[u.i].rela[i],dist:distancias[edges[u.i].rela[i]]});
			}
		}

	}
	var last=indexDest;
	var route=[];
	while(last!=indexOri){
		route.push(last);
		last=padres[last];
	}
	console.log(route);
}








