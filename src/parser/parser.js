import { comparissonOperators, logicOperators, assignments,scopeTypes, builtInFunctions, TokenTypes, statementsKeywords, primitiveTypesKeywords } from "../constants.js"
import {ForOfStmt, FunctionDefStmt, Program, TernaryOp, BinaryOp, Block, UnaryOp, IdentifierDeclarationStmt, WhileStmt, Factor, AssignmentStmt, IdentifierRef, FunctionCallStmt, ReturnStmt, BuiltInFunction} from "../AstNodes.js"
import { SyntaxError } from "../errors.js"

export class Parser{
    constructor(code, logger){
        this.code = code
        this.look_ahead = 0
        this.logger=logger
        if(Parser.instace === "object"){
            return Parser.instace
        }
        Parser.instance = this
        return this
    }

    genError(mssg, line,col){
        const error = new SyntaxError(mssg, line, col)
        this.logger.add(error)
        throw error
    }

    match(char){
        if(this.code[this.look_ahead].type === char){
            return this.code[this.look_ahead++]
        }else{
            const token = this.code[this.look_ahead]
            this.genError(`el caracter actual ${char} no cumple con el tipo deseado`, token.line, token.col)
        }
    }

    matchAll(char){
        let i = 0
        while(this.code[this.look_ahead].type === char){
            this.match(char)
            i++
        }
        return i
    }

    count(char){
        let i = 0
        let fakeCount = this.look_ahead
        while(this.code[fakeCount].type === char){
            i++
            fakeCount++
        }
        return i
    }

    resolveBlock(scopeType){
        this.match(TokenTypes['{'])
        this.match(TokenTypes['NEW_LINE']);
        const block = this.block(scopeType);
        this.match(TokenTypes['}']);
        return block;
    }
    resolveBrackets(isForStmt){
        let expression;
        this.match(TokenTypes['('])
        if(isForStmt){
            let variable;
            switch(this.code[this.look_ahead].type){
                case statementsKeywords.get('empanada'):{
                    variable = this.variable_statement(true);
                    break;
                }
                case statementsKeywords.get('dulceDeLeche'):{
                    variable = this.constant_statement(true);
                    break;
                }
                default:{
                    return this.genError(`tipo no deseado`, this.code[this.look_ahead].line, this.code[this.look_ahead].col)
                }
            }
            this.match(statementsKeywords.get('librito'))
            const iterable = this.expr()
            expression = {iterable, variable}
            this.match(TokenTypes[')'])
        }else{
            if(this.code[this.look_ahead].type === TokenTypes[')']){
                this.match(TokenTypes[')'])
            }else{
                expression = this.expr();
                this.match(TokenTypes[')'])
            }
        }
        return expression
    }

    blockIsEmpty(){
        this.matchAll(TokenTypes['NEW_LINE'])
        return this.count(TokenTypes["}"]) > 0
    }

    args_val(isFunctionDef){
        if(this.code[this.look_ahead].type === TokenTypes[")"]) return []
        const firstElement = this.expr();
        let arr = [firstElement]
        while(this.code[this.look_ahead].type === TokenTypes[',']){
            this.match(TokenTypes[','])
            if(isFunctionDef){
                if(this.code[this.look_ahead].type !== "IDENTIFIER"){
                    return this.genError("si se define una funcion los identifiers deben no ser expresiones", this.code[this.look_ahead].line, this.code[this.look_ahead].col)
                }
            }
            const element = this.expr();
            arr.push(element)
        }
        return arr
    }

    program(){
        const program = new Program()
        while(this.code[this.look_ahead].type !== TokenTypes['EOF']){
            const linesCountBeginning = this.matchAll(TokenTypes["NEW_LINE"])
            if(linesCountBeginning === this.code.length-1){
                break;
            }
            const statement = this.statement()
            program.body.push(statement)
            const linesCountEnd = this.matchAll(TokenTypes['NEW_LINE'])
            if(linesCountEnd<1 && this.code[this.look_ahead].type !== TokenTypes['EOF']){
                return this.genError("tiene que haber por lo menos un salto de linea entre statements", this.code[this.look_ahead].line, this.code[this.look_ahead].col)
            }
        }
        return program
    }

