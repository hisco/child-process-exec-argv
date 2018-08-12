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
    describe('#getExecArgv' , ()=>{
        it('Should fix inspect by default if current process is requested with debug',()=>{
            fakeProcess.execArgv = [
                '--inspect-brk=10'
            ];

            const result = childProcessExecArgv.getExecArgv();
            expect(result.length).to.eq(1);
            expect(result[0]).to.eq('--inspect-brk=' + childProcessExecArgv.inspectPort);
        });
        it('Should fix inspect if flag was enabled and if current process is requested with debug',()=>{
            fakeProcess.execArgv = [
                '--inspect-brk=10',
                '--child-debugger=enabled'
            ];

            const result = childProcessExecArgv.getExecArgv();
            expect(result.length).to.eq(2);
            expect(result[0]).to.eq('--inspect-brk=' + childProcessExecArgv.inspectPort);
        });
        it('Shouldn\'t fix inspect if flag was disabled and if current process is requested with debug',()=>{
            fakeProcess.execArgv = [
                '--inspect-brk=10',
                '--child-debugger=disabled'
            ];

            const result = childProcessExecArgv.getExecArgv();
            expect(result.length).to.eq(1);
            expect(result[0]).to.eq('--child-debugger=disabled');
        });
        it('Shouldn\'t fix inspect if flag not exists and if current process isn\'t requested with debug',()=>{
            fakeProcess.execArgv = [
            ];

            const result = childProcessExecArgv.getExecArgv();
            expect(result.length).to.eq(0);
        });
    });
});