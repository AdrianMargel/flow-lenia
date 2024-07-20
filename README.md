# flow-lenia
A modified implementation of Flow Lenia in WebGL.

This version takes a seed image as input and constrains the simulation according to that image. The settings for the image can be found in the settings.js file.

Scroll to zoom. Left/right click to add/remove mass. Middle click to introduce random mutations.

For simplicity, mutations will only be introduced at the edge of the image. This can also be adjusted in the settings.

Note that this version of Lenia is based off high-dimensional interference patterns rather than the original Affinity Map equation which most Lenia implementations use.

![butterfly](https://i.imgur.com/SlplOO1.png)
(sample seed image from [pexels](https://www.pexels.com/))