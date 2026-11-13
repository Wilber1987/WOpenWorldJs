import { WorldObject } from "../WorldObjectModels.js";

/* =====================================================================
   PavedStreet: calle de pavimento con textura procedural de asfalto.
   ---------------------------------------------------------------------
   • NO bloquea el movimiento (blocks: false).
   • Soporta rotación (0 = a lo largo del eje Y, PI/2 = a lo largo del eje X).
   • Opciones configurables:
       - width, depth          : dimensiones del tramo
       - asphaltColor          : tono base del asfalto (0x2a2a2c por defecto)
       - hasLaneMarkings       : mostrar líneas divisorias de carril
       - laneColor             : color de las líneas (blanco por defecto)
       - laneStyle             : "solid" | "dashed" | "double" | "none"
       - hasCurbs              : añadir bordillos a los lados
       - curbHeight / curbColor: altura y color de los bordillos
       - hasSidewalks          : añadir aceras a los lados
       - sidewalkWidth / Color : ancho y color de las aceras
   ===================================================================== */
export class PavedStreet extends WorldObject {
    constructor(x, y, options = {}) {
        const width = options.width ?? 4;
        const depth = options.depth ?? 10;
        super(x, y, width, depth, {
            blocks: false,
            rotation: options.rotation ?? 0,
            ...options
        });

        this.name = options.name ?? "PavedStreet";
        this.width = width;
        this.depth = depth;

        // Estética
        this.asphaltColor = options.asphaltColor ?? 0x2a2a2c;
        this.hasLaneMarkings = options.hasLaneMarkings ?? true;
        this.laneColor = options.laneColor ?? 0xf0f0e8;
        this.laneStyle = options.laneStyle ?? "dashed"; // solid | dashed | double | none
        this.laneCount = options.laneCount ?? 2;

        // Bordillos
        this.hasCurbs = options.hasCurbs ?? true;
        this.curbHeight = options.curbHeight ?? 0.12;
        this.curbWidth = options.curbWidth ?? 0.25;
        this.curbColor = options.curbColor ?? 0x9a9590;

        // Aceras
        this.hasSidewalks = options.hasSidewalks ?? false;
        this.sidewalkWidth = options.sidewalkWidth ?? 1.5;
        this.sidewalkColor = options.sidewalkColor ?? 0xb8b0a6;

        // Grosor del plano de asfalto (para evitar z-fighting con el suelo)
        this.thickness = options.thickness ?? 0.04;
    }

    // --------------------------------------------------
    // TEXTURA PROCEDURAL DE ASFALTO
    // --------------------------------------------------
    _createAsphaltTexture(THREE) {
        const size = 512;
        const canvas = document.createElement("canvas");
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext("2d");

        // Base oscura
        ctx.fillStyle = "#2a2a2c";
        ctx.fillRect(0, 0, size, size);

        // Grumos / gravilla
        for (let i = 0; i < 8000; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const r = Math.random() * 1.5;
            const brightness = 25 + Math.floor(Math.random() * 40);
            ctx.fillStyle = `rgba(${brightness + 10},${brightness + 8},${brightness},${0.3 + Math.random() * 0.5})`;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }

        // Manchas más claras (parches)
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const r = 20 + Math.random() * 40;
            const g = ctx.createRadialGradient(x, y, 0, x, y, r);
            g.addColorStop(0, `rgba(70,70,70,${0.15 + Math.random() * 0.2})`);
            g.addColorStop(1, "rgba(40,40,40,0)");
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        }

        // Grietas finas
        for (let i = 0; i < 8; i++) {
            ctx.strokeStyle = `rgba(15,15,15,${0.3 + Math.random() * 0.3})`;
            ctx.lineWidth = 0.5 + Math.random();
            ctx.beginPath();
            let cx = Math.random() * size;
            let cy = Math.random() * size;
            ctx.moveTo(cx, cy);
            for (let s = 0; s < 10; s++) {
                cx += (Math.random() - 0.5) * 30;
                cy += (Math.random() - 0.5) * 30;
                ctx.lineTo(cx, cy);
            }
            ctx.stroke();
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        // Repetir la textura a lo largo del tramo (1 vez por cada 4 unidades)
        const aspect = this.depth / this.width;
        tex.repeat.set(1, Math.max(1, aspect));
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
    }

