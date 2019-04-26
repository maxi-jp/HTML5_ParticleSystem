
class Vector2 {
    constructor (x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

class Particle {
    
    constructor () {
        this.img = smoke;

        this.img.halfWidth = this.img.width / 2;
        this.img.halfHeight = this.img.height / 2;

        this.active = false;

        this.appearing = false;

        this.position = new Vector2();

        this.opacity = 0.0;
        this.opacityVelocity = 0.0;

        this.rotation = 0.0;
        this.rotationVelocity = 0.0;

        this.scale = 1.0;
        this.scaleVelocity = 0.0;

        this.wat = Math.random() < 0.15;
    }

    Activate (initialPosition, opacityVelocity, initialScale, scaleVelocity, initialRotation, rotationVelocity) {
        this.position = initialPosition;

        this.opacity = 0.0;
        this.opacityVelocity = opacityVelocity;

        this.scale = initialScale;
        this.scaleVelocity = scaleVelocity;

        this.rotation = initialRotation;
        this.rotationVelocity = rotationVelocity;

        this.appearing = true;

        this.active = true;
    }

    Update (deltaTime) {
        if (this.appearing) {
            this.opacity += this.opacityVelocity * 2.0 * deltaTime;
            if (this.opacity >= 1.0) {
                this.opacity = 1.0;
                this.appearing = false;
            }
        }
        else {
            this.opacity -= this.opacityVelocity * deltaTime;
            if (this.opacity <= 0.0) {
                // deactivate particle
                this.active = false;
            }
        }

        this.scale += this.scaleVelocity * deltaTime;
        this.rotation += this.rotationVelocity * deltaTime;
    }

    Draw (ctx) {
        //ctx.globalCompositeOperation = 'overlay';
        //ctx.globalCompositeOperation = 'darken';
        //ctx.globalCompositeOperation = 'lighten';
        //ctx.globalCompositeOperation = 'color-dodge';
        //ctx.globalCompositeOperation = 'overlay';

        ctx.globalCompositeOperation = this.wat ? 'color-burn' : 'overlay';
        
        ctx.save();

        ctx.translate(this.position.x /*+ this.img.halfWidth*/, this.position.y /*+ this.img.halfHeight*/);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        ctx.translate(-this.img.halfWidth, -this.img.halfHeight);

        ctx.globalAlpha = this.opacity;

        //ctx.fillStyle = "#09f";
        //ctx.fillRect(0, 0, this.img.width, this.img.height);
        //ctx.globalCompositeOperation = "destination-in";

        ctx.drawImage(this.img, 0, 0);

        ctx.globalAlpha = 1.0;
        
        ctx.restore();
    }
}

class ParticleSystem {

    constructor (maxParticleCount = 100) {
        this.origin = new Vector2();

        this.maxParticleCount = maxParticleCount;

        this.MIN_TIME_TO_SPAWN_PARTICLE = 0.02;
        this.MAX_TIME_TO_SPAWN_PARTICLE = 0.03;
        this.nextTimeToSpawnParticle = RandomBetween(this.MIN_TIME_TO_SPAWN_PARTICLE, this.MAX_TIME_TO_SPAWN_PARTICLE);

        this.MIN_SPAWNPOINT_DISPLACEMENT = -30;
        this.MAX_SPAWNPOINT_DISPLACEMENT = 30;

        this.MIN_OPACITY_DECREMENT_VELOCITY_VALUE = 0.8;
        this.MAX_OPACITY_DECREMENT_VELOCITY_VALUE = 1.5;

        this.MIN_INITIAL_SCALE = 0.1;
        this.MAX_INITIAL_SCALE = 0.5;

        this.MIN_SCALE_VELOCITY = 0.5;
        this.MAX_SCALE_VELOCITY = 2;

        this.MIN_INITIAL_ROTATION = -360;
        this.MAX_INITIAL_ROTATION = 360;

        this.MIN_ROTATION_VELOCITY = 0;
        this.MAX_ROTATION_VELOCITY = 0.5;

        // the particles array
        this.particles = new Array();
        // create the particles pool
        for (let i = 0; i < this.maxParticleCount; i++) {
            let newParticle = new Particle();

            this.particles.push(newParticle);
        }
    }

    Update (deltaTime) {
        this.nextTimeToSpawnParticle -= deltaTime;
        if (this.nextTimeToSpawnParticle <= 0.0) {
            // activate particle
            // search for the first unactive particle
            let i;
            for (i = 0; i < this.particles.length; i++) {
                if (!this.particles[i].active)
                {
                    let spawnPoint = new Vector2(
                        RandomBetween(this.MIN_SPAWNPOINT_DISPLACEMENT, this.MAX_SPAWNPOINT_DISPLACEMENT) + this.origin.x,
                        RandomBetween(this.MIN_SPAWNPOINT_DISPLACEMENT, this.MAX_SPAWNPOINT_DISPLACEMENT) + this.origin.y
                    );

                    let opacityVel = RandomBetween(this.MIN_OPACITY_DECREMENT_VELOCITY_VALUE,this.MAX_OPACITY_DECREMENT_VELOCITY_VALUE);

                    let initialScale = RandomBetween(this.MIN_INITIAL_SCALE, this.MAX_INITIAL_SCALE);

                    let scaleVelocity = RandomBetween(this.MIN_SCALE_VELOCITY, this.MAX_SCALE_VELOCITY);

                    let initialRotation = RandomBetween(this.MIN_INITIAL_ROTATION, this.MAX_INITIAL_ROTATION);

                    let rotationVelocity = RandomBetween(this.MIN_ROTATION_VELOCITY, this.MAX_ROTATION_VELOCITY);

                    this.particles[i].Activate(spawnPoint, opacityVel, initialScale, scaleVelocity, initialRotation, rotationVelocity);
                    break;
                }
            }
            if (i == this.maxParticleCount)
                Console.log("Warning: particle system is not big enough");

            // reset the time_to_spawn
            this.nextTimeToSpawnParticle = RandomBetween(this.MIN_TIME_TO_SPAWN_PARTICLE, this.MAX_TIME_TO_SPAWN_PARTICLE);
        }

        this.particles.forEach(particle => {
            if (particle.active)
                particle.Update(deltaTime);
        });
    }

    Draw (ctx) {
        this.particles.forEach(particle => {
            if (particle.active)
                particle.Draw(ctx);
        });
    }

}

function ObtainRandom (maxValue) {
    return Math.random() * maxValue;
}

function RandomBetween (minValue, maxValue) {
    return (Math.random() * (maxValue - minValue)) + minValue;
}
