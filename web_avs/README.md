# Web AVS

This directory contains a minimal JavaScript implementation of the
`vis_avs` visualizer which can run in modern browsers.

The implementation is intentionally simple and is meant to demonstrate how
AVS style "superscope" presets can be rendered using WebGL and the
Web Audio API. It is **not** feature complete when compared to the
original C++ plugin but provides enough functionality to experiment with
AVS style shapes.

## Usage

1. Install dependencies with `npm install` in this directory (requires
   Node.js).
2. Include `engine.js` in your webpage or bundler. The module exports a
   `WebAVS` class.
3. Create an audio element and a container where the visualization should
   appear.
4. Initialise `WebAVS` with a preset containing `init`, `frame`, `beat`
   and `point` expressions (similar to the original AVS Superscope).

See `example.html` for a minimal integration example.
