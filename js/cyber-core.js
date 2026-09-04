/* ==========================================================================
   CYBER CORE JAVASCRIPT ENGINE - ABHISHEK KUMAR MANDAL
   Interactive Three.js 3D Canvas, Terminal CLI, Decryption, & Bento Spotlight
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThreeJsCanvas();
  initCyberTypist();
  initTerminalCLI();
  initBentoSpotlight();
  initArsenalFilters();
  initMobileNav();
  initContactForm();
});

/* ==========================================================================
   1. THREE.JS 3D CYBER CONSTELLATION & PARTICLE MESH
   ========================================================================== */
function initThreeJsCanvas() {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 400;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particle Constellation Geometry
  const particleCount = window.innerWidth < 768 ? 70 : 140;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];

  const bounds = 350;
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * bounds * 2;
    positions[i * 3 + 1] = (Math.random() - 0.5) * bounds * 2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * bounds * 1.5;

    velocities.push({
      x: (Math.random() - 0.5) * 0.4,
      y: (Math.random() - 0.5) * 0.4,
      z: (Math.random() - 0.5) * 0.3
    });
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Glowing Cyan Particle Material
  const pMaterial = new THREE.PointsMaterial({
    color: 0x00f2ff,
    size: 3.5,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(geometry, pMaterial);
  scene.add(particleSystem);

  // Dynamic Connecting Lines
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x00f2ff,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending
  });

  const lineGeometry = new THREE.BufferGeometry();
  const linePositions = new Float32Array(particleCount * particleCount * 6);
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lineMesh);

  // Mouse Interaction Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.08;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.08;
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    particleSystem.rotation.y += 0.001;
    particleSystem.rotation.x += 0.0005;
    camera.position.x = targetX;
    camera.position.y = -targetY;
    camera.lookAt(scene.position);

    // Update particles position & build line connections
    const pos = geometry.attributes.position.array;
    let lineIndex = 0;
    const maxConnectDistance = 110;

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] += velocities[i].x;
      pos[i * 3 + 1] += velocities[i].y;
      pos[i * 3 + 2] += velocities[i].z;

      // Bounce at bounds
      if (Math.abs(pos[i * 3]) > bounds) velocities[i].x *= -1;
      if (Math.abs(pos[i * 3 + 1]) > bounds) velocities[i].y *= -1;
      if (Math.abs(pos[i * 3 + 2]) > bounds) velocities[i].z *= -1;

      // Connect near points
      for (let j = i + 1; j < particleCount; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxConnectDistance) {
          linePositions[lineIndex++] = pos[i * 3];
          linePositions[lineIndex++] = pos[i * 3 + 1];
          linePositions[lineIndex++] = pos[i * 3 + 2];

          linePositions[lineIndex++] = pos[j * 3];
          linePositions[lineIndex++] = pos[j * 3 + 1];
          linePositions[lineIndex++] = pos[j * 3 + 2];
        }
      }
    }

    geometry.attributes.position.needsUpdate = true;
    lineGeometry.setDrawRange(0, lineIndex / 3);
    lineGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* ==========================================================================
   2. CYBER DYNAMIC TYPIST
   ========================================================================== */
