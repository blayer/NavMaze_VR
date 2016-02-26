var landmark_list = [];
landmark_list[11] = THREE.ImageUtils.loadTexture("resources/tiger.png");
landmark_list[1] = THREE.ImageUtils.loadTexture("resources/elephant.png");
landmark_list[2] = THREE.ImageUtils.loadTexture("resources/dog.png");
landmark_list[3] = THREE.ImageUtils.loadTexture("resources/crab.png");
landmark_list[4] = THREE.ImageUtils.loadTexture("resources/Hippo.png");
landmark_list[5] = THREE.ImageUtils.loadTexture("resources/lion.png");
landmark_list[6] = THREE.ImageUtils.loadTexture("resources/turtle.png");
landmark_list[7] = THREE.ImageUtils.loadTexture("resources/shark.png");
landmark_list[8] = THREE.ImageUtils.loadTexture("resources/sheep.png");
landmark_list[9] = THREE.ImageUtils.loadTexture("resources/zebra.png");
landmark_list[10] = THREE.ImageUtils.loadTexture("resources/dolphin.png");
landmark_list[12] = THREE.ImageUtils.loadTexture("resources/fish.png");
landmark_list[13] = THREE.ImageUtils.loadTexture("resources/crocodile.png");
landmark_list[14] = THREE.ImageUtils.loadTexture("resources/end.jpeg");

var mazeSize = 17000;

function Stack() {
	this.els = [];
}

Stack.prototype = {

	push: function(el) {
		this.els.push(el);
	},

	peek: function() {
		if (this.els.length > 0) {
			return this.els[this.els.length - 1];
		} else {
			return null;
		}
	},

	pop: function() {
		var el = this.els[this.els.length - 1];
		this.els = this.els.slice(0, this.els.length - 1);
		return el;
	},

	size: function() {
		return this.els.length;
	}

};

function Cell(i, j, size) {
	this.i = i;
	this.j = j;
	this.visited = false;
	this.size = size;
	this.east = true
	this.west = true;
	this.north = true;
	this.south = true;
	this.landmark = [0, 0]; //a number represent different landmarks, 0 for none, 1-99 represents landmark types
	this.PI2 = 2 * Math.PI;
	this.mesh = {};
	this.collide = {
		'east': false,
		'west': false,
		'north': false,
		'south': false
	};
}


