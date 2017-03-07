var gpu = new GPU();

function sqr(x) {
    return x * x;
}
function dist(x1, y1, x2, y2) {
    return Math.sqrt(sqr(x2 - x1) + sqr(y2 - y1));
}

gpu.addFunction(sqr);
gpu.addFunction(dist);

function makeAnim(mode) {
    var opt = {
        dimensions: [800, 600, 4],
        debug: true,
        graphical: false,
        outputToTexture: true,
        mode: mode
    };

    var y = gpu.createKernel(function (img) {
        return img[this.thread.z][this.thread.y][this.thread.x];
    }, opt);
    return y;
}

function makefx4Anim(mode) {
    var opt = {
        dimensions: [250, 159, 4],
        debug: true,
        graphical: false,
        outputToTexture: true,
        mode: mode
    };

    var y = gpu.createKernel(function (img) {
        return img[this.thread.z][this.thread.y][this.thread.x];
    }, opt);
    return y;
}


var toimg = gpu.createKernel(function (A) {
    this.color(A[0][this.thread.y][this.thread.x], A[1][this.thread.y][this.thread.x], A[2][this.thread.y][this.thread.x]);
}).dimensions([800, 600]).graphical(true);

function embossed(A) {
    if (this.thread.y > 0 && this.thread.y < 600 - 2 && this.thread.x < 800 - 2 && this.thread.x > 0 && this.thread.z < 3) {
        var c = A[this.thread.z][this.thread.y - 1][this.thread.x - 1] * -1 +
            A[this.thread.z][this.thread.y][this.thread.x - 1] * -2 +
            A[this.thread.z][this.thread.y + 1][this.thread.x - 1] * -1 +
//                     A[this.thread.z][this.thread.y-1][this.thread.x]*-1 +
//                     A[this.thread.z][this.thread.y][this.thread.x]*9 +
//                     A[this.thread.z][this.thread.y+1][this.thread.x]*-1 +
            A[this.thread.z][this.thread.y - 1][this.thread.x + 1] +
            A[this.thread.z][this.thread.y][this.thread.x + 1] * 2 +
            A[this.thread.z][this.thread.y + 1][this.thread.x + 1];
        var d = A[this.thread.z][this.thread.y - 1][this.thread.x - 1] * -1 +
            A[this.thread.z][this.thread.y - 1][this.thread.x] * -2 +
            A[this.thread.z][this.thread.y - 1][this.thread.x + 1] * -1 +
//                     A[this.thread.z][this.thread.y-1][this.thread.x]*-1 +
//                     A[this.thread.z][this.thread.y][this.thread.x]*9 +
//                     A[this.thread.z][this.thread.y+1][this.thread.x]*-1 +
            A[this.thread.z][this.thread.y + 1][this.thread.x - 1] +
            A[this.thread.z][this.thread.y + 1][this.thread.x] * 2 +
            A[this.thread.z][this.thread.y + 1][this.thread.x + 1];
        return (c + d) + 1 / 2;
    } else {
        return A[this.thread.z][this.thread.y][this.thread.x];
    }
}

function darken (A) {
    if (this.thread.y > 0 && this.thread.y < 600 - 2 && this.thread.x < 800 - 2 && this.thread.x > 0 && this.thread.z < 3) {
        var c = A[this.thread.z][this.thread.y][this.thread.x] / 2;
        return c;
    } else {
        return A[this.thread.z][this.thread.y][this.thread.x];
    }
}

function reflectX (A) {
        var c = A[this.thread.z][this.thread.y][800 - this.thread.x];
        return c;
}

function greenized (A) {
    var c = A[(this.thread.z + 2) % 4][this.thread.y][this.thread.x];
    return c;
}


function mosaicY (A, y) {


    if (this.thread.y > 0 && this.thread.y < 200 && this.thread.x < 800-2 && this.thread.x > 0 && this.thread.z < 3) {
        return A[this.thread.z][(this.thread.y+y)%600][this.thread.x];
    }else if(this.thread.y > 0 && this.thread.y < 400 && this.thread.x < 800-2 && this.thread.x > 0 && this.thread.z < 3) {
        return A[this.thread.z][(this.thread.y-2*y)%600][this.thread.x];
    }else if(this.thread.y > 0 && this.thread.y < 600-2 && this.thread.x < 800-2 && this.thread.x > 0 && this.thread.z < 3) {
        return A[this.thread.z][(this.thread.y+3*y)%600][this.thread.x];
    }else{
        return A[this.thread.z][this.thread.y][this.thread.x];
    }

}

