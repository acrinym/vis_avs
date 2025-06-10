import * as THREE from 'three';

export class WebAVS {
  constructor({ audioElement, container, preset }) {
    this.audioElement = audioElement;
    this.container = container;
    this.preset = preset || {};
    this.vars = {};
  }

  async init() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.source = this.audioContext.createMediaElementSource(this.audioElement);
    this.analyser = this.audioContext.createAnalyser();
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);
    this.geometry = new THREE.BufferGeometry();
    this.points = new THREE.Points(this.geometry, new THREE.PointsMaterial({ size: 0.03, color: 0xffffff }));
    this.scene.add(this.points);
    this.camera.position.z = 2;
    this.setPreset(this.preset);
  }

  run(code) {
    if (!code) return;
    with (Math) {
      with (this.vars) {
        try { eval(code); } catch (e) { console.error(e); }
      }
    }
  }

  setPreset(preset) {
    this.preset = preset || {};
    this.vars = {};
    this.run(this.preset.init);
  }

  computePoints() {
    const n = this.vars.n || 300;
    const arr = [];
    for (let j = 0; j < n; j++) {
      this.vars.i = j / n;
      this.run(this.preset.point);
      arr.push(new THREE.Vector3(this.vars.x || 0, this.vars.y || 0, this.vars.z || 0));
    }
    return arr;
  }

  update() {
    if (this.preset.frame) {
      this.run(this.preset.frame);
    }
    const pts = this.computePoints();
    this.geometry.setFromPoints(pts);
  }

  animate() {
    this.update();
    this.points.rotation.x += 0.01;
    this.points.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(this.animate.bind(this));
  }

  start() {
    if (!this.renderer) {
      this.init().then(() => this.animate());
    } else {
      this.animate();
    }
  }

  stop() {
    cancelAnimationFrame(this.animationId);
  }
}
