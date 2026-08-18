// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initTheme();
  initScrollProgress();
  initCustomCursor();
  initNamePaint();
  initScrollReveal();
  initClipboard();
  initAccordions();
  initF1Simulator();
  initDailyFact();
});

/* ==========================================================================
   Intersection Observer (Scroll Reveal)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   Copy to Clipboard Handler
   ========================================================================== */
function initClipboard() {
  const copyBtn = document.getElementById('copy-email');
  const tooltip = document.getElementById('email-tooltip');
  if (!copyBtn || !tooltip) return;

  copyBtn.addEventListener('click', async () => {
    const textToCopy = copyBtn.getAttribute('data-clipboard');
    try {
      await navigator.clipboard.writeText(textToCopy);
      
      // Feedback animation
      tooltip.textContent = 'Copied!';
      copyBtn.classList.add('copied');
      
      setTimeout(() => {
        tooltip.textContent = 'Copy email';
        copyBtn.classList.remove('copied');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      tooltip.textContent = 'Failed to copy';
    }
  });
}

/* ==========================================================================
   Collapsible Accordion Handler
   ========================================================================== */
function initAccordions() {
  const sections = document.querySelectorAll('.accordion-section');
  const triggers = document.querySelectorAll('.accordion-trigger');
  const navLinks = document.querySelectorAll('.nav-link');

  // Dynamically wrap each trigger button's letters in spans for wave animation
  triggers.forEach(trigger => {
    const text = trigger.textContent.trim();
    trigger.innerHTML = ''; // Clear text

    const wordSpan = document.createElement('span');
    wordSpan.className = 'trigger-word';

    // Wrap each letter in a span and add stagger transition delay
    [...text].forEach((char, i) => {
      const charSpan = document.createElement('span');
      charSpan.textContent = char;
      // Stagger animation: nth-letter has nth-delay
      charSpan.style.transitionDelay = `${i * 0.03}s`;
      wordSpan.appendChild(charSpan);
    });

    trigger.appendChild(wordSpan);

    // Create custom underline bar that expands on selection
    const underline = document.createElement('span');
    underline.className = 'trigger-underline';
    trigger.appendChild(underline);
  });

  // Toggle accordion state
  function toggleAccordion(section, forceState = null) {
    const trigger = section.querySelector('.accordion-trigger');
    const isExpanded = forceState !== null ? forceState : !section.classList.contains('expanded');

    if (isExpanded) {
      section.classList.add('expanded');
      trigger.setAttribute('aria-expanded', 'true');
      
      // If the expanded section is Projects, trigger F1 chart resize/draw
      if (section.id === 'projects') {
        setTimeout(() => {
          window.dispatchEvent(new Event('resize-f1-chart'));
        }, 150); // Small delay to let the grid transition begin
      }
    } else {
      section.classList.remove('expanded');
      trigger.setAttribute('aria-expanded', 'false');
    }
  }

  // Bind trigger clicks
  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const section = e.target.closest('.accordion-section');
      const wasExpanded = section.classList.contains('expanded');
      toggleAccordion(section);

      // If we just opened a section, scroll it to the top of the viewport
      if (!wasExpanded) {
        // Small delay so the expand animation starts before we scroll
        setTimeout(() => {
          const navHeight = document.getElementById('main-nav')?.offsetHeight ?? 72;
          const top = section.getBoundingClientRect().top + window.scrollY - navHeight - 16;
          window.scrollTo({ top, behavior: 'smooth' });
        }, 50);
      }
    });
  });

  // Bind nav link clicks to scroll and auto-expand
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // Expand section if collapsed
        toggleAccordion(targetSection, true);
        
        // Scroll smoothly to target
        const offset = 90; // Header offset
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetSection.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   Formula 1 Lap Time prediction Simulator (Regression Simulation)
   ========================================================================== */
let triggerF1Redraw = () => {}; // Export draw trigger globally for accordion toggle

