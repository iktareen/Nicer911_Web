var username = "harry";
var password = "potter";

var messages = [];
var profiles = [];
var sensor_data = [];
var tweets = [];
var locations=[];
var markers;
var markerCluster;
var persons = [];
var lt,lo;
var mymap;
var draw_circle;



$(document).ready(function(){
	
	
	if(navigator.onLine) { 
	
	console.log('online');
	
	var url = "http://localhost/restful/rhizome/bundlelist.json";
	authGet(url, function(data){
		console.log(data);
	});
	
	
	}else{
		console.log('ofline');
	}
	
	
	
	
	getFileList(function(data){
		if(data && data.hasOwnProperty('rows'))
		{
			for(var i=0; i < data.rows.length; i++)
			{
				var name = data.rows[i][13];
				var obj = {id: data.rows[i][3], name: name, token: data.rows[i][0], date: data.rows[i][5]};
				
				if(name.indexOf("_m") > -1 && name.indexOf("_mr") == -1)
				{
					// type message
					messages.push(obj);
					
				}
				else if(name.indexOf('_p') > -1 && name.indexOf('_pr') == -1)
				{
					// type profile
					profiles.push(obj);
				}
				else if(name.indexOf('_t') > -1)
				{
					// type tweet
					tweets.push(obj);
				}
				else if(name.indexOf('_sd') > -1)
				{
					// type sensor data
					sensor_data.push(obj);
				}
			}
			
			
			
			navigator.geolocation.getCurrentPosition(function(position) {
	//console.log(position.coords.latitude, position.coords.longitude);
	lt=position.coords.latitude;
	lo=position.coords.longitude;
	
	draw_circle = new google.maps.Circle({
        center: {lat:lt,lng:lo},
        radius: parseFloat(5000),
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: mymap
		});
		
		$('#sliderV').removeClass("hide");
		drawCircle(5000);	
 
			});
			
			
			var myLatLng = {lat: 49.874079, lng: 8.651733};
			
			mymap = new google.maps.Map(document.getElementById('gmap-1'), {
			  zoom: 10,
			  center: myLatLng
			});
			
			
			
			
			var shape = {
    coords: [1, 1, 1, 20, 18, 20, 18, 1],
    type: 'poly'
  };


		
var image3;

var lat=49.880573; var lng=8.677363;
for(var v=0; v<1000; v++){
	
if(v%20==0){
	image3={
		url: 'assets/police-small.png',
    size: new google.maps.Size(31, 71),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(17, 34),
  scaledSize: new google.maps.Size(30, 35)
	};
}else if(v%25==0){
	image3={
		url: 'assets/fire-extinguisher-small.png',
    size: new google.maps.Size(31, 71),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(17, 34),
  scaledSize: new google.maps.Size(30, 35)
	};
}else{
	image3 = {
  url: 'assets/users-small.png',
  size: new google.maps.Size(31, 71),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(17, 34),
  scaledSize: new google.maps.Size(30, 35)
};
}




var infowindow = new google.maps.InfoWindow({
          content: '<h5></h5><br><button class="btn btn-danger btn-sm" data-toggle="modal" data-target="#myModal" id="messageBtn" value="">Message</button>'
        });
	
	var ob={pos:{lat:lat,lng:lng},img:image3,iw:infowindow};
	locations.push(ob);
	
	lat=Math.random() * (49.920000 - 49.860000) + 49.860000;
	lng=Math.random() * (8.720000 - 8.630000) + 8.630000;
	

			
		}
	
	//console.log(locations); 
	
	markers = locations.map(function(locations, i) {
          var marker=new google.maps.Marker({
            position: locations.pos,
			icon: locations.img
          });
		  marker.addListener('click', function() {
          locations.iw.open(mymap, marker);
        });
		
		return marker;
        });

        // Add a marker clusterer to manage the markers.
        markerCluster = new MarkerClusterer(mymap, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'}); 
      

      
			
			//console.log("message data"+messages);
			
			
			  profiles.sort(function(a, b){
				
				var d1=a.date;
				var d2=b.date;
				
				return d2-d1;
				
			}); 
			
			/* var flags2 = [], output2 = [], l2 = profiles.length, i2;
			for( i2=0; i2<l2; i2++) {
			if( flags2[profiles[i2].name]) continue;
			flags2[profiles[i2].name] = true;
			output2.push(profiles[i2]); */
			

			
			 sensor_data.sort(function(a, b){
				
				var d1=a.date;
				var d2=b.date;
				
				return d2-d1;
				
			});  
			
			//console.log(JSON.stringify(profiles));
			//console.log("tweets data"+tweets);
			//console.log(sensor_data);
			// Fill up sensor data
			
			
			
			var flags = [], output = [], l = sensor_data.length, i;
			for( i=0; i<l; i++) {
			if( flags[sensor_data[i].name]) continue;
			flags[sensor_data[i].name] = true;
			output.push(sensor_data[i]);
			}
			
			

			console.log(output);
			for(var i = 0; i < output.length; i++)
			{
			
				
				//if(output[i].token!=null)
				getFile(output[i].id, function(filedata){
					persons.push(filedata);
					//console.log(filedata);
					
					//saveSensorData(filedata);
					
					showPersonOnMap(mymap,filedata);
				}); 
			}
			
			
		
			
			 for(var i = 0; i < tweets.length; i++)
			{
				if(i > 5)
					break;
				
				getFile(tweets[i].id, function(filedata){
					showTweet(filedata);
				}); 
			}
			
			
			for(var i = 0; i < messages.length; i++)
			{
				if(i > 5)
					break;
				
				getFile(messages[i].id, function(filedata){
					getName(filedata);
				}); 
			}  
			
		}
		
	});
	
});




function syncWithPi(){
	
	
	var flags = [], output = [], l = sensor_data.length, i;
			for( i=0; i<l; i++) {
			if( flags[sensor_data[i].name]) continue;
			flags[sensor_data[i].name] = true;
			output.push(sensor_data[i]);
			}
			
	
	var flags2 = [], output2 = [], l2 = profiles.length, i2;
			for( i2=0; i2<l2; i2++) {
			if( flags2[profiles[i2].name]) continue;
			flags2[profiles[i2].name] = true;
			output2.push(profiles[i2]);
			}
			
	
	for(var i = 0; i < output.length; i++)
			{
				
				getFile(output[i].id, function(filedata){
					//var data={uuid:filedata.uuid, name: filedata.name, date: filedata.created, description:filedata.description, image:filedata.image, public_key:filedata.public_key, sender:filedata.sender};
					//saveUserData(data);
					saveSensorData(filedata);
					
				}); 
			} 
			
			
			for(var i = 0; i < output2.length; i++)
			{
				
				getFile(output2[i].id, function(filedata){
					var data={uuid:filedata.uuid, name: filedata.name, date: filedata.created, description:filedata.description, image:filedata.image, public_key:filedata.public_key, sender:filedata.sender};
					saveUserData(data);
				}); 
			} 
			
		
		  for(var i = 0; i < tweets.length; i++)
			{
			
				
				getFile(tweets[i].id, function(filedata){
					saveTweets(filedata);
				}); 
			} 
			
			 
			 for(var i = 0; i < messages.length; i++)
			{
				;
				
				getFile(messages[i].id, function(filedata){
					saveMessages(filedata);
				}); 
			} 
			
	
}


function saveUserData(data){
	//console.log(data.sender);
	var obj=data;
	obj= JSON.stringify(obj);
			
			//console.log(temp);
		
			 $.ajax({

                    url: '/saveData',
                    data: obj,
                    dataType: 'json',
					contentType : 'application/json',
                    processData: false,
                    type: 'POST',

                    }).done(function(data) {

                        //console.log('data=='+output);
                    });
}

function saveChat(){
	
	
	var chat=document.getElementById("chatBox").value;
	document.getElementById("chatBox").value="";
	$('#myModal').modal('hide');
	var sender=document.getElementById("messageBtn").value;

	console.log(sender);
	var uuid = guid();
	
	var d = new Date();
	var dat = d.getTime(); 
	
	var obj={created: dat, uuid: uuid, content: chat, receiver: sender, sender: 'f3751173cf413033da9676f3ac6086157005059c'};
	obj= JSON.stringify(obj);
	
	$.ajax({

                    url: '/message',
                    data: obj,
                    dataType: 'json',
					contentType : 'application/json',
                    processData: false,
                    type: 'POST',
					
                    }).done(function(data) {

						uploadFile(data);
                        console.log(data);
                    });

	
}


function saveTweets(data){
	
	
	var obj={uuid: data.uuid, content:data.content, sender: data.sender};
	obj= JSON.stringify(obj);
	
	$.ajax({

                    url: '/tweetData',
                    data: obj,
                    dataType: 'json',
					contentType : 'application/json',
                    processData: false,
                    type: 'POST',
					
                    }).done(function(data) {

						//uploadFile(data);
                        //console.log(data);
                    });
	
}


function saveMessages(data){
	
	if(data.receiver=='f3751173cf413033da9676f3ac6086157005059c'){
	var obj={uuid: data.uuid, created:data.created, receiver:data.receiver, content:data.content, sender: data.sender};
	obj= JSON.stringify(obj);
	
	$.ajax({

                    url: '/messagesData',
                    data: obj,
                    dataType: 'json',
					contentType : 'application/json',
                    processData: false,
                    type: 'POST',
					
                    }).done(function(data) {

						//uploadFile(data);
                        //console.log(data);
                    });
	}
	
}


function saveSensorData(data){
	
	
	var obj={created: data.created, uuid: data.uuid, latitude: data.latitude, longitude: data.longitude, sender: data.sender};
	obj= JSON.stringify(obj);
	
	$.ajax({

                    url: '/sensorData',
                    data: obj,
                    dataType: 'json',
					contentType : 'application/json',
                    processData: false,
                    type: 'POST',
					
                    }).done(function(data) {

						//uploadFile(data);
                        //console.log(data);
                    });
	
}


function curve25519b32(a, b) {
  if (b != null) {
	b = c255lbase32decode(b);
  };
  return c255lbase32encode(curve25519(c255lbase32decode(a), b));
}

function uploadFile(data2){
	
	var id=curve25519b32('neicer',curve25519b32('neicer')).toUpperCase();
	var d = new Date();
	var n = d.getTime(); 
	var file="C:/Program Files/nodejs/site/public/chat/"+data2.a+"_m";
	
	
	var data=new FormData();
	data.append("manifest", (new Blob([], {type:"rhizome/manifest", format: "text+binarysig"})), data2.a+"_m");
	data.append("payload", new Blob([data2.b], {}),  data2.a+"_m");
	
	
	$.ajax
	({
	  type: "POST",
	  url: "http://localhost:4110/restful/rhizome/insert",
	  data:data,
	  processData: false,
      contentType:false,
	  headers: {
		"Authorization": "Basic " + btoa(username + ":" + password)
	  }, 
	  success: function (data){
		console.log(data);
	  },
	  error:function(data){
		console.log("error"); 
	  }
	});
	
}



function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}