Cell.prototype = {

	paint: function() {
		var x, y;
		if (this.east) {
			x = this.j * this.size;
			y = this.i * this.size;
			this.drawWall(x + this.size, y, x + this.size, y + this.size, 'east');
		}
		if (this.west) {
			x = this.j * this.size;
			y = this.i * this.size;
			this.drawWall(x, y, x, y + this.size, 'west');
		}
		if (this.north) {
			x = this.j * this.size;
			y = this.i * this.size;
			this.drawWall(x, y, x + this.size, y, 'north');
		}
		if (this.south) {
			x = this.j * this.size;
			y = this.i * this.size;
			this.drawWall(x, y + this.size, x + this.size, y + this.size, 'south');
		}
		if (this.landmark[0]) {
			x = this.j * this.size;
			y = this.i * this.size;
			var number1 = this.landmark[0];

			this.drawLandmark(x + (this.size / 16), y + (this.size / 4), x + 3 * (this.size / 16), y + (this.size / 4), number1, 64);

		}



		if (this.landmark[1]) {
			x = this.j * this.size;
			y = this.i * this.size;

			var number2 = this.landmark[1];

			this.drawLandmark(x + 13 * (this.size / 16), y + 3 * (this.size / 4), x + 15 * (this.size / 16), y + 3 * (this.size / 4), number2, 64);
		}
	},


	paint2D: function(g, scale) {


		// camera drawing

		var camX = camera.position.x * scale + 100,
			camY = camera.position.z * scale + 100;

		var angle = -camera.rotation.y - Math.PI / 2,
			amount = 10;

		g.save();
		g.translate(camX, camY);
		g.rotate(angle - Math.PI / 2);
		g.drawImage(youImage, -youImage.width / 2, -youImage.height / 2);
		g.rotate(-angle + Math.PI / 2);
		g.translate(-camX, -camY);
		g.restore();


		// wall drawing
		var x, y;
		if (this.east) {
			x = this.j * this.size;
			y = this.i * this.size;
			this.drawWall2D(g, scale, x + this.size, y, x + this.size, y + this.size, 'east');
		}
		if (this.west) {
			x = this.j * this.size;
			y = this.i * this.size;
			this.drawWall2D(g, scale, x, y, x, y + this.size, 'west');
		}
		if (this.north) {
			x = this.j * this.size;
			y = this.i * this.size;
			this.drawWall2D(g, scale, x, y, x + this.size, y, 'north');
		}
		if (this.south) {
			x = this.j * this.size;
			y = this.i * this.size;
			this.drawWall2D(g, scale, x, y + this.size, x + this.size, y + this.size, 'south');
		}

		if (this.landmark[0]) {
			x = this.j * this.size;
			y = this.i * this.size;
			var number1 = this.landmark[0];

			this.drawLandmark2D(g, scale, x + (this.size / 16), y + (this.size / 4), x + 3 * (this.size / 16), y + (this.size / 4), number1, 64);
		}


		if (this.landmark[1]) {
			x = this.j * this.size;
			y = this.i * this.size;

			var number2 = this.landmark[1];

			this.drawLandmark2D(g, scale, x + 13 * (this.size / 16), y + 3 * (this.size / 4), x + 15 * (this.size / 16), y + 3 * (this.size / 4), number2, 64);
		}
		// camera position




		var endX = endPLight.position.x * scale + 100,
			endY = endPLight.position.z * scale + 100;


		g.save();
		g.translate(endX, endY);
		g.drawImage(finishImage, -finishImage.width / 2, -finishImage.height / 2);
		g.translate(-endX, -endY);
		g.restore();



	},

	drawLandmark: function(x, y, x2, y2, number) {
		w = this.size / 2;
		var landmarkH = 256;
		var angle = Math.atan2(y2 - y, x2 - x);
		//var int = this.landmark;
		var imgTexture = landmark_list[number];

		//var imgTexture = THREE.ImageUtils.loadTexture( "resources/chair2.jpg" );
		//imgTexture.repeat.set( 6, 12 );
		//imgTexture.wrapS = imgTexture.wrapT = THREE.RepeatWrapping;
		var landmarkGeo = new THREE.CubeGeometry(w / 2, landmarkH, w / 2); //CubeGeometry (width,height,depth)

		var landmarkMaterial = new THREE.MeshPhongMaterial({
			map: imgTexture,
			color: 0xffffff,
			ambient: 0xF0EFEF,
			specular: 0x999999,
			shininess: 15,
			perPixel: true,
			shading: THREE.SmoothShading
		});

		var landmarkMesh = new THREE.Mesh(landmarkGeo, landmarkMaterial);
		landmarkMesh.rotation.y = -angle;

		landmarkMesh.position.x = x - Math.abs(w / 2 * Math.sin(angle)) - mazeSize / 2 + w / 2;
		landmarkMesh.position.z = y - Math.abs(w / 2 * Math.cos(angle)) - mazeSize / 2 + w / 2;
		landmarkMesh.position.y += landmarkH / 2 + 700;
		//this.mesh["landmark"]=landmarkMesh;
		scene.add(landmarkMesh);

	},
	drawWall: function(x, y, x2, y2, dir) {

		var w = this.size;

		var angle = Math.atan2(y2 - y, x2 - x);

		var imgTexture = THREE.ImageUtils.loadTexture("resources/brick.jpg"); // ql3.jpg 
		imgTexture.repeat.set(6, 12);
		imgTexture.wrapS = imgTexture.wrapT = THREE.RepeatWrapping;

		var wallH = 1024;

		var wallGeo = new THREE.BoxGeometry(w, wallH, 32); //CubeGeometry (width,height,depth)

		var wallMaterial = new THREE.MeshPhongMaterial({
			map: imgTexture,
			color: 0xffffff,
			ambient: 0xF0EFEF,
			specular: 0x999999,
			shininess: 15,
			perPixel: true,
			shading: THREE.SmoothShading
		});

		var wallMesh = new THREE.Mesh(wallGeo, wallMaterial);

		wallMesh.rotation.y = -angle;

		wallMesh.position.x = x - Math.abs(w / 2 * Math.sin(angle)) - mazeSize / 2 + w / 2;
		wallMesh.position.z = y - Math.abs(w / 2 * Math.cos(angle)) - mazeSize / 2 + w / 2;
		wallMesh.position.y += wallH / 2;

		this.mesh[dir] = wallMesh;


		// spot light

		//			var wallLight = new THREE.SpotLight( 0xFFFFFF, .3 );
		//				wallLight.position.x = wallMesh.position.x + w;
		//				wallLight.position.y = wallMesh.position.y + w;
		//				wallLight.position.z = wallMesh.position.z;
		//				
		//wallLight.rotation.y = wallMesh.rotation.y
		//				wallLight.rotation.y = Math.PI;
		//				scene.add( wallLight );

		scene.add(wallMesh);

	},


	// this gives the distance between the line which lies from (x1, y1) to (x2, y2)
	// and the point (x3, y3) in two dimensional space
	getDistance: function(x1, y1, x2, y2, x3, y3) {

		//  ||P2 - P1|| ^ 2

		var p2p1D = Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);

		var u = ((x3 - x1) * (x2 - x1) + (y3 - y1) * (y2 - y1)) / p2p1D;



		// the point which lies between P1 and P2
		var x = x1 + u * (x2 - x1);
		var y = y1 + u * (y2 - y1);


		if (u < 0) {
			x = x1;
			y = y1;
		} else if (u > 1) {
			x = x2;
			y = y2;
		}

		var distance = Math.sqrt(Math.pow(x3 - x, 2) + Math.pow(y3 - y, 2));


		return distance;


	},

	drawLandmark2D: function(g, scale, x, y, x2, y2, number, width) {
		var xp1 = x * scale,
			yp1 = y * scale,
			xp2 = x2 * scale,
			yp2 = y2 * scale;
		g.beginPath();

		g.moveTo(xp1, yp1);
		g.lineTo(xp2, yp2);
		g.strokeStyle = '#FFFFFF';



		g.stroke();

		g.closePath();

	},
	drawWall2D: function(g, scale, x, y, x2, y2, direction) {
		// global context g variable used

		var xp1 = x * scale,
			yp1 = y * scale,
			xp2 = x2 * scale,
			yp2 = y2 * scale;


		g.beginPath();

		g.moveTo(xp1, yp1);
		g.lineTo(xp2, yp2);

		g.strokeStyle = '#FFFFFF';
		g.stroke();
		g.closePath();


	}




};

