class GeneInitShader extends FragShader{
	constructor(){
		super(
			glsl`#version 300 es
				#define TAU ${TAU}
				#define PI ${PI}
				precision highp float;
				precision highp sampler2D;

				uniform vec2 size;
				uniform float rand;
				uniform float groupLength;

				in vec2 pos;
				out vec4 outColor;

				${SHADER_FUNCS.HASH}

				void main(){
					vec2 pos2=(pos+1.)*.5;
					ivec2 coord2=ivec2(pos2*size);

					float idx=float(coord2.x)+float(coord2.y)*size.x;
					if(mod(idx,groupLength)!=0.){
						outColor=hash42(vec2(coord2)+rand);
					}else{
						outColor=vec4(0.);
					}
				}
			`,
		);
	}
	run(geneTex,groupLength){
		this.uniforms={
			size:geneTex.size,
			rand:rand(),
			groupLength,
		};
		this.attachments=[
			{
				attachment:geneTex.tex,
				...sizeObj(geneTex.size)
			}
		];
		super.run();
		this.time++;
	}
}
class DnaInitShader extends FragShader{
	constructor(){
		super(
			glsl`#version 300 es
				#define TAU ${TAU}
				#define PI ${PI}
				precision highp float;
				precision highp sampler2D;

				uniform vec2 size;
				uniform float rand;
				uniform float maxLength;

				in vec2 pos;
				out vec4 outColor;

				${SHADER_FUNCS.HASH}

				void main(){
					vec2 pos2=(pos+1.)*.5;
					ivec2 coord2=ivec2(pos2*size);

					int initBlockSize=100;
					outColor=floor(hash42(vec2(coord2/initBlockSize)+rand)*maxLength);
				}
			`,
		);
	}
	run(dnaTex,maxLength){
		this.uniforms={
			size:dnaTex.size,
			rand:rand(),
			maxLength,
		};
		this.attachments=[
			{
				attachment:dnaTex.tex,
				...sizeObj(dnaTex.size)
			}
		];
		super.run();
		this.time++;
	}
}