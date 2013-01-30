#include "./initWalls.js"
#include "./initFloor.js"
#include "./initWater.js"

    var gl;

    function initGL(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
    }


    function getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }



    function createProgram(fragmentShaderID, vertexShaderID) {
        var fragmentShader = getShader(gl, fragmentShaderID);
        var vertexShader = getShader(gl, vertexShaderID);

        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        program.vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
        gl.enableVertexAttribArray(program.vertexPositionAttribute);

        program.vertexNormalAttribute = gl.getAttribLocation(program, "aVertexNormal");
        gl.enableVertexAttribArray(program.vertexNormalAttribute);

        program.textureCoordAttribute = gl.getAttribLocation(program, "aTextureCoord");
        gl.enableVertexAttribArray(program.textureCoordAttribute);

        program.pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
        program.mvMatrixUniform = gl.getUniformLocation(program, "uMVMatrix");
        program.nMatrixUniform = gl.getUniformLocation(program, "uNMatrix");
        program.samplerUniform = gl.getUniformLocation(program, "uSampler");
        //program.colorUniform = gl.getUniformLocation(program, "uColor");
        //program.useColorUniform = gl.getUniformLocation(program, "uUseColor");
        program.useTexturesUniform = gl.getUniformLocation(program, "uUseTextures");
        program.useLightingUniform = gl.getUniformLocation(program, "uUseLighting");
        program.ambientColorUniform = gl.getUniformLocation(program, "uAmbientColor");
        program.pointLightingLocationUniform = gl.getUniformLocation(program, "uPointLightingLocation");
        program.pointLightingColorUniform = gl.getUniformLocation(program, "uPointLightingColor");

        return program;
    }


    var currentProgram;
    var textureProgram;
    var colorProgram;

    function initShaders() {
        textureProgram = createProgram("texture-fs", "texture-vs");
    }


    function handleLoadedTexture(texture) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

	var cube = new Object();
	var floor = new Object();
	var water = new Object();

    var waterTexture;
    var crateTexture;
    var floorTexture;

    function loadTexture (obj)
    {
        obj.texture = gl.createTexture();
        obj.texture.image = new Image();
        obj.texture.image.onload = function () {
            handleLoadedTexture(obj.texture)
        }
        obj.texture.image.src = obj.texture_src;
    }

    function initTextures() {
        cube.texture_src = "tile.png";
        loadTexture(cube);
		
        floor.texture_src = "dirty_heart.png";
        loadTexture(floor);

        water.texture_src = "water.jpg";
        loadTexture(water);

		cube.color = 0xffa0a0a0;
		floor.color = 0xffa0a0a0
		water.color = 0x7fceb952;
	}


    var mvMatrix = mat4.create();
    var mvMatrixStack = [];
    var pMatrix = mat4.create();

    function mvPushMatrix() {
        var copy = mat4.create();
        mat4.set(mvMatrix, copy);
        mvMatrixStack.push(copy);
    }

    function mvPopMatrix() {
        if (mvMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        mvMatrix = mvMatrixStack.pop();
    }

    function setMatrixUniforms() {
        gl.uniformMatrix4fv(currentProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(currentProgram.mvMatrixUniform, false, mvMatrix);

        var normalMatrix = mat3.create();
        mat4.toInverseMat3(mvMatrix, normalMatrix);
        mat3.transpose(normalMatrix);
        gl.uniformMatrix3fv(currentProgram.nMatrixUniform, false, normalMatrix);
    }


    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }

    function initBuffers() {
		initWallBuffer(cube);
		initFloorBuffer(floor);
		initWaterBuffer(water);
    }

	function drawBuffers(obj) {
        mvPushMatrix();
        mat4.rotate(mvMatrix, degToRad(cubeAngle), [0, 1, 0]);
        mat4.translate(mvMatrix, [1.25, 0, 0]);
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexPositionBuffer);
        gl.vertexAttribPointer(currentProgram.vertexPositionAttribute, obj.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexNormalBuffer);
        gl.vertexAttribPointer(currentProgram.vertexNormalAttribute, obj.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexTextureCoordBuffer);
        gl.vertexAttribPointer(currentProgram.textureCoordAttribute, obj.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

		if (obj.texture)
		{
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, obj.texture);
			gl.uniform1i(currentProgram.samplerUniform, 0);
			//gl.uniform1i(currentProgram.useColorUniform, 0);
		}
		/*else
		{
			var r =	(obj.color & 0xff) / 256.0;
			var g =	(obj.color >> 8 & 0xff) / 256.0;
			var b =	(obj.color >> 16 & 0xff) / 256.0;
			var a =	(obj.color >> 24 & 0xff) / 256.0;
			gl.uniform1i(
				currentProgram.colorUniform, r, g, b, a
			);
			gl.uniform1i(currentProgram.useColorUniform, 1);
		}*/
		
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.vertexIndexBuffer);
        setMatrixUniforms();
        gl.drawElements(gl.TRIANGLES, obj.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        mvPopMatrix();
	}
	
    var cubeAngle = 0;

    function drawScene() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

        currentProgram = perFragmentProgram;
        gl.useProgram(currentProgram);

        //gl.blendFunc(gl.ONE, gl.ONE);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);

		var lighting = document.getElementById("lighting").checked;
        gl.uniform1i(currentProgram.useLightingUniform, lighting);
        if (lighting) {
            gl.uniform3f(
                currentProgram.ambientColorUniform,
                parseFloat(document.getElementById("ambientR").value),
                parseFloat(document.getElementById("ambientG").value),
                parseFloat(document.getElementById("ambientB").value)
            );

            gl.uniform3f(
                currentProgram.pointLightingLocationUniform,
                parseFloat(document.getElementById("lightPositionX").value),
                parseFloat(document.getElementById("lightPositionY").value),
                parseFloat(document.getElementById("lightPositionZ").value)
            );

            gl.uniform3f(
                currentProgram.pointLightingColorUniform,
                parseFloat(document.getElementById("pointR").value),
                parseFloat(document.getElementById("pointG").value),
                parseFloat(document.getElementById("pointB").value)
            );
        }

        var textures = document.getElementById("textures").checked;
        gl.uniform1i(currentProgram.useTexturesUniform, textures);

        mat4.identity(mvMatrix);

        mat4.translate(mvMatrix, [0, 0, -5]);

        mat4.rotate(mvMatrix, degToRad(30), [1, 0, 0]);

        drawBuffers(cube);
        drawBuffers(floor);
        drawBuffers(water);
    }


    var lastTime = 0;

    function animate() {
        var timeNow = new Date().getTime();
        if (lastTime != 0) {
            var elapsed = timeNow - lastTime;

            cubeAngle += 0.05 * elapsed;
        }
        lastTime = timeNow;
    }


    function tick() {
        requestAnimFrame(tick);
        drawScene();
        animate();
    }


    function webGLStart() {
        var canvas = document.getElementById("lesson13-canvas");
        initGL(canvas);
        initShaders();
        initBuffers();
        initTextures();

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);

        tick();
    }
