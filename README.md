# Child process exec argv
[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

`child-process-exec-argv` eases debugging of child process.

##Motivation
Debugging nodejs forked or clusterd child process can sometimes be difficult.
For example in visual studio code it almost comes out of the box.
You will find you need to change the argsv of your child process - code modifications.
It's not recommended for most projects to be framilier with the required code modification.

This is when this module comes in handy, it will do the dirty code modifications for you.

##Simple usage
The following usage should be enough to most projects.
```js
    const childProcessExecArgv = require('child-process-exec-argv');

    const subprocess = require('child_process').fork('subprocess.js' , [] , {
        execArgv : childProcessExecArgv.getExecArgv()
    });
```

##Advanced usage
This module come with some customization to enable usage to varity of integrations.

When requiring the `main` module you will recive a singlton for your convince , you can also you create a custome instance for better encapsulation/customization.

By default this module will identify the current process is being debugged and will request debugging on the child process.
You can overide this behavior by:
  * Excuting the main process with `child-debugger=disabled`.
  * Modifing the singlton property `childProcessExecArgv.childDebuggble = false`
  * By creating a custome `childProcessExecArgv`.

###Create a custome childProcessExecArgv

```js
    const {ChildProcessExecArgv} = require('child-process-exec-argv');
    const childProcessExecArgv = new ChildProcessExecArgv();

    //For example disable debugging only for this process
    childProcessExecArgv.childDebuggble = false;

    const subprocess = require('child_process').fork('subprocess.js' , [] , {
        execArgv : childProcessExecArgv.getExecArgv()
    });

```

##How to debug forked process in visual studio code
Altough visual studio code comes with a built in support for identifying child process and attaching to them, in some cases it will not manage the ports correctly.

The following changes will help you gainning child process debugging.

Add to your current process in `launch.json` the following paramter:
```js
 "autoAttachChildProcesses": true
```

Take exec argv for this module and forward it to the fork function
```js
    const childProcessExecArgv = require('child-process-exec-argv');

    const subprocess = require('child_process').fork('subprocess.js' , [] , {
        execArgv : childProcessExecArgv.getExecArgv()
    });
```

Happy debugging!

## License

  [MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/child-process-exec-argv.svg
[npm-url]: https://npmjs.org/package/child-process-exec-argv
[travis-image]: https://img.shields.io/travis/hisco/child-process-exec-argv/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/hisco/child-process-exec-argv
[coveralls-image]: https://coveralls.io/repos/github/hisco/child-process-exec-argv/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/hisco/child-process-exec-argv?branch=master

