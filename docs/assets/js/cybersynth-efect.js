// Particle system
class Particle {
    constructor(canvas, options) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
                
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
                
        this.vx = (Math.random() - 0.5) * options.speed;
        this.vy = (Math.random() - 0.5) * options.speed;
                
        this.radius = Math.random() * options.maxSize;
                
        this.originalColor = options.colors[Math.floor(Math.random() * options.colors.length)];
        this.color = this.originalColor;
        this.options = options;
                
        this.opacity = Math.random() * 0.8 + 0.2;
        this.active = Math.random() > 0.1; // Only some particles are active initially
    }
            
    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color.replace('1)', `${this.opacity})`);
        this.ctx.fill();
    }
            
    update(mouseX, mouseY) {
        // Move the particle
        this.x += this.vx;
        this.y += this.vy;
                
        // Bounce off the edges
        if (this.x < 0 || this.x > this.canvas.width) {
            this.vx = -this.vx;
        }
                
        if (this.y < 0 || this.y > this.canvas.height) {
            this.vy = -this.vy;
        }
                
        // Calculate distance to mouse
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
                
        // Activate particles near the mouse
        if (distance < this.options.activationDistance) {
            this.active = true;
                    
            // Particles move away from cursor
            const angle = Math.atan2(dy, dx);
            const force = (this.options.activationDistance - distance) / this.options.activationDistance;
            this.vx -= Math.cos(angle) * force * this.options.repelStrength;
            this.vy -= Math.sin(angle) * force * this.options.repelStrength;
                    
            // Change color based on proximity
            if (distance < this.options.activationDistance * 0.5) {
                this.color = this.options.activeColor;
                this.opacity = 0.9;
                } else {
                    this.color = this.originalColor;
                    this.opacity = 0.6 + (this.options.activationDistance - distance) / this.options.activationDistance * 0.4;
                }
        } else {
            // Gradually return to original state
            if (this.active) {
                this.color = this.originalColor;
                if (this.opacity > 0.2) this.opacity -= 0.01;
            }
        }
                
        // Apply some friction to slow particles
        this.vx *= 0.98;
        this.vy *= 0.98;
                
        // Maintain a minimum speed for active particles
        if (this.active) {
            const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (currentSpeed < this.options.minSpeed) {
                const angle = Math.random() * Math.PI * 2;
                this.vx = Math.cos(angle) * this.options.minSpeed;
                this.vy = Math.sin(angle) * this.options.minSpeed;
            }
                    
            // Chance to become inactive
            if (Math.random() < 0.001) {
                this.active = false;
            }
            } else {
                // Chance to become active even without mouse
                if (Math.random() < 0.0005) {
                    this.active = true;
                }
            }
                
            // Update radius based on activity
            if (this.active) {
                if (this.radius < this.options.maxSize) {
                    this.radius += 0.1;
                }
            } else {
                if (this.radius > this.options.minSize) {
                    this.radius -= 0.05;
                }
            }
        }
}

class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMouseMoving = false;
        this.mouseTimer = null;
                
        this.options = {
            particleCount: 100,
            colors: [
                '#0d2a4c',
                '#7b97af',
                '#CFA251'
            ],
            activeColor: '#f5f5f5ff',
            speed: 0.5,
            maxSize: 4,
            minSize: 0.5,
            activationDistance: 150,
            repelStrength: 0.05,
            minSpeed: 0.1
        };
                
        this.init();
    }
            
    init() {
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
                
        // Create particles
        this.createParticles();
                
        // Mouse tracking
        document.addEventListener('mousemove', (e) => this.trackMouse(e));
        document.addEventListener('touchmove', (e) => this.trackTouch(e));
                
        // Start animation loop
        this.animate();
                
        // Add periodic wave effect
        setInterval(() => this.createWave(), 5000);
    }
            
    resizeCanvas() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
                
        // Recreate particles when canvas is resized
        if (this.particles.length > 0) {
            this.createParticles();
        }
    }
            
    createParticles() {
        this.particles = [];
                
        // Adjust particle count based on screen size
        const area = this.canvas.width * this.canvas.height;
        const density = area / 200000;
        const count = Math.min(Math.max(Math.floor(this.options.particleCount * density), 50), 200);
                
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(this.canvas, this.options));
        }
    }
            
    trackMouse(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
        this.isMouseMoving = true;
                
        clearTimeout(this.mouseTimer);
        this.mouseTimer = setTimeout(() => {
            this.isMouseMoving = false;
        }, 100);
                
        // Update glow effect position
        this.updateGlowEffect();
    }
            
    trackTouch(e) {
        if (e.touches.length > 0) {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.touches[0].clientX - rect.left;
            this.mouseY = e.touches[0].clientY - rect.top;
            this.isMouseMoving = true;
                    
            clearTimeout(this.mouseTimer);
            this.mouseTimer = setTimeout(() => {
                this.isMouseMoving = false;
            }, 100);
                    
            // Update glow effect position
            
        }
    }
            
    createWave() {
        // Create a ripple effect from a random point
        const centerX = Math.random() * this.canvas.width;
        const centerY = Math.random() * this.canvas.height;
                
        this.particles.forEach(particle => {
            const dx = particle.x - centerX;
            const dy = particle.y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);
                    
            // Apply a force based on distance
            setTimeout(() => {
                const force = Math.max(0, (300 - distance) / 300);
                particle.vx += Math.cos(angle) * force * 2;
                particle.vy += Math.sin(angle) * force * 2;
                particle.active = true;
            }, distance * 3); // Delayed based on distance for a wave effect
        });
    }
            
    drawConnections() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 0.5;
                
        for (let i = 0; i < this.particles.length; i++) {
            const particleA = this.particles[i];
                    
            if (!particleA.active) continue;
                    
            for (let j = i + 1; j < this.particles.length; j++) {
                const particleB = this.particles[j];
                        
                if (!particleB.active) continue;
                        
                const dx = particleA.x - particleB.x;
                const dy = particleA.y - particleB.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                        
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particleA.x, particleA.y);
                    this.ctx.lineTo(particleB.x, particleB.y);
                            
                    // Line opacity based on distance
                    const opacity = (100 - distance) / 100 * 0.2;
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                            
                    this.ctx.stroke();
                }
            }
        }
    }
            
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                
        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update(this.mouseX, this.mouseY);
            particle.draw();
        });
                
        // Draw connections between nearby particles
        this.drawConnections();
                
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the system when the window loads
window.addEventListener('load', () => {
    const particleSystem = new ParticleSystem('particleCanvas');
});