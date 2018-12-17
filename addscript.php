<?php
if(isset($_POST["Request"]) && $_POST["Request"] === "first")
{
 $jsondata = json_decode($_POST["json"], true);

 $file = "Menu.xml";

 $name = $jsondata["name"];
 $type = $jsondata["type"];
 $price = $jsondata["price"];
 $mechanism = $jsondata["mech"];
 $options = $jsondata["options"];

 $xml = simplexml_load_file($file);

 $Menu = $xml->MenuItems;
 $index = intval($xml->index) + 1;
 $xml->index = $index;

 $item = $Menu->addChild('Item');
 $item->addAttribute('mechanism', $mechanism);
 $item->addChild('name')->addAttribute('value', $name);
 $item->addChild('type')->addAttribute('value', $type);
 $item->addChild('id')->addAttribute('value', $index);
 $item->addChild('price')->addAttribute('value', $price);
 $optionsxml = $item->addChild('options');
 foreach ($options as &$option) {
	$optionxml = $optionsxml->addChild('option');
	if($option["type"] === "Text")
	{
		$optionxml->addAttribute('type', $option["type"]);
		$optionxml->addChild('name', $option["name"]);
		$optionxml->addChild('text', $option["optiontext"]);
	}elseif($option["type"] === "Options")
	{
		$optionxml->addAttribute('type', $option["type"]);
		$optionxml->addChild('name', $option["name"]);
		foreach ($option["suboptions"] as &$suboption) {
			$subxml = $optionxml->addChild('suboption');
			$subxml->addChild('name', $suboption["name"]);
			$subxml->addChild('price', $suboption["price"]);
		}
	}elseif($option["type"] === "Addition")
	{
		$optionxml->addAttribute('type', $option["type"]);
		$optionxml->addChild('name', $option["name"]);
		$optionxml->addChild('price', $option["price"]);
	}
 }
 echo $index;

 $xmlDocument = new DOMDocument('1.0');
 $xmlDocument->preserveWhiteSpace = false;
 $xmlDocument->formatOutput = true;
 $xmlDocument->loadXML($xml->asXML());

 $xmlDocument->save("Menu.xml");
// $xml->saveXML($file);
}
elseif(isset($_FILES))
{
 $dir ="/var/www/html/cafe/CafeAppServer/images/MenuImages/";
 move_uploaded_file($_FILES["picture"]["tmp_name"], $dir . $_POST["id"] . "_icon.png");
}

?>
