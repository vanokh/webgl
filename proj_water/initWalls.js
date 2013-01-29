function initWallBuffer(obj)
{
	obj.vertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexPositionBuffer);
	vertices = [
		// Back face
		-1.0, -0.5, -1.0,
		-1.0,  0.5, -1.0,
		 1.0,  0.5, -1.0,
		 1.0, -0.5, -1.0,
		// Right face
		 1.0, -0.5, -1.0,
		 1.0,  0.5, -1.0,
		 1.0,  0.5,  1.0,
		 1.0, -0.5,  1.0,
    ];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	obj.vertexPositionBuffer.itemSize = 3;
	obj.vertexPositionBuffer.numItems = 8;//24;

	obj.vertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexNormalBuffer);
	var vertexNormals = [
		// Back face
		 0.0,  0.0, -1.0,
		 0.0,  0.0, -1.0,
		 0.0,  0.0, -1.0,
		 0.0,  0.0, -1.0,
		// Right face
		 1.0,  0.0,  0.0,
		 1.0,  0.0,  0.0,
		 1.0,  0.0,  0.0,
		 1.0,  0.0,  0.0,
    ];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
	obj.vertexNormalBuffer.itemSize = 3;
	obj.vertexNormalBuffer.numItems = 8;//24;

	obj.vertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexTextureCoordBuffer);
	var textureCoords = [
		// Back face
		1.0, 0.0,
		1.0, 0.5,
		0.0, 0.5,
		0.0, 0.0,
		// Right face
		1.0, 0.0,
		1.0, 0.5,
		0.0, 0.5,
		0.0, 0.0,
    ];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	obj.vertexTextureCoordBuffer.itemSize = 2;
	obj.vertexTextureCoordBuffer.numItems = 8;//24;

	obj.vertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.vertexIndexBuffer);
	var vertexIndices = [
		0, 1, 2,      0, 2, 3,    // Back face
		4, 5, 6,      4, 6, 7,    // Right face
	];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
	obj.vertexIndexBuffer.itemSize = 1;
	obj.vertexIndexBuffer.numItems = 12;//36;
}