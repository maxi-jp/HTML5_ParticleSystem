
class ColorRainbowBackground {
    constructor () {
        this.grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        this.colorStep = 0;
    }

    Update(deltaTime) {
        this.grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        
        this.colorStep += deltaTime * 0.1;

        this.grd.addColorStop((   0 + this.colorStep) % 1, 'rgba(255, 0, 0, 1)'   );
        this.grd.addColorStop((0.10 + this.colorStep) % 1, 'rgba(255, 154, 0, 1)' );
        this.grd.addColorStop((0.20 + this.colorStep) % 1, 'rgba(208, 222, 33, 1)');
        this.grd.addColorStop((0.30 + this.colorStep) % 1, 'rgba(79, 220, 74, 1)' );
        this.grd.addColorStop((0.40 + this.colorStep) % 1, 'rgba(63, 218, 216, 1)');
        this.grd.addColorStop((0.50 + this.colorStep) % 1, 'rgba(47, 201, 226, 1)');
        this.grd.addColorStop((0.60 + this.colorStep) % 1, 'rgba(28, 127, 238, 1)');
        this.grd.addColorStop((0.70 + this.colorStep) % 1, 'rgba(95, 21, 242, 1)' );
        this.grd.addColorStop((0.80 + this.colorStep) % 1, 'rgba(186, 12, 248, 1)');
        this.grd.addColorStop((0.90 + this.colorStep) % 1, 'rgba(251, 7, 217, 1)' );
        this.grd.addColorStop((   1 + this.colorStep) % 1, 'rgba(255, 0, 0, 1)'   );
    }

    Draw(ctx) {
        ctx.globalCompositeOperation = "source-in";
        ctx.fillStyle = this.grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';
    }
}

