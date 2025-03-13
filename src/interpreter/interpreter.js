import { builtInFunctions,  scopeTypes } from "../constants.js";
import { Block, ReturnStmt } from "../AstNodes.js";

export class Visitor {
    visit(node){
        return node.accept(this) 
    }
}

export class Interpreter extends Visitor { 
    constructor(logger) {
        super();
        this.symbolTablesStack = [];
        this.blockStack = [];
        this.logger = logger
        this.hasFunctionScopeBeenReached = true;
        if(Interpreter.instace === "object"){ 
            return Interpreter.instace
        }
        Interpreter.instance = this
        return this
    }
    interpret(parser) {
        try {
            this.symbolTablesStack.push(parser.global_scope)
            const newBlock = new Block("GLOBAL")
            newBlock.block = parser.body
            newBlock.scope = parser.global_scope
            this.blockStack.push(newBlock)
            for(let statement of parser.body){
                this.visit(statement)
            }
        } catch (error) {
            this.logger.add(error)
            throw new Error(error)
        }
    }

    lastScopeHasIdentifier(identifier){
        let i = -1
        let block = this.blockStack.at(i)
        while(block.scope_type === scopeTypes['FUNCTION_DEF_STMT']){
            i--
            block = this.blockStack.at(i)
        }
        return block.scope.has(identifier) && block.scope_type !== "GLOBAL"
    }

    findLastIdentifierOnScope(identifier){
        for(let i = this.symbolTablesStack.length-1; i>=0; i--){
            if(this.symbolTablesStack[i].has(identifier)){
                    return this.symbolTablesStack[i]
                }
            }
        return false
    }

    isBlockChildOfFunctionScope(){
        for(let i = this.blockStack.length-1; i>=0; i--){
            if(this.blockStack[i].scope_type === scopeTypes['FUNCTION_DEF_STMT']) return true
        }
        return false;
    }

    visit_factor(node) {
        if(node.type === 'ARRAY'){
            node.value = node.value.map((arg)=> this.visit(arg));
        }else if(node.type === 'STRING'){
            function parseEscapes(str) {
                return str.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, "\"").replace(/\\'/g, "\'")
            }
            return parseEscapes(node.value)
        }
        return node.value;
    }

    visit_identifier(node){
        const identifierId = node.identifier_id;
        const symbolTable = this.findLastIdentifierOnScope(identifierId);
        const identifierValue = symbolTable && symbolTable.get(identifierId);
        if(!identifierValue){
            throw new Error(`identificador ${identifierId} no existe`);
        }
        
        if(node.index !== undefined){
            const index = this.visit(node.index)
            if(identifierValue !== null && typeof identifierValue.value[Symbol.iterator] === 'function'){
                return  identifierValue.value[index];
            }else throw new Error('el objeto al que queres acceder con el indice no es iterable')
        }
        return identifierValue.value
    }

    visit_identifier_declaration_stmt(node){
        const lastScope = this.symbolTablesStack.at(-1);
        if(this.lastScopeHasIdentifier(node.identifier_id) || (lastScope.has(node.identifier_id) && this.blockStack.at(-1).scope_type !== 'FUNCTION_SCOPE')){
            throw new Error("ya hay un identifier con este nombre en el scope actual");
        }
        let identifierValue;
        if(node.identifier_type === "FUNCTION"){
            identifierValue = node.identifier_value;
        }else{
            identifierValue = node.identifier_value && this.visit(node.identifier_value);
        }
        const scopeObj = {
            type:node.identifier_type, 
            value:identifierValue
        }
        lastScope.set(node.identifier_id, scopeObj);
    }

