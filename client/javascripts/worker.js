onmessage = function(e) {
  console.log('im worker');
  console.log('here is data ive recived: ', e.data);
  e.data.a = 'bb';
  postMessage({z: 'xdd'});
}