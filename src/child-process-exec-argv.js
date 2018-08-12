class ChildProcessExecArgv{
    constructor(prs){
        this.process = prs || process;
        this.childDebuggble = true;
        this.inspectPort = 9229;
        this.childDebuggbleFlag = '--child-debugger';
    }
    getFlag(){
        const flagArg = this.process.execArgv.find(arg=>arg.indexOf('--child-debugger=') ==0);
        if (flagArg){
            return (flagArg.indexOf('enabled')!=-1)
        }
        else return null;
    }
    getExecArgv(){
        const execArgv = [].concat(this.process.execArgv);
        const foundBrkIndex = execArgv.findIndex(arg =>arg.indexOf('--inspect-brk=')==0);
        const isChildRequestedDebug = foundBrkIndex !=-1;
        const childDebugFlag = this.getFlag();

        const childDebuggble = childDebugFlag == null ? this.childDebuggble : childDebugFlag;
        if (childDebuggble && isChildRequestedDebug){
            //Fix inspect
            execArgv[foundBrkIndex] = `--inspect-brk=${this.inspectPort}`;
        }
        else if (!childDebuggble&& isChildRequestedDebug){
            //Remove brk when needed
            execArgv.splice(foundBrkIndex,1);
        }

        return execArgv
    }
}

module.exports.ChildProcessExecArgv = ChildProcessExecArgv;