    visit_identifier_assignment_stmt(node){
        const identifierId = node.identifier.identifier_id;
        const symbolTable = this.findLastIdentifierOnScope(node.identifier.identifier_id)
        const oldIdentifier = symbolTable.get(identifierId)
        if(oldIdentifier.type !== "VARIABLE"){
            throw new Error("solo se puede reasignar valor a una variable")
        }
        let assignmentValue = this.visit(node.value);
        let index;
        if(node.index !== undefined ) {
            if(typeof oldIdentifier.value !== "object"){ 
                throw new Error('solo se puede modificar por indice los arrays')
            }
            index = this.visit(node.index);
        }
        switch(node.op){
            case "=":
                if(index !== undefined){
                    oldIdentifier.value[index] = assignmentValue
                    assignmentValue = oldIdentifier.value
                    symbolTable.set(identifierId,{...oldIdentifier, value:assignmentValue})
                    break
                }
                symbolTable.set(identifierId, {...oldIdentifier, value:assignmentValue})
                break;
            case "+=":
                if(index !== undefined){
                    oldIdentifier.value[index] += assignmentValue
                    assignmentValue = oldIdentifier.value
                    symbolTable.set(identifierId,{...oldIdentifier, value:assignmentValue})
                    break
                }
                symbolTable.set(identifierId,{...oldIdentifier, value:oldIdentifier.value + assignmentValue})
                break;
            case "-=":
                if(index !== undefined){
                    oldIdentifier.value[index] -= assignmentValue
                    assignmentValue = oldIdentifier.value
                    symbolTable.set(identifierId,{...oldIdentifier, value:assignmentValue})
                    break
                }
                symbolTable.set(identifierId,{...oldIdentifier, value:oldIdentifier.value - assignmentValue})
                break;
            case "*=":
                if(index !== undefined){
                    oldIdentifier.value[index] *= assignmentValue
                    assignmentValue = oldIdentifier.value
                    symbolTable.set(identifierId,{...oldIdentifier, value:assignmentValue})
                    break
                }
                symbolTable.set(identifierId,{...oldIdentifier, value:oldIdentifier.value * assignmentValue})
                break;
            case "/=":
                if(index !== undefined){
                    oldIdentifier.value[index] += assignmentValue
                    assignmentValue = oldIdentifier.value
                    symbolTable.set(identifierId,{...oldIdentifier, value:assignmentValue})
                    break

                }
                symbolTable.set(identifierId,{...oldIdentifier, value:oldIdentifier.value / assignmentValue})
                break;
            default:{
                throw new Error(`unexpected type ${node.op}`)
            }
        }
    }
    visit_block(node){
        const blockArray = node.block
        this.blockStack.push(node)
        this.symbolTablesStack.push(node.scope)
        if(!this.hasFunctionScopeBeenReached && this.blockStack.at(-1).scope_type === scopeTypes['FUNCTION_DEF_STMT']) this.hasFunctionScopeBeenReached = true
        
        let res;
        for(let statement of blockArray){
            if(!this.hasFunctionScopeBeenReached){
                break;
            }
            res = this.visit(statement);
            if(statement instanceof ReturnStmt){
                if(this.isBlockChildOfFunctionScope()){
                    this.hasFunctionScopeBeenReached = false
                    break;
                }else{
                    throw new Error('return fuera del scope de una funcion')
                }
            }
            if(res !== undefined){
                break;
            }
        }
        node.scope.clear()
        this.symbolTablesStack.pop()
        this.blockStack.pop()
        return res === undefined ? node : res
    }