    // --------------------------------------------------
    // TEXTURA DE ACERA (losas de hormigón)
    // --------------------------------------------------
    _createSidewalkTexture(THREE) {
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#b8b0a6";
        ctx.fillRect(0, 0, size, size);

        // Losas cuadradas
        const tileSize = size / 4;
        ctx.strokeStyle = "#7a7268";
        ctx.lineWidth = 3;
        for (let i = 0; i <= 4; i++) {
            ctx.beginPath(); ctx.moveTo(0, i * tileSize); ctx.lineTo(size, i * tileSize); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(i * tileSize, 0); ctx.lineTo(i * tileSize, size); ctx.stroke();
        }

        // Rugosidad
        for (let i = 0; i < 3000; i++) {
            ctx.fillStyle = `rgba(90,80,70,${Math.random() * 0.15})`;
            ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(this.sidewalkWidth / 2, this.depth / 2);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
    }

    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------
    render(engine) {
        if (this.rendered) return;

        const THREE = engine.THREE;
        const group = new THREE.Group();
        group.name = `PavedStreet_${this.x}_${this.y}`;
        group.userData.worldObject = this;

        const addMesh = (geo, mat, x, y, z, parent = group) => {
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(x, y, z);
            mesh.castShadow = false;
            mesh.receiveShadow = true;
            parent.add(mesh);
            return mesh;
        };

        // --- ASFALTO (plano horizontal) ---
        const asphaltTex = this._createAsphaltTexture(THREE);
        const asphaltMat = new THREE.MeshStandardMaterial({
            map: asphaltTex,
            color: this.asphaltColor,
            roughness: 0.95,
            metalness: 0.0
        });

        const asphaltGeo = new THREE.BoxGeometry(this.width, this.thickness, this.depth);
        addMesh(asphaltGeo, asphaltMat, 0, this.thickness / 2, 0);

        // --- MARCAS DE CARRIL ---
        if (this.hasLaneMarkings && this.laneStyle !== "none") {
            const lineMat = new THREE.MeshStandardMaterial({
                color: this.laneColor,
                roughness: 0.6,
                emissive: this.laneColor,
                emissiveIntensity: 0.1
            });

            // Líneas divisorias entre carriles (a lo largo del eje Z)
            const lineThickness = 0.02;
            const lineHeight = 0.01;
            const lineWidth = this.width / this.laneCount;

            // Líneas entre cada carril (excluyendo bordes)
            for (let i = 1; i < this.laneCount; i++) {
                const lx = -this.width / 2 + i * lineWidth;

                if (this.laneStyle === "solid") {
                    addMesh(
                        new THREE.BoxGeometry(lineThickness, lineHeight, this.depth - 0.5),
                        lineMat, lx, this.thickness + 0.005, 0
                    );
                } else if (this.laneStyle === "double") {
                    addMesh(
                        new THREE.BoxGeometry(lineThickness, lineHeight, this.depth - 0.5),
                        lineMat, lx - 0.08, this.thickness + 0.005, 0
                    );
                    addMesh(
                        new THREE.BoxGeometry(lineThickness, lineHeight, this.depth - 0.5),
                        lineMat, lx + 0.08, this.thickness + 0.005, 0
                    );
                } else {
                    // dashed: segmentos de 1.5m con huecos de 1.5m
                    const segLen = 1.5;
                    const segGap = 1.5;
                    const totalLen = this.depth - 0.5;
                    for (let z = -totalLen / 2; z < totalLen / 2; z += segLen + segGap) {
                        const segZ = z + segLen / 2;
                        if (segZ + segLen / 2 > totalLen / 2) break;
                        addMesh(
                            new THREE.BoxGeometry(lineThickness, lineHeight, segLen),
                            lineMat, lx, this.thickness + 0.005, segZ
                        );
                    }
                }
            }

            // Líneas de borde (blancas sólidas en los extremos)
            const borderMat = lineMat.clone();
            const borderOffset = this.width / 2 - 0.15;
            addMesh(
                new THREE.BoxGeometry(lineThickness, lineHeight, this.depth - 0.3),
                borderMat, -borderOffset, this.thickness + 0.005, 0
            );
            addMesh(
                new THREE.BoxGeometry(lineThickness, lineHeight, this.depth - 0.3),
                borderMat, borderOffset, this.thickness + 0.005, 0
            );
        }

        // --- BORDILLOS ---
        if (this.hasCurbs) {
            const curbMat = new THREE.MeshStandardMaterial({
                color: this.curbColor,
                roughness: 0.9
            });
            const curbY = this.thickness + this.curbHeight / 2;

            // Bordillo izquierdo
            addMesh(
                new THREE.BoxGeometry(this.curbWidth, this.curbHeight, this.depth),
                curbMat,
                -this.width / 2 - this.curbWidth / 2, curbY, 0
            );
            // Bordillo derecho
            addMesh(
                new THREE.BoxGeometry(this.curbWidth, this.curbHeight, this.depth),
                curbMat,
                this.width / 2 + this.curbWidth / 2, curbY, 0
            );
        }

        // --- ACERAS ---
        if (this.hasSidewalks) {
            const sidewalkTex = this._createSidewalkTexture(THREE);
            const sidewalkMat = new THREE.MeshStandardMaterial({
                map: sidewalkTex,
                color: this.sidewalkColor,
                roughness: 0.9
            });
            const swHeight = 0.15;
            const swY = this.thickness + swHeight / 2;

            // Aceras a ambos lados
            const swOffset = this.width / 2 + this.curbWidth + this.sidewalkWidth / 2;
            addMesh(
                new THREE.BoxGeometry(this.sidewalkWidth, swHeight, this.depth),
                sidewalkMat, -swOffset, swY, 0
            );
            addMesh(
                new THREE.BoxGeometry(this.sidewalkWidth, swHeight, this.depth),
                sidewalkMat, swOffset, swY, 0
            );
        }

        // --- POSICIÓN FINAL Y ROTACIÓN ---
        group.position.set(
            this.x + this.width / 2,
            0,
            this.y + this.depth / 2
        );
        group.rotation.y = this.rotation ?? 0;

        engine.renderer.scene.add(group);
        this.AsingProps(group, engine, true);
    }
}


/* =====================================================================
   GrassPatch: Césped de alta definición (HD) con hojas 3D identificables.
   ---------------------------------------------------------------------
   • NO bloquea el movimiento (blocks: false).
   • Usa InstancedMesh para renderizar miles de hojas eficientemente.
   • Incluye shader personalizado para animación de viento (sway).
   • Genera flores y tréboles aleatorios para mayor realismo.
   • Opciones:
       - width, depth       : dimensiones del parche
       - density            : hojas por unidad cuadrada (default: 300)
       - maxHeight/minHeight: variación de altura
       - baseColor/tipColor : gradiente de color de la hoja
       - windStrength       : intensidad del viento
   ===================================================================== */
export class GrassPatch extends WorldObject {
    constructor(x, y, options = {}) {
        const width = options.width ?? 10;
        const depth = options.depth ?? 10;
        super(x, y, width, depth, { blocks: false, ...options });

        this.width = width;
        this.depth = depth;
        
        // Configuración HD
        this.density = options.density ?? 300; // Hojas por unidad cuadrada
        this.maxHeight = options.maxHeight ?? 0.6;
        this.minHeight = options.minHeight ?? 0.2;
        
        // Colores
        this.baseColorHex = options.baseColor ?? 0x2d4c1e; // Verde oscuro (sombra)
        this.tipColorHex = options.tipColor ?? 0x6b9e4d;   // Verde claro (sol)
        
        // Viento
        this.windStrength = options.windStrength ?? 0.15;
        this.swaySpeed = options.swaySpeed ?? 1.5;
        
        this._animRAF = null;
    }

