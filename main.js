// ── Navigation ──
(function() {
  var hamburger = document.querySelector('.hamburger');
  var navLinks = document.querySelector('.nav-links');
  var nav = document.querySelector('.site-nav');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      }
    });
  }

  // Nav scroll effect
  if (nav) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }
})();

// Create floating particles
(function() {
  var container = document.getElementById('particles');
  if (!container) return;

  for (var i = 0; i < 30; i++) {
    var p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (4 + Math.random() * 6) + 's';
    p.style.animationDelay = (Math.random() * 4) + 's';
    p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
    container.appendChild(p);
  }
})();

// Animated percentage counter
(function() {
  var el = document.getElementById('loaderPercent');
  if (!el) return;

  var start = Date.now();
  var duration = 2800;
  function update() {
    var elapsed = Date.now() - start;
    var progress = Math.min(elapsed / duration, 1);
    var eased = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    el.textContent = Math.round(eased * 100) + '%';
    if (progress < 1) requestAnimationFrame(update);
  }
  setTimeout(update, 1200);
})();

// Reveal bio
(function() {
  var loader = document.getElementById('loader');
  if (!loader) return;

  setTimeout(function() {
    loader.classList.add('hidden');
    document.body.classList.add('loaded');

    // Start scroll animations after loader
    setTimeout(initScrollAnimations, 300);
  }, 4200);
})();

// Scroll-triggered animations
function initScrollAnimations() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Animate skill bars when visible
        var bars = entry.target.querySelectorAll('.skill-bar-fill');
        bars.forEach(function(bar) {
          var width = bar.getAttribute('data-width');
          bar.style.width = width + '%';
        });

        // Animate counters when visible
        var counters = entry.target.querySelectorAll('.counter');
        counters.forEach(function(counter) {
          var target = parseInt(counter.getAttribute('data-target'));
          var current = 0;
          var duration = 1500;
          var start = Date.now();
          function animateCounter() {
            var elapsed = Date.now() - start;
            var progress = Math.min(elapsed / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(animateCounter);
          }
          animateCounter();
        });

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(function(el) {
    observer.observe(el);
  });
}