    visit_return_stmt(node){
        const isChildOfFunctionScope = this.isBlockChildOfFunctionScope()
        if(!isChildOfFunctionScope) throw new Error("return ilegal, tiene que estr dentro de una funcion");
        const val = node.arg === undefined ? node.arg : this.visit(node.arg)
        if(val === undefined) throw new Error('el return debe retornar un valor')
        return val;
    }
    visit_for_of_stmt(node){
        const identifierId = node.identifier.identifier_id
        const forOfSymbolTable = node.scope;
        const forOfBlockSymbolTable = node.block.scope;
        this.symbolTablesStack.push(forOfSymbolTable)
        let iterable = this.visit(node.iterable)
        if(!iterable.length) throw new Error("esto no es un iterable xd");
        let res;
        for(let i=0; i<iterable.length; i++){
            this.symbolTablesStack.push(forOfBlockSymbolTable)
            forOfSymbolTable.set(identifierId, {type:node.identifier.identifier_type, value:iterable[i]})
            res = this.visit(node.block)
            if(typeof res !== 'object' && !this.hasFunctionScopeBeenReached){
                break;
            }
            forOfBlockSymbolTable.clear()
        }
        this.symbolTablesStack.pop()
        this.symbolTablesStack.pop()
        return res instanceof Block ? undefined : res
    }
    visit_while_stmt(node){
        let condition = this.visit(node.condition);
        const blockSymbolTable = node.block.scope
        this.symbolTablesStack.push(blockSymbolTable);
        let res;
        while(condition){
            res = this.visit(node.block);
            if(typeof res !== 'object' && !this.hasFunctionScopeBeenReached){ // si no es un block o alguna clase entonces nos esta retornando algo
                break;
            }
            blockSymbolTable.clear()
            condition = this.visit(node.condition);
        }
        this.symbolTablesStack.pop()
        return res instanceof Block ? undefined : res
    }
    visit_if_stmt(node){
        let res;
        let condition = this.visit(node.condition);
        if(condition){
            this.symbolTablesStack.push(node.then_block.scope)
            res = this.visit(node.then_block);
            this.symbolTablesStack.pop()
        }else{
            if(node.else_block){
                this.symbolTablesStack.push(node.else_block.scope)
                res = this.visit(node.else_block);
                this.symbolTablesStack.pop()
            }
        }
        return res instanceof Block ? undefined : res
    }
    visit_built_in_function_call_stmt(node){
        const identifier = node.identifier;
        const symbolTable = this.symbolTablesStack.at(0);
        let vals = []
        const identifierFunction = symbolTable.get(identifier)
        for(const argVal of node.argsValues){
            const value = this.visit(argVal)
            vals.push(value)
        }
        if(identifier === "mateCocido"){
            this.logger.add(vals)
        }
        return identifierFunction(...vals)
    }

    visit_function_call_stmt(node){
        if(builtInFunctions.has(node.identifier.identifier_id)){
            throw new Error('la funcion lleva el nombre de una built in function, porfavor cambielo')
        }
        const identifier = this.visit(node.identifier) //EL BLOQUE DE LA REFERENCIA DEL IDENTIFICADOR DE LA FUNCION
        let vals = []
        for(const argVal of node.argsValues){
            const value = this.visit(argVal)
            vals.push(value)
        }
        let count = 0
        
        const functionBlockCopy = new Block() //CREAMOS UNA COPIA DE ESA REFERENCIA PARA NO MODIFICAR LA REFERENCIA ORIGINAL
        functionBlockCopy.block = identifier.block
        functionBlockCopy.scope_type = identifier.scope_type
        for(const [key,value] of identifier.scope.entries()){ 
            const val = vals.at(count);
            const newVal = {...value, value:val}
            functionBlockCopy.scope.set(key,newVal)
            count++
        }
        this.symbolTablesStack.push(functionBlockCopy.scope)
        let res = this.visit(functionBlockCopy)
        if(!(res instanceof Block)) { 
            this.symbolTablesStack.pop()
            this.hasFunctionScopeBeenReached = true
        }
        return res instanceof Block ? undefined : res
    }

    visit_function_def_stmt(node){
        this.symbolTablesStack.push(node.block.scope)
        for(const param of node.params){
            this.visit(param)
        }
        this.symbolTablesStack.pop()
        this.visit(node.identifier);
    }

    visit_unaryOp(node){
        const rightNode = this.visit(node.right)
        switch (node.op) {
            case "+":
                return +rightNode
            case "-":
                return -rightNode;
            case "!":
                return !rightNode
        }
    }

    visit_binaryOp(node) {
        const leftNode = this.visit(node.left);
        const rightNode = this.visit(node.right);
        switch (node.op) {
            case "+":
                return leftNode + rightNode;
            case "-":
                return leftNode - rightNode;
            case "/":
                return leftNode / rightNode;
            case "*":
                return leftNode * rightNode;
            case "%":
                return leftNode % rightNode
            case "===":
                return leftNode === rightNode;
            case "<":
                return leftNode < rightNode;
            case ">":
                return leftNode > rightNode;
            case ">=":
                return leftNode >= rightNode;
            case "<=":
                return leftNode <= rightNode;
            case '!==':
                return leftNode !== rightNode;
            case '||':
                return leftNode || rightNode
            case '&&':
                return leftNode && rightNode
            default:
                throw new Error("Operador desconocido: " + node.op.type);
        }
    }
    
}