    // --------------------------------------------------
    // TEXTURA DEL SUELO (Tierra y hierba base)
    // --------------------------------------------------
    _createGroundTexture(THREE) {
        const size = 512;
        const canvas = document.createElement("canvas");
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#3a4a25";
        ctx.fillRect(0, 0, size, size);

        // Ruido de tierra
        for (let i = 0; i < 10000; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const r = Math.random() * 1.5;
            const g = 30 + Math.floor(Math.random() * 40);
            ctx.fillStyle = `rgba(${g + 20},${g + 40},${g},${Math.random() * 0.5})`;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        }
        
        // Parches de hierba más clara
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const r = 20 + Math.random() * 60;
            const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
            grad.addColorStop(0, 'rgba(90, 130, 50, 0.4)');
            grad.addColorStop(1, 'rgba(50, 80, 30, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(x - r, y - r, r * 2, r * 2);
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(this.width / 4, this.depth / 4);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
    }

    // --------------------------------------------------
    // GEOMETRÍA DE LA HOJA 3D (Tapered & Bent)
    // --------------------------------------------------
    _createBladeGeometry(THREE) {
        // Plano con suficientes segmentos para curvarse suavemente
        const geo = new THREE.PlaneGeometry(0.12, 1.0, 1, 5);
        const pos = geo.attributes.position;
        const colors = [];
        
        const baseColor = new THREE.Color(this.baseColorHex);
        const tipColor = new THREE.Color(this.tipColorHex);
        const tempColor = new THREE.Color();

        for (let i = 0; i < pos.count; i++) {
            const y = pos.getY(i);
            const normalizedY = y + 0.5; // 0 en la base, 1 en la punta
            
            // 1. Estrechar hacia la punta (Taper)
            const taper = Math.pow(1.0 - normalizedY, 1.5); 
            pos.setX(i, pos.getX(i) * taper);
            
            // 2. Curvar hacia adelante (Bend)
            pos.setZ(i, normalizedY * normalizedY * 0.3 + Math.sin(normalizedY * Math.PI) * 0.05);
            
            // 3. Gradiente de color (Vertex Colors)
            tempColor.copy(baseColor).lerp(tipColor, normalizedY);
            const variation = (Math.random() - 0.5) * 0.05;
            colors.push(tempColor.r + variation, tempColor.g + variation, tempColor.b + variation * 0.5);
        }
        
        geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        pos.needsUpdate = true;
        geo.computeVertexNormals();
        return geo;
    }

    // --------------------------------------------------
    // RENDER PRINCIPAL
    // --------------------------------------------------
    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        group.name = `GrassPatch_${this.x}_${this.y}`;
        group.userData.worldObject = this;

        // --- 1. SUELO BASE ---
        const groundTex = this._createGroundTexture(THREE);
        const groundMat = new THREE.MeshStandardMaterial({
            map: groundTex, roughness: 1.0, metalness: 0.0
        });
        const groundMesh = new THREE.Mesh(new THREE.PlaneGeometry(this.width, this.depth), groundMat);
        groundMesh.rotation.x = -Math.PI / 2;
        groundMesh.position.y = 0.01; // Evitar z-fighting
        groundMesh.receiveShadow = true;
        group.add(groundMesh);

        // --- 2. HOJAS DE HIERBA (InstancedMesh) ---
        const bladeGeo = this._createBladeGeometry(THREE);
        const bladeMat = new THREE.MeshStandardMaterial({
            vertexColors: true,
            side: THREE.DoubleSide,
            roughness: 0.8,
            metalness: 0.0,
            defines: { USE_UV: '' } 
        });

        // INYECCIÓN DE SHADER PARA VIENTO (WIND SWAY)
        bladeMat.onBeforeCompile = (shader) => {
            shader.uniforms.time = { value: 0 };
            shader.uniforms.windStrength = { value: this.windStrength };
            shader.uniforms.swaySpeed = { value: this.swaySpeed };
            
            shader.vertexShader = `
                uniform float time;
                uniform float windStrength;
                uniform float swaySpeed;
                ${shader.vertexShader}
            `.replace(
                `#include <begin_vertex>`,
                `
                #include <begin_vertex>
                
                // Posición mundial para que el viento sea coherente en todo el parche
                vec4 worldPos = modelMatrix * vec4(position, 1.0);
                float localHeight = position.y + 0.5; 
                float swayFactor = localHeight * localHeight; // Solo se mueve la punta
                
                // Ondas de viento superpuestas para un movimiento orgánico
                float windWave = sin(time * swaySpeed + worldPos.x * 0.5 + worldPos.z * 0.7) * 0.5 + 
                                 sin(time * swaySpeed * 1.3 + worldPos.x * 0.8 - worldPos.z * 0.4) * 0.5;
                                 
                float swayAmount = swayFactor * windStrength * windWave;
                
                transformed.x += swayAmount;
                transformed.z += swayAmount * 0.6;
                `
            );
            bladeMat.userData.shader = shader;
        };

        const totalBlades = Math.floor(this.width * this.depth * this.density);
        const instancedMesh = new THREE.InstancedMesh(bladeGeo, bladeMat, totalBlades);
        instancedMesh.castShadow = true;
        instancedMesh.receiveShadow = true;

        const dummy = new THREE.Object3D();
        for (let i = 0; i < totalBlades; i++) {
            dummy.position.x = (Math.random() - 0.5) * this.width;
            dummy.position.z = (Math.random() - 0.5) * this.depth;
            dummy.position.y = 0;

            dummy.rotation.y = Math.random() * Math.PI * 2;
            dummy.rotation.x = (Math.random() - 0.5) * 0.2; // Inclinación aleatoria
            
            const heightScale = this.minHeight + Math.random() * (this.maxHeight - this.minHeight);
            const widthScale = 0.7 + Math.random() * 0.6;
            dummy.scale.set(widthScale, heightScale, widthScale);

            dummy.updateMatrix();
            instancedMesh.setMatrixAt(i, dummy.matrix);
        }
        instancedMesh.instanceMatrix.needsUpdate = true;
        group.add(instancedMesh);

        // --- 3. FLORES Y TRÉBOLES (Detalles HD) ---
        // const flowerCount = Math.floor(totalBlades * 0.015); // 1.5% de flores
        // if (flowerCount > 0) {
        //     const flowerGeo = new THREE.SphereGeometry(0.04, 6, 4);
        //     const flowerMat = new THREE.MeshStandardMaterial({ roughness: 0.6 });
        //     const flowerMesh = new THREE.InstancedMesh(flowerGeo, flowerMat, flowerCount);
            
        //     const color = new THREE.Color();
        //     const flowerColors = [0xffffff, 0xffe600, 0xd94060, 0xe6a840, 0xc060d0];
            
        //     for (let i = 0; i < flowerCount; i++) {
        //         dummy.position.x = (Math.random() - 0.5) * this.width;
        //         dummy.position.z = (Math.random() - 0.5) * this.depth;
        //         dummy.position.y = this.minHeight + Math.random() * (this.maxHeight - this.minHeight) * 0.8;
        //         dummy.scale.setScalar(0.5 + Math.random() * 1.2);
        //         dummy.rotation.set(0, 0, 0);
        //         dummy.updateMatrix();
        //         flowerMesh.setMatrixAt(i, dummy.matrix);
                
        //         color.setHex(flowerColors[Math.floor(Math.random() * flowerColors.length)]);
        //         flowerMesh.setColorAt(i, color);
        //     }
        //     flowerMesh.instanceMatrix.needsUpdate = true;
        //     if (flowerMesh.instanceColor) flowerMesh.instanceColor.needsUpdate = true;
        //     flowerMesh.castShadow = true;
        //     group.add(flowerMesh);
        // }

        // --- POSICIÓN FINAL ---
        group.position.set(this.x + this.width / 2, 0, this.y + this.depth / 2);
        group.rotation.y = this.rotation ?? 0;

        engine.renderer.scene.add(group);
        this.AsingProps(group, engine, true);

        // --- LOOP DE ANIMACIÓN (Viento) ---
        const clock = new THREE.Clock();
        const animate = () => {
            this._animRAF = requestAnimationFrame(animate);
            if (bladeMat.userData.shader) {
                bladeMat.userData.shader.uniforms.time.value = clock.getElapsedTime();
            }
        };
        animate();
    }

