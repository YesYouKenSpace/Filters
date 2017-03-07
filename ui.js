var loadedImage = false;
var arr = [];
var selection = 0;

var firsttime = true;

var darkenFiltering = 0;
var greenizedFiltering = 0;
var reflectXFiltering = 0;
var embossedFiltering = 0;

var embossedState = ["No Embossed", "Embossed"];
var darkenState = ["No Darken", "Darken"];
var greenizedState = ["No Greenized", "Greenized"];
var reflectXState = ["No ReflectX", "ReflectX"];

var slideToLeft = 0;
var slideToLeftState = ["No SlideToLeft", "SlideToLeft"];
var mosaicYFiltering = 0;
var mosaicYState = ["No MosaicY", "MosaicY"];
var mosaicXFiltering = 0;
var mosaicXState = ["No MosaicX", "MosaicX"];
var mosaicXYFiltering = 0;
var mosaicXYState = ["No MosaicXY", "MosaicXY"];

function change(el) {
    if (el.value === "Using CPU") {
        selection = 1;
        el.value = "Using GPU";
    } else {
        selection = 0;
        el.value = "Using CPU";
    }
}
function changeEmbossedFilter(el) {
    embossedFiltering++;
    embossedFiltering %= 2;
    el.value = embossedState[embossedFiltering];
    fps.restart();
}

function checkSum(x){
    var sum = mosaicXFiltering
        +mosaicXYFiltering
        +mosaicYFiltering
        +slideToLeft
        +darkenFiltering
        +greenizedFiltering
        +reflectXFiltering
        +embossedFiltering;
    if(sum==2&&x===0){
        window.alert("Do not use more than two filters");
        return false;
    }
    return true;
}

function changeDarkenFilter(el) {
    if(checkSum(darkenFiltering)) {
        darkenFiltering++;
        darkenFiltering %= 2;
        el.value = darkenState[darkenFiltering];
        fps.restart();
    }
}

function changeGreenizedFilter(el) {
    if(checkSum(greenizedFiltering)) {
        greenizedFiltering++;
        greenizedFiltering %= 2;
        el.value = greenizedState[greenizedFiltering];
        fps.restart();
    }
}

function changeReflectXFilter(el) {
    if(checkSum(reflectXFiltering)) {
        reflectXFiltering++;
        reflectXFiltering %= 2;
        el.value = reflectXState[reflectXFiltering];
        fps.restart();
    }
}

function changeSlideToLeft(el) {
    if(mosaicYFiltering===1){
        changeYMosaic();
    }
    if(mosaicXFiltering===1){
        changeXMosaic();
    }
    if(mosaicXYFiltering===1){
        changeXYMosaic();
    }
    if(checkSum(slideToLeft)) {
        slideToLeft++;
        slideToLeft %= 2;
        el.value = slideToLeftState[slideToLeft];
        fps.restart();
    }
}

function changeYMosaic(el) {
    if(mosaicXFiltering===1){
        changeXMosaic();
    }
    if(slideToLeft===1){
        changeSlideToLeft();
    }
    if(mosaicXYFiltering===1){
        changeXYMosaic();
    }
    if(checkSum(mosaicYFiltering)) {
        mosaicYFiltering++;
        mosaicYFiltering %= 2;
        el.value = mosaicYState[mosaicYFiltering];
        fps.restart();
    }
}

function changeXMosaic(el) {
    if(mosaicYFiltering===1){
        changeYMosaic();
    }
    if(slideToLeft===1){
        changeSlideToLeft();
    }
    if(mosaicXYFiltering===1) {
        changeXYMosaic();
    }
    if(checkSum(mosaicXFiltering)) {
        mosaicXFiltering++;
        mosaicXFiltering %= 2;
        el.value = mosaicXState[mosaicXFiltering];
        fps.restart();
    }
}
function changeXYMosaic(el) {
    if(mosaicYFiltering===1){
        changeYMosaic();
    }
    if(mosaicXFiltering===1){
        changeXMosaic();
    }
    if(slideToLeft===1){
        changeSlideToLeft();
    }
    if(checkSum(mosaicXYFiltering)) {
        mosaicXYFiltering++;
        mosaicXYFiltering %= 2;
        el.value = mosaicXYState[mosaicXYFiltering];
        fps.restart();
    }
}

function loadImage() {
    var canvas = document.getElementById("backimageCanvas");
    var ctx = canvas.getContext('2d');
    var imag = document.getElementById("backimage");
    ctx.drawImage(imag, 0, 0);
    imag.style.display = 'none';

    var imageData = ctx.getImageData(0, 0, 800, 600);

    for (var channel = 0; channel < 4; channel++) {
        arr.push([]);
        for (var y = 0; y < 600; y++) {
            arr[channel].push([]);
        }
    }
    var pointer = 0;
    for (var y = 0; y < 600; y++) {
        for (var x = 0; x < 800; x++) {
            arr[0][600 - y - 1][x] = imageData.data[pointer++] / 255;
            arr[1][600 - y - 1][x] = imageData.data[pointer++] / 255;
            arr[2][600 - y - 1][x] = imageData.data[pointer++] / 255;
            arr[3][600 - y - 1][x] = imageData.data[pointer++] / 255;
        }
    }
    loadedImage = true;
}


