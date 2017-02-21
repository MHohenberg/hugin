<?php

$result = null;
if ($_REQUEST["q"] == null) {
	$result["status"] = "error";
	$result["error"] = "Parameter missing";
} else {
        $result["status"] = "OK";
	$result["domain"] = $_REQUEST["q"];
	$result["ip"] = gethostbyname($_REQUEST["q"]);
	if ($results["ip"] == $results["domain"]) {
		$results["ip"] = "Domain connected?";
	}
}

header("Content-Type: application/json");
echo json_encode($result);
