class RenderShader extends FragShader{
	constructor(){
		super(
			glsl`#version 300 es
				#define TAU ${TAU}
				precision highp float;

				uniform sampler2D tex;
				uniform sampler2D tex2;
				uniform sampler2D tex3;
				uniform sampler2D tex4;
				uniform vec2 imgSize;
				uniform vec2 canvasSize;
				uniform vec2 camPos;
				uniform float camZoom;

				in vec2 pos;
				out vec4 outColor;

				${SHADER_FUNCS.GAMMA}
				
				vec3 rgb2hsv(vec3 c){
					vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
					vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
					vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
	
					float d = q.x - min(q.w, q.y);
					float e = 1.0e-10;
					return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
				}
	
				vec3 hsv2rgb(vec3 c){
					vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
					vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
					return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
				}

				void main(){
					vec2 pos2=(pos+1.)*.5;
					pos2=vec2(pos2.x,1.-pos2.y);
					vec2 ratio=canvasSize/imgSize;
					pos2=(pos2)*vec2(
						min(ratio.x/ratio.y,1.),
						min(ratio.y/ratio.x,1.)
					)/camZoom-camPos;
					vec4 col1=texture(tex,pos2);
					vec4 col2=texture(tex2,pos2);
					vec4 col3=texture(tex3,pos2);
					vec4 col4=texture(tex4,vec2(pos2.x,1.-pos2.y));
					// outColor=vec4(col1.x,col4.x,0.,1.);
					
					outColor=vec4(
						gammaCorrect(
							hsv2rgb(vec3(col2.x/100000.,.9,1.))*2.
							*col1.x
						)
						*((col3.x+1.)/4.+(col3.y+1.)/4.),
						1.
					);

					// outColor=vec4(col3.x,col3.y,0.,1.);
					// outColor=vec4(gammaCorrect(vec3(col1.x*2.,col1.x*.1,col1.x*.002)),1);
					// outColor=vec4(gammaCorrect(vec3(col1.x*1.)),1);
					
					if(pos2.x<0.||pos2.x>1.||pos2.y<0.||pos2.y>1.){
						outColor*=.25;
					}
				}
			`,
		);
	}
	run(cam,imgSize,canvasSize,renderTex,render2Tex,render3Tex,render4Tex){
		this.uniforms={
			camZoom:cam.zoom,
			camPos:cam.pos,
			imgSize,
			canvasSize,
			tex:renderTex.tex,
			tex2:render2Tex.tex,
			tex3:render3Tex.tex,
			tex4:render4Tex.tex,
		};
		super.run();
	}
}