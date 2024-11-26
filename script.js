const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const convertButton = document.getElementById('convert-btn');
const output = document.getElementById('output');

let uploadedFiles = [];

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.backgroundColor = '#eef';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.backgroundColor = '#f9f9f9';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.backgroundColor = '#f9f9f9';
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
});

fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
});

function handleFiles(files) {
    uploadedFiles = files.filter(file => file.type.startsWith('image/') || file.name.endsWith('.heic'));
    if (uploadedFiles.length > 0) {
        alert(`${uploadedFiles.length} archivo(s) cargado(s). Listo para convertir.`);
    } else {
        alert('Por favor, carga solo archivos de imagen (.jpg, .png, .heic, etc.).');
    }
}

convertButton.addEventListener('click', () => {
    if (uploadedFiles.length === 0) {
        alert('Por favor, carga al menos un archivo para convertir.');
        return;
    }

    output.innerHTML = ''; // Limpia los resultados previos

    uploadedFiles.forEach(file => {
        if (file.name.endsWith('.heic')) {
            convertHeicToPng(file);
        } else {
            processImageFile(file);
        }
    });
});

function convertHeicToPng(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        heic2any({
            blob: file,
            toType: "image/png",
        }).then((convertedBlob) => {
            const url = URL.createObjectURL(convertedBlob);
            displayResult(url, `${file.name.split('.')[0]}.png`);
        }).catch((err) => {
            console.error('Error al convertir HEIC:', err);
            alert('Hubo un problema al convertir el archivo HEIC.');
        });
    };
    reader.readAsArrayBuffer(file);
}

function processImageFile(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const pngUrl = canvas.toDataURL('image/png');
            displayResult(pngUrl, `${file.name.split('.')[0]}.png`);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function displayResult(dataUrl, filename) {
    const container = document.createElement('div');
    container.className = 'output-item';

    const img = document.createElement('img');
    img.src = dataUrl;
    img.alt = filename;
    img.style.maxWidth = '100px';

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.textContent = 'Descargar PNG';
    link.style.display = 'block';

    container.appendChild(img);
    container.appendChild(link);
    output.appendChild(container);
}
