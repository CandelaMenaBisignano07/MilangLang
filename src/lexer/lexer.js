import { TokenTypes, arithmeticOperators, assignments, comparissonOperators, keywordsWithOpenCurlyBrackets, keywordsWithParenthesis,logicOperators, primitiveTypesKeywords, statementsKeywords} from "../constants.js";
import { LexicalError } from "../errors.js";
class Position{
    constructor(current_position, line, col){
        this.current_position = current_position
        this.line = line;
        this.col = col;
    }


    advance(number){
        this.current_position+=number
        this.col+=number
    }
    newLine(){
        this.current_position+=2
        this.col = 0
        this.line+=1
    }
}

class Token{
    constructor(type, value, line, col){
        this.type = type;
        this.value = value;
        this.line = line;
        this.col = col;
    }

    tokenToString(){
        return `${type}(${value}) line${line} col ${col}`
    }
}

export class Lexer{
    constructor(code, logger){ 
        this.code = code
        this.position = new Position(0, 1, 1)
        this.char = ''
        this.tokenArray = []
        this.logger = logger
        if(Lexer.instace === "object"){
            return Lexer.instace
        }
        Lexer.instance = this
        return this
    }

    checkIfNextCharItsAWhitespaceOrEOF(nextChar){
        return /\s/.test(nextChar) || !nextChar
    }

    genError(mssg, line,col){
        const error = new LexicalError(mssg, line, col)
        this.logger.add(error)
        return error
    }
    readReservedWords(line){
        let i = 0
        let error;
        const lastLengthTokenArray = this.tokenArray.at(-1).length
        const advanceChar=(tokenMap)=>{
            const type = tokenMap.get(this.char)
            const tokenIsPrimitive = typeof type === 'object'
            const token = new Token(tokenIsPrimitive ? type.type :type, tokenIsPrimitive ? type.value : this.char, this.position.line, this.position.col)
            this.tokenArray.at(-1).push(token)
            this.char = ''
            this.position.advance(1)
        }
        while(line[this.position.col-1] !== undefined && /[a-zA-Z0-9ñ\_]/.test(line[this.position.col-1])){
            const nextChar = line[this.position.col]
            const currChar = line[this.position.col-1]
            this.char+= currChar
            if([statementsKeywords.get('empanada'), statementsKeywords.get('dulceDeLeche')].includes(this.tokenArray.at(-1).at(-1)?.type)){
                if(!error && /[0-9]/.test(this.char[0])){
                    error = this.genError('identificador no puede empezar con numeros', this.position.line, this.position.col)
                }
                if((arithmeticOperators.has(this.char) || logicOperators.has(this.char) || assignments.has(this.char) ||comparissonOperators.has(this.char)|| keywordsWithOpenCurlyBrackets.has(this.char) || keywordsWithParenthesis.has(this.char) || primitiveTypesKeywords.has(this.char) || statementsKeywords.has(this.char)) && this.checkIfNextCharItsAWhitespaceOrEOF(nextChar)){
                    error = this.genError('identificador no puede ser una keyword', this.position.line, this.position.col)
                }
            }else if(arithmeticOperators.has(this.char) && this.checkIfNextCharItsAWhitespaceOrEOF(nextChar)){
                advanceChar(arithmeticOperators)
                break;
            }else if(logicOperators.has(this.char)&& this.checkIfNextCharItsAWhitespaceOrEOF(nextChar)){
                advanceChar(logicOperators)
                break;
            }else if(assignments.has(this.char)&& this.checkIfNextCharItsAWhitespaceOrEOF(nextChar)) {
                advanceChar(assignments)
                break;
            }else if(comparissonOperators.has(this.char)&& this.checkIfNextCharItsAWhitespaceOrEOF(nextChar)){
                advanceChar(comparissonOperators)
                break;
            }else if(keywordsWithOpenCurlyBrackets.has(this.char) && nextChar === "{"){
                advanceChar(keywordsWithOpenCurlyBrackets)
                break;
            }else if(keywordsWithParenthesis.has(this.char) && nextChar === "("){
                advanceChar(keywordsWithParenthesis)
                break;
            }else if(primitiveTypesKeywords.has(this.char) && (!(/[a-zA-Z0-9\_]/.test(nextChar)) ||this.checkIfNextCharItsAWhitespaceOrEOF(nextChar))){
                advanceChar(primitiveTypesKeywords)
                break;
            }else if(statementsKeywords.has(this.char) && this.checkIfNextCharItsAWhitespaceOrEOF(nextChar)){ 
                advanceChar(statementsKeywords)
                break;
            }
            this.position.advance(1)
            i++
        }
        if(error){
            this.tokenArray.at(-1).push(new Token(TokenTypes['ILLEGAL'], this.char, this.position.line, this.position.col))
            this.char = ''
            throw error
        }
        if(lastLengthTokenArray === this.tokenArray.at(-1).length){
            this.tokenArray.at(-1).push(new Token(TokenTypes['IDENTIFIER'], this.char, this.position.line, this.position.col))
            this.char = ''
        }
    }
    
