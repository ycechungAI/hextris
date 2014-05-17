//you can change these to sexier stuff
var colors = [
	"black",
	"orange", 
	"red",
	"blue",
];


function Block(lane, color, distFromHex, settled) {
	this.settled = (settled == undefined) ? 0 : 1;
	this.height = 20;
	this.width = 65;
	this.lane = lane;
	this.angle = 90 - (30 + 60 * lane);
	if (this.angle < 0) {
		this.angle += 360;
	}

	this.color = color;
	
	if (distFromHex) {
		this.distFromHex = distFromHex;
	}
	else {
		this.distFromHex = 470;
	}
	this.draw = function() {
		this.width = 2 * this.distFromHex / Math.sqrt(3);
		this.widthswag = this.width + this.height + 5;
		var p1 = rotatePoint(-this.width/2, this.height/2, this.angle);
		var p2 = rotatePoint(this.width/2, this.height/2, this.angle);
		var p3 = rotatePoint(this.widthswag/2, -this.height/2, this.angle);
		var p4 = rotatePoint(-this.widthswag/2, -this.height/2, this.angle);
		
		ctx.fillStyle=this.color;
		var baseX = canvas.width/2 + Math.sin((this.angle) * (Math.PI/180)) * (this.distFromHex + this.height/2);
		var baseY = canvas.height/2 - Math.cos((this.angle) * (Math.PI/180)) * (this.distFromHex + this.height/2);

		ctx.beginPath();
		ctx.moveTo(Math.round(baseX + p1.x), Math.round(baseY + p1.y));
		ctx.lineTo(Math.round(baseX + p2.x), Math.round(baseY + p2.y));
		ctx.lineTo(Math.round(baseX + p3.x), Math.round(baseY + p3.y));
		ctx.lineTo(Math.round(baseX + p4.x), Math.round(baseY + p4.y));
		ctx.lineTo(Math.round(baseX + p1.x), Math.round(baseY + p1.y));
		ctx.closePath();
		ctx.fill();
	};

}

var Clock = function(sideLength) {
	this.position = 0;
	this.sides = 6;
	this.blocks = [];
	this.angle = 30;
	this.sideLength = sideLength;
	this.strokeColor = 'blue';
	this.x = canvas.width / 2;
	this.y = canvas.height / 2;

	for(var i=0; i< this.sides; i++) {
		this.blocks.push([]);
	}

	this.addBlock = function(block) {
		block.settled = 1;
		var lane = 0;
		lane += this.position - block.lane;
		while(lane < 0) {
			lane = lane + this.sides;
		}
		lane = lane % this.sides;
		block.distFromHex = MainClock.sideLength / 2 * Math.sqrt(3) + block.height * this.blocks[lane].length;
		this.blocks[lane].push(block);
		// consolidateBlocks(this,lane,this.blocks.length-1);
	};

	this.doesBlockCollide = function(block, iter) {
		if (block.settled) return;

		var lane = block.lane - this.position;

		while (lane < 0) {
			lane += 6;
		}
		lane = lane % this.sides;

		var arr = this.blocks[lane];
		if (arr.length > 0) {
			if (block.distFromHex + iter - arr[arr.length - 1].distFromHex - arr[arr.length - 1].height <= 0) {
				this.addBlock(block);
			}
		}
		else {
			if (block.distFromHex - (this.sideLength/2) * Math.sqrt(3) <= 0) {
				this.addBlock(block);
			}

		}

	};

	this.rotate = function(steps) {
		this.position += steps;
		while (this.position < 0) {
			this.position += 6;
		}

		this.position = this.position % this.sides;
		this.blocks.forEach(function(blocks){
			blocks.forEach(function(block){
				block.angle = block.angle - steps * 60;
			});
		})

		this.angle = this.angle + steps * 60;
	};

	this.draw = function() {
		this.drawPolygon(this.x, this.y, this.sides, this.sideLength, this.angle);
	};

	this.drawPolygon = function(x, y, sides, radius, theta) { // can make more elegant, reduce redundancy, fix readability
		ctx.beginPath();
		var coords = rotatePoint(0, radius, theta);
		ctx.moveTo(coords.x + x, coords.y + y);
		var oldX = coords.x;
		var oldY = coords.y;
		for (var i = 0; i < sides; i++) {
			coords = rotatePoint(oldX, oldY, 360 / sides); 
			ctx.lineTo(coords.x + x, coords.y + y);
			ctx.moveTo(coords.x + x, coords.y + y);
			oldX = coords.x;
			oldY = coords.y;
		}
		ctx.closePath();
		// ctx.fill();
		ctx.strokeStyle = this.strokeColor;
		ctx.stroke();
	};
}