function showPersonOnMap(mymap, data)
{
	/* var lt, lo;
	navigator.geolocation.getCurrentPosition(function(position) {
	console.log(position.coords.latitude, position.coords.longitude);
	lt=position.coords.latitude;
	lo=position.coords.longitude;
}); */
	
	$.ajax({

             url: '/getName',
             data: JSON.stringify({sen:data.sender}),
             dataType: 'json',
			 contentType : 'application/json',
             processData: false,
             type: 'POST'
				
			
             }).done(function(data2) {

				var infowindow = new google.maps.InfoWindow({
          content: '<h5>'+data2+'</h5><br><button class="btn btn-danger btn-sm" data-toggle="modal" data-target="#myModal" id="messageBtn" value='+data.sender+' >Message</button>'
        });

	
	var loc = {lat: data.latitude, lng: data.longitude};
	var shape = {
    coords: [1, 1, 1, 20, 18, 20, 18, 1],
    type: 'poly'
  };

  var im = {
  url: 'assets/users-small.png',
   size: new google.maps.Size(31, 71),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(17, 34),
  scaledSize: new google.maps.Size(30, 35)
};
	//var ico={ size: new google.maps.Size(32, 32), url:'assets/users-small.png',origin: new google.maps.Point(0, 0), anchor: new google.maps.Point(0, 32)};
	var marker = new google.maps.Marker({
	  position: loc,
	  draggable: true,
	  map: mymap,
	  title: data2.name,
	  icon: im,
	  shape:shape
	});
	marker.addListener('click', function() {
          infowindow.open(mymap, marker);
        });
		
		
				
        });
	
	
		
	

}



