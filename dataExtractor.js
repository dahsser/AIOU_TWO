var myModule = require('./dataExport');
var multipolygons=myModule.multipolygons;
var points=myModule.points;

function getCenter(data){
	var x1=0,y1=0;
	var x2=0,y2=0;
	for(var i=0;i<data.length;i+=1){
		x1+=Math.cos(data[i][0]*Math.PI/180);
		y1+=Math.sin(data[i][0]*Math.PI/180);
		x2+=Math.cos(data[i][1]*Math.PI/180);
		y2+=Math.sin(data[i][1]*Math.PI/180);
	}
	return {lat:Math.atan2(y1,x1)*180/Math.PI,lon:Math.atan2(y2,x2)*180/Math.PI};
}

var places=[];
for(var i=0;i<multipolygons.features.length; i+=1){
	if(multipolygons.features[i].properties.name!=null){
		var point={'name':multipolygons.features[i].properties.name};
		//console.log(multipolygons.features[i].geometry.coordinates[0][0]);
		point.latlon=getCenter(multipolygons.features[i].geometry.coordinates[0][0]);
		places.push(point);
	}
}


for(var i=0;i<points.features.length;i+=1){
	if(points.features[i].properties.name!=null){
		var point={
			'name':points.features[i].properties.name,
			'latlon':{
				'lat':points.features[i].geometry.coordinates[0],
				'lon':points.features[i].geometry.coordinates[1]
			}
		};
		places.push(point)
	}
}
console.log(places);