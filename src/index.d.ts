
declare module ChildProcessExecArgv {
    export function getExecArgv():string[];
    export class ChildProcessExecArgv{
        constructor(process?:Process);
        getExecArgv():string[];
        process:Process;
        childDebuggble:boolean;
        inspectPort:number|string;
        childDebuggbleFlag:string;
    }
}

export = ChildProcessExecArgv;