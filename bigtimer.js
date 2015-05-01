/**
 * This node is copyright (c) Peter Scargill - but as I've had so many ideas from others -
 * consider it free to use for whatever purpose you like. If you redesign it
 * please remember to drop my name and link in there somewhere.
 * http://tech.scargill.net This software puts out one of two messages on change
 * of state which could be sent to the MQTT node, tests every minute and can be
 * manually over-ridden
 */

module.exports = function(RED) {
	"use strict";
	var SunCalc = require('suncalc');
	
	function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
	
	function randomInt (low, high) {
    var m=Math.floor(Math.random() * (Math.abs(high) - low) + low);
	if (high<=0) return -m; else return m;
}
	
	function bigTimerNode(n) {
		RED.nodes.createNode(this, n);
		var node = this;
	
		var ismanual=-1;
		var timeout=0;
		var startDone=0;
		
		var onlyManual=0;
		
		node.lat = n.lat;
		node.lon = n.lon;
		node.start = n.start;
		node.end = n.end;
		node.startt = n.starttime;
		node.endt = n.endtime;
		node.startOff = n.startoff;
		node.endOff = n.endoff;
		node.outtopic = n.outtopic;
		node.outPayload1 = n.outpayload1;
		node.outPayload2 = n.outpayload2;
		node.outText1 = n.outtext1;
		node.outText2 = n.outtext2;

		node.sun = n.sun;
		node.mon = n.mon;
		node.tue = n.tue;
		node.wed = n.wed;
		node.thu = n.thu;
		node.fri = n.fri;
		node.sat = n.sat;
		node.jan = n.jan;
		node.feb = n.feb;
		node.mar = n.mar;
		node.apr = n.apr;
		node.may = n.may;
		node.jun = n.jun;
		node.jul = n.jul;
		node.aug = n.aug;
		node.sep = n.sep;
		node.oct = n.oct;
		node.nov = n.nov;
		node.dec = n.dec;
		node.suspend=n.suspend;
		node.random=n.random;
		node.repeat=n.repeat;
		node.atstart=n.atstart;
		
		var ison = 0;
		var playit = 0;
		var newEndTime = 0;
		var allowRandom = 0;

		var startcounter =0;
		var endcounter=0; 
		
		var actualStartOffset=0;
		var actualEndOffset=0;
		
		node
				.on(
						"input",
						function(inmsg) {
							var now = new Date();
							var nowOff = -now.getTimezoneOffset() * 60000;
							var times = SunCalc.getTimes(now, node.lat,
									node.lon);
							var nowMillis = Date.UTC(now.getUTCFullYear(), now
									.getUTCMonth(), now.getUTCDate(), now
									.getUTCHours(), now.getUTCMinutes(), 1);
							var midnightMillis = Date.UTC(now.getUTCFullYear(),
									now.getUTCMonth(), now.getUTCDate(), 0, 1);
							var startMillis = Date.UTC(times[node.start]
									.getUTCFullYear(), times[node.start]
									.getUTCMonth(), times[node.start]
									.getUTCDate(), times[node.start]
									.getUTCHours(), times[node.start]
									.getUTCMinutes());
							var endMillis = Date.UTC(times[node.end]
									.getUTCFullYear(), times[node.end]
									.getUTCMonth(), times[node.end]
									.getUTCDate(), times[node.end]
									.getUTCHours(), times[node.end]
									.getUTCMinutes());

							nowMillis += nowOff;
							startMillis += nowOff;
							endMillis += nowOff;

							var outmsg = {
								payload : "",
								topic : ""
							};
							var outmsg2 = {
								payload : "",
								topic : "status"
							};
							var outtext = {
								payload : "",
								topic : ""
							};
							
							if ((node.random) && (allowRandom==1))
							{
								actualStartOffset=randomInt(0,node.startOff);
								actualEndOffset=randomInt(0,node.endOff);
								allowRandom=0;
							}
							
							//var dawn = (((startMillis - midnightMillis) / 60000) + Number(node.endOff)) % 1440;
							//var dusk = (((endMillis - midnightMillis) / 60000) + Number(node.startOff)) % 1440;
							var dawn = (((startMillis - midnightMillis) / 60000)) % 1440;
							var dusk = (((endMillis - midnightMillis) / 60000)) % 1440;
							var today = (Math
									.round((nowMillis - midnightMillis) / 60000)) % 1440;
							var startTime = parseInt(node.startt, 10);
							var endTime = parseInt(node.endt, 10);

							if (startTime == 5000)
								startTime = dawn;
							if (startTime == 6000)
								startTime = dusk;
							if (endTime == 5000)
								endTime = dawn;
							if (endTime == 6000)
								endTime = dusk;
							
							startTime=(startTime+Number(actualStartOffset))%1440;  // experiment - if works no longer call dawn and dusk offsets but start and end offsets
							endTime= (endTime+Number(actualEndOffset))%1440; // experiment
							
							if (inmsg.payload == "reset")
								ison = 0;

							var proceed; proceed = 0;
							var good_day; good_day = 0;

							
							switch (now.getDay()) {
							case 0:
								if (node.sun)
									proceed++;
								break;
							case 1:
								if (node.mon)
									proceed++;
								break;
							case 2:
								if (node.tue)
									proceed++;
								break;
							case 3:
								if (node.wed)
									proceed++;
								break;
							case 4:
								if (node.thu)
									proceed++;
								break;
							case 5:
								if (node.fri)
									proceed++;
								break;
							case 6:
								if (node.sat)
									proceed++;
								break;
							}

							if (proceed)
								switch (now.getMonth()) {
								case 0:
									if (node.jan)
										proceed++;
									break;
								case 1:
									if (node.feb)
										proceed++;
									break;
								case 2:
									if (node.mar)
										proceed++;
									break;
								case 3:
									if (node.apr)
										proceed++;
									break;
								case 4:
									if (node.may)
										proceed++;
									break;
								case 5:
									if (node.jun)
										proceed++;
									break;
								case 6:
									if (node.jul)
										proceed++;
									break;
								case 7:
									if (node.aug)
										proceed++;
									break;
								case 8:
									if (node.sep)
										proceed++;
									break;
								case 9:
									if (node.oct)
										proceed++;
									break;
								case 10:
									if (node.nov)
										proceed++;
									break;
								case 11:
									if (node.dec)
										proceed++;
									break;
								}

							if (proceed >= 2)
								{
								proceed = 1;
								good_day = 1;
								}
							else
								{
								proceed = 0;
								good_day = 0;
								}

							newEndTime = endTime;
							if (endTime > 10000)
								newEndTime = startTime + (endTime - 10000);

							if (proceed) // have to handle midnight wrap
							{
								if (startTime <= newEndTime) {
									if ((today >= startTime)
											&& (today <= newEndTime))
										proceed++;
								} else {
									if ((today >= startTime)
											|| (today <= newEndTime))
										proceed++;
								}
							}

							if (node.suspend) onlyManual=1;
							if (onlyManual) proceed==0;
							
							var justmanual=0;
							
							// manual override
							switch (inmsg.payload)
							{
								case "on"  :
								case "ON"  :
								case "1"   : ismanual=1; timeout=480; justmanual=1; break;
								case "off" :
								case "OFF" :
								case "0"   : ismanual=0;  timeout=480; justmanual=1; break;
								case "default" :
								case "DEFAULT" :
								case "auto" :
								case "AUTO" : ismanual=-1;	onlyManual=0; break;
								case "manual" :
								case "MANUAL" : onlyManual=1; break;
								default :  break;
							}

							if (ismanual==1) proceed=2;
							if (ismanual==0) proceed=1;
							
							if (timeout!==0) if (timeout--==0) ismanual=-1; // kill the timeout after 8 hours
							var duration = 0;
							var manov; if (onlyManual) manov="(schedule on hold)"; else manov="(manual override)";
							if (ismanual!=-1)
							{
								if (ismanual==1) 
									node.status({
										fill : "green",
										shape : "dot",
										text : "ON "+manov
										});
									else
										node.status({
										fill : "red",
										shape : "dot",
										text : "OFF "+manov
										});
							}
							else
							{
								if (good_day==1)
								{
									if (proceed >= 2) {
									if (today <= newEndTime)
										duration = newEndTime - today;
									else
										duration = newEndTime + (1440 - today);
									if (onlyManual)
										node.status({
										fill : "orange",
										shape : "dot",
										text : "On (schedule on hold)"
										});
									else
										node.status({
										fill : "green",
										shape : "dot",
										text : "On for " + pad(parseInt(duration/60),2) + "hrs " + pad(duration%60,2) + "mins"
										});										
								} else {
									if (today <= startTime)
										duration = startTime - today;
									else
										duration = startTime + (1440 - today);
									if (onlyManual)
										node.status({
										fill : "orange",
										shape : "dot",
										text : "Off (schedule on hold)"
										});
									else
										node.status({
										fill : "blue",
										shape : "dot",
										text : "Off for "  + pad(parseInt(duration/60),2) + "hrs " + pad(duration%60,2) + "mins"
										});		
								}
								}
							else
							node.status({
										fill : "black",
										shape : "dot",
										text : "No action today"
									});	
							}

							outmsg.topic = node.outtopic;
							playit=0;
							if (!node.atstart) if (ison==0) ison=-1;
	
	
							if ((!node.atstart)&&(startDone==0)) // no startup output? Ok then set the output accordingly so no change is seen
							{
							  if (proceed>=2) ison=2; else ison=1;
							  startDone=1;
							}						
							
							
							if (proceed >= 2) {	 // OUT OPTION 1						
								if (((ison == 0) || (ison == 1) || (node.repeat))) {
									if ((ison == 0) || (ison == 1)) playit=1;
									outmsg.payload = node.outPayload1;
									outtext.payload=node.outText1;
									if (ison!=2) allowRandom=1; // if a change from previous state, next time allow the random interference
									ison = 2; if (justmanual==1) { ismanual=-1; justmanual=0; } 
									outmsg2.payload = (ison - 1).toString();
									if (playit) node.send([outmsg, outmsg2,outtext]); else node.send([outmsg, outmsg2,null]);
									
								} else
								{
									outmsg2.payload = (ison - 1).toString();
									node.send([null, outmsg2,null]);
								}
								
							} else { // OUT OPTION 2
								if ((ison == 0) || (ison == 2) || (node.repeat)) {
									if ((ison == 0) || (ison == 2)) playit=1;
									outmsg.payload = node.outPayload2;
									outtext.payload=node.outText2;
								    if (ison!=1) allowRandom=1;
									ison = 1; if (justmanual==1) {ismanual=-1; justmanual=0; }
									outmsg2.payload = (ison - 1).toString();
									if (playit) node.send([outmsg, outmsg2,outtext]); else node.send([outmsg, outmsg2,null]);
								} else
								{
									outmsg2.payload = (ison - 1).toString();
									node.send([null, outmsg2,null]);
								}
							}
							startDone=1;
						});

		var tock = setTimeout(function() {
			node.emit("input", {});
		}, 2000); // wait 2 secs before starting to let things settle down -
					// e.g. UI connect

		var tick = setInterval(function() {
			node.emit("input", {});
		}, 60000); // trigger every 60 secs

		node.on("close", function() {
			if (tock) {
				clearTimeout(tock);
			}
			if (tick) {
				clearInterval(tick);
			}
		});

	}
	RED.nodes.registerType("bigtimer", bigTimerNode);
}
