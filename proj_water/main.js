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

        return program;
    }

    function initProgram_Vertex(program, obj) {
        program.vertexPositionAttribute = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(program.vertexPositionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexPositionBuffer);
        gl.vertexAttribPointer(program.vertexPositionAttribute, obj.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        program.vertexNormalAttribute = gl.getAttribLocation(program, "normal");
        gl.enableVertexAttribArray(program.vertexNormalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexNormalBuffer);
        gl.vertexAttribPointer(program.vertexNormalAttribute, obj.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        program.textureCoordAttribute = gl.getAttribLocation(program, "texcoord");
        gl.enableVertexAttribArray(program.textureCoordAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexTextureCoordBuffer);
        gl.vertexAttribPointer(program.textureCoordAttribute, obj.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
    }
        /*
        program.pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
        program.mvMatrixUniform = gl.getUniformLocation(program, "uMVMatrix");
        program.nMatrixUniform = gl.getUniformLocation(program, "uNMatrix");
        program.samplerUniform = gl.getUniformLocation(program, "uSampler");
        program.useTexturesUniform = gl.getUniformLocation(program, "uUseTextures");
        program.useLightingUniform = gl.getUniformLocation(program, "uUseLighting");
        
        program.ambientColorUniform = gl.getUniformLocation(program, "uAmbientColor");
        program.pointLightingLocationUniform = gl.getUniformLocation(program, "uPointLightingLocation");
        program.pointLightingColorUniform = gl.getUniformLocation(program, "uPointLightingColor");
        */
    function initProgram_Light(program, light) {    
        // установка параметров точечного источника света
        gl.uniform3f(gl.getUniformLocation(program, "light.position"),
            light.positionX, light.positionY, light.positionZ);
        gl.uniform3f(gl.getUniformLocation(program, "light.ambient"),
            light.acolorR, light.acolorG, light.acolorB, 1.0);
        gl.uniform3f(gl.getUniformLocation(program, "light.diffuse");
            light.pcolorR, light.pcolorG, light.pcolorB, 1.0);
        gl.uniform3f(gl.getUniformLocation(program, "light.specular");
            light.pcolorR, light.pcolorG, light.pcolorB, 1.0);
        gl.uniform1f(gl.getUniformLocation(program, "light.attenuation"), 1.0);
    }

    function initProgram_Material(program, obj)
        // установка параметров материала
        if (obj.texture)
        {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, obj.texture);
            gl.uniform1i(gl.getUniformLocation(program, "material.texture"), 0);
            gl.uniform1i(gl.getUniformLocation(program, "useTexture"), 1);
        }
        else
        {
            gl.uniform1i(gl.getUniformLocation(program, "useTexture"), 0);
        }
        
        gl.uniform3f(gl.getUniformLocation(program, "material.ambient"), 
            obj.colorR, obj.colorG, obj.colorB, obj.colorA);
        gl.uniform3f(gl.getUniformLocation(program, "material.diffuse"), 
            obj.colorR, obj.colorG, obj.colorB, obj.colorA);
        gl.uniform3f(gl.getUniformLocation(program, "material.specular"), 
            obj.colorR, obj.colorG, obj.colorB, obj.colorA);
        gl.uniform3f(gl.getUniformLocation(program, "material.emission"), 0.0, 0.0, 0.0);
        gl.uniform1f(gl.getUniformLocation(program, "material.shininess"), 0.5);
    }
    
    function initProgram_Transform(program, transform) {    
        // передаем матрицы в шейдерную программу
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "transform.model")
            false, transform.model);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "transform.viewProjection"), 
            false, transform.viewProjection);

        transform.normal = mat3.create();
        mat4.toInverseMat3(transform.model, transform.normal);
        mat3.transpose(transform.normal);
        gl.uniformMatrix3fv(gl.getUniformLocation(program, "transform.normal"), 
            false, transform.normal);

        // передаем позицию наблюдателя (камеры) в шейдерную программу
        gl.getUniformLocation(program, "transform.viewPosition");
    }

    var currentProgram;
    var textureProgram;
    var colorProgram;

    function initShaders() {
        currentProgram = createProgram("texture-fs", "texture-vs");
        //textureProgram = createProgram("color-fs", "color-vs");
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

	var cube       = new Object();
	var floor      = new Object();
	var water      = new Object();

    var light      = new Object();
    var transform  = new Object();

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

		cube.colorR = 0xa0;
        cube.colorG = 0xa0;
        cube.colorB = 0xa0;
        cube.colorA = 0xff;
        floor.colorR = 0xa0;
        floor.colorG = 0xa0;
        floor.colorB = 0xa0;
        floor.colorA = 0xff;
		water.colorR = 0x52;
        water.colorG = 0xb9;
        water.colorB = 0xce;
        water.colorA = 0x7f;
	}

    var mvMatrixStack = [];

    function mvPushMatrix(m) {
        var copy = mat4.create();
        mat4.set(m, copy);
        mvMatrixStack.push(copy);
    }

    function mvPopMatrix() {
        if (mvMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        return mvMatrixStack.pop();
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
        mvPushMatrix(transform.model);
        mat4.rotate(transform.model, degToRad(cubeAngle), [0, 1, 0]);
        mat4.translate(transform.model, [1.25, 0, 0]);

        initProgram_Vertex(currentProgram, obj);

        initProgram_Material(currentProgram, obj);
		
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.vertexIndexBuffer);
        
        initProgram_Transform(currentProgram, transform);

        gl.drawElements(gl.TRIANGLES, obj.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        transform.model = mvPopMatrix();
	}
	
    var cubeAngle = 0;

    function drawScene() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, transform.viewProjection);

        gl.useProgram(currentProgram);

        //gl.blendFunc(gl.ONE, gl.ONE);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);

        light.acolorR = parseFloat(document.getElementById("ambientR").value),
        light.acolorG = parseFloat(document.getElementById("ambientG").value),
        light.acolorB = parseFloat(document.getElementById("ambientB").value)

        light.positionX = parseFloat(document.getElementById("lightPositionX").value),
        light.positionY = parseFloat(document.getElementById("lightPositionY").value),
        light.positionZ = parseFloat(document.getElementById("lightPositionZ").value)

        light.pcolorR = parseFloat(document.getElementById("pointR").value),
        light.pcolorG = parseFloat(document.getElementById("pointG").value),
        light.pcolorB = parseFloat(document.getElementById("pointB").value)

        /*
        var textures = document.getElementById("textures").checked;
        gl.uniform1i(currentProgram.useTexturesUniform, textures);
        */

        mat4.identity(transform.model);
        mat4.translate(transform.model, [0, 0, -5]);
        mat4.rotate(transform.model, degToRad(30), [1, 0, 0]);
        
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
        var canvas = document.getElementById("wgl-canvas");
        initGL(canvas);
        initShaders();
        initBuffers();
        initTextures();

        transform.model = mat4.create();
        transform.viewProjection = mat4.create();

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);

        tick();
    }
