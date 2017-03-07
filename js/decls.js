function Enum(constantsList) {
    for (var i in constantsList) {
        this[constantsList[i]] = i;
    }
}

var ObjTyp = new Enum(['EMPTY', 'SPHERE', 'CUBOID', 'CYLINDER', 'CONE', 'TRIANGLE']);

var fps = {
    startTime: 0, frameNumber: 0, maxfps:0,
    getFPS: function () {
        this.frameNumber++;
        var d = new Date().getTime(), currentTime = ( d - this.startTime ) / 1000, result = Math.floor(( (this.frameNumber * 10) / currentTime ));
        if(this.frameNumber > 1){ // to let it stabilize first
            this.maxfps = Math.max(this.maxfps, result/10.0);
        }
        if (currentTime > 1) {
            this.startTime = new Date().getTime();
            this.frameNumber = 0;
        }

        return result / 10.0;
    },
    restart: function () {
        this.frameNumber = 0;
        this.startTime = 0;
        this.maxfps = 0;
    },

    getMaxFPS : function(){
        return this.maxfps;
    }
};

