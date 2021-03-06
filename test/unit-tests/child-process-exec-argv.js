const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-spies'));

const {ChildProcessExecArgv} = require('../../src/child-process-exec-argv');

describe('ChildProcessExecArgv' , ()=>{
    let childProcessExecArgv;
    let fakeProcess;
    beforeEach(()=>{
        fakeProcess = {
            execArgv : []
        };
        childProcessExecArgv = new ChildProcessExecArgv(fakeProcess);
    });

    describe('#setPortIncrement' , ()=>{
        it('Should set state portAlgo to increment', ()=>{
            childProcessExecArgv.setPortIncrement();

            expect(childProcessExecArgv.portAlgo).to.eq('increment');
        });
    });
    describe('#setRandomPort' , ()=>{
        it('Should set state portAlgo to random', ()=>{
            childProcessExecArgv.setRandomPort();

            expect(childProcessExecArgv.portAlgo).to.eq('random');
        });
    });
    describe('#setStaticPort' , ()=>{
        it('Should set state portAlgo to static', ()=>{
            childProcessExecArgv.setStaticPort();

            expect(childProcessExecArgv.portAlgo).to.eq('static');
        });
    });
    describe('#getFlag' , ()=>{
        it('Should be positive if flag exists and enabled', ()=>{
            fakeProcess.execArgv.push('--child-debugger=enabled');

            expect(childProcessExecArgv.getFlag()).to.eq(true);
        });
        it('Should be negetive if flag exists and not enabled', ()=>{
            fakeProcess.execArgv.push('--child-debugger=adf');

            expect(childProcessExecArgv.getFlag()).to.eq(false);
        });
        it('Should null if flag not exists', ()=>{

            expect(childProcessExecArgv.getFlag()).to.eq(null);
        });
    });

    describe('#syncGetPort' , ()=>{
        it('Should get incremented', ()=>{
            childProcessExecArgv.inspectPort = 1;
            childProcessExecArgv.portAlgo = 'increment';

            expect(childProcessExecArgv.syncGetPort()).to.eq(1);
            expect(childProcessExecArgv.syncGetPort()).to.eq(2);
        })
        it('Should get random', ()=>{
            childProcessExecArgv.inspectPort = 1;
            childProcessExecArgv.portAlgo = 'random';

            expect(childProcessExecArgv.syncGetPort()).not.to.eq(1);
        });
        it('Should get incremented', ()=>{
            childProcessExecArgv.inspectPort = 1;
            childProcessExecArgv.portAlgo = 'static';

            expect(childProcessExecArgv.syncGetPort()).to.eq(1);
            expect(childProcessExecArgv.syncGetPort()).to.eq(1);
        })
    });
    describe('#syncGetExecArgv' , ()=>{
        it('Should fix inspect by default if current process is requested with debug',()=>{
            fakeProcess.execArgv = [
                '--inspect-brk=10'
            ];

            childProcessExecArgv.setPortIncrement();
            const result = childProcessExecArgv.syncGetExecArgv();
            expect(result.length).to.eq(1);
            expect(result[0]).to.eq('--inspect-brk=' + childProcessExecArgv.inspectPort);
        });
        it('Should fix inspect if flag was enabled and if current process is requested with debug',()=>{
            fakeProcess.execArgv = [
                '--inspect-brk=10',
                '--child-debugger=enabled'
            ];

            childProcessExecArgv.setPortIncrement();
            const result = childProcessExecArgv.syncGetExecArgv();
            expect(result.length).to.eq(2);
            expect(result[0]).to.eq('--inspect-brk=' + childProcessExecArgv.inspectPort);
        });
        it('Shouldn\'t fix inspect if flag was disabled and if current process is requested with debug',()=>{
            fakeProcess.execArgv = [
                '--inspect-brk=10',
                '--child-debugger=disabled'
            ];

            childProcessExecArgv.setPortIncrement();
            const result = childProcessExecArgv.syncGetExecArgv();

            expect(result.length).to.eq(1);
            expect(result[0]).to.eq('--child-debugger=disabled');
        });
        it('Shouldn\'t fix inspect if flag not exists and if current process isn\'t requested with debug',()=>{
            fakeProcess.execArgv = [
            ];

            childProcessExecArgv.setPortIncrement();
            const result = childProcessExecArgv.syncGetExecArgv();

            expect(result.length).to.eq(0);
        });
    });


    describe('#getPort' , ()=>{
        it('Should get incremented', async ()=>{
            childProcessExecArgv.inspectPort = 1;
            childProcessExecArgv.portAlgo = 'increment';

            expect(await childProcessExecArgv.getPort()).to.eq(1);
            expect(await childProcessExecArgv.getPort()).to.eq(2);
        })
        it('Should get random', async ()=>{
            childProcessExecArgv.inspectPort = 1;
            childProcessExecArgv.portAlgo = 'random';

            expect(await childProcessExecArgv.getPort()).not.to.eq(1);
        });
        it('Should get incremented', async ()=>{
            childProcessExecArgv.inspectPort = 1;
            childProcessExecArgv.portAlgo = 'static';

            expect(await childProcessExecArgv.getPort()).to.eq(1);
            expect(await childProcessExecArgv.getPort()).to.eq(1);
        })
    });

    describe('#getExecArgv' , ()=>{
        it('Should fix inspect by default if current process is requested with debug',async ()=>{
            fakeProcess.execArgv = [
                '--inspect-brk=10'
            ];

            childProcessExecArgv.setPortIncrement();
            const result = await childProcessExecArgv.getExecArgv();
            expect(result.length).to.eq(1);
            expect(result[0]).to.eq('--inspect-brk=' + childProcessExecArgv.inspectPort);
        });
        it('Should fix inspect if flag was enabled and if current process is requested with debug',async ()=>{
            fakeProcess.execArgv = [
                '--inspect-brk=10',
                '--child-debugger=enabled'
            ];

            childProcessExecArgv.setPortIncrement();

            const result = await childProcessExecArgv.getExecArgv();
            expect(result.length).to.eq(2);
            expect(result[0]).to.eq('--inspect-brk=' + childProcessExecArgv.inspectPort);
        });
        it('Shouldn\'t fix inspect if flag was disabled and if current process is requested with debug', async ()=>{
            fakeProcess.execArgv = [
                '--inspect-brk=10',
                '--child-debugger=disabled'
            ];
            childProcessExecArgv.setPortIncrement();

            const result = await childProcessExecArgv.getExecArgv();
            expect(result.length).to.eq(1);
            expect(result[0]).to.eq('--child-debugger=disabled');
        });
        it('Shouldn\'t fix inspect if flag not exists and if current process isn\'t requested with debug',async ()=>{
            fakeProcess.execArgv = [
            ];
            childProcessExecArgv.setPortIncrement();

            const result = await childProcessExecArgv.getExecArgv();
            expect(result.length).to.eq(0);
        });
    });
});