function Maze(w, h, size) {
	this.cells = [];
	this.w = w;
	this.h = h;
	this.size = size;
	this.init();
	this.FillMaze();
	//this.makeMaze();
}



Maze.prototype = {

	init: function() {
		var i = 0,
			j = 0;
		for (; i < this.h; i += 1) {
			this.cells.push([]);
			for (j = 0; j < this.w; j += 1) {
				this.cells[i][j] = new Cell(i, j, this.size);
			}
		}

	},

	paint: function() {

		var i = 0,
			j = 0;
		for (; i < this.h; i += 1) {
			for (j = 0; j < this.w; j += 1) {
				this.cells[i][j].paint();
			}
		}

	},


	paint2D: function(g, scale) {
		g.clearRect(0, 0, 200, 200);
		var i = 0,
			j = 0;
		for (; i < this.h; i += 1) {
			for (j = 0; j < this.w; j += 1) {
				this.cells[i][j].paint2D(g, scale);
			}
		}

	},


	collide: function(box1, box2) {

		var cXmax = box1.max.x,
			cXmin = box1.min.x,
			cYmax = box1.max.y,
			cYmin = box1.min.y,
			cZmax = box1.max.z,
			cZmin = box1.min.z;

		var wXmax = box2.max.x, // wall x max
			wXmin = box2.min.x,
			wYmax = box2.max.y, // wall y max
			wYmin = box2.min.y,
			wZmax = box2.max.z,
			wZmin = box2.min.z;

		var xB = wXmin < cXmax && wXmax > cXmin,
			yB = wYmin < cYmax && wYmax > cYmin,
			zB = wZmin < cZmax && wZmax > cZmin;

		return xB && yB && zB;
	},


	checkIntersections: function(movementUD, movementRL) {


		var angle = camera.rotation.y;

		var i = 0,
			j = 0;


		var collision = {
			'right': false,
			'left': false,
			'up': false,
			'down': false
		};


		cameraBox.geometry.computeBoundingBox();

		var cbox = cameraBox.geometry.boundingBox;

		cbox.max.addSelf(cameraBox.position);
		cbox.min.addSelf(cameraBox.position);



		cbox.max.addSelf(movementUD);
		cbox.min.addSelf(movementUD);

		cameraBox.geometry.boundingBox = false;

		cameraBox.geometry.computeBoundingBox();

		var cboxRL = cameraBox.geometry.boundingBox;

		cboxRL.max.addSelf(cameraBox.position);
		cboxRL.min.addSelf(cameraBox.position);

		cboxRL.max.addSelf(movementRL);
		cboxRL.min.addSelf(movementRL);

		for (; i < this.h; i += 1) {
			for (j = 0; j < this.w; j += 1) {

				var walls = this.cells[i][j].mesh;

				for (var dir in walls) {

					if (walls.hasOwnProperty(dir)) {

						var wall = walls[dir];

						wall.geometry.computeBoundingBox();


						var angle = wall.rotation.y;

						var box = wall.geometry.boundingBox;

						if (wall.rotation.y !== 0) {
							var temp = box.max.z;
							box.max.z = box.max.x;
							box.max.x = temp;

							temp = box.min.z;
							box.min.z = box.min.x;
							box.min.x = temp;

						}

						box.max.addSelf(wall.position);
						box.min.addSelf(wall.position);

						if (this.collide(cbox, box)) {

							collision.up = true;
							collision.down = true;
						}

						if (this.collide(cboxRL, box)) {

							collision.left = true;
							collision.right = true;

						}

					}

				} // for

			}

		}



		return collision;

	},


	FillMaze: function() //fill maze with cusmized layouts. Test for a 8by8 size
	// cells[a][b] , a is the vertical axis, b is the horizental axis		
	{
		this.cells[0][0].south = false;


		this.cells[0][14].south = false;

		this.cells[1][0].north = false;
		this.cells[1][0].south = false;
		this.cells[1][0].east = false;


		this.cells[1][1].east = false;
		this.cells[1][1].west = false;


		this.cells[1][2].east = false;
		this.cells[1][2].west = false;


		this.cells[1][3].south = false;
		this.cells[1][3].east = false;
		this.cells[1][3].west = false;


		this.cells[1][4].east = false;
		this.cells[1][4].west = false;

		this.cells[1][5].east = false;
		this.cells[1][5].west = false;



		this.cells[1][6].west = false;


		this.cells[1][8].east = false;


		this.cells[1][9].east = false;
		this.cells[1][9].west = false;


		this.cells[1][10].east = false;
		this.cells[1][10].west = false;


		this.cells[1][11].south = false;
		this.cells[1][11].east = false;
		this.cells[1][11].west = false;



		this.cells[1][12].east = false;
		this.cells[1][12].west = false;


		this.cells[1][13].east = false;
		this.cells[1][13].west = false;


		this.cells[1][14].north = false;
		this.cells[1][14].south = false;
		this.cells[1][14].west = false;


		this.cells[2][0].north = false;

		this.cells[2][3].north = false;
		this.cells[2][3].south = false;

		this.cells[2][11].north = false;
		this.cells[2][11].south = false;

		this.cells[2][14].north = false;

		this.cells[3][3].north = false;
		this.cells[3][3].south = false;


		this.cells[3][11].north = false;
		this.cells[3][11].south = false;


		this.cells[4][3].north = false;
		this.cells[4][3].east = false;


		this.cells[4][4].east = false;
		this.cells[4][4].west = false;


		this.cells[4][5].east = false;
		this.cells[4][5].west = false;


		this.cells[4][6].east = false;
		this.cells[4][6].west = false;


		this.cells[4][7].south = false;
		this.cells[4][7].east = false;
		this.cells[4][7].west = false;



		this.cells[4][8].east = false;
		this.cells[4][8].west = false;



		this.cells[4][9].east = false;
		this.cells[4][9].west = false;


		this.cells[4][10].east = false;
		this.cells[4][10].west = false;

		this.cells[4][11].north = false;
		this.cells[4][11].west = false;


		this.cells[5][7].north = false;
		this.cells[5][7].south = false;

		this.cells[6][7].north = false;
		this.cells[6][7].south = false;


		this.cells[7][7].north = false;
		this.cells[7][7].south = false;



		this.cells[8][3].north = false;
		this.cells[8][3].south = false;
		this.cells[8][3].east = false;



		this.cells[8][4].west = false;
		this.cells[8][4].east = false;


		this.cells[8][5].west = false;
		this.cells[8][5].east = false;



		this.cells[8][6].west = false;
		this.cells[8][6].east = false;



		this.cells[8][7].north = false;
		this.cells[8][7].south = false;
		this.cells[8][7].west = false;
		this.cells[8][7].east = false;





		this.cells[8][8].west = false;
		this.cells[8][8].east = false;


		this.cells[8][9].west = false;
		this.cells[8][9].east = false;

		this.cells[8][10].west = false;
		this.cells[8][10].east = false;


		this.cells[8][11].north = false;
		this.cells[8][11].south = false;
		this.cells[8][11].west = false;


		this.cells[9][7].north = false;
		this.cells[9][7].south = false;


		this.cells[10][7].north = false;
		this.cells[10][7].south = false;


		this.cells[11][7].north = false;
		this.cells[11][7].south = false;



		this.cells[12][3].south = false;
		this.cells[12][3].east = false;


		this.cells[12][4].west = false;
		this.cells[12][4].east = false;



		this.cells[12][5].west = false;
		this.cells[12][5].east = false;

		this.cells[12][6].west = false;
		this.cells[12][6].east = false;


		this.cells[12][7].north = false;
		this.cells[12][7].west = false;
		this.cells[12][7].east = false;


		this.cells[12][8].west = false;
		this.cells[12][8].east = false;


		this.cells[12][9].west = false;
		this.cells[12][9].east = false;

		this.cells[12][10].west = false;
		this.cells[12][10].east = false;



		this.cells[12][11].south = false;
		this.cells[12][11].west = false;


		this.cells[13][3].north = false;
		this.cells[13][3].south = false;


		this.cells[13][11].north = false;
		this.cells[13][11].south = false;



		this.cells[14][0].south = false;



		this.cells[14][14].south = false;


		this.cells[14][3].north = false;
		this.cells[14][3].south = false;



		this.cells[14][11].north = false;
		this.cells[14][11].south = false;



		this.cells[15][0].north = false;
		this.cells[15][0].south = false;
		this.cells[15][0].east = false;


		this.cells[15][1].west = false;
		this.cells[15][1].east = false;


		this.cells[15][2].west = false;
		this.cells[15][2].east = false;


		this.cells[15][3].north = false;
		this.cells[15][3].west = false;
		this.cells[15][3].east = false;



		this.cells[15][4].west = false;
		this.cells[15][4].east = false;



		this.cells[15][5].west = false;
		this.cells[15][5].east = false;



		this.cells[15][6].west = false;
		this.cells[15][6].east = false;


		this.cells[15][7].west = false;
		this.cells[15][7].east = false;


		this.cells[15][8].west = false;
		//	this.cells[15][8].east=false;


		this.cells[15][9].west = false;
		this.cells[15][9].east = false;



		this.cells[15][10].west = false;
		this.cells[15][10].east = false;




		this.cells[15][11].north = false;
		this.cells[15][11].west = false;
		this.cells[15][11].east = false;



		this.cells[15][12].west = false;
		this.cells[15][12].east = false;


		this.cells[15][13].west = false;
		this.cells[15][13].east = false;




		this.cells[15][14].north = false;
		this.cells[15][14].south = false;
		this.cells[15][14].west = false;


		this.cells[16][0].north = false;

		this.cells[16][14].north = false;

		////////////////////////////////


		this.cells[7][3].north = false;
		this.cells[7][3].south = false;

		this.cells[6][3].north = false;
		this.cells[6][3].south = false;


		this.cells[5][3].south = false;
		this.cells[5][3].west = false;



		this.cells[8][3].north = false;
		this.cells[8][3].south = false;


		this.cells[9][3].north = false;
		this.cells[9][3].south = false;

		this.cells[10][3].north = false;
		this.cells[10][3].south = false;

		this.cells[11][3].north = false;
		this.cells[11][3].west = false;



		this.cells[7][11].north = false;
		this.cells[7][11].south = false;

		this.cells[6][11].north = false;
		this.cells[6][11].south = false;


		this.cells[5][11].south = false;
		this.cells[5][11].east = false;



		this.cells[8][11].north = false;
		this.cells[8][11].south = false;


		this.cells[9][11].north = false;
		this.cells[9][11].south = false;

		this.cells[10][11].north = false;
		this.cells[10][11].south = false;

		this.cells[11][11].north = false;
		this.cells[11][11].east = false;


		this.cells[5][0].north = false;
		this.cells[5][0].south = false;
		this.cells[5][0].east = false;



		this.cells[5][1].west = false;
		this.cells[5][1].east = false;




		this.cells[5][2].west = false;
		this.cells[5][2].east = false;




		this.cells[5][12].west = false;
		this.cells[5][12].east = false;



		this.cells[5][13].west = false;
		this.cells[5][13].east = false;


		this.cells[5][14].north = false;
		this.cells[5][14].south = false;
		this.cells[5][14].west = false;


		this.cells[11][0].north = false;
		this.cells[11][0].south = false;
		this.cells[11][0].east = false;



		this.cells[11][1].west = false;
		this.cells[11][1].east = false;




		this.cells[11][2].west = false;
		this.cells[11][2].east = false;




		this.cells[11][12].west = false;
		this.cells[11][12].east = false;



		this.cells[11][13].west = false;
		this.cells[11][13].east = false;


		this.cells[11][14].north = false;
		this.cells[11][14].south = false;
		this.cells[11][14].west = false;


		//////////////////////////////

		this.cells[3][0].south = false;

		this.cells[4][0].north = false;
		this.cells[4][0].south = false;

		this.cells[6][0].north = false;
		this.cells[6][0].south = false;

		this.cells[7][0].north = false;



		this.cells[9][0].south = false;

		this.cells[10][0].north = false;
		this.cells[10][0].south = false;


		this.cells[12][0].north = false;
		this.cells[12][0].south = false;

		this.cells[13][0].north = false;


		this.cells[3][14].south = false;

		this.cells[4][14].north = false;
		this.cells[4][14].south = false;

		this.cells[6][14].north = false;
		this.cells[6][14].south = false;

		this.cells[7][14].north = false;



		this.cells[9][14].south = false;

		this.cells[10][14].north = false;
		this.cells[10][14].south = false;


		this.cells[12][14].north = false;
		this.cells[12][14].south = false;

		this.cells[13][14].north = false;



		this.cells[14][0].north = false;
		this.cells[13][0].south = false;

		//landmark initalize

		this.cells[8][7].landmark = [1, 2];
		this.cells[12][7].landmark = [0, 3];
		this.cells[15][3].landmark = [0, 4];
		this.cells[8][3].landmark = [0, 5];
		this.cells[11][0].landmark = [0, 6];
		//this.cells[1][14].landmark=[0,7];
		this.cells[1][11].landmark = [0, 8];
		this.cells[11][14].landmark = [0, 9];
		this.cells[8][11].landmark = [0, 10];
		this.cells[5][0].landmark = [0, 11];
		this.cells[1][3].landmark = [0, 12];
		this.cells[4][7].landmark = [0, 13];
		this.cells[15][7].landmark = [0, 14];




	},



};