// Scroll progress bar
(function() {
  var scrollProgress = document.getElementById('scrollProgress');
  var backToTop = document.getElementById('backToTop');

  if (!scrollProgress && !backToTop) return;

  window.addEventListener('scroll', function() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var scrollPercent = (scrollTop / docHeight) * 100;

    if (scrollProgress) {
      scrollProgress.style.width = scrollPercent + '%';
    }

    // Back to top button
    if (backToTop) {
      if (scrollTop > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  });
})();

// ── Interactive Terminal ──
(function() {
  var overlay = document.getElementById('termOverlay');
  var toggle = document.getElementById('termToggle');
  var closeBtn = document.getElementById('termClose');
  var body = document.getElementById('termBody');
  var input = document.getElementById('termInput');
  var canvas = document.getElementById('matrixCanvas');

  if (!overlay || !toggle) return;

  var history = [];
  var historyIndex = -1;

  var commands = {
    help: function() {
      return [
        {text: '╔══════════════════════════════════════╗', cls: 'bright'},
        {text: '║     GLEB\'S TERMINAL v1.0             ║', cls: 'bright'},
        {text: '╚══════════════════════════════════════╝', cls: 'bright'},
        {text: ''},
        {text: '  Available commands:', cls: 'white'},
        {text: ''},
        {text: '  about       → Who is Gleb?', cls: 'accent'},
        {text: '  skills      → What I\'m good at', cls: 'accent'},
        {text: '  journey     → Where I\'ve been', cls: 'accent'},
        {text: '  dreamcar    → The goal', cls: 'accent'},
        {text: '  motto       → How I live', cls: 'accent'},
        {text: '  music       → What I listen to', cls: 'accent'},
        {text: '  food        → In the kitchen', cls: 'accent'},
        {text: '  sports      → My teams', cls: 'accent'},
        {text: '  code        → My coding journey', cls: 'accent'},
        {text: '  dogs        → The real MVPs', cls: 'accent'},
        {text: '  contact     → Get in touch', cls: 'accent'},
        {text: '  hack        → ???', cls: 'red'},
        {text: '  clear       → Clear terminal', cls: 'dim'},
        {text: ''},
        {text: '  Type any command and press Enter.', cls: 'dim'},
      ];
    },

    about: function() {
      return [
        {text: '┌─ ABOUT GLEB ─────────────────────────', cls: 'bright'},
        {text: '│', cls: 'dim'},
        {text: '│  Name:     Gleb Gorbatiuc', cls: 'white'},
        {text: '│  Age:      16', cls: 'white'},
        {text: '│  From:     Moldova → USA', cls: 'white'},
        {text: '│  Lives in: Minnesota', cls: 'white'},
        {text: '│  Speaks:   English & Russian (fluent)', cls: 'white'},
        {text: '│  Mindset:  100% or nothing', cls: 'gold'},
        {text: '│', cls: 'dim'},
        {text: '│  Started businesses at 16.', cls: 'white'},
        {text: '│  Learning to code with AI mentor Sasha.', cls: 'white'},
        {text: '│  Built different.', cls: 'bright'},
        {text: '└──────────────────────────────────────', cls: 'bright'},
      ];
    },

    skills: function() {
      return [
        {text: '┌─ SKILLS ─────────────────────────────', cls: 'bright'},
        {text: '│', cls: 'dim'},
        {text: '│  Landscaping    ████████████████████░ 95%', cls: 'accent'},
        {text: '│  Cooking        ██████████████████░░░ 90%', cls: 'accent'},
        {text: '│  Snowboarding   █████████████████░░░░ 88%', cls: 'accent'},
        {text: '│  Tile Work      █████████████████░░░░ 85%', cls: 'accent'},
        {text: '│  LVP Flooring   ████████████████░░░░░ 80%', cls: 'accent'},
        {text: '│  Auto Mechanics █████████████░░░░░░░░ 65%', cls: 'accent'},
        {text: '│  Coding         ████████░░░░░░░░░░░░░ 40%', cls: 'gold'},
        {text: '│', cls: 'dim'},
        {text: '│  Coding level: rising fast 📈', cls: 'bright'},
        {text: '└──────────────────────────────────────', cls: 'bright'},
      ];
    },

    journey: function() {
      return [
        {text: '┌─ MY JOURNEY ─────────────────────────', cls: 'bright'},
        {text: '│', cls: 'dim'},
        {text: '│  2009  🇲🇩  Born in Moldova', cls: 'white'},
        {text: '│    ↓', cls: 'dim'},
        {text: '│  2009  🇺🇸  Moved to Washington State', cls: 'white'},
        {text: '│    ↓', cls: 'dim'},
        {text: '│   ...  📍  North Dakota', cls: 'white'},
        {text: '│    ↓', cls: 'dim'},
        {text: '│  NOW   🏠  Minnesota (home)', cls: 'gold'},
        {text: '│', cls: 'dim'},
        {text: '│  4 states. 2 languages. 1 mindset.', cls: 'bright'},
        {text: '└──────────────────────────────────────', cls: 'bright'},
      ];
    },

    dreamcar: function() {
      return [
        {text: '', cls: ''},
        {text: '  🏎️  LAMBORGHINI AVENTADOR SVJ', cls: 'gold'},
        {text: '', cls: ''},
        {text: '      ___', cls: 'white'},
        {text: '     /   \\___________', cls: 'white'},
        {text: '    |  ___    ___    |\\', cls: 'white'},
        {text: '    |_|   |__|   |___| \\', cls: 'white'},
        {text: '     (o)          (o)   )', cls: 'white'},
        {text: '      ¯            ¯', cls: 'white'},
        {text: '', cls: ''},
        {text: '  770 HP · V12 · Pure Italian Fury', cls: 'accent'},
        {text: '  Every dollar earned goes toward this.', cls: 'dim'},
        {text: '  The grind never stops.', cls: 'bright'},
        {text: '', cls: ''},
      ];
    },

    motto: function() {
      return [
        {text: '', cls: ''},
        {text: '  ╔════════════════════════════════╗', cls: 'gold'},
        {text: '  ║                                ║', cls: 'gold'},
        {text: '  ║     " 100% OR NOTHING "        ║', cls: 'gold'},
        {text: '  ║                                ║', cls: 'gold'},
        {text: '  ╚════════════════════════════════╝', cls: 'gold'},
        {text: '', cls: ''},
        {text: '  Always open to the next opportunity.', cls: 'white'},
        {text: '  Always giving everything I\'ve got.', cls: 'white'},
        {text: '  Built a business at 16 — just getting started.', cls: 'bright'},
        {text: '', cls: ''},
      ];
    },

    music: function() {
      return [
        {text: '┌─ NOW PLAYING ────────────────────────', cls: 'bright'},
        {text: '│', cls: 'dim'},
        {text: '│  🎵 Genre: A little bit of everything', cls: 'white'},
        {text: '│', cls: 'dim'},
        {text: '│  ♫ Hip-Hop     ████████████', cls: 'pink'},
        {text: '│  ♫ Rock        ████████', cls: 'accent'},
        {text: '│  ♫ Pop         ██████', cls: 'gold'},
        {text: '│  ♫ Whatever    ████████████████', cls: 'bright'},
        {text: '│', cls: 'dim'},
        {text: '│  Good music is good music.', cls: 'white'},
        {text: '└──────────────────────────────────────', cls: 'bright'},
      ];
    },

    food: function() {
      return [
        {text: '┌─ IN THE KITCHEN ─────────────────────', cls: 'bright'},
        {text: '│', cls: 'dim'},
        {text: '│  👨‍🍳 I can cook literally anything.', cls: 'white'},
        {text: '│', cls: 'dim'},
        {text: '│  🍔 Famous Burgers  (ask anyone)', cls: 'gold'},
        {text: '│  🍝 Pasta           (always fire)', cls: 'accent'},
        {text: '│  🔥 Grilling        (steaks, burgers)', cls: 'accent'},
        {text: '│  🍗 Chicken & Asparagus (clean eats)', cls: 'accent'},
        {text: '│', cls: 'dim'},
        {text: '│  The burgers are famous. That\'s a fact.', cls: 'bright'},
        {text: '└──────────────────────────────────────', cls: 'bright'},
      ];
    },

    sports: function() {
      return [
        {text: '┌─ MY TEAMS ───────────────────────────', cls: 'bright'},
        {text: '│', cls: 'dim'},
        {text: '│  🏈 Seattle Seahawks', cls: 'white'},
        {text: '│     NFL · 2026 SUPER BOWL CHAMPS 🏆', cls: 'gold'},
        {text: '│     In my blood since day one.', cls: 'dim'},
        {text: '│', cls: 'dim'},
        {text: '│  🏀 Minnesota Timberwolves', cls: 'white'},
        {text: '│     NBA · Repping the home state', cls: 'accent'},
        {text: '│', cls: 'dim'},
        {text: '└──────────────────────────────────────', cls: 'bright'},
      ];
    },

    code: function() {
      return [
        {text: '┌─ CODING JOURNEY ─────────────────────', cls: 'bright'},
        {text: '│', cls: 'dim'},
        {text: '│  Mentor: Sasha (AI Coding Teacher)', cls: 'white'},
        {text: '│  Stack:  Python, HTML, CSS, JS', cls: 'white'},
        {text: '│  Status: Actively learning & building', cls: 'gold'},
        {text: '│', cls: 'dim'},
        {text: '│  > The same kid who builds businesses', cls: 'accent'},
        {text: '│    is now building software.', cls: 'accent'},
        {text: '│', cls: 'dim'},
        {text: '│  while learning:', cls: 'pink'},
        {text: '│      skills.append("new_skill")', cls: 'pink'},
        {text: '│      print("Never stop building.")', cls: 'pink'},
        {text: '│', cls: 'dim'},
        {text: '└──────────────────────────────────────', cls: 'bright'},
      ];
    },

    dogs: function() {
      return [
        {text: '', cls: ''},
        {text: '  🐶 LUNA & SONYA', cls: 'gold'},
        {text: '  Shih Tzus · The real MVPs', cls: 'white'},
        {text: '', cls: ''},
        {text: '     / \\__', cls: 'white'},
        {text: '    (    @\\___', cls: 'white'},
        {text: '    /         O', cls: 'white'},
        {text: '   /   (_____/', cls: 'white'},
        {text: '  /_____/   U', cls: 'white'},
        {text: '', cls: ''},
        {text: '  They run this house. I just live here.', cls: 'dim'},
        {text: '', cls: ''},
      ];
    },

    contact: function() {
      return [
        {text: '┌─ GET IN TOUCH ───────────────────────', cls: 'bright'},
        {text: '│', cls: 'dim'},
        {text: '│  📧 gorbatiucgleb@gmail.com', cls: 'accent'},
        {text: '│  📱 (612) 963-1667', cls: 'accent'},
        {text: '│  📸 Instagram', cls: 'accent'},
        {text: '│  👻 Snapchat', cls: 'accent'},
        {text: '│', cls: 'dim'},
        {text: '│  Always open to the next opportunity.', cls: 'bright'},
        {text: '└──────────────────────────────────────', cls: 'bright'},
      ];
    },

    clear: function() {
      body.innerHTML = '';
      return [];
    },

    hack: function() {
      startMatrix();
      return [
        {text: '', cls: ''},
        {text: '  [!] INITIATING HACK SEQUENCE...', cls: 'red'},
        {text: '  [!] Bypassing mainframe...', cls: 'red'},
        {text: '  [!] Accessing Gleb\'s bio core...', cls: 'red'},
        {text: '  [✓] HACK COMPLETE.', cls: 'bright'},
        {text: '', cls: ''},
        {text: '  Just kidding. But the Matrix rain is real.', cls: 'dim'},
        {text: '', cls: ''},
      ];
    }
  };

  function printLines(lines) {
    lines.forEach(function(line, i) {
      setTimeout(function() {
        var div = document.createElement('div');
        div.className = 'term-line' + (line.cls ? ' ' + line.cls : '');
        div.textContent = line.text;
        body.appendChild(div);
        body.scrollTop = body.scrollHeight;
      }, i * 30);
    });
  }

  function processCommand(cmd) {
    var trimmed = cmd.trim().toLowerCase();

    var promptLine = document.createElement('div');
    promptLine.className = 'term-line white';
    promptLine.textContent = 'gleb@bio ~$ ' + cmd;
    body.appendChild(promptLine);

    if (trimmed === '') return;

    history.unshift(trimmed);
    historyIndex = -1;

    if (commands[trimmed]) {
      var result = commands[trimmed]();
      if (result.length > 0) printLines(result);
    } else {
      printLines([
        {text: '  Command not found: ' + trimmed, cls: 'red'},
        {text: '  Type "help" to see available commands.', cls: 'dim'},
      ]);
    }
  }

  // Matrix rain
  function startMatrix() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.add('active');
    canvas.style.display = 'block';

    var ctx = canvas.getContext('2d');
    var chars = 'GLEB01アイウエオカキクケコ10サシスセソ'.split('');
    var fontSize = 14;
    var columns = Math.floor(canvas.width / fontSize);
    var drops = [];
    for (var i = 0; i < columns; i++) drops[i] = Math.random() * -100;

    var interval = setInterval(function() {
      ctx.fillStyle = 'rgba(10,14,26,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#22c55e';
      ctx.font = fontSize + 'px JetBrains Mono, monospace';

      for (var j = 0; j < drops.length; j++) {
        var text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, j * fontSize, drops[j] * fontSize);
        if (drops[j] * fontSize > canvas.height && Math.random() > 0.975) drops[j] = 0;
        drops[j]++;
      }
    }, 40);

    setTimeout(function() {
      clearInterval(interval);
      canvas.classList.remove('active');
      canvas.style.display = 'none';
    }, 4000);
  }

  // Open/close terminal
  toggle.addEventListener('click', function() {
    overlay.classList.add('open');
    setTimeout(function() { input.focus(); }, 100);
    if (body.children.length === 0) {
      printLines([
        {text: '  Welcome to Gleb\'s Terminal.', cls: 'bright'},
        {text: '  Type "help" to see what you can do.', cls: 'dim'},
        {text: '', cls: ''},
      ]);
    }
  });

  closeBtn.addEventListener('click', function() {
    overlay.classList.remove('open');
  });

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) overlay.classList.remove('open');
  });

  // Handle input
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      processCommand(input.value);
      input.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = history[historyIndex];
      } else {
        historyIndex = -1;
        input.value = '';
      }
    } else if (e.key === 'Escape') {
      overlay.classList.remove('open');
    }
  });

  // Keyboard shortcut to open terminal
  document.addEventListener('keydown', function(e) {
    if (e.key === '`' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (overlay.classList.contains('open')) {
        overlay.classList.remove('open');
      } else {
        overlay.classList.add('open');
        setTimeout(function() { input.focus(); }, 100);
        if (body.children.length === 0) {
          printLines([
            {text: '  Welcome to Gleb\'s Terminal.', cls: 'bright'},
            {text: '  Type "help" to see what you can do.', cls: 'dim'},
            {text: '', cls: ''},
          ]);
        }
      }
    }
  });
})();