function initCyberTypist() {
  const typistElement = document.getElementById('cyber-typist');
  if (!typistElement) return;

  const roles = [
    'QA Software Testing Engineer',
    'Penetration Tester & Cyber Analyst',
    'Selenium & Test Automation Specialist',
    'REST API & OWASP Security Auditor',
    'Windows Ecosystem & Registry Validator'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typistElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typistElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 1800; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   3. INTERACTIVE CYBER TERMINAL (AbhishekOS v2.6 CLI)
   ========================================================================== */
function initTerminalCLI() {
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');
  if (!terminalBody || !terminalInput) return;

  const commands = {
    help: () => `
<div class="out-info">Available Commands:</div>
  <span class="out-accent">run-pentest</span>   - Execute simulated OWASP Top 10 vulnerability scan
  <span class="out-accent">run-qa-suite</span>  - Run automated Selenium/Playwright test suite
  <span class="out-accent">whoami</span>        - Print professional summary & QA engineering background
  <span class="out-accent">skills</span>        - List categorized technical & security arsenal
  <span class="out-accent">projects</span>      - Display featured projects & security case studies
  <span class="out-accent">download-cv</span>   - Download Abhishek Kumar Mandal's official resume
  <span class="out-accent">contact</span>       - Show direct contact details (Email, Phone, WhatsApp)
  <span class="out-accent">clear</span>         - Clear the terminal console
`,

    whoami: () => `
<div class="out-success">NAME: Abhishek Kumar Mandal</div>
<div class="out-info">ROLE: QA Software Testing Engineer | Test Automation | Penetration Testing</div>
<div>EXPERIENCE: Oriental Outsourcing Consultant Pvt Ltd (QA Engineer)</div>
<div>EDUCATION: B.Tech in CSE (CGPA: 8.5, Distinction)</div>
<div class="text-muted">Passionate about identifying software vulnerabilities before deployment, architecting robust Selenium/Java automation frameworks, and validating Windows native application reliability.</div>
`,

    skills: () => `
<div class="out-info">⚡ TECHNICAL ARSENAL:</div>
  • <span class="out-success">Testing:</span> Manual, Automation (Selenium Java, TestNG, POM), API (Postman), Regression, Smoke
  • <span class="out-warn">Security:</span> OWASP Top 10, Burp Suite, Nmap, Wireshark, SCADA Security, Patch Validation
  • <span class="out-accent">OS/Desktop:</span> Windows Registry Checks, Event Viewer Log Analysis, Installer Validation
  • <span class="out-info">Tools:</span> JIRA, Git, SQL, MS Excel, VS Code
`,

    projects: () => `
<div class="out-info">🔬 FEATURED CASE STUDIES:</div>
  1. <span class="out-success">Justo Delivery</span> - Logistics Platform QA, 15+ API tests, Burp Suite OWASP audit, 25+ JIRA bugs.
  2. <span class="out-warn">SCADA & Industrial Security</span> - Network access control audit, API backdoor scanning, SQL integrity checks.
  3. <span class="out-accent">Selenium Java Test Suite</span> - Automated web login & regression framework with 30% time reduction.
`,

    contact: () => `
<div class="out-info">📡 DIRECT TRANSMISSION CHANNELS:</div>
  • Phone/WhatsApp: <a href="https://wa.me/8340331293" class="out-success" target="_blank">+91 834-033-1293</a>
  • Email: <a href="mailto:abhishekmandal669@gmail.com" class="out-cyan">abhishekmandal669@gmail.com</a>
  • LinkedIn: <a href="https://linkedin.com/in/abhishek-mandal-a9b714214" class="out-info" target="_blank">linkedin.com/in/abhishek-mandal-a9b714214</a>
  • GitHub: <a href="https://github.com/abhishekmandal669" class="out-accent" target="_blank">github.com/abhishekmandal669</a>
`,

    'download-cv': () => {
      window.open('Abhishek_Mandal_QA_Updated_Resume.pdf', '_blank');
      return `<div class="out-success">✓ Initiating CV download (Abhishek_Mandal_QA_Updated_Resume.pdf)...</div>`;
    },

    clear: () => {
      terminalBody.innerHTML = '';
      return '';
    }
  };

  // Automated Pentest Simulation
  async function runPentestSimulation() {
    appendOutput(`<div class="out-warn">[!] Initializing VAPT Reconnaissance Engine against Target: staging.app.internal...</div>`);
    await sleep(600);
    appendOutput(`<div>[>] Probing Network Ports & SSL/TLS Ciphers with Nmap... <span class="out-success">[DONE]</span></div>`);
    await sleep(700);
    appendOutput(`<div>[>] Intercepting API traffic with Burp Suite (OWASP Top 10 Suite)...</div>`);
    await sleep(800);
    appendOutput(`
<div class="out-info">--------------------------------------------------</div>
<div class="out-error">⚠️ [HIGH] Broken Object Level Auth (BOLA) detected on /api/v1/shipment/{id}</div>
<div class="out-warn">⚠️ [MEDIUM] Missing Rate Limiting on /api/v1/auth/login (Brute Force Risk)</div>
<div class="out-success">✓ [PASSED] SQL Injection Payload Filters (Prepared Statements Active)</div>
<div class="out-success">✓ [PASSED] XSS Content Security Policy (CSP) Validated</div>
<div class="out-info">--------------------------------------------------</div>
<div class="out-success">🎯 [STATUS] Vulnerability Assessment Complete. Remediation logged in JIRA.</div>
`);
  }

  // Automated QA Suite Simulation
  async function runQASuiteSimulation() {
    appendOutput(`<div class="out-info">[⚡] Launching Selenium WebDriver & TestNG Automated Regression Suite...</div>`);
    await sleep(500);
    appendOutput(`<div>  ➔ Executing Test: Login_Authentication_ValidCredentials ... <span class="out-success">✓ PASSED (0.42s)</span></div>`);
    await sleep(500);
    appendOutput(`<div>  ➔ Executing Test: API_Shipment_Creation_Postman_Collection ... <span class="out-success">✓ PASSED (0.28s)</span></div>`);
    await sleep(600);
    appendOutput(`<div>  ➔ Executing Test: Windows_Registry_Clean_Uninstall_Check ... <span class="out-success">✓ PASSED (0.65s)</span></div>`);
    await sleep(500);
    appendOutput(`<div>  ➔ Executing Test: CrossBrowser_Windows11_SnapLayout_Verification ... <span class="out-success">✓ PASSED (0.33s)</span></div>`);
    await sleep(600);
    appendOutput(`
<div class="out-success">==================================================</div>
<div class="out-success">🎉 TEST RUN SUMMARY: 48 Tests Passed, 0 Failed, 0 Skipped (100% Success Rate)</div>
<div class="out-info">⏱️ Execution Time: 2.18s | Allure Report Generated.</div>
<div class="out-success">==================================================</div>
`);
  }

  function appendOutput(html) {
    const div = document.createElement('div');
    div.className = 'terminal-output';
    div.innerHTML = html;
    terminalBody.appendChild(div);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function handleCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    if (!cmd) return;

    // Echo input
    appendOutput(`<div class="prompt-line">guest@abhishek-os:~$ ${cmdRaw}</div>`);

    if (cmd === 'run-pentest') {
      runPentestSimulation();
    } else if (cmd === 'run-qa-suite') {
      runQASuiteSimulation();
    } else if (commands[cmd]) {
      const result = commands[cmd]();
      if (result) appendOutput(result);
    } else {
      appendOutput(`<div class="out-error">command not found: "${cmd}". Type <span class="out-cyan">help</span> for available commands.</div>`);
    }
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      terminalInput.value = '';
      handleCommand(val);
    }
  });

  // Handle Quick Chips
  document.querySelectorAll('.quick-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        handleCommand(cmd);
      }
    });
  });

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/* ==========================================================================
   4. BENTO SPOTLIGHT MOUSE TRACKER
   ========================================================================== */