    destroy() {
        if (this._animRAF) cancelAnimationFrame(this._animRAF);
        super.destroy();
    }
}


/* =====================================================================
   DirtPath: Camino de tierra HD con bordes suaves y piedras 3D.
   ---------------------------------------------------------------------
   • NO bloquea el movimiento (blocks: false).
   • Se funde suavemente con el terreno circundante (césped/tierra).
   • Opciones:
       - width, depth    : dimensiones del camino
       - dirtColor       : color base (0x5c4a3a por defecto)
       - stoneDensity    : cantidad de piedras 3D por unidad cuadrada
   ===================================================================== */
export class DirtPath extends WorldObject {
    constructor(x, y, options = {}) {
        const width = options.width ?? 2;
        const depth = options.depth ?? 10;
        super(x, y, width, depth, { blocks: false, rotation: options.rotation ?? 0, ...options });

        this.width = width;
        this.depth = depth;
        this.dirtColorHex = options.dirtColor ?? 0x5c4a3a;
        this.stoneDensity = options.stoneDensity ?? 15;
    }

    // --------------------------------------------------
    // TEXTURA PROCEDURAL DE TIERRA
    // --------------------------------------------------
    _createDirtTexture(THREE) {
        const size = 512;
        const canvas = document.createElement("canvas");
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext("2d");

        // Base
        ctx.fillStyle = `#${new THREE.Color(this.dirtColorHex).getHexString()}`;
        ctx.fillRect(0, 0, size, size);

        // Ruido y variaciones de tono
        for (let i = 0; i < 12000; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const r = Math.random() * 2.5;
            const lightness = Math.random();
            const alpha = 0.1 + Math.random() * 0.25;
            
            ctx.fillStyle = lightness > 0.6 
                ? `rgba(230, 210, 180, ${alpha})` // Zonas secas/claras
                : `rgba(40, 25, 15, ${alpha})`;   // Zonas húmedas/oscuras
            
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        }

        // Huellas sutiles / surcos
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = '#2a1a0a';
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            ctx.beginPath();
            ctx.ellipse(x, y, 8 + Math.random() * 10, 20 + Math.random() * 15, Math.random() * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        // Repetir a lo largo del camino para mantener la calidad
        tex.repeat.set(Math.max(1, this.width / 2), Math.max(1, this.depth / 2));
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
    }

    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------
    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        group.name = `DirtPath_${this.x}_${this.y}`;
        group.userData.worldObject = this;

        // --- 1. PLANO DE TIERRA ---
        const dirtTex = this._createDirtTexture(THREE);
        const dirtMat = new THREE.MeshStandardMaterial({
            map: dirtTex,
            roughness: 1.0,
            metalness: 0.0,
            transparent: true, // Necesario para el fade de bordes
            alphaTest: 0.01,  defines: { USE_UV: '' } 
        });

        // SHADER PARA DESVANECER BORDES (Edge Fade)
        dirtMat.onBeforeCompile = (shader) => {
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <dithering_fragment>',
                    `#include <dithering_fragment>
                    
                    // Suavizar los bordes laterales (vUv.x) para fundirse con el césped
                    float edgeFade = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x);
                    gl_FragColor.a *= edgeFade;
                `
            );
        };

