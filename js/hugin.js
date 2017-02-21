function populateTable() {

    $.getJSON('domainlist.json', function (data) {
	for (var i = 0; i < data.domainlist.length; i++) {
	    $('#domainTable tbody').append("<tr><td id='"+data.domainlist[i].domain+"_name'>"+data.domainlist[i].domain+"</td><td id='"+data.domainlist[i].domain+"_ip'>"+data.domainlist[i].ip+"</td><td id='"+data.domainlist[i].domain+"_safeWebresult'></td></tr>");
	}
    });
}

function querySafeBrowsingAPI() {

    $.getJSON('config.json', function (data) {
        var apikey = data.apikey;

	var obj = new Object();
        obj.client = new Object();
        obj.client.clientId = "hugin";
        obj.client.clientVersion = "0.0.1";
	obj.threatInfo = new Object();
	obj.threatInfo.threatTypes = ["MALWARE", "SOCIAL_ENGINEERING"];
        obj.threatInfo.platformTypes = ["WINDOWS"];
	obj.threatInfo.threatEntryTypes = ["URL"];
	obj.threatInfo.threatEntries = [];
	obj.threatInfo.threatEntries.push({"url":"jugendzimmergestalten.de"});

alert(apikey);
alert(JSON.stringify(obj));

	
        $.ajax({
	    type: "POST",
	    url: "https://safebrowsing.googleapis.com/v4/threatMatches:find?key="+apikey+" HTTP/1.1",
            data:JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
	    dataType: "json",
            success:function(data){ alert(JSON.stringify(data)); },
            failure: function(errMsg) {alert(errMsg)}
	});

    });
}