    readString(line, lastQuotationMark){
        let error;
        let markCount = 1
        while(line[this.position.col-1] !== undefined){
            const currChar = line[this.position.col-1]
            const nextChar = line[this.position.col]
            if(/["']/.test(currChar)){ //si es una quotation mark
                if(currChar !== lastQuotationMark){ //si la linea es una quotation mark y es distinta
                    error = this.genError('el string esta mal cerrado', this.position.line, this.position.col)
                    this.char+=currChar
                    this.position.advance(1)
                    continue;
                }
                markCount++
                this.tokenArray.at(-1).push(new Token(TokenTypes['STRING'], this.char, this.position.line, this.position.col))
                break;
            }else if(/\\/.test(currChar)){
                const escapedCharacter = currChar+nextChar
                this.char+=escapedCharacter
                this.position.advance(2)
                continue;
            }
            this.char+=currChar
            this.position.advance(1)
        }
        if(error || (this.char.length < 1 && markCount !== 2) || markCount !== 2){
            console.log('ERROR STRINGGGG')
            error = error || this.genError('el string esta mal cerrado', this.position.line, this.position.col)
            this.tokenArray.at(-1).push(new Token(TokenTypes['ILLEGAL'], this.char, this.position.line, this.position.col))
            this.char = ''
            throw error
        }
        this.char = ''
    }

    readComment(line){
        while(line[this.position.col-1] !== undefined){
            this.position.advance(1)
        }
    }

    readNumber(line){
        let error;
        let dotCount = 0
        while(line[this.position.col-1] !== undefined && /[\.0-9-]/.test(line[this.position.col-1])){
            const currChar = line[this.position.col-1]
            if([statementsKeywords.get('empanada'), statementsKeywords.get('dulceDeLeche')].includes(this.tokenArray.at(-1).at(-1)?.type)){
                this.readReservedWords(line)
                this.char = ""
                break;
            }
        
            if(currChar === '-'){
                if(this.char.length !== 0){
                    error = this.genError('negativo mal puesto', this.position.line, this.position.col)
                }
                this.char+=currChar
            }
        
            if(currChar=== '.'){
                if(this.char.length === 0){
                    this.char+='0.'
                    dotCount++
                }else if(dotCount <1){
                    this.char+=currChar
                    dotCount++
                }else{
                    this.char+=currChar
                    dotCount++
                    error = this.genError('mas de dos puntos en el numero', this.position.line, this.position.col)
                    
                }
            }
            if(/[0-9]/.test(currChar)){
                this.char+=currChar
            }
            this.position.advance(1)
        }
        
        if(error){
            this.tokenArray.at(-1).push(new Token(TokenTypes['ILLEGAL'], this.char, this.position.line, this.position.col))
            this.char = ''
            throw error
        }
        if(this.char) {
            const numberIsInteger = +this.char / parseInt(this.char) === 0
            if(numberIsInteger){
                this.tokenArray.at(-1).push(new Token(TokenTypes['INTEGER'], +this.char, this.position.line, this.position.col))
            }else{
                this.tokenArray.at(-1).push(new Token(TokenTypes['FLOAT'], +this.char, this.position.line, this.position.col))
            }
        }
        this.char = ''
    }

    readLine(line){
        this.tokenArray.push([])
        while(line[this.position.col-1] !== undefined){
                const currChar = line[this.position.col-1]
                if(/\s/.test(currChar)){
                    this.position.advance(1)
                }else if(/[\(\)\{\}\,\[\]]/.test(currChar)){
                    this.tokenArray.at(-1).push(new Token(TokenTypes[currChar], currChar, this.position.line, this.position.col))
                    this.position.advance(1)
                }else if(/\#/.test(currChar)){
                    this.position.advance(1)
                    this.readComment(line)
                    this.position.advance(1)
                }else if(/[a-zA-Z]/.test(currChar)){
                    this.readReservedWords(line)
                }else if(/["']/.test(currChar)){
                    this.position.advance(1)
                    this.readString(line, currChar)
                    this.position.advance(1)
                }else if(/[-0-9]/.test(currChar)){
                    this.readNumber(line)
                }else{
                    const lastToken = this.tokenArray.at(-1).at(-1)
                    if(lastToken?.type === TokenTypes["ILLEGAL"]){ //si ya habia un token ilegal le suma el caracter actual
                        lastToken.value+=currChar
                        lastToken.col+=1
                        this.position.advance(1)
                    }else{
                        this.tokenArray.at(-1).push(new Token(TokenTypes['ILLEGAL'], currChar, this.position.line, this.position.col))
                    }
            }
        }
    }
    
    lex(){
        try {
            let indexLine = 0
            while(indexLine < this.code.length){
                this.readLine(this.code[this.position.line-1])
                indexLine+=1
                if(indexLine < this.code.length){
                    this.tokenArray.at(-1).push(new Token(TokenTypes['NEW_LINE'], '\r\n', this.position.line, this.position.col))
                    this.position.line+=1
                    this.position.col = 1
                }
            }
            this.tokenArray.at(-1).push(new Token(TokenTypes['EOF'], undefined, this.position.line, this.position.col+1))
        } catch (error) {
            if(!(error instanceof LexicalError)){
                this.logger.add(error)
            }
            console.log(error)
            throw new Error(error)
        }
    }
}