const pictureInput = document.getElementById('photo-file');
const selectImageBtn = document.getElementById('select-image');
const downloadImageBtn = document.getElementById('download-image');
const canvasPreview = document.getElementById('canvas-preview');
const canvasContext = canvasPreview.getContext('2d');

selectImageBtn.onclick = function() {
    pictureInput.click();
}

window.addEventListener('DOMContentLoaded', () => {
    pictureInput.addEventListener('change', () => {
        let pictureFile = pictureInput.files.item(0);
        let reader = new FileReader();
        
        reader.readAsDataURL(pictureFile);
        reader.onload = function(event) {
            var base_image = new Image();
            base_image.src = event.target.result;
            base_image.onload = function(){
                canvasPreview.setAttribute('width', base_image.width);
                canvasPreview.setAttribute('height', base_image.height);
                canvasContext.drawImage(base_image, 0, 0);
                canvasContext.lineWidth = 16;
                canvasContext.strokeStyle = '#f3b60d';
                canvasContext.strokeRect(0, 0, base_image.width, base_image.height);
            }
            downloadImageBtn.classList.remove('d-none');
        }
    });
});

downloadImageBtn.onclick = function() {
    if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(canvasPreview.msToBlob(), "canvas-image.png");
    } else {
        const link = document.createElement("a");
        document.body.appendChild(link);
        link.href = canvasPreview.toDataURL();
        link.download = "canvas-image.png";
        link.click();
        document.body.removeChild(link);
    }
}