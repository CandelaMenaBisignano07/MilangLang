class ErrorMessage{
    constructor(message, line,col){
        this.message = message;
        this.line = line;
        this.col = col;
    }

    errorMessage(){
            if(!this.line || !this.col){
                return [`error: ${this.message}`]
            }
            else return [`error: ${this.message} \n
            at line ${this.line}
            at col ${this.col}
        `]
    }
}

export class SyntaxError extends ErrorMessage{
    constructor(message, line,col){
        super(message, line,col)
        this.syntaxErrorErrorsEnum = {
            
        }
    }
}
export class LexicalError extends ErrorMessage{
    constructor(message, line,col){
        super(message, line,col)
    }
}