function mosaicXY (A,x, y) {
    if (this.thread.x < 200 && this.thread.x > 0 && this.thread.z < 3) {
        if (this.thread.y > 0 && this.thread.y < 200 && this.thread.z < 3) {
            return A[this.thread.z][(this.thread.y+y)%600][this.thread.x-x];
        }else if(this.thread.y > 0 && this.thread.y < 400 && this.thread.z < 3) {
            return A[this.thread.z][(this.thread.y-2*y)%600][this.thread.x-x];
        }else if(this.thread.y > 0 && this.thread.y < 600-2 && this.thread.z < 3) {
            return A[this.thread.z][(this.thread.y+3*y)%600][this.thread.x-x];
        }else{
            return A[this.thread.z][this.thread.y][this.thread.x];
        }
    }else if(this.thread.x < 400 && this.thread.x > 0 && this.thread.z < 3) {
        if (this.thread.y > 0 && this.thread.y < 200 && this.thread.z < 3) {
            return A[this.thread.z][(this.thread.y+y)%600][this.thread.x+2*x];
        }else if(this.thread.y > 0 && this.thread.y < 400 && this.thread.z < 3) {
            return A[this.thread.z][(this.thread.y-2*y)%600][this.thread.x+2*x];
        }else if(this.thread.y > 0 && this.thread.y < 600-2 && this.thread.z < 3) {
            return A[this.thread.z][(this.thread.y+3*y)%600][this.thread.x+2*x];
        }else{
            return A[this.thread.z][this.thread.y][this.thread.x];
        }
    }else if(this.thread.x < 600 && this.thread.x > 0 && this.thread.z < 3) {
        if (this.thread.y > 0 && this.thread.y < 200 && this.thread.z < 3) {
            return A[this.thread.z][(this.thread.y+y)%600][this.thread.x-3*x];
        }else if(this.thread.y > 0 && this.thread.y < 400 && this.thread.z < 3) {
            return A[this.thread.z][(this.thread.y-2*y)%600][this.thread.x-3*x];
        }else if(this.thread.y > 0 && this.thread.y < 600-2 && this.thread.z < 3) {
            return A[this.thread.z][(this.thread.y+3*y)%600][this.thread.x-3*x];
        }else{
            return A[this.thread.z][this.thread.y][this.thread.x];
        }
    }else if(this.thread.x < 800-2 && this.thread.x > 0 && this.thread.z < 3) {
        if (this.thread.y > 0 && this.thread.y < 200 && this.thread.z < 3) {
            return A[this.thread.z][(this.thread.y+y)%600][this.thread.x+4*x];
        }else if(this.thread.y > 0 && this.thread.y < 400 && this.thread.z < 3) {
            return A[this.thread.z][(this.thread.y-2*y)%600][this.thread.x+4*x];
        }else if(this.thread.y > 0 && this.thread.y < 600-2 && this.thread.z < 3) {
            return A[this.thread.z][(this.thread.y+3*y)%600][this.thread.x+4*x];
        }else{
            return A[this.thread.z][this.thread.y][this.thread.x];
        }
    }else {
        return A[this.thread.z][this.thread.y][this.thread.x];
    }

}

function mosaicX (A, x) {
    if (this.thread.y > 0 && this.thread.y < 600-2 && this.thread.x < 200 && this.thread.x > 0 && this.thread.z < 3) {
        return A[this.thread.z][(this.thread.y)][this.thread.x-x];
    }else if(this.thread.y > 0 && this.thread.y < 600-2 && this.thread.x < 400 && this.thread.x > 0 && this.thread.z < 3) {
        return A[this.thread.z][(this.thread.y)][this.thread.x+2*x];
    }else if(this.thread.y > 0 && this.thread.y < 600-2 && this.thread.x < 600 && this.thread.x > 0 && this.thread.z < 3) {
        return A[this.thread.z][(this.thread.y)][this.thread.x-3*x];
    }else if(this.thread.y > 0 && this.thread.y < 600-2 && this.thread.x < 800-2 && this.thread.x > 0 && this.thread.z < 3) {
        return A[this.thread.z][this.thread.y][this.thread.x+4*x];
    }else{
        return A[this.thread.z][this.thread.y][this.thread.x];
    }

}

function makeFilter(mode, kernel) {
    var opt = {
        dimensions: [800, 600, 4],
        debug: true,
        graphical: false,
        outputToTexture: true,
        mode: mode
    };
    var filt = gpu.createKernel(kernel, opt);
    return filt;
}

function hpu() {
    var opt = {
        dimensions: [800, 600, 4],
        debug: true,
        graphical: false,
        outputToTexture: true,
        mode: mode
    };
}

function makeAnimator(mode) {
    var opt = {
        dimensions: [800, 600, 4],
        debug: true,
        graphical: false,
        outputToTexture: true,
        mode: mode
    };
    var filt = gpu.createKernel(function (A, x) {
        return A[this.thread.z][this.thread.y][(this.thread.x + x)];
    }, opt);
    return filt;
}

