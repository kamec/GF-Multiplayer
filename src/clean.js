const path = require('path');

del(path.join(__dirname, '..', 'public', 'js'));

function del(dst) {
  require('del')([dst]);
}
