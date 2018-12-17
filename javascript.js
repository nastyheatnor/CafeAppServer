var xml;

function pwPrompt(text)
{
	var modal = document.getElementById("myModal");
	var textinner = document.getElementsByClassName("modal-text")[0];
	modal.style.display = "block";
	textinner.innerHTML = text;

	var pwdbox = document.getElementById("pwdinpt");
	var button = document.getElementById("pwd-submt");

	button.onclick = function()
	{
		enterPassword(modal, pwdbox.value);
	}
}

function enterPassword(modal, password)
{
	var xhttp = new XMLHttpRequest();
	var response = "";
	xhttp.onreadystatechange = function() {
	        if (this.readyState == 4 && this.status == 200) {
			response = this.responseText;
			if(response == "1")
			{
				localStorage.setItem("pwd", password);
				modal.style.display = "none";
			}else
			{
				alert("Password incorrect! Try again.");
			}
		}
	};
	var params = "pwd=" + password;
	xhttp.open("POST", "passwdscript.php", true);
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send(params);
}

function run()
{
//	document.getElementById("wrapper").style.width = screen.width + "px";
//	document.getElementById("wrapper").style.height = (screen.height - 22) + "px";
//	document.getElementsByTagName("body")[0].style.margin = -5 + "px";
}

function getIP()
{
	return "";
}

function retrieveParser()
{
	if(xml == null || typeof xml == "undefined")
	{	
	var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
	        	if (this.readyState == 4 && this.status == 200) {
				xml = this.responseXML;
			}
	        };
	        xhttp.open("POST", getIP() + "Menu.xml", false);
	        xhttp.send();
		return xml.getElementsByTagName("Item");
	}else
	{
		return xml.getElementsByTagName("Item");
	}
}
function parseFromMenu(xml, mechanism)
{
	var menarr = retrieveParser();
	var htmtext = "";

	for(var i = 0; i < menarr.length; i++)
	{
		if(menarr[i].getAttribute("mechanism").indexOf(mechanism) !== -1)
		{
    		htmtext += `<button class="order" onClick="addToCart(` + readAttribute(menarr[i],"id") + `)" style="background-image: url(images/MenuImages/` + readAttribute(menarr[i], "id") + `_icon.png);">
			<span class="btn-price">` + readAttribute(menarr[i], "price") + `</span>
			<span class="btn-text">` + readAttribute(menarr[i], "name") + `</span></button>`;
		}
	}
	var basetable = document.getElementById("base-table");
	basetable.innerHTML = htmtext;
}
function readAttribute(elem, attr)
{
	return elem.getElementsByTagName(attr)[0].getAttribute("value");
}

function parseDirect(id, attr)
{
	var menarr = retrieveParser();
	var htmtext = "";

	for(var i = 0; i < menarr.length; i++)
	{
		if(menarr[i].getElementsByTagName("id")[0].getAttribute("value") === id)
		{
    		return menarr[i].getElementsByTagName(attr)[0].getAttribute("value");
		}
	}
}
function load(mechanism)
{
	run();
	
	parseFromMenu(xml,mechanism);
	if(mechanism !== localStorage.getItem("mechanism"))
	{
		localStorage.setItem("mechanism", mechanism);
		localStorage.setItem("cart", "");
	}
	retrieveCart();
}

function getCartMenu()
{
	run();
	var cart = getCart();
	var display = document.getElementById("menu-listing");
	var count = document.getElementById("count");
	var price = document.getElementById("price");
	var result = "";
	for(var i = 0; i < cart.length; i++)
	{
		var xm = getById(cart[i]);
		result += "<button class=\"cart-item\" onClick=\"remove(" + cart[i] + 
			")\" style=\"background-image: url(images/MenuImages/" + cart[i] + 
			"_icon.png); height:100px; width:25%; margin-left:2%; margin-right:2%; \"><span class=\"cart-item-txt\">" + readAttribute(xm, "name") + "</span></button>";
	}
	if(cart.length == 1)
	{
		count.innerHTML = cart.length + " Item"; 
	}else
	{
		count.innerHTML = cart.length + " Items"; 
	}
	
	price.innerHTML = "$" + getTotalPrice().toFixed(2);
	display.innerHTML = result;
}

