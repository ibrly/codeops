// Turns a 1-5 star rating into a label shown next to each song.
function ratingLabel(stars) {
  if (stars >= 3) {
    return "good";
  } else if (stars === 5) {
    return "favorite";
  } else {
    return "skip";
  }
}

module.exports = { ratingLabel };
