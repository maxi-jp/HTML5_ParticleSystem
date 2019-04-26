
class Background {
    constructor () {
        // background colors
        this.bgColors = [
            { R: 128, G: 0, B: 255 }, 
            { R: 0, G: 255, B: 255 },
            { R: 255, G: 196, B: 0 }
        ];
        this.bgColorVar = 0.0; // bg blend in the current step
        this.bgColorStep = 0; // blendStep, 0: 1-2, 1: 2-3, 2: 3-0
        this.bgColorVarVelocity = 0.1; // color bg variation velocity
    }

    Update(deltaTime) {
        this.bgColorVar += this.bgColorVarVelocity * deltaTime;
        if (this.bgColorVar > 1.0)
        {
            this.bgColorStep = (this.bgColorStep + 1) % 3;
            this.bgColorVar = 0.0;
        }
    }

    Draw(ctx) {
        let bgColorR, bgColorG, bgColorB;

        let nextStep = (this.bgColorStep + 1) % this.bgColors.length;
        bgColorR = Math.round( (1 - this.bgColorVar) * this.bgColors[this.bgColorStep].R + (this.bgColorVar * this.bgColors[nextStep].R) );
        bgColorG = Math.round( (1 - this.bgColorVar) * this.bgColors[this.bgColorStep].G + (this.bgColorVar * this.bgColors[nextStep].G) );
        bgColorB = Math.round( (1 - this.bgColorVar) * this.bgColors[this.bgColorStep].B + (this.bgColorVar * this.bgColors[nextStep].B) );

        let stringR = (bgColorR).toString(16); if (stringR.length < 2) stringR = "0" + stringR;
        let stringG = (bgColorG).toString(16); if (stringG.length < 2) stringG = "0" + stringG;
        let stringB = (bgColorB).toString(16); if (stringB.length < 2) stringB = "0" + stringB;
        
        let stringR_0 = (Math.round(bgColorR / 10)).toString(16); if (stringR_0.length < 2) stringR_0 = "0" + stringR_0;
        let stringG_0 = (Math.round(bgColorG / 10)).toString(16); if (stringG_0.length < 2) stringG_0 = "0" + stringG_0;
        let stringB_0 = (Math.round(bgColorB / 10)).toString(16); if (stringB_0.length < 2) stringB_0 = "0" + stringB_0;

        let bgColor = "#" + stringR + stringG + stringB;
        let lGrad = ctx.createLinearGradient(320, 0, 320, canvas.width); // gradient direction
        //lGrad.addColorStop(0.0, 'black');
        lGrad.addColorStop(0.0, '#' + stringR_0 + stringG_0 + stringB_0);
        //lGrad.addColorStop(0.05, "#161616");
        lGrad.addColorStop(0.9, bgColor);
        //lGrad.addColorStop(1.0, 'white');
        ctx.fillStyle = lGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