function initF1Simulator() {
  const canvas = document.getElementById('f1-chart');
  if (!canvas) return;

  // Simulator controls
  const compoundBtns = document.querySelectorAll('.compound-btn');
  const tyreAgeInput = document.getElementById('tyre-age');
  const tyreAgeVal = document.getElementById('tyre-age-val');
  const trackTempInput = document.getElementById('track-temp');
  const trackTempVal = document.getElementById('track-temp-val');
  const fuelLoadInput = document.getElementById('fuel-load');
  const fuelLoadVal = document.getElementById('fuel-load-val');

  // Outputs
  const predLapTimeEl = document.getElementById('pred-laptime');
  const predDeltaEl = document.getElementById('pred-delta');
  const predGripEl = document.getElementById('pred-grip');

  // State
  let simState = {
    compound: 'soft', // soft, medium, hard
    tyreAge: 12,      // laps
    trackTemp: 32,    // °C
    fuelLoad: 60      // kg
  };

  // Base configurations representing model regression coefficients
  const f1Config = {
    baseLapTimeSec: 88.5, // 1:28.500 base lap time
    compounds: {
      soft: { baseOffset: 0.0, wearFactor: 0.011, tempSensitivity: 0.003, optimalTemp: 30 },
      medium: { baseOffset: 0.7, wearFactor: 0.006, tempSensitivity: 0.0015, optimalTemp: 38 },
      hard: { baseOffset: 1.5, wearFactor: 0.0032, tempSensitivity: 0.0008, optimalTemp: 45 }
    },
    fuelFactor: 0.038 // seconds added per kg of fuel
  };

  // Bind compound buttons
  compoundBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      compoundBtns.forEach(b => b.classList.remove('active'));
      const targetBtn = e.target.closest('.compound-btn');
      targetBtn.classList.add('active');
      simState.compound = targetBtn.getAttribute('data-compound');
      updateSimulator();
    });
  });

  // Bind sliders
  tyreAgeInput.addEventListener('input', (e) => {
    simState.tyreAge = parseInt(e.target.value, 10);
    tyreAgeVal.textContent = `${simState.tyreAge} laps`;
    updateSimulator();
  });

  trackTempInput.addEventListener('input', (e) => {
    simState.trackTemp = parseInt(e.target.value, 10);
    trackTempVal.textContent = `${simState.trackTemp}°C`;
    updateSimulator();
  });

  fuelLoadInput.addEventListener('input', (e) => {
    simState.fuelLoad = parseInt(e.target.value, 10);
    fuelLoadVal.textContent = `${simState.fuelLoad} kg`;
    updateSimulator();
  });

  // Handle window resize or accordion expansions for canvas scaling
  window.addEventListener('resize', () => {
    drawChart();
  });

  window.addEventListener('resize-f1-chart', () => {
    drawChart();
  });

  // Calculate laptime based on inputs
  function calculateLapTime(compound, age, temp, fuel) {
    const compConfig = f1Config.compounds[compound];
    
    // 1. Fuel impact (linear: more fuel = slower)
    const fuelDelta = fuel * f1Config.fuelFactor;

    // 2. Base compound gap (soft is fastest initially)
    const compoundDelta = compConfig.baseOffset;

    // 3. Thermal degradation penalty (quadratic based on deviation from optimal temp)
    const tempDev = temp - compConfig.optimalTemp;
    const thermalDelta = Math.pow(Math.max(0, tempDev), 1.6) * compConfig.tempSensitivity;

    // 4. Tyre wear degradation penalty (non-linear polynomial degradation)
    const wearMultiplier = 1.0 + (temp > 40 ? 0.2 : 0.0);
    const wearDelta = Math.pow(age, 1.7) * compConfig.wearFactor * wearMultiplier;

    const totalSeconds = f1Config.baseLapTimeSec + fuelDelta + compoundDelta + thermalDelta + wearDelta;
    
    // Calculate estimated grip remaining
    const maxLaps = compound === 'soft' ? 22 : (compound === 'medium' ? 32 : 45);
    const wearPercent = Math.min(100, Math.pow(age / maxLaps, 1.4) * 100);
    const gripRemaining = Math.max(0, Math.round(100 - wearPercent));

    return {
      totalSeconds,
      wearDelta: wearDelta + thermalDelta,
      gripRemaining
    };
  }

  // Format seconds to F1 style: M:SS.mmm
  function formatLapTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const milliseconds = Math.floor((totalSeconds % 1) * 1000);
    
    const secStr = seconds < 10 ? '0' + seconds : seconds;
    const msStr = milliseconds < 100 ? (milliseconds < 10 ? '00' + milliseconds : '0' + milliseconds) : milliseconds;
    
    return `${minutes}:${secStr}.${msStr}`;
  }

  // Main updater
  function updateSimulator() {
    const stats = calculateLapTime(simState.compound, simState.tyreAge, simState.trackTemp, simState.fuelLoad);
    
    predLapTimeEl.textContent = formatLapTime(stats.totalSeconds);
    predDeltaEl.textContent = `+${stats.wearDelta.toFixed(3)}s`;
    predGripEl.textContent = `${stats.gripRemaining}%`;

    drawChart();
  }

  // Draw chart in HTML5 Canvas
  function drawChart() {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Responsive sizing support
    const rect = canvas.parentNode.getBoundingClientRect();
    if (rect.width === 0) return; // Skip drawing if accordion is closed

    const dpr = window.devicePixelRatio || 1;
    
    // Set display sizes
    canvas.style.width = rect.width + 'px';
    canvas.style.height = '140px';
    
    // Set actual drawing sizes scaled for DPI
    canvas.width = rect.width * dpr;
    canvas.height = 140 * dpr;
    
    // Scale drawing operations
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = 140;
    
    // Theme colors loaded dynamically from CSS variables
    const themeStyle = getComputedStyle(document.documentElement);
    const gridColor = themeStyle.getPropertyValue('--border-color').trim() || '#e3dec9';
    const textMuted = themeStyle.getPropertyValue('--text-muted').trim() || '#837b70';
    
    // Active compound colors
    const compColors = {
      soft: '#e10600',
      medium: '#ffd100',
      hard: '#7a7a7a'
    };
    const activeColor = compColors[simState.compound];

    // Chart margins
    const padding = { top: 15, right: 15, bottom: 20, left: 35 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Clear background
    ctx.clearRect(0, 0, width, height);

    // Calculate predictions for entire range (0 to 40 laps)
    const maxGraphLaps = 40;
    const dataPoints = [];
    
    for (let lap = 0; lap <= maxGraphLaps; lap++) {
      const res = calculateLapTime(simState.compound, lap, simState.trackTemp, simState.fuelLoad);
      dataPoints.push({ lap, time: res.totalSeconds });
    }

    // Min/Max bounds for scaling Y axis
    const times = dataPoints.map(d => d.time);
    const minTime = Math.min(...times) - 0.2;
    const maxTime = Math.max(...times) + 0.2;
    const timeRange = maxTime - minTime;

    // Helper functions for coordinates
    const getX = (lap) => padding.left + (lap / maxGraphLaps) * chartWidth;
    const getY = (time) => padding.top + chartHeight - ((time - minTime) / timeRange) * chartHeight;

    // 1. Draw Grid Lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.fillStyle = textMuted;
    ctx.font = '10px var(--font-sans)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    // Horizontal Y grid lines (3 divisions)
    const divisions = 3;
    for (let i = 0; i <= divisions; i++) {
      const val = minTime + (timeRange / divisions) * i;
      const y = getY(val);
      
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      const minutes = Math.floor(val / 60);
      const seconds = Math.floor(val % 60);
      ctx.fillText(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}s`, padding.left - 6, y);
    }

    // X Axis Labels (0, 10, 20, 30, 40 laps)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const xLabels = [0, 10, 20, 30, 40];
    xLabels.forEach(lap => {
      const x = getX(lap);
      
      ctx.beginPath();
      ctx.moveTo(x, padding.top + chartHeight);
      ctx.lineTo(x, padding.top + chartHeight + 3);
      ctx.stroke();

      ctx.fillText(`L${lap}`, x, padding.top + chartHeight + 5);
    });

    // 2. Draw degradation curve area fill
    ctx.beginPath();
    ctx.moveTo(getX(0), padding.top + chartHeight);
    for (let i = 0; i < dataPoints.length; i++) {
      ctx.lineTo(getX(dataPoints[i].lap), getY(dataPoints[i].time));
    }
    ctx.lineTo(getX(maxGraphLaps), padding.top + chartHeight);
    ctx.closePath();
    
    const areaGradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
    areaGradient.addColorStop(0, 'rgba(140, 130, 117, 0.1)');
    areaGradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = areaGradient;
    ctx.fill();

    // 3. Draw curve line
    ctx.beginPath();
    ctx.moveTo(getX(dataPoints[0].lap), getY(dataPoints[0].time));
    for (let i = 1; i < dataPoints.length; i++) {
      ctx.lineTo(getX(dataPoints[i].lap), getY(dataPoints[i].time));
    }
    ctx.strokeStyle = activeColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 4. Draw marker for current tyre age
    const curTime = calculateLapTime(simState.compound, simState.tyreAge, simState.trackTemp, simState.fuelLoad).totalSeconds;
    const markerX = getX(simState.tyreAge);
    const markerY = getY(curTime);

    // Dashed line from axis
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = textMuted;
    ctx.lineWidth = 1;
    
    // Vertical drop
    ctx.beginPath();
    ctx.moveTo(markerX, markerY);
    ctx.lineTo(markerX, padding.top + chartHeight);
    ctx.stroke();

    // Horizontal drop
    ctx.beginPath();
    ctx.moveTo(markerX, markerY);
    ctx.lineTo(padding.left, markerY);
    ctx.stroke();
    
    ctx.setLineDash([]); // Reset line dash

    // Outer ring marker
    ctx.beginPath();
    ctx.arc(markerX, markerY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = activeColor;
    ctx.fill();

    // Inner dot marker
    ctx.beginPath();
    ctx.arc(markerX, markerY, 2, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }

  // Initial call
  updateSimulator();
}

/* ==========================================================================
   Typographic Name Paint Animation
   ========================================================================== */
function initNamePaint() {
  const canvas = document.getElementById('name-paint-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

    const parent = canvas.parentNode;
    let width = 0;
    let height = 0;
    let fontSize = 0;
    let paintPoints = [];
    let particles = []; // Active sparkles list
    let lastX = null;
    let lastY = null;

    let idleTimeout = null;
    let isAutoDrawing = false;
    let autoDrawX = 0;

    function resetIdleTimer() {
      isAutoDrawing = false;
      autoDrawX = 0;
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        isAutoDrawing = true;
        autoDrawX = 0;
      }, 8000);
    }

    resetIdleTimer();

    // Sparkle Particle Class
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.2 + 0.6;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.radius = Math.random() * 2 + 1.2;
        this.age = 0;
        this.maxAge = Math.random() * 22 + 14;
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.96;
        this.vy *= 0.96;
        this.age++;
      }
      
      draw(c) {
        const lifeRatio = 1 - (this.age / this.maxAge);
        c.beginPath();
        c.arc(this.x, this.y, this.radius * lifeRatio, 0, 2 * Math.PI);
        c.fillStyle = `rgba(224, 83, 43, ${lifeRatio * 0.85})`;
        c.fill();
      }
    }
    
    // Wait for Google Fonts to be loaded so Syne renders correctly
    document.fonts.ready.then(() => {
    resizeCanvas();
    animate();
  });

  function resizeCanvas() {
    // 1. Get stable reference of main page container width
    const container = document.querySelector('.container');
    const containerWidth = container ? container.getBoundingClientRect().width : window.innerWidth;
    
    // 2. We want the name text to occupy exactly 43% of total container width on desktop
    // On mobile, they stack vertically so it can take up 98% of container width!
    const isDesktop = window.innerWidth > 992;
    const targetNameWidth = isDesktop ? containerWidth * 0.43 : containerWidth * 0.98;
    
    // 3. Estimate starting font size based on target width
    const dpr = window.devicePixelRatio || 1;
    let tempFontSize = targetNameWidth * 0.18; 
    
    ctx.font = `400 ${tempFontSize}px 'Bebas Neue'`;
    const tempTextWidth = ctx.measureText("ADI GOLDSTONE").width;
    
    // 4. Calculate base font size to fit target width exactly
    let baseFontSize = tempFontSize * (targetNameWidth / tempTextWidth);
    
    // 5. Add exactly 80px to make it even bigger — more surface to paint!
    fontSize = baseFontSize + 80;
    
    // 6. Calculate new width and height based on the larger font size
    ctx.font = `400 ${fontSize}px 'Bebas Neue'`;
    const newTextWidth = ctx.measureText("ADI GOLDSTONE").width;
    width = newTextWidth + 40; // 40px padding to avoid letter clipping on sides
    height = fontSize * 1.35;

    // 7. Set canvas display style sizes
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    
    // 8. Set canvas back-buffer resolution scaled by DPR
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  // Add paint stroke coordinate points with path interpolation
  function addPoints(x1, y1, x2, y2) {
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const steps = Math.ceil(dist / 3); // Point every 3px for high density
    
    for (let i = 0; i <= steps; i++) {
      const t = steps === 0 ? 0 : i / steps;
      const cx = x1 + (x2 - x1) * t;
      const cy = y1 + (y2 - y1) * t;
      paintPoints.push({
        x: cx,
        y: cy,
        age: 0,
        maxAge: 180 // Fades out slowly over 3 seconds (at 60fps)
      });

      // Spawn particles at intervals
      if (Math.random() < 0.45) {
        particles.push(new Particle(cx, cy));
      }
    }
  }

  // Track cursor hover and pointer tracking
  canvas.addEventListener('pointermove', (e) => {
    resetIdleTimer();
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (lastX === null || lastY === null) {
      lastX = x;
      lastY = y;
    }

    addPoints(lastX, lastY, x, y);
    lastX = x;
    lastY = y;
  });

  canvas.addEventListener('pointerleave', () => {
    resetIdleTimer();
    lastX = null;
    lastY = null;
  });

  canvas.addEventListener('pointerenter', () => {
    resetIdleTimer();
  });

  window.addEventListener('resize', () => {
    resizeCanvas();
  });

  // Render loop
  function animate() {
    requestAnimationFrame(animate);

    // Auto-draw wave if idle
    if (isAutoDrawing) {
      autoDrawX += 4.5;
      if (autoDrawX < width) {
        const waveY = (height / 2) + Math.sin(autoDrawX * 0.05) * (fontSize * 0.22);
        paintPoints.push({
          x: autoDrawX,
          y: waveY,
          age: 0,
          maxAge: 180
        });
        if (Math.random() < 0.45) {
          particles.push(new Particle(autoDrawX, waveY));
        }
      } else {
        resetIdleTimer();
      }
    }

    // Update point timelines
    paintPoints.forEach(pt => pt.age++);
    paintPoints = paintPoints.filter(pt => pt.age < pt.maxAge);

    // Update particle timelines
    particles.forEach(p => p.update());
    particles = particles.filter(p => p.age < p.maxAge);

    // 1. Clear background
    ctx.clearRect(0, 0, width, height);

    // 2. Draw base text
    ctx.font = `400 ${fontSize}px 'Bebas Neue'`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#e3dec9'; // uncoloured base color matches border-color
    ctx.fillText("ADI GOLDSTONE", width / 2, height / 2);

    // 3. Draw colored mask layer on hover paths
    if (paintPoints.length > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'source-atop';

      const brushRadius = fontSize * 0.18; // Scales relative to font size

      paintPoints.forEach(pt => {
        const lifeRatio = 1 - (pt.age / pt.maxAge);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, brushRadius * lifeRatio, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(224, 83, 43, ${lifeRatio})`; // Fades to matching accent orange
        ctx.fill();
      });

      ctx.restore();
    }

    // 4. Draw paint sparkles
    particles.forEach(p => p.draw(ctx));
  }
}

