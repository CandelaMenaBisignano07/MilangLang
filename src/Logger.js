export class Logger{
    constructor(){
        this.logs = []
        if(typeof Logger.instance === 'object'){
            return Logger.instance
        }
        Logger.instance = this
        return this
    }
    add(log){
        this.logs.push(log)
    }
    get(){
        return this.logs
    }
    clear(){
        this.logs = []
    }
}