        const planeGeo = new THREE.PlaneGeometry(this.width, this.depth);
        const planeMesh = new THREE.Mesh(planeGeo, dirtMat);
        planeMesh.rotation.x = -Math.PI / 2;
        planeMesh.position.y = 0.02; // Ligeramente sobre el suelo base
        planeMesh.receiveShadow = true;
        group.add(planeMesh);

        // --- 2. PIEDRAS 3D (Guisarros) ---
        const stoneCount = Math.floor(this.width * this.depth * this.stoneDensity);
        if (stoneCount > 0) {
            const stoneGeo = new THREE.DodecahedronGeometry(0.06, 0);
            const stoneMat = new THREE.MeshStandardMaterial({ color: 0x7a7570, roughness: 1.0,  defines: { USE_UV: '' }  });
            const stonesMesh = new THREE.InstancedMesh(stoneGeo, stoneMat, stoneCount);
            stonesMesh.receiveShadow = true;
            stonesMesh.castShadow = true;

            const dummy = new THREE.Object3D();
            const color = new THREE.Color();
            
            for (let i = 0; i < stoneCount; i++) {
                // Distribuir evitando los bordes extremos para que no floten en el vacío
                dummy.position.x = (Math.random() - 0.5) * (this.width * 0.8);
                dummy.position.z = (Math.random() - 0.5) * this.depth;
                dummy.position.y = 0.02;

                dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
                dummy.scale.setScalar(0.5 + Math.random() * 1.5);
                dummy.updateMatrix();
                stonesMesh.setMatrixAt(i, dummy.matrix);

                // Variación de color en piedras
                const g = 0.4 + Math.random() * 0.2;
                color.setRGB(g, g * 0.95, g * 0.9);
                stonesMesh.setColorAt(i, color);
            }
            stonesMesh.instanceMatrix.needsUpdate = true;
            if (stonesMesh.instanceColor) stonesMesh.instanceColor.needsUpdate = true;
            group.add(stonesMesh);
        }