    block(type){
        const block = new Block(type)
        if(this.blockIsEmpty()) return undefined
        let hasEnded = false
        while(!hasEnded){
            const statement = this.statement()
            let currToken = this.code[this.look_ahead]
            if(currToken.type !== TokenTypes["}"]){
                const linesCount =  this.matchAll(TokenTypes['NEW_LINE']) 
                if(linesCount < 1){ 
                    return this.genError("falto un salto de linea luego de tu statement", this.code[this.look_ahead].line, this.code[this.look_ahead].col)
                }
            }
            block.block.push(statement)
            currToken = this.code[this.look_ahead]
            if(currToken.type === TokenTypes['}']){
                hasEnded = true
            }
        }
        return block;
    }

    statement(){
        const currToken = this.code[this.look_ahead]
        switch (currToken.type) {
            case statementsKeywords.get('dulceDeLeche'):
                return this.constant_statement();
            case statementsKeywords.get('empanada'):
                return this.variable_statement();
            case statementsKeywords.get('vitelTone'):
                return this.expr()
            case statementsKeywords.get('milanesa'):
                return this.if_statement();
            case statementsKeywords.get('terere'):
                return this.while_statement();
            case statementsKeywords.get('mate'):
                return this.for_statement()
            case statementsKeywords.get('asado'):{
                return this.function_def_stmt();
            }
            case statementsKeywords.get('chinchulin'):{
                return this.function_call_stmt();
            }
            case statementsKeywords.get('alfajor'):{
                return this.return_stmt();
            }
            default:
                return this.genError(`tipo inesperado ${this.code[this.look_ahead],type}`, this.code[this.look_ahead].line, this.code[this.look_ahead].col)
        }
    }

    variable_statement(for_stmt){
        this.match(statementsKeywords.get('empanada'))
        const id = this.match(TokenTypes['IDENTIFIER']).value;
        if(for_stmt){
            if(this.code[this.look_ahead].type !== statementsKeywords.get("librito")){
                //si esta en un for of y el actual no es un of entonces no esta bien
                return this.genError('falta el of luego de declarar la variable', this.code[this.look_ahead].line, this.code[this.look_ahead].col)
            }
            return new IdentifierDeclarationStmt(id, 'VARIABLE')
        }
        if(this.code[this.look_ahead].type === TokenTypes['NEW_LINE']) {
            return new IdentifierDeclarationStmt(id, 'VARIABLE')
        }
        this.match(assignments.get("choripan"))
        const variableValue = this.expr();
        return new IdentifierDeclarationStmt(id, 'VARIABLE', variableValue)
    }
    

    constant_statement(for_stmt){
        this.match(statementsKeywords.get("dulceDeLeche"))
        const id = this.match(TokenTypes['IDENTIFIER']).value;
        if(for_stmt){
            if(this.code[this.look_ahead].type !== statementsKeywords.get("librito")) {
                return this.genError('falta el of luego de declarar la constante', this.code[this.look_ahead].line, this.code[this.look_ahead].col)
            }
            return new IdentifierDeclarationStmt(id, 'CONSTANT', undefined);
        }
        this.match(assignments.get("choripan"));
        const constantValue = this.expr();
        return new IdentifierDeclarationStmt(id, 'CONSTANT', constantValue);
    }

    if_statement(){
        const scopeType = scopeTypes["IF_STMT"]
        this.match(statementsKeywords.get('milanesa'));
        const condition = this.resolveBrackets()
        const then_block = this.resolveBlock(scopeType)
        const currentTokenType = this.code[this.look_ahead].type
        if(currentTokenType !== statementsKeywords.get('provoleta')){
            return new TernaryOp(condition, then_block, undefined)
        }
        this.matchAll(TokenTypes['NEW_LINE'])
        this.match(statementsKeywords.get('provoleta'))
        const else_block = this.resolveBlock(scopeType)
        return new TernaryOp(condition, then_block, else_block)
    }

