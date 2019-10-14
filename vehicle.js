class Vehicle {
    constructor(x, y, dna) {
        this.acceleration = createVector();
        this.velocity = p5.Vector.random2D();
        this.position = createVector(x, y); 
        this.r = 3;
        this.maxForce = 0.5;
        this.maxSpeed = 3;
        this.velocity.setMag(this.maxSpeed);
        this.health = 1;
        if (dna instanceof Array) {
            this.dna = [];
            // Copy the dna.
            for (let i = 0; i < dna.length; i++) {
                // Mutation 10%
                if (random(1) < 0.1) {
                    if (i < 2) {    
                        // This is steering force or weights.
                        this.dna[i] = dna[i] + random(-0.2, 0.2);
                    } else {  // Perception radius.
                        this.dna[i] = dna[i] + random(-10, 10);
                    }
                } else {    // No Mutation.
                    this.dna[i] = dna[i];
                }
            }
        } else {   // Create a new DNA.
            let maxf = 3;
             // 0: Attraction/Repulsion to food
            // 1: Attraction/Repulsion to poison
            // 2: Radius to sense food
            // 3: Radius to sense poison
            this.dna = [random(-maxf, maxf), random(-maxf, maxf), random(5, 100), random(5, 100)]
        }       
    }

    /**
     * Update according to the velocity and acceleration.
     */
    update () {
        this.velocity.add(this.acceleration)
        this.velocity.limit(this.maxSpeed)
        this.position.add(this.velocity)
        this.acceleration.mult(0);
        this.health -= 0.002;
    }

    dead () {
        return this.health < 0;
    }

    /**
     * Create a new vehicle with this vechicle as parent. Probabilistically new vehicle is created.
     */
    birth () {
        let r = random(1);
        if (r < 0.001) {           
            return new Vehicle(this.position.x, this.position.y, this.dna);
        }
    }
    
    // Check against array of food or poison
    // index = 0 for food, index = 1 for poison
    eat (list, index) {
        let closest = null;
        let closestD = Infinity;
        for (let i = list.length - 1; i >= 0; i--) {
            //console.log("This is from eat function: ", this.position, this.velocity)
            let d = p5.Vector.dist(list[i], this.position)
            // If it is within perception radius and closer than previous.
            if (d < this.dna[index + 2] && d < closestD) {
                closestD = d;
                closest = list[i];
                // If we are within 5 pixels, eat it.
                if (d < 5) {
                    list.splice(i, 1);
                    this.health += nutrition[index];
                }
            }
        }
        // If something was closest.
        if (closest){
            // Seek.
            let seek = this.seek(closest, index);
            // Weight according to DNA.
            seek.mult(this.dna[index]);
            // Limit.
            seek.limit(this.maxForce);
            this.applyForce(seek);
        }
    }

    applyForce (force) {
        this.acceleration.add(force);
    }

    // A method that calculates a steering force towards a target
    // STEER = DESIRED MINUS VELOCITY
    seek (target, index) {
        let desired = p5.Vector.sub(target, this.position);
        let d = desired.mag();
        // Scale to maximum speed.
        desired.setMag(this.maxSpeed);

        // Steering = Desired minus velocity.
        let steer = p5.Vector.sub(desired, this.velocity);
        return steer;
    }

    /**
     * Display the vehicle rotated in the velocity direction.
     */
    display () {
        // Color is based on health.
        let green = color(0, 255, 0);
        let red = color(255, 0, 0);
        let col = lerpColor(red, green, this.health);

        // Draw a triangle rotated in the direction of velocity.
        let theta = this.velocity.heading() + PI / 2;

        push ();

        translate(this.position.x, this.position.y);
        rotate(theta);

        if (debug.checked()) {
            noFill();

            // Circle the line for food.
            let granularity = floor(map(this.dna[0], -3, 3, 0, 255))
            stroke(0, granularity, 0);
            ellipse(0, 0, this.dna[2] * 2);
            line(0, 0, 0, -this.dna[0] * 25);
            // Circle the line of poison.
            granularity = floor (map (this.dna[1], -3, 3, 0, 255))
            // stroke(0, 0, granularity);
            stroke(granularity, 0, 0);
            ellipse(0, 0, this.dna[3] * 2);
            line(0, 0, 0, -this.dna[1] * 25);

        }

        // Draw the vehicle.
        fill(col);
        stroke(col);
        beginShape()
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);

        pop();
    }

    /**
     * Boundary updates the vehicle: not to go out of bounds.
     */
    boundaries () {
        let d = 10; 
        // This will be set when vehicle is going out of screen.
        let desired = null;

        // Checking for x.
        if (this.position.x < d) {
            desired = createVector(this.maxSpeed, this.velocity.y)
        } else if (this.position.x > width - d) {
            desired = createVector(-this.maxSpeed, this.velocity.y)
        }

        // Checking for y.
        if (this.position.y < d) {
            desired = createVector(this.velocity.x, this.maxSpeed)
        } else if(this.position.y > height - d) {
            desired = createVector(this.velocity.x, -this.maxSpeed)
        }

        if (desired != null) {
            desired.setMag(this.maxSpeed);
            let steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxForce);
            this.applyForce(steer);
        }
    }
}       // End of Vehicle class.