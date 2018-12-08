
declare module ChildProcessExecArgv {
    export async function getExecArgv(userParams?:string[]):string[];
    export function syncGetExecArgv(userParams?:string[]):string[];
    export class ChildProcessExecArgv{
        constructor(process?:NodeJS.Process);
        async getExecArgv(userParams?:string[]):string[];
        syncGetExecArgv(userParams?:string[]):string[];
        process:NodeJS.Process;
        childDebuggble:boolean;
        inspectPort:number|string;
        childDebuggbleFlag:string;
    }
}

export = ChildProcessExecArgv;