    return_stmt(){
        this.match(statementsKeywords.get('alfajor'));
        if(this.code[this.look_ahead].type === "NEW_LINE"){
            return new ReturnStmt(undefined)
        }
        const arg = this.expr();
        return new ReturnStmt(arg)
    }

    variable_assignment_expression(){
        this.match(statementsKeywords.get('vitelTone'))
        const identifier = this.match(TokenTypes['IDENTIFIER'])
        const identifierRef = new IdentifierRef(identifier.value);
        let currToken = this.code[this.look_ahead]
        let index;
        if(currToken.type === TokenTypes['[']){
            this.match(TokenTypes['['])
            index = this.expr();
            this.match(TokenTypes[']'])
        }
        currToken = this.code[this.look_ahead]
        if(!assignments.has(currToken.value)){
            return this.genError(`tipo inesperado ${this.code[this.look_ahead].type}`, this.code[this.look_ahead].line, this.code[this.look_ahead].col)
        }
        const operator = assignments.get(currToken.value)
        this.match(operator)
        const variableValue = this.expr();
        return new AssignmentStmt(identifierRef, operator, variableValue, index);
    }   

    for_statement(){
        const scopeType = scopeTypes["FOR_STMT"]
        this.match(statementsKeywords.get('mate'))
        const {variable, iterable} = this.resolveBrackets(true)
        const block = this.resolveBlock(scopeType)
        return new ForOfStmt(variable, iterable, block);
    }
    while_statement(){
        const scopeType = scopeTypes["WHILE_STMT"]
        this.match(statementsKeywords.get('terere'));
        const condition = this.resolveBrackets()
        const block = this.resolveBlock(scopeType)
        return new WhileStmt(condition, block);
    }

    expr(){
        const node = this.logicExpr()
        return node
    }

    logicExpr(){
        let node = this.comparisonExpr()
        while([...logicOperators.values()].includes(this.code[this.look_ahead].type)){
            const op = this.code[this.look_ahead].type
            this.match(this.code[this.look_ahead].type)
            const nodeR = this.comparisonExpr()
            node = new BinaryOp(node, op, nodeR)
        }
        return node;
    }

    comparisonExpr(){
        let node = this.arithmeticExpr()
        while([...comparissonOperators.values()].includes(this.code[this.look_ahead].type)){
            const op = this.code[this.look_ahead].type
            this.match(this.code[this.look_ahead].type)
            const nodeR = this.arithmeticExpr()
            node = new BinaryOp(node, op, nodeR)
        }
        return node
    }
    arithmeticExpr(){
        let node = this.term()
        while(["+", "-"].includes(this.code[this.look_ahead].type)){
            const op = this.code[this.look_ahead].type
            this.match(this.code[this.look_ahead].type)
            const nodeR = this.term()
            node = new BinaryOp(node, op, nodeR)
        }
        return node
    }
    term(){
        let node = this.factor()
        while(["*", "/", "%"].includes(this.code[this.look_ahead].type)){
            const op = this.code[this.look_ahead].type
            this.match(this.code[this.look_ahead].type)
            const nodeR = this.factor()
            node = new BinaryOp(node, op, nodeR)
        }
        return node
    }
    factor(){
        switch(this.code[this.look_ahead].type){
            case "+":
            case "-":
            case logicOperators.get("humita"):{
                const op = this.code[this.look_ahead].type
                this.match(this.code[this.look_ahead].type)
                const nodeR = this.factor()
                return new UnaryOp(op, nodeR)
            }
            case TokenTypes["("]:{
                const node = this.resolveBrackets()
                return node
            }
            case TokenTypes['IDENTIFIER']:{
                const identifier = this.code[this.look_ahead]
                this.match(this.code[this.look_ahead].type)
                let index;
                if(this.code[this.look_ahead].type === TokenTypes["["]){
                    this.match(TokenTypes["["])
                    index = this.expr()
                    this.match(TokenTypes["]"])
                }
                return new IdentifierRef(identifier.value, index)
            }
            case TokenTypes['INTEGER']:
            case TokenTypes['FLOAT']:
            case TokenTypes['STRING']:
                const factor = this.code[this.look_ahead]
                this.match(this.code[this.look_ahead].type)
                return new Factor(factor)
            case statementsKeywords.get("vitelTone"):{
                return this.variable_assignment_expression()
            }
            case primitiveTypesKeywords.get('medialuna').type:
            case primitiveTypesKeywords.get('bolaDeFraile').type:{
                const boolean = this.code[this.look_ahead]
                this.match(this.code[this.look_ahead].type)
                return new Factor(boolean)
            }
            case TokenTypes["["]:{
                this.match(TokenTypes["["])
                const arr = this.args_val()
                this.match(TokenTypes["]"])
                return new Factor(undefined, "ARRAY", arr)
            }

            case statementsKeywords.get("chinchulin"):{
                return this.function_call_stmt()
            }
            default : {
                return this.genError(`tipo inesperado ${this.code[this.look_ahead].type}`, this.code[this.look_ahead].line, this.code[this.look_ahead].col)
            }
        }
    }

