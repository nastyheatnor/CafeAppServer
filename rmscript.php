<?php
if(isset($_POST))
{
	$id = $_POST["id"];
	$file = "Menu.xml";

	$doc = simplexml_load_file($file);

	foreach($doc->MenuItems->Item as $item)
	{
	    $crid = intval($item->id['value']);
	    $rmid = intval($id);
	    if($crid === $rmid) {
	        $dom=dom_import_simplexml($item);
	        $dom->parentNode->removeChild($dom);
	    }
	}
	$doc->asXml($file);
}
?>