/* ==========================================================================
   Adi's Daily Fun Fact Widget
   ========================================================================== */
function initDailyFact() {
  const factEl = document.getElementById('daily-fact-text');
  if (!factEl) return;

  const facts = [
    "Wombat poop is cube-shaped, which stops it from rolling away.",
    "Bananas are curved because they grow towards the sun against gravity.",
    "A day on Venus is longer than a year on Venus.",
    "Honey never spoils; you could theoretically eat 3,000-year-old Egyptian tomb honey.",
    "Sea otters hold hands when they sleep so they do not drift apart.",
    "A group of flamingos is called a 'flamboyance'.",
    "The first computer bug was an actual moth found trapped in a Harvard Mark II computer in 1947.",
    "Sharks existed before trees, appearing in the fossil record about 400 million years ago.",
    "High heels were originally worn by Persian soldiers to help secure their feet in stirrups.",
    "Oxford University is older than the Aztec Empire.",
    "The heart of a blue whale is the size of a small car.",
    "A small child could swim through the veins of a blue whale.",
    "Nintendo was founded in 1889 as a playing card company.",
    "Before eraser rubber, stale bread was used to rub out pencil marks.",
    "The clouds on Venus are composed of sulphuric acid.",
    "Clouds can weigh over a million pounds.",
    "Cotton candy was co-invented by a dentist.",
    "Sloths can hold their breath longer than dolphins can.",
    "There are more trees on Earth than stars in the Milky Way.",
    "An octopus has three hearts and blue blood.",
    "It rains diamonds on Saturn and Jupiter.",
    "A single bolt of lightning contains enough energy to toast 100,000 slices of bread.",
    "Human teeth are the only part of the body that cannot heal themselves.",
    "The tongue of a blue whale weighs more than an entire elephant.",
    "Snail mucus is used in cosmetics to hydrate skin.",
    "Snails can sleep for up to three years.",
    "A day on Mars is 24 hours, 37 minutes, and 22 seconds.",
    "Pineapples take nearly three years to grow and mature.",
    "The Eiffel Tower can grow up to 15 cm taller during summer due to thermal expansion.",
    "Koalas have fingerprints that are almost identical to human fingerprints.",
    "An individual droplet of water spends about 9 days in the atmosphere before raining.",
    "The inventor of the Pringles can was buried in one.",
    "Cows have best friends and get stressed when they are separated.",
    "A sheep, a duck, and a rooster were the first passengers in a hot air balloon.",
    "The national animal of Scotland is the unicorn.",
    "Pigs do not sweat; they roll in mud to stay cool.",
    "The total weight of all ants on Earth is roughly equal to the weight of all humans.",
    "A teaspoon of a neutron star would weigh about 6 billion tons.",
    "Tears contain a natural painkiller called leucine enkephalin.",
    "Chewing gum while peeling onions prevents you from crying.",
    "Lobsters taste with their legs and chew with their stomachs.",
    "Elephants are the only mammals that cannot jump.",
    "A crocodile cannot stick its tongue out.",
    "Butterflies taste with their feet.",
    "Cat urine glows under black light.",
    "Starfish do not have brains or blood.",
    "The first orange carrots were grown in the Netherlands in the 17th century.",
    "Water makes up about 60% of the adult human body.",
    "Sound travels about four times faster in water than in air.",
    "Astronauts grow up to two inches taller in space due to spine expansion.",
    "The letter 'Q' is the only letter that does not appear in any US state name.",
    "The longest musical performance in history started in 2001 and is scheduled to end in 2640.",
    "Dead skin makes up about 50% of the dust in a home.",
    "The average cloud weighs about 100 elephants.",
    "Avocados are berries, while strawberries are not.",
    "A group of crows is called a 'murder'.",
    "Bananas are radioactive because they are rich in potassium-40.",
    "Gold is edible and is used in gourmet food decoration.",
    "Pluto has not completed a single orbit around the Sun since its discovery.",
    "The average person spends six months of their lifetime waiting for red lights to turn green.",
    "More people are killed by vending machines than by sharks annually.",
    "A group of owls is called a 'parliament'.",
    "The speed of a computer mouse click is about 100 milliseconds.",
    "A jumbo jet uses 4,000 litres of fuel just to take off.",
    "Apples float in water because they are 25% air.",
    "The skin of a tiger is striped, not just its fur.",
    "The average person walks the equivalent of five times around the world in their lifetime.",
    "Rats laugh when they are tickled.",
    "The first alarm clock could only ring at 4:00 AM.",
    "There are 293 ways to make change for a dollar.",
    "A shark can detect a single drop of blood in an Olympic-sized pool.",
    "The writing on a pencil can draw a line 35 miles long.",
    "The Sahara Desert can experience snow.",
    "Honeybees can flap their wings 200 times per second.",
    "A group of frogs is called an 'army'.",
    "Winds on Neptune can reach speeds of 1,200 miles per hour.",
    "The tongue of a woodpecker wraps around its brain to protect it during pecking.",
    "An ostrich's eye is bigger than its brain.",
    "Kangaroos cannot walk backwards.",
    "The first webcam was created to monitor a coffee pot at Cambridge University.",
    "A group of ferrets is called a 'business'.",
    "Human bones are about four times stronger than concrete.",
    "There are about 60,000 miles of blood vessels in a human body.",
    "A blue whale can consume up to 4 tons of krill per day.",
    "Peanuts are not nuts; they are legumes.",
    "The first telephone directory contained only 50 names.",
    "The world's oldest wooden wheel is over 5,000 years old.",
    "Grapes light up in flames when microwaved.",
    "An octopus has nine brains: one central brain and one in each arm.",
    "Sea turtles cry to excrete excess salt from their bodies.",
    "A single strand of spider silk is stronger than a steel wire of the same thickness.",
    "Venus spins in the opposite direction of most other planets.",
    "A group of jellyfish is called a 'smack'.",
    "The smell of freshly cut grass is a chemical distress signal.",
    "Mercury has no atmosphere and no wind.",
    "The first paper money was printed in China during the Tang Dynasty.",
    "A group of penguins in the water is called a 'raft'.",
    "A group of penguins on land is called a 'waddle'.",
    "Your fingernails grow faster on your dominant hand.",
    "A hummingbird weighs less than a penny."
  ];

  // Select a fact based on the current calendar day
  const today = new Date();
  const dateStamp = today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate();
  const index = dateStamp % facts.length;

  factEl.textContent = facts[index];

  // Shuffle Roulette Listener
  const shuffleBtn = document.getElementById('shuffle-fact-btn');
  if (shuffleBtn) {
    let currentIdx = index;
    shuffleBtn.addEventListener('click', () => {
      let nextIdx = currentIdx;
      while (nextIdx === currentIdx) {
        nextIdx = Math.floor(Math.random() * facts.length);
      }
      currentIdx = nextIdx;
      typewriterEffect(factEl, facts[currentIdx]);
    });
  }

  function typewriterEffect(element, text) {
    element.innerHTML = '';
    let idx = 0;
    clearInterval(element.typewriterInterval);
    element.typewriterInterval = setInterval(() => {
      if (idx < text.length) {
        element.innerHTML += text.charAt(idx);
        idx++;
      } else {
        clearInterval(element.typewriterInterval);
      }
    }, 15);
  }
}

