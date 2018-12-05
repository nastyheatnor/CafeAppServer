<?php
function order()
{
	$myFile = "orders.json";
	$arr_data = array();
	$jsondata = file_get_contents($myFile);
	$arr_data = json_decode($jsondata, true);
	$obj = json_decode($_POST["json"], true);

	$obj["id"] = count($arr_data);
	array_push($arr_data,$obj);

	$jsondata = json_encode($arr_data, JSON_PRETTY_PRINT);

	file_put_contents($myFile, $jsondata);

	echo $obj["id"];
}
function change($id)
{
	$myFile = "orders.json";
	$arr_data = array();

	$jsondata = file_get_contents($myFile);
	$arr_data = json_decode($jsondata, true);

	foreach($arr_data as &$value)
	{
		if(intval($value["id"]) === intval($id))
		{
			$value["status"] = $_POST["val"];
		}
	}
	$jsondata = json_encode($arr_data, JSON_PRETTY_PRINT);
	file_put_contents($myFile, $jsondata);
}
if(isset($_POST["json"]))
{
	order();
}
if(isset($_POST["rmid"]))
{
	change($_POST["rmid"]);
}
?>