function showTweet(data)
{
	var time = timeConverter(data.created);
	var message = data.content.split('\n')[0];
	var sender = data.sender;
	
	var html = `<li class="unread">
				<a onClick="gotoTweets()">
					<p>` + message +
						`<br><i>` + time + `</i>
					</p>
				</a>
			</li>`;
			
	$("#notifications .notif-header").after(html);
	
	// For sidebar
	var html = `<li><a onClick="gotoTweets()"> `+ message +` <span class="muted">` + time + `</span></a></li>`
	$("#notification-list").append(html);
	
	var noti_count = parseFloat($('#noti_count').text()) || 0;
	noti_count++;
	$('#noti_count').text(noti_count);
	$('#noti_count').removeClass('hide');
}


function showMessages(data, sender){
	
	//console.log(data);
	if(data.receiver=="f3751173cf413033da9676f3ac6086157005059c"){
	var time = timeConverter(data.created);
	var message = data.content.split('\n')[0];
	var html = `<li class="unread">
				<a onClick="gotoInbox()">
					<p>` + message +
						`<br><i>` + time + `</i>
					</p>
				</a>
			</li>`;
			
	$("#messages .notif-header").after(html);
	
	// For sidebar
	 var html = `<span class="sender"><i class="icon-star text-yellow-2"></i>` +sender+`</span><li><a onClick="gotoInbox()"> `+ message +` <span class="muted"><br>` + time + `</span></a></li>`
	$("#inbox-list").append(html);
	
	var msg_count = parseFloat($('#messageCount').text()) || 0;
	msg_count++;
	$('#messageCount').text(msg_count);
	$('#messageCount').removeClass('hide');
	}	
	
}