function initBentoSpotlight() {
  const cards = document.querySelectorAll('.bento-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   5. ARSENAL TABS FILTER
   ========================================================================== */
function initArsenalFilters() {
  const tabs = document.querySelectorAll('.arsenal-tab');
  const items = document.querySelectorAll('.skill-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      items.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. MOBILE NAVIGATION TOGGLE
   ========================================================================== */
function initMobileNav() {
  const nav = document.querySelector('.cyber-nav');
  const toggle = document.querySelector('.mobile-toggle');
  const links = document.querySelectorAll('.nav-links a');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('mobile-open');
    });

    links.forEach(l => {
      l.addEventListener('click', () => {
        nav.classList.remove('mobile-open');
      });
    });
  }
}

/* ==========================================================================
   7. CONTACT FORM SUBMISSION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('cyber-contact-form');
  const statusDiv = document.getElementById('form-status');
  if (!form || !statusDiv) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Transmitting...`;
    statusDiv.className = 'form-status';
    statusDiv.style.display = 'none';

    try {
      const formData = new FormData(form);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        statusDiv.className = 'form-status success';
        statusDiv.innerHTML = `✓ Message encrypted & dispatched successfully! I will reach out shortly.`;
        form.reset();
      } else {
        throw new Error(data.message || 'Submission failed.');
      }
    } catch (err) {
      statusDiv.className = 'form-status error';
      statusDiv.innerHTML = `⚠️ Error sending message: ${err.message}. Please reach out via WhatsApp or LinkedIn directly!`;
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
      statusDiv.style.display = 'block';
    }
  });
}