        // --- POSICIÓN FINAL ---
        group.position.set(this.x + this.width / 2, 0, this.y + this.depth / 2);
        group.rotation.y = this.rotation ?? 0;

        engine.renderer.scene.add(group);
        this.AsingProps(group, engine, true);
    }
}


/* =====================================================================
   Crosswalk: paso de cebra con textura procedural de asfalto y franjas.
   ---------------------------------------------------------------------
   • NO bloquea el movimiento (blocks: false).
   • Franjas blancas con desgaste realista (bordes irregulares, manchas).
   • Soporta rotación para colocarlo en cualquier dirección.
   • Opciones configurables:
       - width, depth       : dimensiones del paso (width = a lo largo de la calle)
       - stripeCount        : número de franjas blancas
       - stripeColor        : color de las franjas
       - asphaltColor       : color base del asfalto
       - wearLevel          : nivel de desgaste (0 = nuevo, 1 = muy desgastado)
       - hasCurbRamps       : añadir rampas en los bordillos
   ===================================================================== */
export class Crosswalk extends WorldObject {
    constructor(x, y, options = {}) {
        const width = options.width ?? 4;
        const depth = options.depth ?? 6;
        super(x, y, width, depth, {
            blocks: false,
            rotation: options.rotation ?? 0,
            ...options
        });

        this.name = options.name ?? "Crosswalk";
        this.width = width;
        this.depth = depth;

        // Estética
        this.stripeCount = options.stripeCount ?? Math.max(4, Math.floor(width / 0.8));
        this.stripeColor = options.stripeColor ?? 0xe8e8e0;
        this.asphaltColor = options.asphaltColor ?? 0x2a2a2c;
        this.wearLevel = options.wearLevel ?? 0.3; // 0..1

        // Ramps en bordillos
        this.hasCurbRamps = options.hasCurbRamps ?? true;
        this.curbHeight = options.curbHeight ?? 0.12;

        // Grosor del plano (anti z-fighting)
        this.thickness = options.thickness ?? 0.04;
        this.stripeThickness = 0.02;
    }