/* ==========================================================================
   Dark/Light Theme Switcher
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  // Check saved local storage or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  toggleBtn.addEventListener('click', () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }

    // Force redraw F1 Strategy canvas chart with new variables
    window.dispatchEvent(new Event('resize-f1-chart'));
  });
}

/* ==========================================================================
   Scroll Progress bar indicator
   ========================================================================== */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    bar.style.width = scrolled + '%';
  });
}

/* ==========================================================================
   Custom trailing hover ring cursor
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;

  window.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursor.style.opacity = '1';
  });

  window.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  // Disappear with shimmer when entering navbar
  const navbar = document.getElementById('main-nav');
  if (navbar) {
    navbar.addEventListener('mouseenter', () => {
      cursor.classList.add('shimmer-fade');
    });
    navbar.addEventListener('mouseleave', () => {
      cursor.classList.remove('shimmer-fade');
    });
  }

  // Attach hover scaling to clickable items
  const clickables = document.querySelectorAll('a, button, [role="button"], canvas, .accordion-trigger');
  clickables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '40px';
      cursor.style.height = '40px';
      cursor.style.backgroundColor = 'rgba(224, 83, 43, 0.08)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '10px';
      cursor.style.height = '10px';
      cursor.style.backgroundColor = 'transparent';
    });
  });
}

/* ==========================================================================
   Page Loader Intro Reveal
   ========================================================================== */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  
  const hideLoader = () => {
    loader.classList.add('fade-out');
  };
  
  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 600);
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 600));
    setTimeout(hideLoader, 1500); // safety fallback
  }
}

