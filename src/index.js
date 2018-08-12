const {ChildProcessExecArgv} = require('./child-process-exec-argv');

module.exports = new ChildProcessExecArgv(process);
module.exports.ChildProcessExecArgv = ChildProcessExecArgv;