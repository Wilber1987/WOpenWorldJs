import { WorldObject } from "../WorldObjectModels.js";

/* =====================================================================
   StreetSign: señal de tráfico con poste y panel procedural.
   ---------------------------------------------------------------------
   • Bloquea el movimiento en su tile (es un poste físico).
   • Tipos disponibles:
       - "stop"       : octágono rojo con STOP
       - "no_entry"   : círculo rojo con barra blanca
       - "speed"      : límite de velocidad (número configurable)
       - "one_way"    : dirección única (flecha azul)
       - "crosswalk"  : aviso de paso de peatones
       - "parking"    : zona de aparcamiento (P)
   • Opciones:
       - signType     : tipo de señal
       - poleHeight   : altura del poste
       - signSize     : tamaño del panel
       - speedLimit   : número para el tipo "speed"
   ===================================================================== */
export class StreetSign extends WorldObject {
    constructor(x, y, options = {}) {
        super(x, y, 0.4, 0.4, options); // huella pequeña (solo el poste)

        this.name = options.name ?? "StreetSign";
        this.signType = options.signType ?? "stop";
        this.poleHeight = options.poleHeight ?? 2.4;
        this.signSize = options.signSize ?? 0.7;
        this.speedLimit = options.speedLimit ?? 30;
        this.poleColor = options.poleColor ?? 0x8a8a8a;
    }

    // --------------------------------------------------
    // TEXTURA PROCEDURAL SEGÚN TIPO DE SEÑAL
    // --------------------------------------------------
    _createSignTexture(THREE) {
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext("2d");

        // Fondo transparente por defecto
        ctx.clearRect(0, 0, size, size);
        const cx = size / 2, cy = size / 2;

        switch (this.signType) {
            case "stop": {
                // Octágono rojo
                const r = size * 0.46;
                ctx.beginPath();
                for (let i = 0; i < 8; i++) {
                    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
                    const px = cx + Math.cos(a) * r;
                    const py = cy + Math.sin(a) * r;
                    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.fillStyle = "#c0202a";
                ctx.fill();
                ctx.lineWidth = 14;
                ctx.strokeStyle = "#ffffff";
                ctx.stroke();
                // Texto STOP
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 72px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("STOP", cx, cy);
                break;
            }

            case "no_entry": {
                // Círculo rojo con barra blanca
                ctx.beginPath();
                ctx.arc(cx, cy, size * 0.45, 0, Math.PI * 2);
                ctx.fillStyle = "#c0202a";
                ctx.fill();
                ctx.lineWidth = 12;
                ctx.strokeStyle = "#ffffff";
                ctx.stroke();
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(size * 0.18, cy - 20, size * 0.64, 40);
                break;
            }

            case "speed": {
                // Círculo blanco con borde rojo y número
                ctx.beginPath();
                ctx.arc(cx, cy, size * 0.45, 0, Math.PI * 2);
                ctx.fillStyle = "#ffffff";
                ctx.fill();
                ctx.lineWidth = 22;
                ctx.strokeStyle = "#c0202a";
                ctx.stroke();
                ctx.fillStyle = "#1a1a1a";
                ctx.font = "bold 100px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(String(this.speedLimit), cx, cy);
                break;
            }

            case "one_way": {
                // Rectángulo azul con flecha blanca
                ctx.fillStyle = "#1a4a9a";
                ctx.fillRect(size * 0.06, size * 0.28, size * 0.88, size * 0.44);
                ctx.fillStyle = "#ffffff";
                // Cuerpo de la flecha
                ctx.fillRect(size * 0.16, cy - 22, size * 0.5, 44);
                // Punta de la flecha
                ctx.beginPath();
                ctx.moveTo(size * 0.66, cy - 55);
                ctx.lineTo(size * 0.86, cy);
                ctx.lineTo(size * 0.66, cy + 55);
                ctx.closePath();
                ctx.fill();
                break;
            }

            case "crosswalk": {
                // Triángulo de aviso con peatón
                ctx.beginPath();
                ctx.moveTo(cx, size * 0.08);
                ctx.lineTo(size * 0.92, size * 0.9);
                ctx.lineTo(size * 0.08, size * 0.9);
                ctx.closePath();
                ctx.fillStyle = "#ffffff";
                ctx.fill();
                ctx.lineWidth = 16;
                ctx.strokeStyle = "#c0202a";
                ctx.stroke();
                // Peatón estilizado
                ctx.fillStyle = "#1a1a1a";
                ctx.beginPath();
                ctx.arc(cx, size * 0.42, 22, 0, Math.PI * 2); // cabeza
                ctx.fill();
                ctx.fillRect(cx - 14, size * 0.5, 28, 70);   // cuerpo
                // Pasos de cebra mini
                ctx.fillStyle = "#1a1a1a";
                for (let i = 0; i < 4; i++) {
                    ctx.fillRect(size * 0.28 + i * 40, size * 0.82, 22, 8);
                }
                break;
            }

            case "parking": {
                // Cuadrado azul con P
                ctx.fillStyle = "#1a4a9a";
                ctx.fillRect(size * 0.1, size * 0.1, size * 0.8, size * 0.8);
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 140px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("P", cx, cy);
                break;
            }
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
        group.name = `StreetSign_${this.x}_${this.y}`;
        group.userData.worldObject = this;

        const poleMat = new THREE.MeshStandardMaterial({
            color: this.poleColor, roughness: 0.5, metalness: 0.7
        });

        // --- POSTE ---
        const pole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.06, this.poleHeight, 12),
            poleMat
        );
        pole.position.y = this.poleHeight / 2;
        pole.castShadow = true;
        group.add(pole);

        // Base del poste
        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.15, 0.08, 12),
            poleMat
        );
        base.position.y = 0.04;
        group.add(base);

        // --- PANEL DE SEÑAL (doble cara) ---
        const signTex = this._createSignTexture(THREE);
        const signMat = new THREE.MeshStandardMaterial({
            map: signTex,
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide,
            roughness: 0.4,
            metalness: 0.2,  defines: { USE_UV: '' } 
        });

        const panel = new THREE.Mesh(
            new THREE.PlaneGeometry(this.signSize, this.signSize),
            signMat
        );
        panel.position.y = this.poleHeight - this.signSize * 0.4;
        panel.position.z = 0.02;
        panel.castShadow = true;
        group.add(panel);

        // Refuerzo trasero (para que no se vea hueco desde atrás)
        const backMat = new THREE.MeshStandardMaterial({
            color: 0x606060, roughness: 0.8, metalness: 0.5,  defines: { USE_UV: '' } 
        });
        const backPanel = new THREE.Mesh(
            new THREE.PlaneGeometry(this.signSize * 0.9, this.signSize * 0.9),
            backMat
        );
        backPanel.position.y = panel.position.y;
        backPanel.position.z = 0.01;
        backPanel.rotation.y = Math.PI;
        group.add(backPanel);

        // --- POSICIÓN FINAL ---
        group.position.set(this.x + this.w / 2, 0, this.y + this.h / 2);
        group.rotation.y = this.rotation ?? 0;

        engine.renderer.scene.add(group);
        this.AsingProps(group, engine, true);
    }
}

