//original source :  http://timelessname.com/sandbox/matrix.html
var matrix = document.getElementById('matrix');
var ctx = matrix.getContext('2d');

/* La toile prend tout l'espace à l'écran */
matrix.height = window.screen.availHeight;
matrix.width = window.screen.availWidth;

var ypositions = new Array(); /* Mémoire de l'ordonnée courante*/
var characters = new Array(); /* Mémoire du caractère courant */
var clmncolors = new Array(); /* Mémoire de la couleur courante */

/* Les véritables couleurs officielles, merci Melvyna ! */
var sogray = "#B3B3B3";
var sogreen = "#99CC00";
var soorange = "#e65c00";

var chars = ['S', 'o', '@', 't']; /* Les caractères que nous affichons */
var colors = [sogreen, sogray, soorange]; /* Les couleurs que peuvent prendre ces caractères. */

/*
 * Nous calculons le nombre de colonnes à dessiner en fonction
 * de la largeur du plus gros caractère.
 * Il est inutile de dessiner des colonnes qui sortent de la toile.
 *
 * Pour être encore plus générique le code devrait boucler sur "chars"
 * et déterminer lui même le plus large des caractères.
 */
var cw = ctx.measureText("@").width + 10; /* Nous ajoutons 10 pixels pour aérer entre deux colonnes de '@' */
var ch = 10; /* Nous aurons un caractère tous les 10 pixels verticalement. */
var nbc = Math.floor(matrix.width / cw); /* nbc pour "number of columns" */

/*
 * i est l'indice d'une colonne.
 * ResetColumn attribue aléatoirement une couleur et un caractère à la colonne i.
 * L'ordonnée courante est remise à 0. (Donc on reprendra le dessin depuis le haut.)
 */
function ResetColumn(i)
{
	ypositions[i] = 0;
	characters[i] = chars[Math.floor(Math.random() * chars.length)];
	clmncolors[i] = colors[Math.floor(Math.random() * colors.length)];
}

/* Une petite initialisation */
for (i = 0; i < nbc; i++)
{
	ResetColumn(i);
	/* 
	 * Pour éviter l'effet "rideau" (tous les points ont 0 en ordonnée)
	 * nous attribuons une ordonnée aléatoire.
	 * Du coup les colonnes "démarrent" n'importe où sur la toile.
	 *
	 * L'ordonnée peut pointer au delà de la toile (matrix.height * 3), 
	 * c'est volontaire. De cette manière toutes les colonnes n'apparaissent 
	 * pas lorsque la page est chargée. C'est moins brutal.
	 */
	ypositions[i] = Math.floor(Math.random() * matrix.height * 3) 
}

/* L'action à répéter périodiquement. */
function step() 
{
	/*
	 * Dessin d'un rectangle très transparent.
	 * Tous les points précédemment tracés deviennent 5% plus transparents.
	 * Après 20 appels nous retrouvons du noir.
	 */
	ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
	ctx.fillRect(0, 0, matrix.width, matrix.height);

	/*
	 * Pour chaque colonne on va dessiner sous l'actuel dernier caractère,
	 * d'ordonnée ypositions[i], de couleur clmncolors[i],
	 * un nouveau caractère. Celui-ci ne vient pas de subir le rectangle
	 * transparent, donc il est 100% opaque.
	 */
	ypositions.map(function (y, i){
		var color = colors[Math.floor(Math.random() * 3)];

		ctx.font = '10pt Tahoma';
		ctx.textAlign = "start";
		ctx.textBaseline = "top";

		ctx.fillStyle = clmncolors[i];
		ctx.fillText(characters[i], i * cw, y);

		/*
		 * Lorsque le caractère le plus récent (donc celui que nous venons de tracer)
		 * sort de la toile, sa colonne a 1% de chances d'être remise à zéro
		 * et de reprendre le tracé depuis le haut de la toile.
		 *
		 * S'il n'y a pas d'aléa toutes les colonnes repassent en haut en même temps.
		 * Le motif initial serait alors répété sans fin.
		 *
		 * En ne remettant à zéro qu'après avoir dépassé la toile nous sommes
		 * certains que toutes les colonnes traversent l'écran de haut en bas.
		 */
		if(y > matrix.height){ //Math.round(3/4 * matrix.height)){
			if(Math.ceil(Math.random() * 100) > 99){
				ResetColumn(i);
			}
			else{
				this[i] += ch; /* Plus bas ! */
			}
		}
		else{
			this[i] += ch; /* Toujours plus bas ! */
		}
		}, ypositions);

		if(window.requestAnimationFrame)
			requestAnimationFrame(step);
		else //Pour toi IE
			setTimeout(step, 33);
	}

	/*
	 * Nous réalisons le premier appel à step(). Les suivants
	 * seront initiés par requestAnimationFrame().
	 */
	step();
