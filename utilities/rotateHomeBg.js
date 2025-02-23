const background = document.querySelector("#background-container img");

// GSAP animation to rotate the background image
gsap.to(background, {
  rotation: 360, // Rotate 360 degrees
  duration: 20, // Duration of one full rotation (in seconds)
  repeat: -1, // Repeat indefinitely
  ease: "linear", // Smooth linear animation
});