function retrieveCart()
{
	var display = document.getElementById("current-order");
	var count = document.getElementById("count");
	var price = document.getElementById("price");
	var result = "";
	var cart = getCart();
	for(var i = 0; i < cart.length; i++)
	{
		var xm = getById(cart[i]);
		result += "<button class=\"cart-item\" onClick=\"removeFromCart(" + cart[i] + 
			")\" style=\"background-image: url(images/MenuImages/" + cart[i] + 
			"_icon.png); \"><span class=\"cart-item-txt\">" + 	readAttribute(xm, "name") + "</span></button>";
	}
	if(cart.length == 1)
	{
		count.innerHTML = cart.length + " Item"; 
	}else
	{
		count.innerHTML = cart.length + " Items"; 
	}
	
	price.innerHTML = "$" + getTotalPrice().toFixed(2);
	display.innerHTML = result;
}

function clearCart()
{
	var cart = getCart();
	for(var i = 0; i < cart.length; i++)
	{
		removeFromCart(0);
	}
}

function getCart()
{
	var storedNames = localStorage.getItem("cart").split("/");

	var result = [];
	for(var i = 0; i < storedNames.length; i++)
	{
		if(storedNames[i] !== null && storedNames[i] !== undefined && storedNames[i] !== "")
		{
			result.push(storedNames[i]);
		}
	}
	return result;
}

function getById(id)
{
	var menarr = retrieveParser();
	
	for(var i = 0; i < menarr.length; i++)
	{
		var element = menarr[i];
		if(menarr[i] !== null)
		{
			if(readAttribute(element, "id").toString() === id.toString())
			{
				return element;
			}
		}
	}
}

function addToCart(id)
{
	var cart = localStorage.getItem("cart") + "/" + id;
	localStorage.setItem("cart", cart);
	retrieveCart();
}

function remove(id)
{
	var cartItemsArr = localStorage.getItem("cart").split("/");
	var cart = "";
	var rmbool = false;
	for(var j = 0; j < cartItemsArr.length; j++)
	{
		if(cartItemsArr[j] !== null && cartItemsArr[j] !== undefined && cartItemsArr[j] !== "")
			{
				if(cartItemsArr[j].toString() !== id.toString() || rmbool)
				{
					cart += cartItemsArr[j] + "/";
				}else
				{
					rmbool = true;
				}
			}
		localStorage.setItem("cart", cart);
	}
	getCartMenu();
}

function removeFromCart(id)
{
	var cartItemsArr = localStorage.getItem("cart").split("/");
	var cart = "";
	var rmbool = false;
	for(var j = 0; j < cartItemsArr.length; j++)
	{
		if(cartItemsArr[j] !== null && cartItemsArr[j] !== undefined && cartItemsArr[j] !== "")
			{
				if(cartItemsArr[j].toString() !== id.toString() || rmbool)
				{
					cart += cartItemsArr[j] + "/";
				}else
				{
					rmbool = true;
				}
			}
		localStorage.setItem("cart", cart);
	}
	retrieveCart();
}

function getTotalPrice()
{
	var cart = getCart();
	var price = 0;
	for(var i = 0; i < cart.length; i++)
	{	
		price += parseFloat(getPrice(cart[i]));	
	}
	return price;	
}

function getPrice(id)
{
	return parseDirect(id, "price");
}

function goback()
	{
		var mechanism = localStorage.getItem("mechanism");
		if(mechanism === "BFLP")
		{
			location.href='BatesLunchProgram.html'
		}else if(mechanism === "MHC")
		{
			location.href='MarylandHallCatering.html'
		}else if(mechanism === "RP")
		{
			location.href='RapidPickup.html'
		}
	}