function gotoInbox(){
	
	console.log("go to inbox");
	//window.location.replace("inbox.html");
	document.getElementById("body").style.display = 'none';
	document.getElementById("body2").style.display = 'block';
	$("#tbody").removeClass('hide');
	$("#reply").addClass('hide');
	$('#ibTwt').addClass('active');
	$("#tbody").empty();
	$('#ibMsg').addClass('active');
	$('#ibTwt').removeClass('active');
	
	$.ajax({

             url: '/getMessages',
             dataType: 'json',
			 contentType : 'application/json',
             processData: false,
             type: 'POST'
				
             }).done(function(data2) {
				 
				 for(var i=0; i<data2.length; i++){
					 console.log(data2[i].content);
					 

					var html=`<tr class="unread"><td><a >Message</a></td><td><a onClick="openMessage(\'`+data2[i].content+`,`+data2[i].sender+`\')">`+data2[i].content+`</a></td></tr>`
					 $('#tbody').append(html);	
					
				 }

			 });
			 
		
	
	
}

function openMessage(content,sender){
	
	$("#tbody").addClass('hide');
	$("#msgBody").removeClass('hide');
	$("#msgBody").empty();
	$("#reply").removeClass('hide');
	
	var split=content.split(",");
	content=split[0];
	sender=split[1];
	
	
	
	 $.ajax({

             url: '/getName',
             data: JSON.stringify({sen:sender}),
             dataType: 'json',
			 contentType : 'application/json',
             processData: false,
             type: 'POST'
				
			
             }).done(function(data) {

				var html='<hr><p>Sender:'+data+'</p><br><p>Content:'+content+'</p></hr>';
				$("#msgBody").append(html);
				$("#sendMessage2").val(sender);
				
              }); 
	
}

