function ratingLabel(stars) {
  if (stars === 5) {
    return "favorite";
  } else if (stars > 3) {
    return "good";
  } else {
    return "skip";
  }
}

module.exports = { ratingLabel };
