const pictureInput = document.getElementById('photo-file');
const selectImageBtn = document.getElementById('select-image');
const downloadImageBtn = document.getElementById('download-image');
const canvasList = [];

selectImageBtn.onclick = function() {
    pictureInput.click();
}

window.addEventListener('DOMContentLoaded', () => {
    pictureInput.addEventListener('change', () => {
        var pictureFiles = [];
        for (let i = 0; i < pictureInput.files.length; i++) {
            pictureFiles.push(pictureInput.files.item(i));
        }
        pictureFiles.forEach((pictureFile, index) => {
            createNewCanvasElement(index);
            let reader = new FileReader();
            reader.readAsDataURL(pictureFile);
            reader.onload = event => {
                var baseImage = new Image();
                baseImage.src = event.target.result;
                baseImage.onload = () => {
                    drawImage(baseImage, index);
                }
                downloadImageBtn.classList.remove('d-none');
            }
            console.log('reading');
        })
    });
});

function createNewCanvasElement(index) {
    let canvasContainer = document.getElementById('canvas-container');
    let newCanvas = document.createElement('canvas');
    newCanvas.setAttribute('id', `canvas-preview-${index}`);
    newCanvas.setAttribute('class', 'canvas-preview');
    canvasContainer.appendChild(newCanvas);
}

function drawImage(baseImage, index) {
    let canvasPreview = document.getElementById(`canvas-preview-${index}`);
    let canvasContext = canvasPreview.getContext('2d');
    canvasPreview.setAttribute('width', baseImage.width);
    canvasPreview.setAttribute('height', baseImage.height);
    canvasContext.drawImage(baseImage, 0, 0);
    canvasContext.lineWidth = 16;
    canvasContext.strokeStyle = '#FED65A';
    canvasContext.strokeRect(0, 0, baseImage.width, baseImage.height);
    drawLogo(baseImage, canvasContext, canvasPreview);
}

function drawLogo(baseImage, canvasContext, canvasPreview) {
    var logo = new Image();
    logo.src = 'src/img/logo-menor.png';
    logo.onload = () => {
        canvasContext.beginPath();
        canvasContext.drawImage(logo, baseImage.width - 150, baseImage.height - 166);
        canvasList.push(canvasPreview);
    }
}

downloadImageBtn.onclick = function() {
    canvasList.forEach(canvasPreview => {
        const link = document.createElement("a");
        document.body.appendChild(link);
        link.href = canvasPreview.toDataURL("image/jpeg");
        link.download = "canvas-image.jpeg";
        link.click();
        document.body.removeChild(link);
    });
}