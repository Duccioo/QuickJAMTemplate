import config from "./config.js";

class BackgroundEffect {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.currentEffect = "checkerboard";
    this.effects = {
      checkerboard: this.drawCheckerboard.bind(this),
      gradient: this.drawGradient.bind(this),
      dots: this.drawDots.bind(this),
      perlinNoise: this.drawPerlinNoise.bind(this),
      flowFields: this.drawFlowFields.bind(this),
      bezierCurves: this.drawBezierCurves.bind(this),
    };
    this.colors = {
      primary: config.theme.colors.primary,
      secondary: config.theme.colors.secondary,
      accent: "#ff6b6b",
    };
    // Simplified emoji properties for checkerboard
    this.emojis = {
      dark: "",
      light: "🍻",
    };
    // Perlin noise setup
    this.noiseScale = 0.01;
    this.noiseTime = 0.9;
    // Flow fields setup
    this.particles = [];
    this.particleCount = 1000;
    this.initParticles();
    // Bezier curves setup
    this.curves = [];
    this.curveCount = 105;
    this.initCurves();

    this.setupCanvas();
    this.animate();
  }

  setupCanvas() {
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = this.canvas.parentElement.offsetHeight;
  }

  drawCheckerboard(time) {
    const size = 100; // Size of each square
    // Optimize scrolling speed and smoothness
    const scrollSpeed = 100;
    const scrollX = time / scrollSpeed;
    const scrollY = time / scrollSpeed;

    // Extract colors from the theme configuration
    const primaryColor = this.hexToRgb(this.colors.primary);
    const secondaryColor = this.hexToRgb(this.colors.secondary);

    // Pre-calculate canvas boundaries to reduce calculations in the loop
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    const xLimit = canvasWidth + size * 2;
    const yLimit = canvasHeight + size * 2;

    this.ctx.save();

    // Optimize the rendering loop
    for (let x = -size * 2; x < xLimit; x += size) {
      for (let y = -size * 2; y < yLimit; y += size) {
        // Calculate position with diagonal scrolling
        const posX = ((x + scrollX) % (canvasWidth + size * 4)) - size * 2;
        const posY = ((y + scrollY) % (canvasHeight + size * 4)) - size * 2;

        // Check if the square is visible on screen to avoid unnecessary rendering
        if (
          posX + size < 0 ||
          posX > canvasWidth ||
          posY + size < 0 ||
          posY > canvasHeight
        ) {
          continue; // Skip rendering squares outside the visible area
        }

        const isDarkSquare =
          (Math.floor(posX / size) + Math.floor(posY / size)) % 2 === 0;

        // Use theme colors with optimized animation
        const animationFactor = isDarkSquare
          ? 0.15 + Math.sin(time / 3000) * 0.15 // Smoother animation for dark squares
          : 0.1 + Math.cos(time / 3000) * 0.1; // Smoother animation for light squares

        // Create colors with proper RGB values from theme
        this.ctx.fillStyle = isDarkSquare
          ? `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${animationFactor})`
          : `rgba(${secondaryColor.r}, ${secondaryColor.g}, ${
              secondaryColor.b
            }, ${animationFactor * 0.8})`;

        // Draw square with rounded corners for a more modern look
        this.ctx.beginPath();
        this.ctx.moveTo(posX, posY);
        this.ctx.lineTo(posX + size, posY);
        this.ctx.lineTo(posX + size, posY + size);
        this.ctx.lineTo(posX, posY + size);
        this.ctx.lineTo(posX, posY);
        this.ctx.fill();

        // Add emoji to light squares if enabled
        if (!isDarkSquare && this.emojis.light) {
          this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
          this.ctx.font = `${size * 0.5}px Arial`;
          this.ctx.textAlign = "center";
          this.ctx.textBaseline = "middle";
          this.ctx.fillText(
            this.emojis.light,
            posX + size / 2,
            posY + size / 2
          );
        }
      }
    }

    this.ctx.restore();
  }

  drawGradient(time) {
    const gradient = this.ctx.createLinearGradient(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    const offset = (Math.sin(time / 2000) + 1) / 2;

    gradient.addColorStop(0, this.colors.primary);
    gradient.addColorStop(offset, this.colors.secondary);
    gradient.addColorStop(1, this.colors.accent);

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawDots(time) {
    this.ctx.fillStyle = "rgb(137, 43, 226)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const numDots = 50;
    const radius = 5;

    for (let i = 0; i < numDots; i++) {
      const x = this.canvas.width * (0.1 + 0.8 * Math.sin(time / 1000 + i));
      const y = this.canvas.height * (0.1 + 0.8 * Math.cos(time / 1000 + i));

      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 107, 107, ${
        0.3 + Math.sin(time / 1000 + i) * 0.2
      })`;
      this.ctx.fill();
    }
  }

  drawPerlinNoise(time) {
    // Pixelated Perlin noise effect
    const pixelSize = 10; // Size of each "pixel" in the noise
    const width = Math.ceil(this.canvas.width / pixelSize);
    const height = Math.ceil(this.canvas.height / pixelSize);

    // Slowly change noise over time
    this.noiseTime += 0.002;

    // Clear the canvas with a base color
    this.ctx.fillStyle = this.colors.primary + "20"; // Adding transparency
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        // Generate noise value
        const noiseValue = this.perlinNoise(
          x * this.noiseScale,
          y * this.noiseScale,
          this.noiseTime
        );

        // Map noise to color
        const r = Math.floor(this.hexToRgb(this.colors.primary).r * noiseValue);
        const g = Math.floor(this.hexToRgb(this.colors.primary).g * noiseValue);
        const b = Math.floor(this.hexToRgb(this.colors.primary).b * noiseValue);

        // Draw pixel
        this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        this.ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }
  }

  // Simple Perlin noise implementation
  perlinNoise(x, y, z) {
    // This is a simplified version of Perlin noise
    const noise = Math.sin(x * 10 + z) * Math.cos(y * 10 + z) * 0.5 + 0.5;
    return noise;
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: 0,
        vy: 0,
        size: Math.random() * 3 + 1,
        color:
          Math.random() > 0.5 ? this.colors.primary : this.colors.secondary,
        speed: Math.random() * 2 + 1,
      });
    }
  }

  drawFlowFields(time) {
    // Flow fields effect
    this.ctx.fillStyle = this.colors.primary + "10"; // Very transparent background
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles
    this.particles.forEach((particle) => {
      // Calculate flow field angle based on position and time
      const angle =
        (Math.sin(particle.x * 0.01 + time * 0.0005) +
          Math.cos(particle.y * 0.01 + time * 0.0005)) *
        Math.PI;

      // Update velocity based on flow field
      particle.vx = Math.cos(angle) * particle.speed;
      particle.vy = Math.sin(angle) * particle.speed;

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color + "80"; // Semi-transparent
      this.ctx.fill();
    });
  }

  initCurves() {
    this.curves = [];
    for (let i = 0; i < this.curveCount; i++) {
      this.curves.push({
        startX: Math.random() * this.canvas.width,
        startY: Math.random() * this.canvas.height,
        controlX1: Math.random() * this.canvas.width,
        controlY1: Math.random() * this.canvas.height,
        controlX2: Math.random() * this.canvas.width,
        controlY2: Math.random() * this.canvas.height,
        endX: Math.random() * this.canvas.width,
        endY: Math.random() * this.canvas.height,
        color:
          Math.random() > 0.5 ? this.colors.primary : this.colors.secondary,
        thickness: Math.random() * 3 + 1,
      });
    }
  }

  drawBezierCurves(time) {
    // Bezier curves effect
    this.ctx.fillStyle = this.colors.primary + "10"; // Very transparent background
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw curves
    this.curves.forEach((curve) => {
      // Animate control points
      const offsetX1 = Math.sin(time * 0.001) * 100;
      const offsetY1 = Math.cos(time * 0.001) * 100;
      const offsetX2 = Math.sin(time * 0.001 + Math.PI) * 100;
      const offsetY2 = Math.cos(time * 0.001 + Math.PI) * 100;

      this.ctx.beginPath();
      this.ctx.moveTo(curve.startX, curve.startY);
      this.ctx.bezierCurveTo(
        curve.controlX1 + offsetX1,
        curve.controlY1 + offsetY1,
        curve.controlX2 + offsetX2,
        curve.controlY2 + offsetY2,
        curve.endX,
        curve.endY
      );

      this.ctx.strokeStyle = curve.color + "80"; // Semi-transparent
      this.ctx.lineWidth = curve.thickness;
      this.ctx.stroke();
    });
  }

  // Helper function to convert hex color to RGB
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : {r: 0, g: 0, b: 0};
  }

  setEffect(effectName) {
    if (this.effects[effectName]) {
      this.currentEffect = effectName;
    }
  }

  animate() {
    const time = performance.now();

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.effects[this.currentEffect](time);

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize the background effect when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.createElement("canvas");
  canvas.id = "background-canvas";
  document.querySelector(".hero").prepend(canvas);

  const backgroundEffect = new BackgroundEffect(canvas);

  // Add background switcher buttons
  const backgroundSwitcher = document.createElement("div");
  //   backgroundSwitcher.className = "background-switcher";
  //   backgroundSwitcher.innerHTML = `
  //         <button data-effect="checkerboard">Checkerboard</button>
  //         <button data-effect="gradient">Gradient</button>
  //         <button data-effect="dots">Dots</button>
  //         <button data-effect="perlinNoise">Perlin Noise</button>
  //         <button data-effect="flowFields">Flow Fields</button>
  //         <button data-effect="bezierCurves">Bezier Curves</button>
  //     `;

  backgroundSwitcher.addEventListener("click", (e) => {
    if (e.target.dataset.effect) {
      backgroundEffect.setEffect(e.target.dataset.effect);

      // Update active state of buttons
      backgroundSwitcher.querySelectorAll("button").forEach((btn) => {
        btn.classList.toggle(
          "active",
          btn.dataset.effect === e.target.dataset.effect
        );
      });
    }
  });

  document.querySelector(".hero .container").appendChild(backgroundSwitcher);
});