/* =====================================================================
   TrafficLight: semáforo con ciclo automático de luces animado.
   ---------------------------------------------------------------------
   • Bloquea el movimiento en su tile.
   • Ciclo: verde → amarillo → rojo → verde (tiempos configurables).
   • Las luces emiten brillo real (emissive) + PointLight opcional.
   • Opciones:
       - greenTime / yellowTime / redTime : duración de cada fase (seg)
       - startPhase     : fase inicial ("green" | "yellow" | "red")
       - addLight       : emitir luz real al entorno (afecta rendimiento)
       - hasPedestrian  : añadir semáforo peatonal pequeño
   ===================================================================== */
export class TrafficLight extends WorldObject {
    constructor(x, y, options = {}) {
        super(x, y, 0.4, 0.4, options);

        this.name = options.name ?? "TrafficLight";
        this.poleHeight = options.poleHeight ?? 3.2;
        this.greenTime = options.greenTime ?? 8;
        this.yellowTime = options.yellowTime ?? 2;
        this.redTime = options.redTime ?? 8;
        this.startPhase = options.startPhase ?? "green";
        this.addLight = options.addLight ?? true;
        this.hasPedestrian = options.hasPedestrian ?? false;

        this._animRAF = null;
        this._lights = {};   // referencias a materiales
        this._pointLights = {};
    }

    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------
    render(engine) {
        if (this.rendered) return;

        const THREE = engine.THREE;
        const group = new THREE.Group();
        group.name = `TrafficLight_${this.x}_${this.y}`;
        group.userData.worldObject = this;

        const poleMat = new THREE.MeshStandardMaterial({
            color: 0x3a3a3a, roughness: 0.6, metalness: 0.6,  defines: { USE_UV: '' } 
        });
        const boxMat = new THREE.MeshStandardMaterial({
            color: 0x2a2a2a, roughness: 0.7, metalness: 0.4,  defines: { USE_UV: '' } 
        });

        // --- POSTE ---
        const pole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.07, 0.09, this.poleHeight, 12),
            poleMat
        );
        pole.position.y = this.poleHeight / 2;
        pole.castShadow = true;
        group.add(pole);

        // Base
        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(0.18, 0.22, 0.1, 12),
            poleMat
        );
        base.position.y = 0.05;
        group.add(base);

        // --- CABEZAL DEL SEMÁFORO ---
        const headY = this.poleHeight - 0.5;
        const head = new THREE.Mesh(
            new THREE.BoxGeometry(0.45, 1.2, 0.35),
            boxMat
        );
        head.position.set(0, headY, 0.15);
        head.castShadow = true;
        group.add(head);

        // --- LAS TRES LUCES ---
        const lightDefs = [
            { key: "red",    color: 0xff2020, y: headY + 0.38 },
            { key: "yellow", color: 0xffb020, y: headY },
            { key: "green",  color: 0x20c040, y: headY - 0.38 }
        ];

        for (const def of lightDefs) {
            // Lámpara (esfera emisiva)
            const mat = new THREE.MeshStandardMaterial({
                color: def.color,
                emissive: def.color,
                emissiveIntensity: 0, // se anima
                roughness: 0.3,  defines: { USE_UV: '' } 
            });
            const lamp = new THREE.Mesh(
                new THREE.SphereGeometry(0.13, 16, 16),
                mat
            );
            lamp.position.set(0, def.y, 0.34);
            group.add(lamp);
            this._lights[def.key] = mat;

            // Visera sobre la luz
            const visor = new THREE.Mesh(
                new THREE.CylinderGeometry(0.16, 0.16, 0.1, 12, 1, false, 0, Math.PI),
                boxMat
            );
            visor.rotation.x = Math.PI / 2;
            visor.rotation.z = Math.PI;
            visor.position.set(0, def.y + 0.06, 0.38);
            group.add(visor);

            // PointLight opcional
            if (this.addLight) {
                const pl = new THREE.PointLight(def.color, 0, 5);
                pl.position.set(0, def.y, 0.5);
                group.add(pl);
                this._pointLights[def.key] = pl;
            }
        }

        // --- SEMÁFORO PEATONAL (opcional, más bajo) ---
        if (this.hasPedestrian) {
            const pedY = this.poleHeight * 0.45;
            const pedBox = new THREE.Mesh(
                new THREE.BoxGeometry(0.3, 0.6, 0.25),
                boxMat
            );
            pedBox.position.set(0.15, pedY, 0.1);
            group.add(pedBox);

            const pedRed = new THREE.Mesh(
                new THREE.SphereGeometry(0.08, 12, 12),
                new THREE.MeshStandardMaterial({ color: 0xff2020, emissive: 0xff2020, emissiveIntensity: 0,  defines: { USE_UV: '' }  })
            );
            pedRed.position.set(0.15, pedY + 0.15, 0.24);
            group.add(pedRed);

            const pedGreen = new THREE.Mesh(
                new THREE.SphereGeometry(0.08, 12, 12),
                new THREE.MeshStandardMaterial({ color: 0x20c040, emissive: 0x20c040, emissiveIntensity: 0,  defines: { USE_UV: '' } })
            );
            pedGreen.position.set(0.15, pedY - 0.15, 0.24);
            group.add(pedGreen);

            this._lights.pedRed = pedRed.material;
            this._lights.pedGreen = pedGreen.material;
        }

        // --- POSICIÓN FINAL ---
        group.position.set(this.x + this.w / 2, 0, this.y + this.h / 2);
        group.rotation.y = this.rotation ?? 0;

        engine.renderer.scene.add(group);
        this.AsingProps(group, engine, true);

        // --- LOOP DE ANIMACIÓN DEL CICLO ---
        const clock = new THREE.Clock();
        const phaseOffsets = { green: 0, yellow: this.greenTime, red: this.greenTime + this.yellowTime };
        const totalCycle = this.greenTime + this.yellowTime + this.redTime;
        let startTime = -phaseOffsets[this.startPhase]; // empezar en la fase pedida

        const animate = () => {
            this._animRAF = requestAnimationFrame(animate);
            const elapsed = clock.getElapsedTime() + startTime;
            const t = ((elapsed % totalCycle) + totalCycle) % totalCycle;

            // Determinar fase activa
            const active =
                t < this.greenTime ? "green" :
                t < this.greenTime + this.yellowTime ? "yellow" : "red";

            // Actualizar intensidades
            for (const key of ["red", "yellow", "green"]) {
                const isOn = key === active;
                if (this._lights[key]) {
                    this._lights[key].emissiveIntensity = isOn ? 1.5 : 0.05;
                }
                if (this._pointLights[key]) {
                    this._pointLights[key].intensity = isOn ? 1.2 : 0;
                }
            }

            // Semáforo peatonal: invertido al vehicular
            if (this.hasPedestrian) {
                const pedGo = active === "red"; // peatón cruza cuando los coches están en rojo
                if (this._lights.pedRed)   this._lights.pedRed.emissiveIntensity   = pedGo ? 0.05 : 1.2;
                if (this._lights.pedGreen) this._lights.pedGreen.emissiveIntensity = pedGo ? 1.2 : 0.05;
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
   Manhole: tapa de alcantarilla con textura procedural de metal.
   ---------------------------------------------------------------------
   • NO bloquea el movimiento (está a ras de suelo).
   • Opciones:
       - radius   : radio de la tapa
       - style    : "round" | "square"
       - color    : tono del metal
       - worn     : nivel de desgaste/óxido (0..1)
   ===================================================================== */
export class Manhole extends WorldObject {
    constructor(x, y, options = {}) {
        const radius = options.radius ?? 0.5;
        super(x, y, radius * 2, radius * 2, { blocks: false, ...options });

        this.name = options.name ?? "Manhole";
        this.radius = radius;
        this.style = options.style ?? "round";
        this.color = options.color ?? 0x4a4a4e;
        this.worn = options.worn ?? 0.4;
    }

    // --------------------------------------------------
    // TEXTURA PROCEDURAL DE TAPA
    // --------------------------------------------------
    _createManholeTexture(THREE) {
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext("2d");
        const cx = size / 2, cy = size / 2;

        // Base metálica
        ctx.fillStyle = "#4a4a4e";
        ctx.fillRect(0, 0, size, size);

        // Anillo exterior
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.46, 0, Math.PI * 2);
        ctx.fillStyle = "#55555a";
        ctx.fill();
        ctx.lineWidth = 8;
        ctx.strokeStyle = "#2a2a2e";
        ctx.stroke();

        // Patrón de rejilla antideslizante (rombos)
        ctx.strokeStyle = "#35353a";
        ctx.lineWidth = 3;
        const step = 22;
        for (let i = -size; i < size * 2; i += step) {
            ctx.beginPath();
            ctx.moveTo(i, 0); ctx.lineTo(i + size, size);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(i + size, 0); ctx.lineTo(i, size);
            ctx.stroke();
        }

        // Recortar la rejilla al círculo
        ctx.globalCompositeOperation = "destination-in";
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.44, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";

        // Asideros laterales
        ctx.fillStyle = "#2a2a2e";
        ctx.beginPath(); ctx.ellipse(cx - size * 0.3, cy, 12, 20, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx + size * 0.3, cy, 12, 20, 0, 0, Math.PI * 2); ctx.fill();

        // Texto fundido
        ctx.fillStyle = "#5a5a60";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("CLOACA", cx, cy - size * 0.18);

        // Desgaste / óxido
        const wornSpots = Math.floor(this.worn * 30);
        for (let i = 0; i < wornSpots; i++) {
            const a = Math.random() * Math.PI * 2;
            const r = Math.random() * size * 0.44;
            const px = cx + Math.cos(a) * r;
            const py = cy + Math.sin(a) * r;
            const wr = 4 + Math.random() * 10;
            const g = ctx.createRadialGradient(px, py, 0, px, py, wr);
            g.addColorStop(0, `rgba(120, 70, 40, ${0.3 + Math.random() * 0.4})`);
            g.addColorStop(1, "rgba(80, 50, 30, 0)");
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(px, py, wr, 0, Math.PI * 2); ctx.fill();
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
        group.name = `Manhole_${this.x}_${this.y}`;
        group.userData.worldObject = this;

        const tex = this._createManholeTexture(THREE);
        const mat = new THREE.MeshStandardMaterial({
            map: tex,
            color: this.color,
            roughness: 0.9,
            metalness: 0.6,
            defines: { USE_UV: '' } 
        });

        let geo;
        if (this.style === "square") {
            geo = new THREE.BoxGeometry(this.radius * 2, 0.05, this.radius * 2);
        } else {
            geo = new THREE.CylinderGeometry(this.radius, this.radius, 0.05, 32);
        }

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = 0.026; // ligeramente elevado para evitar z-fighting
        mesh.receiveShadow = true;
        group.add(mesh);

        // --- POSICIÓN FINAL ---
        group.position.set(this.x + this.w / 2, 0, this.y + this.h / 2);
        group.rotation.y = this.rotation ?? 0;

        engine.renderer.scene.add(group);
        this.AsingProps(group, engine, true);
    }
}