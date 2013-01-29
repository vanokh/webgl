function initWaterBuffer(obj)
{
	var gridX = 128;
	var gridY = 128;
	var trianglesCount = gridX * gridY * 2;
	var vertexCount = (gridX + 1) * (gridY + 1);
	var vertices = [];
	var vertexNormals = [];
	var i;

	obj.vertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexPositionBuffer);
	/*
	var vertices = [
		// Bottom face
		-1.0, 0.0, -1.0,
		 1.0, 0.0, -1.0,
		 1.0, 0.0,  1.0,
		-1.0, 0.0,  1.0,
    ];
    */
    for (i = 0; i < gridY * gridX; i++)
    {
    	vertices[3*i]   = -1.0 + 2/gridX*i;
    	vertices[3*i+1] = 0.0;
    	vertices[3*i+2] = -1.0 + 2/gridY*i;
    }

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	obj.vertexPositionBuffer.itemSize = 3;
	obj.vertexPositionBuffer.numItems = 4;//24;

	obj.vertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexNormalBuffer);
	/*
	var vertexNormals = [
		// Bottom face
		 0.0, 1.0,  0.0,
		 0.0, 1.0,  0.0,
		 0.0, 1.0,  0.0,
		 0.0, 1.0,  0.0,
    ];
    */
    for (i = 0; i < gridY * gridX; i++)
    {
    	vertexNormals[3*i]   = 0.0;
    	vertexNormals[3*i+1] = 1.0;
    	vertexNormals[3*i+2] = 0.0;
    }


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