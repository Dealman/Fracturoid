var Blasteroids = (function Blasteroids() {
  function Blasteroids(options) {
    this.el = null;
    this.canvas = null;
    this.context = null;

    this.width = 0;
    this.height = 0;

    this.isRunning = false;
    this.lastUpdate = 0;
    this.dt = 0;
    this.timeDilation = 1;

    this.pointer = {
      'x': 0,
      'y': 0
    };

    this.player = null;
    this.timeUntilFireReady = 0;
    this.isPlayerMoving = false;
    this.timeToShakeScreen = 0;
    this.difficultyStep = 0;

    this.minAsteroids = 0;
    this.minAsteroids = 0;
    this.asteroidMinSpawnRate = 0;
    this.asteroidMaxSpawnRate = 0;
    this.powerupMinSpawnRate = 0;
    this.powerupMaxSpawnRate = 0;

    this.bullets = [];
    this.asteroids = [];
    this.particles = [];
    this.powerups = [];

    this.KEY_FORWARD = 87;
    this.KEY_BACKWARD = 83;
    this.KEY_LEFT = 65;
    this.KEY_RIGHT = 68;
    this.KEYS_PRESSED = {};
    this.isMouseDown = false;

    this.modifiers = {
      'fireRate': {
        'name': 'Fire Rate',
        'value': 1,
        'defaultValue': 1,
        'duration': 0
      },
      'asteroidsSpeed': {
        'name': 'Astro Slowdown',
        'value': 1,
        'defaultValue': 1,
        'duration': 0
      },
      'playerSpeed': {
        'value': 1,
        'defaultValue': 1,
        'duration': 0
      },
      'godmode': {
        'name': 'Invulnerable',
        'value': false,
        'defaultValue': false,
        'duration': 0
      },
      'lives': {
        'name': 'Lives',
        'value': 1,
        'defaultValue': 1,
        'duration': 0
      },
      'wreckingball': {
        'name': 'Wrecking Ball',
        'value': false,
        'defaultValue': false,
        'duration': 0
      },
      'piercingshots': {
        'name': 'Piercing Bullets',
        'value': false,
        'defaultValue': false,
        'duration': 0
      }
    };

    this.stats = {
      'bulletsFired': 0,
      'bulletsHit': 0,
      'asteroidsDestroyed': 0,
      'asteroidsMissed': 0,
      'powerups': 0,
      'time': 0
    };

    // Time (ms) to let the game run before showing the death screen
    this.TIME_BEFORE_SHOWING_DEATH_SCREEN = 1500;
    // Time (ms) to leave the player on the death screen (image + score)
    this.TIME_TO_BE_ON_DEATH_SCREEN = 5000;
    // When the player is dead before respawning - how fast does it follow the mouse
    this.PLAYER_DEAD_POINTER_FOLLOW_SPEED = 5;
    // Should we play the intro video when the game is first shown
    this.PLAY_INTRO_VIDEO = true;
    // How long (in seconds) before the difficulty increases
    this.DIFFICULTY_STEP_TIME = 20;
    // Should there be glows or not
    this.GLOW = true;

    this.pointerTrail = [];
    this.timeSinceGotPointerTrail = 0;
    this.TIME_BETWEEN_POINTER_TRAIL = 0.01;
    this.POINTER_DOT_TRAIL_SIZE = 7;
    this.POINTER_DOT_SIZE = 3;
    this.POINTER_DOT_COLOUR = 'rgba(255, 255, 255, .75)';

    // Time (s) between each bullet
    this.FIRE_RATE = 0.3;
    // Number of stars to generate for the background
    this.NUMBER_OF_STARS = 70;
    // Default screen shake strength - random pixels between this and -this
    this.SCREEN_SHAKE_STRENGTH = 1.2;
    // Default duration of screen shake (s)
    this.DEFAULT_SHAKE_DURATION = 0.15;
    // Grid squares size
    this.GRID_SIZE = 25;
    // Grid line colour
    this.GRID_COLOUR = 'rgba(46, 26, 66, .5)';

    // Player config
    this.PLAYER_SIZE = 22;
    this.PLAYER_SPEED = 0.11;
    this.PLAYER_MAX_SPEED = 120;
    this.PLAYER_ROTATION_SPEED = 15;
    this.PLAYER_MAX_ROTATION_SPEED = 4;
    this.PLAYER_DRAG = 0.07;
    this.PLAYER_ANGULAR_DRAG = 0.2;
    this.PLAYER_DENT = 5;
    this.PLAYER_FILL = 'rgba(0, 0, 0, 1)';
    this.PLAYER_BORDER = 'rgba(202, 75, 155, 1)';
    this.PLAYER_SHADOW_BLUR = 10;
    this.PLAYER_SHADOW_COLOR = 'rgba(202, 75, 155, 0.7)';
    this.PLAYER_PARTICLE_OFFSET = 0.35;
    this.PLAYER_PARTICLE_COLOUR = ['rgba(80, 0, 0, 1)', 'rgba(80, 50, 0, 1)'];
    this.PLAYER_PARTICLE_MIN_LIFETIME = 0.05;
    this.PLAYER_PARTICLE_MAX_LIFETIME = 0.15;
    this.PLAYER_PARTICLE_MIN_THICKNESS = 1;
    this.PLAYER_PARTICLE_MAX_THICKNESS = 2;
    this.PLAYER_DEATH_PARTICLES = [
      'rgba(202, 75, 155, 1)',
      'rgba(222, 65, 175, 1)',
      'rgba(255, 255, 255, .7)'
    ];

    // Bullets config
    this.BULLETS_SPEED = 350;
    this.BULLETS_COLOUR = '#ca4b9b';
    this.BULLETS_SIZE = 3;

    // Asteroids config
    this.MIN_ASTEROIDS = 3;
    this.ASTEROID_MIN_SPWAN_RATE = 0.5;
    this.ASTEROID_MAX_SPWAN_RATE = 3;
    this.ASTEROID_CHANCE_TO_SPLIT = 0.85;
    this.ASTEROID_MAX_SPLIT_LEVELS = 3;
    this.ASTEROID_MIN_SIZE = 25;
    this.ASTEROID_MAX_SIZE = 60;
    this.ASTEROID_MIN_SPEED = 0.06;
    this.ASTEROID_MAX_SPEED = 0.2;
    this.ATEROIDS_SHADOW_BLUR = 10;
    this.ATEROIDS_COLOUR_FILL = 'rgba(200, 255, 255, .1)';
    this.ATEROIDS_COLOUR_BORDER = 'rgba(200, 255, 255, .8)';
    this.ATEROIDS_SHADOW_COLOR = 'rgba(220, 255, 255, .8)';
    this.timeToSpawnAsteroid = 0;

    // Particles config
    this.NUMBER_OF_PARTICLES = {
      1: [20, 35],
      2: [8, 20],
      3: [3, 8],
    }
    this.PARTICLE_MIN_SIZE = 2;
    this.PARTICLE_MAX_SIZE = 6;
    this.PARTICLE_MIN_SPEED = 150;
    this.PARTICLE_MAX_SPEED = 200;
    this.PARTICLE_MIN_LIFETIME = 0.1;
    this.PARTICLE_MAX_LIFETIME = 0.4;
    this.PARTICLE_MIN_THICKNESS = 0.8;
    this.PARTICLE_MAX_THICKNESS = 2;
    this.PARTICLE_COLOURS = [
                              'rgba(180, 220, 255, .7)',
                              'rgba(180, 255, 220, .7)',
                              'rgba(200, 255, 255, .7)',
                              'rgba(255, 255, 255, .6)'
                            ];

    // Powerups config
    this.POWERUP_MAX_ALIVE = 2;
    this.POWERUP_MIN_SPAWN_RATE = 5;
    this.POWERUP_MAX_SPAWN_RATE = 10;
    this.timeToSpawnPowerup = 0;

    this.powerupConfigs = [
      {
        'modifier': {
          'key': 'fireRate',
          'value': 0.35,
          'duration': 10
        },
        'size': 18,
        'thickness': 2,
        'rotationSpeed': 0.7,
        'ttl': 15,
        'shadowBlur': 7,
        'shadowColor': 'rgba(255, 255, 255, .3)',
        'fill': 'rgba(50, 250, 220, .2)',
        'border': 'rgba(50, 250, 220, .6)'
      },
      {
        'modifier': {
          'key': 'fireRate',
          'value': 0.2,
          'duration': 6
        },
        'size': 24,
        'thickness': 2.5,
        'rotationSpeed': 1.7,
        'ttl': 15,
        'shadowBlur': 7,
        'shadowColor': 'rgba(255, 255, 255, .3)',
        'fill': 'rgba(50, 250, 220, .2)',
        'border': 'rgba(50, 250, 220, .6)'
      },
      {
        'modifier': {
          'key': 'asteroidsSpeed',
          'value': 0.4,
          'duration': 8
        },
        'size': 18,
        'thickness': 2,
        'rotationSpeed': 1.1,
        'ttl': 15,
        'shadowBlur': 7,
        'shadowColor': 'rgba(255, 128, 0, .3)',
        'fill': 'rgba(250, 200, 50, .2)',
        'border': 'rgba(250, 200, 50, .7)'
      },
      {
        'modifier': {
          'key': 'godmode',
          'value': true,
          'duration': 10
        },
        'size': 20,
        'thickness': 2,
        'rotationSpeed': 2,
        'ttl': 15,
        'shadowBlur': 7,
        'shadowColor': 'rgba(255, 255, 0, .5)',
        'fill': 'rgba(255, 255, 255, .3)',
        'border': 'rgba(255, 255, 200, 1)'
      },
      {
        'modifier': {
          'key': 'wreckingball',
          'value': true,
          'duration': 8
        },
        'size': 20,
        'thickness': 2,
        'rotationSpeed': 6,
        'ttl': 15,
        'shadowBlur': 7,
        'shadowColor': 'rgba(255, 255, 200, .5)',
        'fill': 'rgba(50, 50, 50, 1)',
        'border': 'rgba(220, 220, 220, 1)'
      },
      {
        'modifier': {
          'key': 'piercingshots',
          'value': true,
          'duration': 8
        },
        'size': 18,
        'thickness': 2,
        'rotationSpeed': 3,
        'ttl': 15,
        'shadowBlur': 7,
        'shadowColor': 'rgba(0, 0, 0, 0)',
        'fill': 'rgba(205, 50, 50, 0.6)',
        'border': 'rgba(255, 120, 120, 0.6)'
      },
      {
        'modifier': {
          'key': 'lives',
          'value': 2,
          'duration': Infinity
        },
        'size': 18,
        'thickness': 2,
        'rotationSpeed': 5,
        'ttl': 15,
        'shadowBlur': 7,
        'shadowColor': this.PLAYER_BORDER,
        'fill': this.PLAYER_FILL,
        'border': this.PLAYER_BORDER
      }
    ];

    this.init(options);
  }

  Blasteroids.prototype.init = function init(options) {
    this.el = options.el;
    this.elIntro = this.el.querySelector('video');

    if (this.elIntro) {
      this.elIntro.addEventListener('ended', this.onIntroVideoEnd.bind(this));
    } else {
      this.PLAY_INTRO_VIDEO = false;
    }

    this.createPlayer();
    this.createHTML();

    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.el.addEventListener('mousedown', function onMouseDown(e) {
      this.isMouseDown = true;
    }.bind(this));
    window.addEventListener('mouseup', function onMouseUp(e) {
      this.isMouseDown = false;
    }.bind(this));
    window.addEventListener('keydown', function onKeyDown(e) {
      this.KEYS_PRESSED[e.keyCode] = true;
    }.bind(this));
    window.addEventListener('keyup', function onKeyUp(e) {
      this.KEYS_PRESSED[e.keyCode] = false;
    }.bind(this));
  };
  
  Blasteroids.prototype.show = function show() {
    this.el.classList.add('visible');

    this.resize();

    AudioPlayer.play(AudioPlayer.Blasteroids_Show);

    if (this.PLAY_INTRO_VIDEO) {
      this.el.classList.add('play-intro');
      this.elIntro.currentTime = 0;
      this.elIntro.play();
      AudioPlayer.play(AudioPlayer.Blasteroids_IntroPlay);
    } else {
      this.start();
    }
  };
  
  Blasteroids.prototype.hide = function hide() {
    this.el.classList.remove('visible');
    this.stop(true);
    this.reset();
  };

  Blasteroids.prototype.onIntroVideoEnd = function onIntroVideoEnd(e) {
    AudioPlayer.play(AudioPlayer.Blasteroids_IntroEnd);
    this.el.classList.remove('play-intro');
    this.start(true);
  };

  Blasteroids.prototype.start = function start(bSkipAudio) {
    if (this.isRunning) {
      return false;
    }

    this.isRunning = true;

    this.reset();

    if (!bSkipAudio) {
      AudioPlayer.play(AudioPlayer.Blasteroids_Start);
    }

    this.lastUpdate = Date.now();
    window.requestAnimationFrame(this.tick.bind(this));

    return true;
  };
  
  Blasteroids.prototype.stop = function stop(bSkipAudio) {
    this.isRunning = false;

    if (!bSkipAudio) {
      AudioPlayer.play(AudioPlayer.Blasteroids_Stop);
    }
  };

  Blasteroids.prototype.onMouseMove = function onMouseMove(e) {
    var bounds = this.canvas.getBoundingClientRect();

    var x = e.pageX - bounds.left;
    var y = e.pageY - bounds.top;

    this.pointer.x = Math.min(Math.max(x, 0), bounds.width);
    this.pointer.y = Math.min(Math.max(y, 0), bounds.height);

    e.preventDefault();
  };

  Blasteroids.prototype.tick = function tick() {
    if (!this.isRunning) {
      return false;
    }

    var now = Date.now();

    this.dt = Math.min((now - this.lastUpdate) / 1000, 30 / 1000);

    this.stats.time += this.dt;

    this.update(this.dt * this.timeDilation);
    this.draw();

    this.updateHUD();


    this.lastUpdate = now;
    window.requestAnimationFrame(this.tick.bind(this));
  };
  
  Blasteroids.prototype.controlPlayer = function controlPlayer(dt) {
    var player = this.player;
    var shouldSpawnMovementParticles = false;
    var isPlayerMoving = false;

    if (player.isActive) {
      // Movement keys - WASD
      if (this.KEYS_PRESSED[this.KEY_FORWARD]) {
        player.currentSpeed.x += player.speed;
        isPlayerMoving = true;
        shouldSpawnMovementParticles = true;
      }
      if (this.KEYS_PRESSED[this.KEY_BACKWARD]) {
        player.currentSpeed.x -= player.speed;
        isPlayerMoving = true;
        shouldSpawnMovementParticles = false;
      }
      if (this.KEYS_PRESSED[this.KEY_LEFT]) {
        player.currentSpeed.y -= player.speed;
        isPlayerMoving = true;
      }
      if (this.KEYS_PRESSED[this.KEY_RIGHT]) {
        player.currentSpeed.y += player.speed;
        isPlayerMoving = true;
      }
    } else {
      player.x += (this.pointer.x - this.player.x) * this.PLAYER_DEAD_POINTER_FOLLOW_SPEED * dt;
      player.y += (this.pointer.y - this.player.y) * this.PLAYER_DEAD_POINTER_FOLLOW_SPEED * dt;
    }

    // Check if player started or stopped moving and trigger appropriate audio
    if (isPlayerMoving !== this.isPlayerMoving) {
      this.isPlayerMoving = isPlayerMoving;
      if (isPlayerMoving) {
        AudioPlayer.play(AudioPlayer.Blasteroids_StartMoving);
      } else {
        AudioPlayer.play(AudioPlayer.Blasteroids_StopMoving);
      }
    }

    /* Lerping to mouse */
    var dx = this.pointer.x - player.x;
    var dy = this.pointer.y - player.y;
    var len = Math.sqrt(dx * dx + dy * dy);
    dx /= len ? len : 1.0;
    dy /= len ? len : 1.0;
    var dirX = Math.cos(player.angle);
    var dirY = Math.sin(player.angle);
    var rotationSpeed = this.PLAYER_ROTATION_SPEED * dt * this.modifiers.playerSpeed.value;

    dirX += (dx - dirX) * rotationSpeed;
    dirY += (dy - dirY) * rotationSpeed;

    player.angle = Math.atan2(dirY, dirX);

    this.checkPlayerFire(dt);

    // If the player is moving forwards - spawn particles
    if (shouldSpawnMovementParticles) {
      var angle = player.angle - Math.PI;
      angle = this.random(angle - this.PLAYER_PARTICLE_OFFSET, angle + this.PLAYER_PARTICLE_OFFSET);

      this.createParticle(player, {
        'colour': this.PLAYER_PARTICLE_COLOUR[Math.floor(this.random(0, this.PLAYER_PARTICLE_COLOUR.length))],
        'angle': angle,
        'ttl': this.random(this.PLAYER_PARTICLE_MIN_LIFETIME, this.PLAYER_PARTICLE_MAX_LIFETIME),
        'thickness': this.random(this.PLAYER_PARTICLE_MIN_THICKNESS, this.PLAYER_PARTICLE_MAX_THICKNESS),
      });
    }

    return true;
  };

  Blasteroids.prototype.checkPlayerFire = function checkPlayerFire(dt) {
    if (this.timeUntilFireReady > 0) {
      this.timeUntilFireReady -= dt;
      if (this.timeUntilFireReady <= 0) {
        this.timeUntilFireReady = 0;
      }
    }

    if (this.isMouseDown && this.timeUntilFireReady === 0) {
      AudioPlayer.play(AudioPlayer.Blasteroids_Fire);
      this.stats.bulletsFired++;
      this.timeUntilFireReady = this.FIRE_RATE * this.modifiers.fireRate.value;
      this.createBullet(this.player);
    }
  };

  Blasteroids.prototype.difficultyIncrease = function difficultyIncrease() {
    var time = this.stats.time;
    var step = Math.floor(time / this.DIFFICULTY_STEP_TIME);

    if (step !== this.difficultyStep) {
      this.difficultyStep = step;

      // Increse min asteroids every two levels
      if (this.difficultyStep % 2 === 1) {
        this.minAsteroids++;
      }

      this.asteroidMinSpawnRate *= 0.75;
      this.asteroidMaxSpawnRate *= 0.75;
      this.powerupMinSpawnRate *= 0.9;
      this.powerupMaxSpawnRate *= 0.9;
    }
  };

  Blasteroids.prototype.update = function update(dt) {
    var player = this.player;
    var bullets = this.bullets;
    var asteroids = this.asteroids;
    var particles = this.particles;
    var powerups = this.powerups;

    this.difficultyIncrease();

    // Spawn asteroids
    if (this.timeToSpawnAsteroid >= 0) {
      this.timeToSpawnAsteroid -= dt;
      if (this.timeToSpawnAsteroid <= 0) {
        this.timeToSpawnAsteroid = this.random(this.asteroidMinSpawnRate, this.asteroidMaxSpawnRate);

        var toCreate = Math.max(this.minAsteroids - asteroids.length, 1);
        for (var i = 0; i < toCreate; i++) {
          this.createAsteroid();
        }
      }
    }

    // Spawn powerups
    if (this.timeToSpawnPowerup >= 0) {
      this.timeToSpawnPowerup -= dt;
      if (this.timeToSpawnPowerup <= 0) {
        if (this.powerups.length < this.POWERUP_MAX_ALIVE) {
          this.timeToSpawnPowerup = this.random(this.powerupMinSpawnRate, this.powerupMaxSpawnRate);
          this.createPowerup();
        } else {
          // If there are the maximum number of powerups on screen, set it to 0.1
          // So it will try again next tick
          this.timeToSpawnPowerup = 0.1;
        }
      }
    }

    if (this.timeToShakeScreen > 0) {
      this.timeToShakeScreen -= dt;
      if (this.timeToShakeScreen <= 0) {
        this.timeToShakeScreen = 0;
      }
    }

    // Update modifiers to count down
    var didModifiersChange = false;
    for (var k in this.modifiers) {
      var modifier = this.modifiers[k];

      if (modifier.duration > 0) {
        modifier.duration -= dt;
        didModifiersChange = true;

        if (modifier.duration <= 0) {
          AudioPlayer.play(AudioPlayer.Blasteroids_PowerupModifierExpired);
          modifier.duration = 0;
          modifier.value = modifier.defaultValue;
        }
      }
    }

    if (didModifiersChange) {
      this.updateHUD();
    }

    this.controlPlayer(dt);
    this.updateActor(player, dt);

    for (var i = 0; i < bullets.length; i++) {
      this.updateActor(bullets[i], dt, bullets);
    }
    for (var i = 0; i < asteroids.length; i++) {
      this.updateActor(asteroids[i], dt, asteroids);
    }
    for (var i = 0; i < particles.length; i++) {
      this.updateActor(particles[i], dt, particles);
    }
    for (var i = 0; i < powerups.length; i++) {
      this.updateActor(powerups[i], dt, powerups);
    }

    // Wrap player around edges
    if (player.y + player.halfSize < 0) {
      player.y = this.height + player.halfSize;
      player.x = this.width - player.x;
      AudioPlayer.play(AudioPlayer.Blasteroids_WrapEdge);
    } else if (player.y - player.halfSize > this.height) {
      player.y = -player.halfSize;
      player.x = this.width - player.x;
      AudioPlayer.play(AudioPlayer.Blasteroids_WrapEdge);
    } else if (player.x + player.halfSize < 0) {
      player.x = this.width + player.halfSize;
      player.y = this.height - player.y;
      AudioPlayer.play(AudioPlayer.Blasteroids_WrapEdge);
    } else if (player.x - player.halfSize > this.width) {
      player.x = -player.halfSize;
      player.y = this.height - player.y;
      AudioPlayer.play(AudioPlayer.Blasteroids_WrapEdge);
    }


    if (this.timeSinceGotPointerTrail >= 0) {
      this.timeSinceGotPointerTrail -= dt;
      if (this.timeSinceGotPointerTrail <= 0) {
        this.timeSinceGotPointerTrail = this.TIME_BETWEEN_POINTER_TRAIL;

        this.pointerTrail.push([this.pointer.x, this.pointer.y]);

        if (this.pointerTrail.length > this.POINTER_DOT_TRAIL_SIZE) {
          this.pointerTrail.splice(0, 1);
        }
      }
    }

    this.checkCollisions();
  };

  Blasteroids.prototype.updateActor = function updateActor(actor, dt, actorList) {
    var shouldDestroy = false;

    if (actor.ttl !== Infinity) {
      actor.ttl -= dt;
      if (actor.ttl <= 0) {
        if (actor.isPowerup) {
          AudioPlayer.play(AudioPlayer.Blasteroids_PowerupExpired);
        }
        shouldDestroy = true;
      }
    }

    if (!shouldDestroy) {
      if (actor.maxSpeed) {
        actor.currentSpeed.x = Math.min(Math.max(actor.currentSpeed.x, -actor.maxSpeed), actor.maxSpeed);
        actor.currentSpeed.y = Math.min(Math.max(actor.currentSpeed.y, -actor.maxSpeed), actor.maxSpeed);
      }
      if (actor.maxRotationSpeed) {
        actor.currentRotationSpeed = Math.min(Math.max(actor.currentRotationSpeed, -actor.maxRotationSpeed), actor.maxRotationSpeed);
      }

      actor.angle += actor.currentRotationSpeed * dt;
      actor.rotation += actor.currentDisplayRotationSpeed * dt;
      actor.cos = Math.cos(actor.angle + actor.rotation + Math.PI / 2);
      actor.sin = Math.sin(actor.angle + actor.rotation + Math.PI / 2);

      var cos = Math.cos(actor.angle);
      var sin = Math.sin(actor.angle);
      var speed = {
        'x': actor.currentSpeed.x * dt,
        'y': actor.currentSpeed.y * dt
      };

      if (actor.isPlayer) {
        speed.x *= this.modifiers.playerSpeed.value;
        speed.y *= this.modifiers.playerSpeed.value;
      }
      if (actor.isAsteroid) {
        speed.x *= this.modifiers.asteroidsSpeed.value;
        speed.y *= this.modifiers.asteroidsSpeed.value;
      }

      actor.x += (cos * speed.x - sin * speed.y);
      actor.y += (cos * speed.y + sin * speed.x);

      actor.currentSpeed.x *= (1 - actor.drag);
      actor.currentSpeed.y *= (1 - actor.drag);
      actor.currentRotationSpeed *= (1 - actor.angularDrag);

      if (Math.sqrt(actor.currentSpeed.x * actor.currentSpeed.x + actor.currentSpeed.y * actor.currentSpeed.y) <= 0.1) {
        actor.currentSpeed.x = 0;
        actor.currentSpeed.y = 0;
      }
      if (Math.abs(actor.currentRotationSpeed) <= 0.1) {
        actor.currentRotationSpeed = 0;
      }

      if (actor.destroyOutOfBounds) {
        if (actor.x + actor.halfSize < 0 || actor.x - actor.halfSize > this.width ||
            actor.y + actor.halfSize < 0 || actor.y - actor.halfSize > this.height) {
          shouldDestroy = true;
        }
      }
    }

    if (shouldDestroy && actorList) {
      this.destroyActor(actorList, actor);

      if (actor.isBullet) {
        this.updateHUD();
      }
      if (actor.isAsteroid) {
        this.stats.asteroidsMissed++;
      }
    }
  };

  Blasteroids.prototype.draw = function draw() {
    var context = this.context;
    var shakeX = 0;
    var shakeY = 0;
    var i, actor, len;

    context.clearRect(0, 0, this.width, this.height);

    // Screen shake
    if (this.timeToShakeScreen > 0) {
      shakeX = this.random(-this.screenShakeStrength, this.screenShakeStrength);
      shakeY = this.random(-this.screenShakeStrength, this.screenShakeStrength);
      context.translate(shakeX, shakeY);
    }

    // Particles
    for (i = 0, len = this.particles.length; i < len; i++) {
      actor = this.particles[i];
      actor.draw.call(this, actor, context);
    }

    // Asteroids
    context.fillStyle = this.ATEROIDS_COLOUR_FILL;
    context.strokeStyle = this.ATEROIDS_COLOUR_BORDER;
    context.shadowBlur = this.GLOW? this.ATEROIDS_SHADOW_BLUR : 0;
    context.shadowColor = this.ATEROIDS_SHADOW_COLOR;
    for (i = 0, len = this.asteroids.length; i < len; i++) {
      actor = this.asteroids[i];
      actor.draw.call(this, actor, context);
    }
    
    // Powerups
    for (i = 0, len = this.powerups.length; i < len; i++) {
      actor = this.powerups[i];
      actor.draw.call(this, actor, context);
    }

    // Bullets
    context.fillStyle = this.modifiers.piercingshots.value? 'red' : this.BULLETS_COLOUR;
    for (i = 0, len = this.bullets.length; i < len; i++) {
      actor = this.bullets[i];
      actor.draw.call(this, actor, context);
    }

    // Player
    this.player.draw.call(this, this.player, context);

    if (shakeX || shakeY) {
      context.translate(-shakeX, -shakeY);
    }

    this.drawPointer(context);
  };

  Blasteroids.prototype.drawPointer = function drawPointer(context) {
    return;

    if (this.POINTER_DOT_SIZE) {
      context.fillStyle = this.POINTER_DOT_COLOUR;
      
      var pointSize = this.POINTER_DOT_SIZE;
      var radius = Math.PI * 2;
      var trail = this.pointerTrail;
      var trailSize = this.pointerTrail.length;
      var alpha = 1 / (trailSize + 1);

      for (var i = 0; i < trailSize; i++) {
        var point = trail[i];

        context.globalAlpha = alpha;
        context.beginPath();
        context.arc(point[0], point[1], pointSize, 0, radius);
        context.fill();

        alpha += 1 / trailSize;
      }

      context.globalAlpha = 1;
      context.beginPath();
      context.arc(this.pointer.x, this.pointer.y, pointSize, 0, radius);
      context.fill();
    }

    context.strokeStyle = 'rgba(255, 255, 255, .1)';
    context.beginPath();
    context.moveTo(this.pointer.x, this.pointer.y);
    context.lineTo(this.player.x, this.player.y);
    context.stroke();


    context.closePath();
  };

  Blasteroids.prototype.drawPlayer = function drawPlayer(actor, context) {
    var width = actor.size * 0.75;
    var shadowColor = actor.shadowColor;
    var fill = actor.colourFill;
    var border = actor.colourBorder;

    if (this.modifiers.wreckingball.value) {
      fill = 'rgba(50, 50, 50, 1)';
      border = 'rgba(220, 220, 220, 1)';
      shadowColor = 'rgba(0, 0, 0, 0)';
    } else {
      if (this.modifiers.godmode.value) {
        context.globalAlpha = 0.5;
        shadowColor = 'rgba(255, 255, 220, .5)';
      }
    }

    // Main player shape
    context.fillStyle = fill;
    context.strokeStyle = border;
    context.lineWidth = 2;
    context.shadowBlur = this.GLOW? actor.shadowBlur : 0;
    context.shadowColor = shadowColor;

    if (!this.player.isActive) {
      context.globalAlpha = 0.25;
    }

    this.drawActorPoints(context, [
      this.rotateActorPoint(actor, 0, -actor.halfSize),
      this.rotateActorPoint(actor, width / 2, actor.halfSize),
      this.rotateActorPoint(actor, 0, actor.halfSize - actor.dent),
      this.rotateActorPoint(actor, -width / 2, actor.halfSize)
    ]);

    context.fill();
    context.stroke();

    // Effect for Wrecking Ball
    if (this.modifiers.wreckingball.value) {
      var r = actor.halfSize * 2;

      context.fillStyle = 'rgba(180, 180, 180, 0.7)';
      context.strokeStyle = 'rgba(210, 210, 210, 1)';
      context.lineWidth = 1;
      for (var i = 0; i < 3; i++) {
        var speed = (i + 1) * 3.09;
        var angle = (this.stats.time * speed) % (Math.PI * 2);
        var x = actor.x + r * Math.cos(angle);
        var y = actor.y + r * Math.sin(angle);

        context.beginPath();
        context.arc(x, y, 3, 0, Math.PI * 2);
        context.fill();
        context.stroke();
        context.closePath();
      }
    }

    // Effect for increased fire rate
    if (this.modifiers.piercingshots.value) {
      context.fillStyle = 'rgba(200, 50, 50, 0.9)';

      this.drawActorPoints(context, [
        this.rotateActorPoint(actor, 0, -actor.halfSize + 2),
        this.rotateActorPoint(actor, width / 2 - 3, 2),
        this.rotateActorPoint(actor, -width / 2 + 3, 2)
      ]);

      context.fill();
      context.closePath();
    }

    // Effect for increased fire rate
    if (this.modifiers.fireRate.duration) {
      context.fillStyle = 'rgba(50, 250, 220, 0.3)';
      context.strokeStyle = 'rgba(50, 250, 220, 0.6)';
      context.lineWidth = 1;
      var point = this.rotateActorPoint(actor, 0, -actor.halfSize);

      context.beginPath();
      context.arc(point[0], point[1], 4, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.closePath();
    }

    if (!this.player.isActive || this.modifiers.godmode.value) {
      context.globalAlpha = 1;
    }

    context.shadowBlur = 0;
  };

  Blasteroids.prototype.drawAsteroid = function drawAsteroid(actor, context) {
    this.drawActorPoints(context, [
      this.rotateActorPoint(actor, actor.topX, -actor.halfSize),
      this.rotateActorPoint(actor, actor.halfSize, actor.rightY),
      this.rotateActorPoint(actor, actor.bottomX, actor.halfSize),
      this.rotateActorPoint(actor, -actor.halfSize, actor.leftY)
    ]);

    context.lineWidth = actor.lineWidth;
    context.fill();
    context.stroke();
  };

  Blasteroids.prototype.drawParticle = function drawParticle(actor, context) {
    var lineSize = actor.thickness / 2;
    
    this.drawActorPoints(context, [
      this.rotateActorPoint(actor, -lineSize, -actor.halfSize),
      this.rotateActorPoint(actor, lineSize, -actor.halfSize),
      this.rotateActorPoint(actor, lineSize, actor.halfSize),
      this.rotateActorPoint(actor, -lineSize, actor.halfSize)
    ]);

    context.fillStyle = actor.colour;
    context.fill();
  };

  Blasteroids.prototype.drawPowerup = function drawPowerup(actor, context) {
    this.drawActorPoints(context, [
      this.rotateActorPoint(actor, -actor.halfSize, -actor.halfSize),
      this.rotateActorPoint(actor, actor.halfSize, -actor.halfSize),
      this.rotateActorPoint(actor, actor.halfSize, actor.halfSize),
      this.rotateActorPoint(actor, -actor.halfSize, actor.halfSize)
    ]);

    var powerup = actor.powerup;
    context.lineWidth = powerup.thickness;
    context.fillStyle = powerup.fill;
    context.strokeStyle = powerup.border;
    context.shadowBlur = this.GLOW? powerup.shadowBlur : 0;
    context.shadowColor = powerup.shadowColor;
    context.fill();
    context.stroke();

    context.shadowBlur = 0;
  };

  Blasteroids.prototype.drawBullet = function drawBullet(actor, context) {
    context.fillRect(actor.x - actor.halfSize,
                     actor.y - actor.halfSize,
                     actor.size, actor.size);
  };
  
  Blasteroids.prototype.shakeScreen = function shakeScreen(strength, duration) {
    this.timeToShakeScreen = duration === undefined? this.DEFAULT_SHAKE_DURATION : duration;
    this.screenShakeStrength = strength === undefined? this.SCREEN_SHAKE_STRENGTH : strength;
  };

  Blasteroids.prototype.destroyActor = function destroyActor(list, actor) {
    var index = list.indexOf(actor);
    list[index] = null;
    list.splice(index, 1);
  };

  Blasteroids.prototype.reset = function reset() {
    this.player.angle = 0;
    this.player.isActive = true;

    for (var k in this.stats) {
      this.stats[k] = 0;
    }
    for (var k in this.modifiers) {
      this.modifiers[k].value = this.modifiers[k].defaultValue;
      this.modifiers[k].duration = 0;
    }

    this.difficultyStep = 0;
    this.minAsteroids = this.MIN_ASTEROIDS;
    this.asteroidMinSpawnRate = this.ASTEROID_MIN_SPWAN_RATE;
    this.asteroidMaxSpawnRate = this.ASTEROID_MAX_SPWAN_RATE;
    this.powerupMinSpawnRate = this.POWERUP_MIN_SPAWN_RATE;
    this.powerupMaxSpawnRate = this.POWERUP_MAX_SPAWN_RATE;

    this.timeToSpawnPowerup = this.random(this.powerupMinSpawnRate, this.powerupMaxSpawnRate);
    this.timeToSpawnAsteroid = this.random(this.asteroidMinSpawnRate, this.asteroidMaxSpawnRate);

    this.bullets = [];
    this.asteroids = [];
    this.particles = [];
    this.powerups = [];
    this.centrePlayer();
    this.updateHUD();
  };

  Blasteroids.prototype.onPlayerHitByAsteroid = function onPlayerHitByAsteroid(asteroid) {
    if (this.modifiers.wreckingball.value) {
      this.onPlayerHitAsteroid(asteroid);
      return;
    }

    var numberOfParticles = this.random(100, 200);
    for (var i = 0; i < numberOfParticles; i++) {
      this.createParticle(this.player, {
        'colour': this.PLAYER_DEATH_PARTICLES[Math.floor(this.random(0, this.PLAYER_DEATH_PARTICLES.length))],
      });
    }

    this.player.isActive = false;

    this.updateHUD();

    AudioPlayer.play(AudioPlayer.Blasteroids_Die);

    var isDead = this.getNumberOfLives() === 1;

    if (isDead) {
      this.el.classList.add('player-dead');
    } else {
      this.modifiers.lives.value /= 2;
    }

    window.setTimeout(function timeoutWaitForDeath() {
      if (isDead) {
        this.el.classList.add('death-screen');
        this.stop(true);

        window.setTimeout(function timeoutDeathScreen() {
          this.reset();
          this.el.classList.remove('player-dead');
          this.el.classList.remove('death-screen');
          this.start();
        }.bind(this), this.TIME_TO_BE_ON_DEATH_SCREEN);
      } else {
        this.player.x = this.pointer.x;
        this.player.y = this.pointer.y;
        this.player.isActive = true;
      }
    }.bind(this), this.TIME_BEFORE_SHOWING_DEATH_SCREEN);
  };

  Blasteroids.prototype.onPlayerHitAsteroid = function onPlayerHitAsteroid(asteroid) {
    AudioPlayer.play(AudioPlayer.Blasteroids_HitAsteroid);
    this.stats.asteroidsDestroyed++;
    this.destroyActor(this.asteroids, asteroid);
    this.splitAsteroid(asteroid);
    this.updateHUD();
    this.shakeScreen();
  };

  Blasteroids.prototype.onPlayerCollectPowerup = function onPlayerCollectPowerup(powerup) {
    AudioPlayer.play(AudioPlayer.Blasteroids_PowerupCollected);

    var modifierData = powerup.modifier;
    var modifier = this.modifiers[modifierData.key];

    if (typeof modifierData.value === 'number') {
      modifier.value *= modifierData.value;
    } else {
      modifier.value = modifierData.value;
    }

    modifier.duration += modifierData.duration;

    this.stats.powerups++;

    this.shakeScreen();

    var numberOfParticles = this.random(30, 60);
    for (var i = 0; i < numberOfParticles; i++) {
      this.createParticle(powerup, {
        'colour': Math.random() > 0.5? powerup.powerup.fill : powerup.powerup.border
      });
    }

    this.destroyActor(this.powerups, powerup);
  };

  Blasteroids.prototype.checkCollisions = function checkCollisions() {
    var bullets = this.bullets;
    var asteroids = this.asteroids;
    var powerups = this.powerups;
    var isGodMode = this.modifiers.godmode.value && !this.modifiers.wreckingball.value;

    // First check player against powerups
    for (var i = 0; i < powerups.length; i++) {
      if (this.doCollide(this.player, powerups[i])) {
        this.onPlayerCollectPowerup(powerups[i]);
      }
    }

    // Then check asteroids with player or with bullets
    for (var i = 0; i < asteroids.length; i++) {
      var asteroid = asteroids[i];

      if (!isGodMode) {
        if (this.doCollide(this.player, asteroid)) {
          this.onPlayerHitByAsteroid(asteroid);
          break;
        }
      }

      for (var j = 0; j < bullets.length; j++) {
        if (this.doCollide(bullets[j], asteroid)) {
          this.onPlayerHitAsteroid(asteroid);
          this.stats.bulletsHit++;
          this.updateHUD();
          i--;
          
          if (!this.modifiers.piercingshots.value) {
            this.destroyActor(bullets, bullets[j]);
          }

          break;
        }
      }
    }
  };

  Blasteroids.prototype.doCollide = function doCollide(actorA, actorB) {
    if (!actorA.isActive || !actorB.isActive) {
      return false;
    }

    return !(
      actorA.x - actorA.halfSize > actorB.x + actorB.halfSize ||
      actorA.x + actorA.halfSize < actorB.x - actorB.halfSize ||
      actorA.y - actorA.halfSize > actorB.y + actorB.halfSize ||
      actorA.y + actorA.halfSize < actorB.y - actorB.halfSize
    );
  };

  Blasteroids.prototype.centrePlayer = function centrePlayer() {
    this.player.x = this.width / 2;
    this.player.y = this.height / 2;
  };

  Blasteroids.prototype.splitAsteroid = function splitAsteroid(asteroid) {
    if (asteroid.level < this.ASTEROID_MAX_SPLIT_LEVELS && 
        Math.random() < this.ASTEROID_CHANCE_TO_SPLIT) {
      var numberOfShareds = this.random(1, 2);
      for (var i = 0; i < numberOfShareds; i++) {
        this.createAsteroid(asteroid);
      }
    }

    var particlsRange = this.NUMBER_OF_PARTICLES[asteroid.level];
    if (particlsRange) {
      var numberOfParticles = this.random(particlsRange[0], particlsRange[1]);
      for (var i = 0; i < numberOfParticles; i++) {
        this.createParticle(asteroid);
      }
    }
  };

  Blasteroids.prototype.getNumberOfLives = function getNumberOfLives() {
    var value = this.modifiers.lives.value;
    var lives = 1;

    if (value === 1) {
      return lives;
    }

    value *= 2;

    while (true) {
      if (Math.pow(2, lives) === value) {
        return lives;
      }

      lives++;
    }
  };

  Blasteroids.prototype.updateHUD = function updateHUD() {
    var stats = this.stats;
    var hud = [];

    hud.push('Level: ' + (this.difficultyStep + 1) +
             ' | ' +
             'Score: ' + stats.asteroidsDestroyed);

    if (this.player.isActive) {
      var lives = this.modifiers.lives;
      hud.push(lives.name + ': ' + this.getNumberOfLives());

      for (var k in this.modifiers) {
        var modifier = this.modifiers[k];
        if (k === 'lives') {
          continue;
        }

        var duration = modifier.duration;
        if (duration) {
          duration = Math.round(duration * 10) / 10;
          
          if (duration % 1 === 0) {
            duration += '.0';
          }

          hud.push(modifier.name + ': ' + duration);
        }
      }
    } else {
      var accuracy = Math.min(Math.round((stats.bulletsHit / stats.bulletsFired) * 100), 100);
      
      if (!stats.bulletsFired) {
        accuracy = 0;
      }

      hud.push('--------------------');
      hud.push('Shots Fired... ' + stats.bulletsFired);
      hud.push('Accuracy...... ' + accuracy + '%');
      hud.push('Got Away...... ' + stats.asteroidsMissed);
      hud.push('Powerups...... ' + stats.powerups);
    }

    this.elHUD.innerHTML = hud.join('<br />');
  };

  Blasteroids.prototype.createPlayer = function createPlayer() {
    var actor = this.getActor(this.PLAYER_SIZE);

    this.player = actor;

    actor.isPlayer = true;
    actor.speed = this.PLAYER_SPEED * Math.min(this.width, this.height);
    actor.maxSpeed = this.PLAYER_MAX_SPEED;
    actor.rotationSpeed = this.PLAYER_ROTATION_SPEED;
    actor.maxRotationSpeed = this.PLAYER_MAX_ROTATION_SPEED;
    actor.drag = this.PLAYER_DRAG;
    actor.angularDrag = this.PLAYER_ANGULAR_DRAG;

    actor.colourFill = this.PLAYER_FILL;
    actor.colourBorder = this.PLAYER_BORDER;
    actor.shadowColor = this.GLOW? this.PLAYER_SHADOW_COLOR : 0;
    actor.shadowBlur = this.PLAYER_SHADOW_BLUR;
    actor.dent = this.PLAYER_DENT;

    actor.draw = this.drawPlayer;
  };

  Blasteroids.prototype.createAsteroid = function createAsteroid(sourceActor) {
    var level = sourceActor? sourceActor.level + 1 : 1;
    var size = this.random(this.ASTEROID_MIN_SIZE, this.ASTEROID_MAX_SIZE) / level;
    var actor = this.getActor(size, this.asteroids);
    var speed = this.random(this.ASTEROID_MIN_SPEED, this.ASTEROID_MAX_SPEED) * Math.min(this.width, this.height);
    var mid = size / 2;
    var angle = 0;
    var x = 0;
    var y = 0;
    var lineWidth = sourceActor? sourceActor.lineWidth * 0.75 : this.random(1, 2);

    if (sourceActor) {
      x = sourceActor.x;
      y = sourceActor.y;
      angle = this.random(0, Math.PI * 2);
      speed = sourceActor.currentSpeed.x * this.random(1.25, 1.75);
    } else {
      var isLeftRight = Math.random() > 0.75;
      var rand = Math.random() > 0.5;
      var isLeft = isLeftRight && rand;
      var isRight = isLeftRight && !rand;
      var isTop = !isLeftRight && rand;
      var isBottom = !isLeftRight && !rand;

      if (isLeftRight) {
        y = this.random(mid, this.height - mid);
      } else {
        x = this.random(mid, this.width - mid);
      }

      if (isLeft) {
        x = -mid + 1;
        angle = 0;
      } else if (isRight) {
        x = this.width + mid - 1;
        angle = Math.PI;
      } else if (isTop) {
        y = -mid + 1;
        angle = Math.PI / 2;
      } else if (isBottom) {
        y = this.height + mid - 1;
        angle = Math.PI * 1.5;
      }
    }

    actor.isAsteroid = true;
    actor.x = x;
    actor.y = y;
    actor.angle = angle;
    actor.rotation = this.random(0, Math.PI * 2);
    actor.currentSpeed.x = speed;
    actor.currentSpeed.y = speed * this.random(-0.25, 0.25);
    actor.currentDisplayRotationSpeed = this.random(-0.5, 0.5);
    actor.level = level;

    actor.lineWidth = lineWidth;
    actor.topX = this.random(-size * 0.25, size * 0.25);
    actor.rightY = this.random(-size * 0.25, size * 0.25);
    actor.bottomX = this.random(-size * 0.25, size * 0.25);
    actor.leftY = this.random(-size * 0.25, size * 0.25);

    actor.draw = this.drawAsteroid;
  };

  Blasteroids.prototype.createBullet = function createBullet(sourceActor) {
    var actor = this.getActor(this.BULLETS_SIZE, this.bullets);
    
    actor.isBullet = true;
    actor.x = sourceActor.x + (sourceActor.halfSize * Math.cos(sourceActor.angle));
    actor.y = sourceActor.y + (sourceActor.halfSize * Math.sin(sourceActor.angle));
    actor.angle = sourceActor.angle;
    actor.currentSpeed.x = sourceActor.currentSpeed.x + this.BULLETS_SPEED;
    actor.currentSpeed.y = sourceActor.currentSpeed.y;

    actor.draw = this.drawBullet;
  };

  Blasteroids.prototype.createParticle = function createParticle(sourceActor, options) {
    !options && (options = {});

    var size = this.random(this.PARTICLE_MIN_SIZE, this.PARTICLE_MAX_SIZE);
    var actor = this.getActor(size, this.particles);

    actor.isParticle = true;
    actor.x = sourceActor.x + this.random(-2, 2);
    actor.y = sourceActor.y + this.random(-2, 2);
    actor.currentSpeed.x = this.random(this.PARTICLE_MIN_SPEED, this.PARTICLE_MAX_SPEED);
    actor.angle = 'angle' in options? options.angle : this.random(0, Math.PI * 2);
    actor.ttl = 'ttl' in options? options.ttl : this.random(this.PARTICLE_MIN_LIFETIME, this.PARTICLE_MAX_LIFETIME);
    actor.colour = 'colour' in options? options.colour : this.PARTICLE_COLOURS[Math.floor(this.random(0, this.PARTICLE_COLOURS.length))];
    actor.thickness = 'thickness' in options? options.thickness : this.random(this.PARTICLE_MIN_THICKNESS, this.PARTICLE_MAX_THICKNESS);

    actor.draw = this.drawParticle;
  };

  Blasteroids.prototype.createPowerup = function createPowerup(type) {
    if (type === undefined) {
      type = Math.floor(this.random(0, this.powerupConfigs.length));
    }

    var powerup = this.powerupConfigs[type];
    var actor = this.getActor(powerup.size, this.powerups);

    actor.isPowerup = true;
    actor.x = this.random(actor.halfSize, this.width - actor.halfSize);
    actor.y = this.random(actor.halfSize, this.height - actor.halfSize);
    actor.currentRotationSpeed = powerup.rotationSpeed;
    actor.ttl = powerup.ttl;
    actor.modifier = powerup.modifier;
    actor.powerup = powerup;
    
    actor.draw = this.drawPowerup;

    AudioPlayer.play(AudioPlayer.Blasteroids_PowerupSpawned);
  };

  Blasteroids.prototype.getActor = function getActor(size, list) {
    var actor = {
      'x': 0,
      'y': 0,
      'currentSpeed': {
        'x': 0,
        'y': 0
      },
      'speed': {
        'x': 0,
        'y': 0
      },
      'maxSpeed': 0,
      'drag': 0,

      'angle': 0,
      'currentRotationSpeed': 0,
      'rotationSpeed': 0,
      'maxRotationSpeed': 0,
      'angularDrag': 0,

      'rotation': 0,
      'currentDisplayRotationSpeed': 0,

      'isActive': true,
      'size': size,
      'halfSize': size / 2,
      'ttl': Infinity,
      'destroyOutOfBounds': true
    };

    if (list) {
      list.push(actor);
    }

    return actor;
  };

  Blasteroids.prototype.rotateActorPoint = function rotateActorPoint(actor, x, y) {
    var sin = actor.sin;
    var cos = actor.cos;
    var cx = actor.x;
    var cy = actor.y;
    x += actor.x;
    y += actor.y;

    return [
      (cos * (x - cx)) - (sin * (y - cy)) + cx,
      (cos * (y - cy)) + (sin * (x - cx)) + cy
    ];
  };

  Blasteroids.prototype.drawActorPoints = function drawActorPoints(context, points) {
    var first = points[0];

    context.beginPath();

    context.moveTo(first[0], first[1]);
    for (var i = 1, len = points.length; i < len; i++) {
      context.lineTo(points[i][0], points[i][1]);
    }
    context.lineTo(first[0], first[1]);
  };

  Blasteroids.prototype.createBackground = function createBackground() {
    var canvas = this.el.querySelector('.background');

    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'background';
      this.el.appendChild(canvas);
    }

    var context = canvas.getContext('2d');
    var width = this.width;
    var height = this.height;

    canvas.width = width;
    canvas.height = height;

    // Black background
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    // White stars
    context.fillStyle = 'white';
    context.globalAlpha = Math.random() * 0.5 + 0.2;

    for (var i = 0; i < this.NUMBER_OF_STARS; i++) {
      if (Math.random() > 0.2) {
        context.globalAlpha = Math.random() * 0.5 + 0.15;
      }

      var size = Math.random() * 2.5;
      context.fillRect(Math.random() * width,
                       Math.random() * height,
                       size, size);
    }

    // Grid lines
    context.globalAlpha = 1;
    context.fillStyle = this.GRID_COLOUR;
    for (var i = 1; i < this.width / this.GRID_SIZE; i++) {
      context.fillRect(i * this.GRID_SIZE, 0, 1, this.height);
    }
    for (var i = 0; i < this.height / this.GRID_SIZE; i++) {
      context.fillRect(0, i * this.GRID_SIZE, this.width, 1);
    }
  };

  Blasteroids.prototype.resize = function resize() {
    var width = this.el.offsetWidth;
    var height = this.el.offsetHeight;

    if (!width || !height) {
      window.setTimeout(this.resize.bind(this), 20);
      return;
    }

    this.canvas.width = this.width = width;
    this.canvas.height = this.height = height;

    this.createBackground();
    this.createPlayer();
    this.centrePlayer();
  };
  
  Blasteroids.prototype.createHTML = function createHTML() {
    this.el.classList.add('blasteroids');

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    this.el.appendChild(this.canvas);

    this.elHUD = document.createElement('div');
    this.elHUD.className = 'hud';

    this.el.appendChild(this.elHUD);

    var elStyle = document.createElement('style');
    elStyle.type = 'text/css';
    elStyle.innerHTML = '.blasteroids {' +
                          'position: relative;' +
                          'display: none;' +
                          'user-select: none;' +
                          'cursor: nonae;' +
                        '}' +
                        '.blasteroids.visible {' +
                          'display: block;' +
                        '}' +
                          '.blasteroids canvas {' +
                            'position: absolute;' +
                            'top: 0;' +
                            'left: 0;' +
                            'z-index: 10;' +
                          '}' +
                          '.blasteroids .background {' +
                            'z-index: 2;' +
                          '}' +
                          '.blasteroids .hud {' +
                            'position: absolute;' +
                            'top: 0;' +
                            'left: 0;' +
                            'padding: 2px 6px 4px 3px;' +
                            'font-size: 11px;' +
                            'line-height: 1.1;' +
                            'color: rgba(0, 255, 0, .7);' +
                            'background: rgba(41, 12, 44, 0.5);' +
                            'font-family: "White Rabbit Regular", monospace;' +
                            'z-index: 30;' +
                            'transition: top 180ms ease-in-out,' +
                                        'transform 180ms ease-in-out;' +
                          '}' +
                          '.blasteroids.player-dead .hud {' +
                            'font-size: 12px;' +
                            'line-height: 1.2;' +
                            'padding-bottom: 8px;' +
                            'top: 100%;' +
                            'transform: translateY(-100%);' +
                            'background: rgba(41, 12, 44, 0.8);' +
                          '}';
    document.head.appendChild(elStyle);

    this.updateHUD();

    this.resize();
  };

  Blasteroids.prototype.random = function random(max, min) {
    return max + (Math.random() * (min - max));
  };

  return Blasteroids;
}());