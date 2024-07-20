// Create global page styles
createStyles(scss`&{
	background-color:black;
	overflow:hidden;
	canvas{
		position:absolute;
		width:100vw;
		height:100vh;
	}
	.gl{
		pointer-events:none;
		opacity:1;
		image-rendering: pixelated;
	}
}`());

let canvasElm=newElm("canvas");
let glCanvasElm=newElm("canvas");
let gl=glCanvasElm.getContext("webgl2",{
	premultipliedAlpha: true
});
gl.getExtension("EXT_color_buffer_float");
gl.getExtension("EXT_float_blend");

// Populate page html
let body=html`
	${addClass("gl",glCanvasElm)}
	${addClass("canvas",canvasElm)}
`();
addElm(body,document.body);
body.disolve();

let display=new CanvasDisplay(canvasElm);
display.view=new Cam(Vec(0,0),1.);
let control=new Control();
control.connect(canvasElm);

let shaderManager=new ShaderManager();
let lenia=new Lenia();
let canvasTex=new Texture({
	src: canvasElm,
	minMag: gl.NEAREST,
	wrap: gl.REPEAT
});

let imageTex=new Texture({
	src: imageSrc
});

let zoomBase=1.2;
let zoomExp=0;
let frameAnim=animate(()=>{
	display.clear();

	let ratio=display.size.cln().div(lenia.size);
	let scale=Vec(
		min(ratio.x/ratio.y,1.),
		min(ratio.y/ratio.x,1.)
	);
	let pre=display.view.transformInv(control.mousePos()).div(display.size);
	zoomExp-=sign(control.mouseWheelDelta());
	display.view.zoom=pow(zoomBase,zoomExp);
	let post=display.view.transformInv(control.mousePos()).div(display.size);
	display.view.pos.add(post.cln().sub(pre).scl(scale));
	
	control.resetDelta();

	if(control.mouseDown()){
		display.noStroke();
		if(control.mouseDown("l")){
			//add mass
			display.setFill(rgb(0,.5,0,.1));
			display.circ(display.view.transformInv(control.mousePos()),100);
		}
		if(control.mouseDown("m")){
			//mutate
			display.setFill(rgb(0.,0,1,.1));
			display.circ(display.view.transformInv(control.mousePos()),95);
		}
		if(control.mouseDown("r")){
			//remove mass
			display.setFill(rgb(5,.0,0,.1));
			display.circ(display.view.transformInv(control.mousePos()),90);
		}
		// control.mouseDown=false;
	}

	canvasTex.update(canvasElm);
	lenia.run(display,canvasTex,imageTex);
},1,true).start();