// ── 3D Tilt Effect on Cards ──
(function() {
  var cards = document.querySelectorAll('.work-card, .hobby-card, .fav-card, .family-card, .dish-card, .lang-item, .sport-team-card, .style-card, .roots-card, .travel-card, .passion-card, .info-card');
  if (cards.length === 0) return;

  cards.forEach(function(card) {
    card.classList.add('tilt-card');
    card.style.position = card.style.position || 'relative';

    // Add shine overlay
    var shine = document.createElement('div');
    shine.className = 'tilt-shine';
    card.appendChild(shine);

    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;

      var rotateX = ((y - centerY) / centerY) * -8;
      var rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02, 1.02, 1.02)';

      var shineX = (x / rect.width) * 100;
      var shineY = (y / rect.height) * 100;
      shine.style.setProperty('--shine-x', shineX + '%');
      shine.style.setProperty('--shine-y', shineY + '%');
    });

    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
    });
  });

  // Mobile gyroscope tilt
  if (window.DeviceOrientationEvent) {
    var tiltCards = document.querySelectorAll('.tilt-card');
    var lastBeta = 0, lastGamma = 0;

    function handleOrientation(e) {
      if (e.beta === null || e.gamma === null) return;

      var beta = Math.max(-15, Math.min(15, e.beta - 45));
      var gamma = Math.max(-15, Math.min(15, e.gamma));

      // Smooth it
      lastBeta = lastBeta + (beta - lastBeta) * 0.1;
      lastGamma = lastGamma + (gamma - lastGamma) * 0.1;

      var rotateX = (lastBeta / 15) * -5;
      var rotateY = (lastGamma / 15) * 5;

      tiltCards.forEach(function(card) {
        var rect = card.getBoundingClientRect();
        var inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView) {
          card.classList.add('tilting');
          card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
        }
      });
    }

    // Try to request permission on iOS 13+
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      document.body.addEventListener('click', function() {
        DeviceOrientationEvent.requestPermission().then(function(response) {
          if (response === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        });
      }, { once: true });
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }
  }
})();

// ── Animated Signature ──
(function() {
  var sig = document.getElementById('signatureSvg');
  if (!sig) return;

  // Calculate actual path lengths and set them
  var paths = sig.querySelectorAll('path');
  paths.forEach(function(path) {
    var length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
  });

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        sig.classList.add('animate');
        observer.unobserve(sig);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(sig);
})();
