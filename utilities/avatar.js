// utils/avatar.js
const avatars = [
  "avatar1.svg",
  "avatar2.svg",
  "avatar3.svg",
  "avatar4.svg",
  "avatar5.svg",
  "avatar6.svg",
  "avatar7.svg",
  "avatar8.svg",
  "avatar9.svg",
  "avatar10.svg",
  "avatar11.svg",
  "avatar12.svg",
];

const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * avatars.length);
  // Return the path to the avatar
  return `/avatars/${avatars[randomIndex]}`;
};


module.exports = getRandomAvatar;