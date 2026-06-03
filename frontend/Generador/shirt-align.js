'use strict';

const ShirtAlign = {
    loadModels: async function () {
        console.log("Configurando motor y cargando modelos...");
        try {
            await faceapi.tf.setBackend('cpu');
            await faceapi.tf.ready();

            const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models/';
            await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
            await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
            console.log("Modelos de face-api cargados con éxito (Modo Seguro CPU).");
        } catch (err) {
            console.error("Error al cargar los modelos:", err);
        }
    },

    alignShirt: function (shirtImg, state, onUpdate) {
        if (!state.shirtY) state.shirtY = 0;
        if (onUpdate) onUpdate('draw');
    },
    findShirtCollarY: function (shirtImg) {
        if (!shirtImg) return 3037;

        const sw = shirtImg.naturalWidth || shirtImg.width;
        const sh = shirtImg.naturalHeight || shirtImg.height;

        const auxCanvas = document.createElement('canvas');
        auxCanvas.width = sw;
        auxCanvas.height = sh;
        const auxCtx = auxCanvas.getContext('2d', { willReadFrequently: true });
        auxCtx.drawImage(shirtImg, 0, 0, sw, sh);

        const centerX = Math.floor(sw / 2);
        const imgData = auxCtx.getImageData(centerX, 0, 1, sh);
        const data = imgData.data;

        let localCollarY = sh;
        for (let y = 0; y < sh; y++) {
            if (data[y * 4 + 3] > 20) {
                localCollarY = y;
                break;
            }
        }
        return (localCollarY / sh) * 3840;
    },
    align: async function (photo, shirtImg, state, onUpdate) {
        if (!photo) return;

        const w = photo.naturalWidth || photo.width;
        const h = photo.naturalHeight || photo.height;
        const auxCanvas = document.createElement('canvas');
        auxCanvas.width = w;
        auxCanvas.height = h;
        const auxCtx = auxCanvas.getContext('2d', { willReadFrequently: true });
        auxCtx.drawImage(photo, 0, 0, w, h);
        const data = auxCtx.getImageData(0, 0, w, h).data;

        let minY = h, maxY = 0, minX = w, maxX = 0;
        let found = false;

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                if (data[(y * w + x) * 4 + 3] > 15) {
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    found = true;
                }
            }
        }
        if (!found) return;

        const TARGET_Y_TOP = 207;
        const TARGET_X_CENTER = (189 + 2186) / 2;
        let scale;
        let faceDetected = false;
        let chinY = maxY;
        let faceCenterX = (minX + maxX) / 2;

        if (state.showShirt && shirtImg) {
            if (typeof faceapi !== 'undefined' && faceapi.nets.tinyFaceDetector.isLoaded) {
                const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });
                const detection = await faceapi.detectSingleFace(photo, options).withFaceLandmarks();

                if (detection) {
                    faceDetected = true;
                    chinY = detection.landmarks.positions[8].y;
                    chinY += (chinY - minY) * 0.05;
                    const rightCheek = detection.landmarks.positions[16].x;
                    const leftCheek = detection.landmarks.positions[0].x;
                    faceCenterX = (leftCheek + rightCheek) / 2;
                }
            }

            const collarY = this.findShirtCollarY(shirtImg) + (state.shirtY || 0);

            if (faceDetected) {
                const TARGET_AVAILABLE_HEIGHT = collarY - TARGET_Y_TOP;
                const CONTENT_FACE_HEIGHT = chinY - minY;
                scale = TARGET_AVAILABLE_HEIGHT / CONTENT_FACE_HEIGHT;
            } else {
                const TARGET_AVAILABLE_HEIGHT = collarY - TARGET_Y_TOP;
                const CONTENT_HEIGHT = maxY - minY;
                scale = TARGET_AVAILABLE_HEIGHT / CONTENT_HEIGHT;
            }

        } else {
            const TARGET_Y_BOTTOM = 3103;
            const TARGET_AVAILABLE_HEIGHT = TARGET_Y_BOTTOM - TARGET_Y_TOP;
            const CONTENT_HEIGHT = maxY - minY;
            scale = TARGET_AVAILABLE_HEIGHT / CONTENT_HEIGHT;
        }
        state.photoScale = scale * 40;
        state.photoY = TARGET_Y_TOP - (minY * scale);
        state.photoX = (1221) - (faceCenterX * scale);

        state._photoBounds = { minY, maxY, minX, maxX, scale };

        if (onUpdate) onUpdate('draw');
    }
};