    // --------------------------------------------------
    // TEXTURA PROCEDURAL DE ASFALTO
    // --------------------------------------------------
    _createAsphaltTexture(THREE) {
        const size = 512;
        const canvas = document.createElement("canvas");
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#2a2a2c";
        ctx.fillRect(0, 0, size, size);

        // Gravilla
        for (let i = 0; i < 6000; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const r = Math.random() * 1.5;
            const b = 25 + Math.floor(Math.random() * 40);
            ctx.fillStyle = `rgba(${b + 10},${b + 8},${b},${0.3 + Math.random() * 0.4})`;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        }

        // Manchas de aceite / parches
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const r = 15 + Math.random() * 30;
            const g = ctx.createRadialGradient(x, y, 0, x, y, r);
            g.addColorStop(0, `rgba(60,60,60,${0.1 + Math.random() * 0.15})`);
            g.addColorStop(1, "rgba(40,40,40,0)");
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(this.width / 4, this.depth / 4);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
    }

    // --------------------------------------------------
    // TEXTURA DE FRANJA CON DESGASTE
    // --------------------------------------------------
    _createStripeTexture(THREE) {
        const size = 128;
        const canvas = document.createElement("canvas");
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext("2d");

        // Base blanca
        ctx.fillStyle = "#e8e8e0";
        ctx.fillRect(0, 0, size, size);

        // Desgaste: manchas de asfalto que "comen" la pintura
        const wearSpots = Math.floor(this.wearLevel * 40);
        for (let i = 0; i < wearSpots; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const r = 3 + Math.random() * 8;
            ctx.fillStyle = `rgba(42,42,44,${0.3 + Math.random() * 0.5})`;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        }

        // Bordes irregulares (desgaste en los extremos)
        for (let i = 0; i < 20; i++) {
            const edge = Math.random() > 0.5 ? 0 : size;
            const x = Math.random() * size;
            const y = edge + (Math.random() - 0.5) * 10;
            const r = 2 + Math.random() * 5;
            ctx.fillStyle = `rgba(42,42,44,${0.4 + Math.random() * 0.3})`;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        }

        // Textura de pintura (porosidad)
        for (let i = 0; i < 500; i++) {
            ctx.fillStyle = `rgba(200,200,190,${Math.random() * 0.3})`;
            ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
    }

    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------
    render(engine) {
        if (this.rendered) return;

        const THREE = engine.THREE;
        const group = new THREE.Group();
        group.name = `Crosswalk_${this.x}_${this.y}`;
        group.userData.worldObject = this;

        const addMesh = (geo, mat, x, y, z, parent = group) => {
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(x, y, z);
            mesh.castShadow = false;
            mesh.receiveShadow = true;
            parent.add(mesh);
            return mesh;
        };

        // --- 1. ASFALTO BASE ---
        const asphaltTex = this._createAsphaltTexture(THREE);
        const asphaltMat = new THREE.MeshStandardMaterial({
            map: asphaltTex,
            color: this.asphaltColor,
            roughness: 0.95,
            metalness: 0.0
        });
        addMesh(
            new THREE.BoxGeometry(this.width, this.thickness, this.depth),
            asphaltMat, 0, this.thickness / 2, 0
        );

        // --- 2. FRANJAS BLANCAS ---
        const stripeTex = this._createStripeTexture(THREE);
        const stripeMat = new THREE.MeshStandardMaterial({
            map: stripeTex,
            color: this.stripeColor,
            roughness: 0.7,
            emissive: this.stripeColor,
            emissiveIntensity: 0.05
        });

        // Calcular dimensiones de cada franja
        const gapRatio = 0.4; // 40% del ancho total es hueco
        const stripeWidth = this.width / (this.stripeCount + (this.stripeCount - 1) * gapRatio);
        const gapWidth = stripeWidth * gapRatio;
        const stripeDepth = this.depth - 0.6; // Margen en los extremos

        let currentX = -this.width / 2;
        for (let i = 0; i < this.stripeCount; i++) {
            const cx = currentX + stripeWidth / 2;

            // Franja principal
            addMesh(
                new THREE.BoxGeometry(stripeWidth, this.stripeThickness, stripeDepth),
                stripeMat,
                cx,
                this.thickness + this.stripeThickness / 2,
                0
            );

            currentX += stripeWidth + gapWidth;
        }

        // --- 3. LÍNEAS DE BORDE (opcional, líneas blancas en los extremos) ---
        const borderMat = new THREE.MeshStandardMaterial({
            color: this.stripeColor,
            roughness: 0.7
        });
        const borderWidth = 0.15;
        const borderDepth = this.depth - 0.4;

        // Borde izquierdo
        addMesh(
            new THREE.BoxGeometry(borderWidth, this.stripeThickness, borderDepth),
            borderMat,
            -this.width / 2 + borderWidth / 2 + 0.1,
            this.thickness + this.stripeThickness / 2,
            0
        );
        // Borde derecho
        addMesh(
            new THREE.BoxGeometry(borderWidth, this.stripeThickness, borderDepth),
            borderMat,
            this.width / 2 - borderWidth / 2 - 0.1,
            this.thickness + this.stripeThickness / 2,
            0
        );

        // --- 4. RAMPAS EN BORDILLOS ---
        if (this.hasCurbRamps) {
            const curbMat = new THREE.MeshStandardMaterial({
                color: 0x9a9590,
                roughness: 0.9
            });

            // Rampa en el borde norte (y negativo)
            const rampGeo = new THREE.BoxGeometry(this.width, this.curbHeight, 0.8);
            const rampN = addMesh(rampGeo, curbMat, 0, this.curbHeight / 2, -this.depth / 2 - 0.4);
            rampN.rotation.x = 0.3; // Inclinación suave

            // Rampa en el borde sur (y positivo)
            const rampS = addMesh(rampGeo.clone(), curbMat, 0, this.curbHeight / 2, this.depth / 2 + 0.4);
            rampS.rotation.x = -0.3;
        }

        // --- POSICIÓN FINAL Y ROTACIÓN ---
        group.position.set(
            this.x + this.width / 2,
            0,
            this.y + this.depth / 2
        );
        group.rotation.y = this.rotation ?? 0;

        engine.renderer.scene.add(group);
        this.AsingProps(group, engine, true);
    }
}