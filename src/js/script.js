const pictureInput = document.getElementById('photo-file');
const selectImageBtn = document.getElementById('select-image');
const downloadImageBtn = document.getElementById('download-image');
const canvasContainer = document.getElementById('canvas-container');
const loadingSpin = document.getElementById('loading-spin');
const pictureCounter = document.getElementById('picture-counter');
var canvasList = [];

selectImageBtn.onclick = function() {
    reset();
    setLoading();
    pictureInput.click();
}

window.addEventListener('DOMContentLoaded', () => {
    pictureInput.addEventListener('change', () => {
        var pictureFiles = [];
        for (let i = 0; i < pictureInput.files.length; i++) {
            pictureFiles.push(pictureInput.files.item(i));
        }
        pictureFiles.forEach((pictureFile, index) => {
            createNewCanvasElement(index, pictureFile.name);
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
        });
        setPicturesCounter(pictureFiles.length);
    });
});

function reset() {
    canvasList = [];
    while (canvasContainer.firstChild) {
        canvasContainer.removeChild(canvasContainer.firstChild);
    }
}

function setPicturesCounter(counter) {
    if (counter) {
        pictureCounter.textContent = counter + ' imagens selecionadas';
        pictureCounter.classList.remove('d-none');
    } else {
        pictureCounter.classList.add('d-none');
    }
}

function createNewCanvasElement(index, fileName) {
    let newCanvas = document.createElement('canvas');
    newCanvas.setAttribute('id', `canvas-preview-${index}`);
    newCanvas.setAttribute('class', 'canvas-preview');
    newCanvas.setAttribute('name', fileName);
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
    setLoading(true, 'Carregando');
    setTimeout(function name() {
        var zip = new JSZip();
        canvasList.forEach((canvasPreview, index) => {
            setLoading(true, 'Processando imagens');
            let folder = zip.folder('imagens');
            let fileName = canvasPreview.getAttribute('name');
            fileName = fileName.substring(0, fileName.indexOf('.'));
            let image = canvasPreview.toDataURL('image/jpeg');
            let base64Index = image.indexOf(",");
            if (base64Index !== -1) {
                image = image.substring(base64Index + 1, image.length);
            }
            folder.file(fileName + '.jpeg', image, {base64: true});
        });
        zip.generateAsync({type:"blob"}).then(function(content) {
            saveAs(content, "imagens.zip");
            setLoading(false);
        });
    }, 1000);
}

function setLoading(loading, text) {
    if (loading) {
        loadingSpin.textContent = text;
        loadingSpin.classList.remove('d-none');
    } else {
        loadingSpin.classList.add('d-none');
    }
}