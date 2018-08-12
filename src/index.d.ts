
declare module ChildProcessExecArgv {
    export function getExecArgv():string[];
    export class ChildProcessExecArgv{
        constructor(process?:NodeJS.Process);
        getExecArgv():string[];
        process:NodeJS.Process;
        childDebuggble:boolean;
        inspectPort:number|string;
        childDebuggbleFlag:string;
    }
}

export = ChildProcessExecArgv;