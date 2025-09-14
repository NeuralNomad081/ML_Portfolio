// Three.js Scene Setup - Disabled
class ThreeScene {
    constructor() {
        // Background disabled for clean look
        console.log('Three.js background disabled');
    }
}
    
    init() {
        // Scene
        this.scene = new THREE.Scene();
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 30;
        
        // Renderer
        const canvas = document.getElementById('three-canvas');
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Create particle system
        this.createParticleSystem();
        
        // Create floating dots
        this.createFloatingDots();
        
        // Create subtle lines
        this.createConnectionLines();
    }
    
    createParticleSystem() {
        const particlesCount = 1000;
        const positions = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);
        const sizes = new Float32Array(particlesCount);
        
        for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;
            
            // Positions
            positions[i3] = (Math.random() - 0.5) * 100;
            positions[i3 + 1] = (Math.random() - 0.5) * 100;
            positions[i3 + 2] = (Math.random() - 0.5) * 100;
            
            // Colors
            const colorIntensity = Math.random();
            colors[i3] = 0.2 + colorIntensity * 0.8;     // R
            colors[i3 + 1] = 0.4 + colorIntensity * 0.6; // G
            colors[i3 + 2] = 1.0;                         // B
            
            // Sizes
            sizes[i] = Math.random() * 3 + 1;
        }
        
        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const particlesMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                mouse: { value: new THREE.Vector2() }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                uniform vec2 mouse;
                
                void main() {
                    vColor = color;
                    
                    vec3 pos = position;
                    
                    // Add floating animation
                    pos.y += sin(time * 0.001 + position.x * 0.01) * 2.0;
                    pos.x += cos(time * 0.001 + position.y * 0.01) * 1.0;
                    
                    // Mouse interaction
                    vec2 mouseInfluence = (mouse - vec2(pos.x, pos.y)) * 0.1;
                    pos.xy += mouseInfluence * 0.5;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                    float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                    
                    gl_FragColor = vec4(vColor, alpha * 0.8);
                }
            `,
            transparent: true,
            vertexColors: true
        });
        
        this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(this.particles);
    }
    
    createFloatingDots() {
        this.floatingDots = [];
        
        // Create small floating dots
        for (let i = 0; i < 12; i++) {
            const dotGeometry = new THREE.SphereGeometry(0.1, 8, 8);
            const dotMaterial = new THREE.MeshBasicMaterial({
                color: 0x4F46E5,
                transparent: true,
                opacity: 0.4
            });
            
            const dot = new THREE.Mesh(dotGeometry, dotMaterial);
            
            // Position dots around the scene
            dot.position.set(
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 30
            );
            
            // Store animation data
            dot.userData = {
                originalPosition: dot.position.clone(),
                speed: 0.0003 + Math.random() * 0.0005,
                offset: Math.random() * Math.PI * 2
            };
            
            this.floatingDots.push(dot);
            this.scene.add(dot);
        }
    }
    
    createConnectionLines() {
        this.connectionLines = [];
        
        // Create some connecting lines between random points
        for (let i = 0; i < 6; i++) {
            const startPoint = new THREE.Vector3(
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 25
            );
            
            const endPoint = new THREE.Vector3(
                startPoint.x + (Math.random() - 0.5) * 20,
                startPoint.y + (Math.random() - 0.5) * 15,
                startPoint.z + (Math.random() - 0.5) * 15
            );
            
            const points = [startPoint, endPoint];
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0x6366F1,
                transparent: true,
                opacity: 0.2
            });
            
            const line = new THREE.Line(lineGeometry, lineMaterial);
            
            // Store animation data
            line.userData = {
                originalOpacity: 0.2,
                pulseSpeed: 0.001 + Math.random() * 0.002,
                pulseOffset: Math.random() * Math.PI * 2
            };
            
            this.connectionLines.push(line);
            this.scene.add(line);
        }
    }
    
    addEventListeners() {
        // Mouse movement
        document.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX - this.windowHalf.x) * 0.01;
            this.mouse.y = (event.clientY - this.windowHalf.y) * 0.01;
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.windowHalf.x = window.innerWidth / 2;
            this.windowHalf.y = window.innerHeight / 2;
            
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Scroll interaction
        window.addEventListener('scroll', () => {
            const scrollProgress = window.pageYOffset / (document.body.scrollHeight - window.innerHeight);
            this.camera.position.z = 30 + scrollProgress * 20;
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now();
        
        // Update particles
        if (this.particles && this.particles.material.uniforms) {
            this.particles.material.uniforms.time.value = time;
            this.particles.material.uniforms.mouse.value.set(this.mouse.x, this.mouse.y);
        }
        
        // Animate floating dots
        this.floatingDots.forEach((dot, index) => {
            // Gentle floating motion
            dot.position.y = dot.userData.originalPosition.y + 
                Math.sin(time * dot.userData.speed + dot.userData.offset) * 2;
            dot.position.x = dot.userData.originalPosition.x + 
                Math.cos(time * dot.userData.speed * 0.7 + dot.userData.offset) * 1;
            
            // Gentle pulsing opacity
            const pulse = Math.sin(time * 0.002 + index * 0.5) * 0.2 + 0.8;
            dot.material.opacity = 0.4 * pulse;
        });
        
        // Animate connection lines
        this.connectionLines.forEach((line, index) => {
            // Pulsing opacity
            const pulse = Math.sin(time * line.userData.pulseSpeed + line.userData.pulseOffset) * 0.5 + 0.5;
            line.material.opacity = line.userData.originalOpacity * pulse;
        });
        
        // Camera movement based on mouse
        this.camera.position.x += (this.mouse.x * 2 - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouse.y * 2 - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the scene when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ThreeScene();
});
