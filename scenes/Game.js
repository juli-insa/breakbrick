// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("hello-world");
  }

  init() {
    // this is called before the scene is created
    // init variables
    // take data passed from other scenes
    // data object param {}
  }

  preload() {
    // Crea una textura circular en tiempo de ejecución
    this.graphics = this.make.graphics({x: 0, y: 0, add: false});
    this.graphics.fillStyle(0x00ff00, 1);
    this.graphics.fillCircle(20, 20, 20);
    this.graphics.generateTexture('circle', 40, 40);

    // Crea una textura rectangular roja
    this.graphics.clear();
    this.graphics.fillStyle(0xff0000, 1);
    this.graphics.fillRect(0, 0, 200, 50);
    this.graphics.generateTexture('rectangle', 200, 50);

    // Crea una textura rectangular azul para el obstáculo
    this.graphics.clear();
    this.graphics.fillStyle(0x0000ff, 1);
    this.graphics.fillRect(0, 0, 200, 50);
    this.graphics.generateTexture('rectangleBlue', 200, 50);
  }

  create() {
    // Velocidad inicial del círculo
    this.circleSpeed = 180;

    // Crear rectángulo físico controlable (rojo)
    this.rectangle = this.physics.add.image(400, 550, 'rectangle');
    this.rectangle.setImmovable(true);
    this.rectangle.setCollideWorldBounds(true);

    // Crear obstáculo azul (NO controlable)
    this.targetRect = this.physics.add.image(400, 300, 'rectangleBlue');
    this.targetRect.setImmovable(true);
    this.targetRect.setCollideWorldBounds(true);
    this.targetRect.setVelocity(0, 0);
    this.targetRect.body.allowGravity = false;

    // Usa un sprite físico con la textura circular
    this.circle = this.physics.add.image(400, 300, 'circle');
    this.circle.setCircle(20);
    this.circle.setCollideWorldBounds(true);
    this.circle.setBounce(1);

    // Asigna velocidad inicial aleatoria
    this.setCircleVelocity();

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();

    // Colisiones entre el círculo y el rectángulo controlable
    this.physics.add.collider(this.circle, this.rectangle);

    // Colisión con callback: mueve el obstáculo a una posición aleatoria y aumenta velocidad
    this.physics.add.collider(this.circle, this.targetRect, () => {
      // Oculta temporalmente el obstáculo
      this.targetRect.disableBody(true, true);

      // Aumenta la velocidad para la próxima vez
      this.circleSpeed += 300;

      // Espera un breve tiempo y reaparece en una posición aleatoria
      this.time.delayedCall(500, () => {
        // Calcula nueva posición aleatoria dentro de los límites del juego
        const x = Phaser.Math.Between(100, 700);
        const y = Phaser.Math.Between(100, 500);
        this.targetRect.enableBody(true, x, y, true, true);
        this.targetRect.setVelocity(0, 0);

        // Cambia la velocidad del círculo (dirección aleatoria)
       // this.setCircleVelocity();
      });
    }, null, this);
  }

  setCircleVelocity() {
    // Dirección aleatoria para x e y
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const vx = Math.cos(angle) * this.circleSpeed;
    const vy = Math.sin(angle) * this.circleSpeed;
    this.circle.setVelocity(vx, vy);
  }

  update() {
    // Controles de input para el rectángulo
    if (this.cursors.left.isDown) {
      this.rectangle.setVelocityX(-500);
    } else if (this.cursors.right.isDown) {
      this.rectangle.setVelocityX(500);
    } else {
      this.rectangle.setVelocityX(0);
    }
  }
}
