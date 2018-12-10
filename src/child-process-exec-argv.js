class ChildProcessExecArgv{
    constructor(prs){
        this.process = prs || process;
        this.childDebuggble = true;
        this.inspectPort = 9229;
        this.childDebuggbleFlag = '--child-debugger';
        this.portAlgo = 'random';
        this.portIndex = 0;
    }
    getTestedPort(from , to , cb){
        let port = from;
        from++;

        if (from == to)
            cb(new Error('Cannot find a free port on the system'));

        let server = require('net').createServer()
        server.listen(port, ()=> {
            if (err){
                this.getPort(from , to , cb);
            }
            else{
                server.once('close', function onClose () {
                    cb(null,port)
                })
                server.close()
            }
        })
    }
    setPortIncrement(){
        this.portAlgo = 'increment';
    }
    setRandomPort(){
        this.portAlgo = 'random';
    }
    setStaticPort(){
        this.portAlgo = 'static';
    }
    syncGetPort(){
        if (this.portAlgo == 'increment'){
            return this.inspectPort + (this.portIndex++);
        }
        else if (this.portAlgo == 'random'){
            return Math.floor((Math.random() * 9999) + 9230);
        }
        else 
            return this.inspectPort;
    }
    async getPort(){
        if (this.portAlgo == 'increment'){
            return this.inspectPort + (this.portIndex++);
        }
        else if (this.portAlgo == 'random'){
            return await new Promise((resolve, reject)=>{
                this.getTestedPort(
                    Math.floor((Math.random() * 9999) + this.inspectPort),
                    9999,
                    (error,port)=>{
                        if (error){
                            reject(error)
                        }
                        else
                            resolve(port);
                    }
                )
            });
        }
        else 
            return this.inspectPort;
    }
    getFlag(){
        const flagArg = this.process.execArgv.find(arg=>arg.indexOf('--child-debugger=') ==0);
        if (flagArg){
            return (flagArg.indexOf('enabled')!=-1)
        }
        else return null;
    }
    syncGetExecArgv(userParams){
        const execArgv = [].concat(this.process.execArgv, userParams || []);
        const foundBrkIndex = execArgv.findIndex(arg =>arg.indexOf('--inspect-brk=')==0);
        const isChildRequestedDebug = foundBrkIndex !=-1;
        const childDebugFlag = this.getFlag();

        const childDebuggble = childDebugFlag == null ? this.childDebuggble : childDebugFlag;
        if (childDebuggble && isChildRequestedDebug){
            //Fix inspect
            execArgv[foundBrkIndex] = `--inspect-brk=${this.syncGetPort()}`;
        }
        else if (!childDebuggble&& isChildRequestedDebug){
            //Remove brk when needed
            execArgv.splice(foundBrkIndex,1);
        }

        return execArgv
    }
    async getExecArgv(userParams){
        const execArgv = [].concat(this.process.execArgv , userParams || []);
        const foundBrkIndex = execArgv.findIndex(arg =>arg.indexOf('--inspect-brk=')==0);
        const isChildRequestedDebug = foundBrkIndex !=-1;
        const childDebugFlag = this.getFlag();

        const childDebuggble = childDebugFlag == null ? this.childDebuggble : childDebugFlag;
        if (childDebuggble && isChildRequestedDebug){
            //Fix inspect
            execArgv[foundBrkIndex] = `--inspect-brk=${await this.getPort()}`;
        }
        else if (!childDebuggble&& isChildRequestedDebug){
            //Remove brk when needed
            execArgv.splice(foundBrkIndex,1);
        }

        return execArgv
    }
}

module.exports.ChildProcessExecArgv = ChildProcessExecArgv;