    built_in_function_call_stmt(identifier){
        if(!builtInFunctions.has(identifier)){
            return this.genError(`esto no es una built in function`, this.code[this.look_ahead].line, this.code[this.look_ahead].col)
        }
        const identifierKeywordType = builtInFunctions.get(identifier)
        this.match(identifierKeywordType);
        this.match(TokenTypes["("]);
        const args = this.args_val();
        this.match(TokenTypes[")"]);
        return new BuiltInFunction(identifier, args)
    }
    function_call_stmt(){
        this.match("FUNCTION_CALL_KEYWORD");
        if(builtInFunctions.has(this.code[this.look_ahead].value)){
            return this.built_in_function_call_stmt(this.code[this.look_ahead].value)
        }
        const identifier = this.match(TokenTypes["IDENTIFIER"]);
        const identifierRefInstance = new IdentifierRef(identifier.value)
        this.match(TokenTypes["("]);
        const args = this.args_val()
        this.match(TokenTypes[")"])
        return new FunctionCallStmt(identifierRefInstance, args)
    }

    function_def_stmt(){
        const scopeType = scopeTypes['FUNCTION_DEF_STMT']
        this.match(statementsKeywords.get('asado'))
        const identifierToken = this.match(TokenTypes['IDENTIFIER'])
        this.match(TokenTypes["("])
        let funcArgs = []
        while(this.code[this.look_ahead].type !== TokenTypes[")"]){
            if(funcArgs.length !== 0){
                this.match(TokenTypes[',']);
            }
            if(this.code[this.look_ahead].type !== TokenTypes['IDENTIFIER']) return this.genError(`el parametro debe ser de tipo identifier, no de tipo ${this.code[this.look_ahead].type}`, this.code[this.look_ahead].line, this.code[this.look_ahead].col)
            const value = new IdentifierDeclarationStmt(this.code[this.look_ahead].value, "VARIABLE", undefined);
            funcArgs.push(value);
            this.match(TokenTypes['IDENTIFIER']);
        }

        this.match(TokenTypes[")"])
        const block = this.resolveBlock(scopeType)
        const identifier = new IdentifierDeclarationStmt(identifierToken.value, "FUNCTION", block)
        return new FunctionDefStmt(identifier, funcArgs, block)
    }

    parse(){
        try {
            return this.program()
        } catch (error) {
            if(!(error instanceof SyntaxError)){
                this.logger.add(error)
            }
            throw new Error(error)
        }
    }
}