function sendMessage2(){
	
	//console.log($("#sendMessage2").val());
	
	var text=$('#messageBox2').val();
	$('#messageBox2').val('');
	var sender=$("#sendMessage2").val();
	var html='<hr><p style="text-align:left;">Sender:911</p><br><p>Content:'+text+'</p></hr>';
	$("#msgBody").append(html);
	
	
	
	
	var uuid = guid();
	
	var d = new Date();
	var dat = d.getTime(); 
	
	var obj={created: dat, uuid: uuid, content: text, receiver: sender, sender: 'f3751173cf413033da9676f3ac6086157005059c'};
	obj= JSON.stringify(obj);
	
	$.ajax({

                    url: '/message',
                    data: obj,
                    dataType: 'json',
					contentType : 'application/json',
                    processData: false,
                    type: 'POST',
					
                    }).done(function(data) {

						uploadFile(data);
                        console.log(data);
                    });

	
	
	
}

function gotoTweets(){
	
	console.log("go to inbox");
	//window.location.replace("inbox.html");
	document.getElementById("body").style.display = 'none';
	document.getElementById("body2").style.display = 'block';
	
	$("#tbody").empty();
	$("#tbody").removeClass('hide');
	$("#msgBody").addClass('hide');
	$("#reply").addClass('hide');
	$('#ibTwt').addClass('active');
	$('#ibMsg').removeClass('active');
	$.ajax({

             url: '/getTweets',
             dataType: 'json',
			 contentType : 'application/json',
             processData: false,
             type: 'POST'
				
             }).done(function(data2) {
				 
				 for(var i=0; i<data2.length; i++){
					 console.log(data2[i].content);
					 

					var html=`<tr class="unread"><td><a href="">Tweet</a></td><td><a href="">`+data2[i].content+`</a></td></tr>`
					 $('#tbody').append(html);	
					
				 }

			 });
	
}


function getName(data1){
	
	$.ajax({

             url: '/getName',
             data: JSON.stringify({sen:data1.sender}),
             dataType: 'json',
			 contentType : 'application/json',
             processData: false,
             type: 'POST',
	
			
             }).done(function(data) {

				showMessages(data1,data);
				
              });
	
}


function getFileList(callback)
{
	var url = "http://localhost:4110/restful/rhizome/bundlelist.json";
	authGet(url, function(data){
		callback(data);
	});
}

function getFile(id, callback)
{
	var url = "http://localhost:4110/restful/rhizome/" + id + "/raw.bin";
	authGet(url, function(data){
		//console.log(data);
		callback(data);
	});
}

function authGet(url, callback)
{
	$.ajax
	({
	  type: "GET",
	  url: url,
	  dataType: 'json',
	  async: true,
	  headers: {
		"Authorization": "Basic " + btoa(username + ":" + password)
	  },
	  success: function (data){
		callback(data);
	  }
	});
}

function drawCircle(radius){
	console.log('rad'+radius);
	draw_circle.setRadius(parseFloat(radius));
		
		var locations2=[];
for(var u=0; u<locations.length; u++){
//markers[u].setMap(null);
markerCluster.clearMarkers();
/* var dLat = (lt - locations[u].pos.lat) * Math.PI / 180;
var dLon = (lo - locations[u].pos.lng) * Math.PI / 180;
var a = 0.5 - Math.cos(dLat) / 2 + Math.cos(locations[u].pos.lat * Math.PI / 180) * Math.cos(lt * Math.PI / 180) * (1 - Math.cos(dLon)) / 2;
d = Math.round(6371000 * 2 * Math.asin(Math.sqrt(a))); */
		
		var point=new google.maps.LatLng(locations[u].pos.lat, locations[u].pos.lng);
		var center=new google.maps.LatLng(lt, lo);
		
		var d=google.maps.geometry.spherical.computeDistanceBetween(point, center)<=radius;
		
	if(!d){
		//locations.splice(u,1);
		
	}else{
		//console.log(google.maps.geometry.spherical.computeDistanceBetween(point, center));
		locations2.push(locations[u]);
	}
	
		}
		
		
		markers = locations2.map(function(locations2, i) {
          var marker=new google.maps.Marker({
            position: locations2.pos,
			icon: locations2.img

          });
		  marker.addListener('click', function() {
          locations2.iw.open(mymap, marker);
        });
		
		return marker;
        });

        // Add a marker clusterer to manage the markers.
        markerCluster = new MarkerClusterer(mymap, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'}); 
	
}

function timeConverter(UNIX_timestamp){
	
var date = new Date(UNIX_timestamp);
date=date.toUTCString().replace(/\s*(GMT|UTC)$/, "")
return date;

}