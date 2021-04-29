exports.getRandomIntInclusive = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.range = (x,y) => Array.from((function*(){
  while (x <= y) yield x++;
})());
