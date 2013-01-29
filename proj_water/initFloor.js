function initFloorBuffer(obj)
{	
	obj.vertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexPositionBuffer);
	vertices = [
		// Bottom face
		-1.0, -0.5, -1.0,
		 1.0, -0.5, -1.0,
		 1.0, -0.5,  1.0,
		-1.0, -0.5,  1.0,
    ];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	obj.vertexPositionBuffer.itemSize = 3;
	obj.vertexPositionBuffer.numItems = 4;//24;

	obj.vertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexNormalBuffer);
	var vertexNormals = [
		// Bottom face
		 0.0, 1.0,  0.0,
		 0.0, 1.0,  0.0,
		 0.0, 1.0,  0.0,
		 0.0, 1.0,  0.0,
    ];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
	obj.vertexNormalBuffer.itemSize = 3;
	obj.vertexNormalBuffer.numItems = 4;//24;

	obj.vertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexTextureCoordBuffer);
	var textureCoords = [
		// Bottom face
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,
		1.0, 0.0,
    ];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	obj.vertexTextureCoordBuffer.itemSize = 2;
	obj.vertexTextureCoordBuffer.numItems = 4;//24;

	obj.vertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.vertexIndexBuffer);
	var vertexIndices = [
		0, 1, 2,      0, 2, 3,    // Bottom face
	];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
	obj.vertexIndexBuffer.itemSize = 1;
	obj.vertexIndexBuffer.numItems = 6;//36;
}