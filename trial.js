function first() {
  console.log('a');
  return false;
}

function second() {
  console.log('b');
  return true;
}

if (first() || second()) {
  console.log('c');
}
