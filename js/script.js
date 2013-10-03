function Log(str, class_attr)
{
	var list = document.getElementById("operations");
	var li = document.createElement("li");
	if(class_attr !== undefined)
		li.setAttribute("class", class_attr);
	li.innerHTML = str;

	list.insertBefore(li, list.firstChild);
}

try
{
	var canvas = document.getElementById("mycanvas");

	if(null == canvas)
		throw "Impossible de trouver la toile sur la page.";

	if(null == canvas.getContext)
		throw "Votre navigateur ne permet pas le dessin avec HTML5";

	canvas.width = 600;
	canvas.height = 300;

	var sogray = "#B3B3B3"; //Soat's gray
	var sogreen = "#99CC00"; //Soat's green
	var soorange = "#E65C00"; //Soat's orange

	/*
	 * Nous importons le logo Soat brut, pour l'utiliser partout
	 * dans le script !
	 */
	var soat = new Image();
	soat.src = "img/logo.png";
	soat.onload = function()
	{
		Log("Logo chargé !", "status");
		var ctx = canvas.getContext('2d');

		/*
		Log("L'image fait " + soat.width + " pixels de large, par " + soat.height + " de haut.");
		Log("Nous l'insérons sur seulement 100 pixels de large.");
		var height = (100/soat.width) * soat.height;
		Log("Nouvelle hauteur : " + height + " pixel(s).");
		ctx.drawImage(soat, 0, 0, 100, height);
		*/
		ctx.drawImage(soat, 0, 0);

		Log("Et maintenant créons une frise !");
		var x = soat.width;
		var r = 1; //Nombre de rotations
		var i = setInterval(function(){

			ctx.save();
			ctx.translate(r * soat.width, 0);
			ctx.rotate(Math.PI / 25 * r);
			ctx.strokeRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(soat, 0, 0);
			ctx.restore();

			r++;
			x += soat.width;

			if(x >= canvas.width){
				Log("Je suis arrivé au bout.", "status");
				clearInterval(i);
			}
		}, 300);
	}
	Log("Chargement du logo de Soat...", "status");
}
catch(str)
{
	console.log(str);
}

