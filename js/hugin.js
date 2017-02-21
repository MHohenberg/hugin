var listDomains = [];
$('#alert_malicious').hide();
$('#warning_dns').hide();


function populateTable() {
    $.getJSON('domainlist.json', function (data) {
	listDomains = [];
	for (var i = 0; i < data.domainlist.length; i++) {
	    $('#domainTable tbody').append("<tr><td id='"+data.domainlist[i].domain+"_name'>"+data.domainlist[i].domain+"</td><td id='"+data.domainlist[i].domain+"_ip'>"+data.domainlist[i].ip+"</td><td id='"+data.domainlist[i].domain+"_safeWebresult'></td></tr>");
            listDomains.push(data.domainlist[i].domain);
	}
	querySafeBrowsingAPI();
	queryDNSLookup();
    });
}

function queryDNSLookup() {
    for (var i = 0; i < listDomains.length; i++) {
        $.getJSON('dnslookup.php?q='+listDomains[i], function (data) {
	    if (data.status == "OK") {
		if ($("td[id='"+data.domain+"_ip']").text() == data.ip) {
                   $("td[id='"+data.domain+"_ip']").html(data.ip+'<span class="label label-success">OK</span>');
		} else {
                   var oldIP = $("td[id='"+data.domain+"_ip']").text();
                   $("td[id='"+data.domain+"_ip']").html(oldIP+'<span class="label label-warning">'+data.ip+'</span>');
                }
            }
	});
    }
}

function querySafeBrowsingAPI() {
    $.getJSON('config.json', function (data) {
        var apikey = data.apikey;
	
	var obj = new Object();
        obj.client = new Object();
        obj.client.clientId = "hugin";
        obj.client.clientVersion = "0.1.9";
	obj.threatInfo = new Object();
	obj.threatInfo.threatTypes = ["MALWARE", "SOCIAL_ENGINEERING"];
        obj.threatInfo.platformTypes = ["WINDOWS"];
	obj.threatInfo.threatEntryTypes = ["URL"];
	obj.threatInfo.threatEntries = [];
	
	for (var i = 0; i < listDomains.length; i++) {
		obj.threatInfo.threatEntries.push({"url":listDomains[i]});
	}

	
        $.ajax({
	    type: "POST",
	    url: "https://safebrowsing.googleapis.com/v4/threatMatches:find?key="+apikey+"",
            data:JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
	    dataType: "json",
            success:function(data){

		$("[id*='_safeWebresult']").html('<span class="label label-success">OK</span>')

                for (var i = 0; i < data.matches.length; i++) {
			$('#alert_malicious').show();
			$("td[id='"+data.matches[i].threat.url+"_safeWebresult']").html('<span class="label label-danger">Danger</span>'); 
                }
            },
            failure: function(errMsg) {alert(errMsg)}
	});

    });
}
