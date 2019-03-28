import './vendor';
import './upload';

let svg = document.querySelector('.typeRange');
let output = document.querySelector('.output');
let needle = document.querySelector('.needle');

let initialValue = document.querySelector('.initialValue');

let rad = Math.PI / 180;

let W = parseInt(window.getComputedStyle(svg, null).getPropertyValue('width'), 10);
let offset = 40;
let cx = ~~(W / 2);
let cy = 160;

const r1 = cx - offset;
let delta = ~~(r1 / 4);

let initVal = initialValue.value;

let isDragging = false;

function clearRect(node) {
	while (node.firstChild) {
		node.removeChild(node.firstChild);
	}
}

function drawScale() {
	let scale = document.querySelector('.scale');

	clearRect(scale);
}
function drawNeedle(ccx, ccy, rr1, a) {
	let nx1 = ccx + 10 * Math.cos((a - 100) * rad);
	let ny1 = ccy + 10 * Math.sin((a - 100) * rad);

	let nx2 = ccx + (rr1 - 50) * Math.cos(a * rad);
	let ny2 = ccy + (rr1 - 50) * Math.sin(a * rad);

	let nx3 = ccx + 10 * Math.cos((a + 90) * rad);
	let ny3 = ccy + 10 * Math.sin((a + 90) * rad);

	let points = `${nx1},${ny1} ${nx2},${ny2} ${nx3},${ny3}`;

	needle.setAttributeNS(null, 'points', points);
}
function drawInput(ccx, ccy, rr1, offset1, delta1, a) {
	drawScale();

	drawNeedle(ccx, ccy, rr1, a);
}

function updateInput(p, ccx, ccy, rr1, offset1, delta1) {
	let x = p.x;
	let y = p.y;
	let lx = ccx - x;
	let ly = ccy - y;

	let a = Math.atan2(ly, lx) / rad - 180;

	drawInput(ccx, ccy, rr1, offset1, delta1, a);
	output.innerHTML = Math.round((a + 180) / 1.8);
	initialValue.value = Math.round((a + 180) / 0.8);
}

// helpers
function oMousePos(elmt, evt) {
	let ClientRect = elmt.getBoundingClientRect();

	return { // obj
		x: Math.round(evt.clientX - ClientRect.left),
		y: Math.min(Math.round(evt.clientY - ClientRect.top), cy),
	};
}

// events
window.addEventListener('load', () => {
	let pa = initVal * 1.8 - 180;
	let p = {};

	p.x = cx + r1 * Math.cos(pa * rad);
	p.y = cy + r1 * Math.sin(pa * rad);
	updateInput(p, cx, cy, r1, offset, delta);
}, false);

initialValue.addEventListener('input', () => {
	let val = this.value;
	let newVal = !isNaN(val) && val >= 0 && val <= 100 ? val : 18;
	let pa = newVal * 1.8 - 180;
	let p = {};

	p.x = cx + r1 * Math.cos(pa * rad);
	p.y = cy + r1 * Math.sin(pa * rad);
	updateInput(p, cx, cy, r1, offset, delta);
}, false);

svg.addEventListener('mousedown', function(evt)  {
	isDragging = true;
	this.classList.add('focusable');
	let mousePos = oMousePos(svg, evt);

	updateInput(mousePos, cx, cy, r1, offset, delta);
}, false);
svg.addEventListener('mouseup', function() {
	isDragging = false;
	this.classList.remove('focusable');
}, false);
svg.addEventListener('mouseout', function (){
	isDragging = false;
	this.classList.remove('focusable');
}, false);

svg.addEventListener('mousemove', function(evt)  {
	if (isDragging) {
		let mousePos = oMousePos(svg, evt);

		updateInput(mousePos, cx, cy, r1, offset, delta);
	}
}, false);

function numberColor() {
	$('.typeRange').on('click', () => {
		let getNumb = $('.output');
		let number = getNumb.text();

		if (+number < 30) {
			getNumb.attr('class', 'output');
			getNumb.addClass('color1');
		}
		if (+number < 70 && +number > 30) {
			getNumb.attr('class', 'output');
			getNumb.addClass('color2');
		}
		if (+number > 70) {
			getNumb.attr('class', 'output');
			getNumb.addClass('color3');
		}
	});
}

function checkParams() {
	let name = $('#name').val();
	let date = $('#date').val();
	let city = $('#city').val();
	let phone = $('#phone').val();

	if (name.length && date.length && city.length && phone.length) {
		$('.approved').addClass('animate');
	} else {
		$('.approved').removeClass('animate');
	}
}

$('.block-contact input').keypress(() => {
	checkParams();
});
numberColor();
