class AST{
    accept(visitor) {
        throw new Error("no se implemento accept(visitor) en la clase hija instanciada");
    }
};  

export class Program extends AST{
    constructor(){
        super();
        this.body = []
        this.global_scope = new Map([
            ["mateCocido", (...args)=> console.log(...args)],
            ["bizcochuelo", (obj, sep, limit)=> obj.split(sep, limit)],
            ["mantecol", (obj, ...args)=> obj.push( ...args)],
            ["pastafrola", (obj)=> obj.pop()],
            ["mondongo", (obj)=> obj.length],
            ["pionono", (obj, start,...args)=> obj.splice(start, ...args)]
        ])
    }
}

export class BinaryOp extends AST{
    constructor(left,op,right){
        super()
        this.left = left;
        this.type = 'BINARYOP'
        this.op = op;
        this.right = right
    }

    accept(visitor){
        return visitor.visit_binaryOp(this)
    }
};

export class Factor extends AST{
    constructor(token, type, value){
        super()
        this.token = token ?? null
        this.value = value ?? token.value 
        this.type = type ?? token.type
    }
    accept(visitor){
        return visitor.visit_factor(this)
    }
};

export class Block extends AST{
    constructor(scope_type){
        super()
        this.block = []
        this.scope = new Map()
        this.scope_type = scope_type
    }

    accept(visitor){
        return visitor.visit_block(this)
    }
};

export class UnaryOp extends AST{
    constructor(op,right){
        super()
        this.type = 'UNARYOP'
        this.op = op;
        this.right = right
    }

    accept(visitor){
        return visitor.visit_unaryOp(this)
    }
}
export class IdentifierDeclarationStmt extends AST{
    constructor(identifier_id, identifier_type=undefined, identifier_value = undefined){
        super()
        this.identifier_id = identifier_id
        this.identifier_value = identifier_value
        this.identifier_type = identifier_type
    }

    accept(visitor){
        return visitor.visit_identifier_declaration_stmt(this);
    }
};
export class IdentifierRef extends AST{
    constructor(identifier_id, index){
        super()
        this.identifier_id = identifier_id
        this.index = index
    }

    accept(visitor){
        return visitor.visit_identifier(this)
    }
};


export class TernaryOp extends AST{
    constructor(condition, then_block, else_block){
        super()
        this.condition = condition
        this.then_block = then_block
        this.else_block = else_block
    }
    accept(visitor){
        return visitor.visit_if_stmt(this)
    }
}
export class FunctionDefStmt extends AST{
    constructor(identifier,params, block){
        super()
        this.identifier = identifier
        this.params = params
        this.block = block
    }

    accept(visitor){
        return visitor.visit_function_def_stmt(this)
    }
}
export class FunctionCallStmt extends AST{
    constructor(identifier, argsValues){
        super()
        this.argsValues = argsValues;
        this.identifier = identifier;
    }

    accept(visitor){
        return visitor.visit_function_call_stmt(this)
    }
}

export class BuiltInFunction extends FunctionCallStmt{
    constructor(identifier, argsValues){
        super(identifier, argsValues)
    }

    accept(visitor){
        return visitor.visit_built_in_function_call_stmt(this)
    }
}

export class ReturnStmt extends AST{
    constructor(arg = undefined, type = undefined){
        super();
        this.arg = arg
        this.type = type
    }
    accept(visitor){
        return visitor.visit_return_stmt(this)
    }
}

export class ForOfStmt extends AST{
    constructor(identifier, iterable, block){
        super();
        this.identifier = identifier
        this.scope = new Map([[identifier.identifier_id, {value:identifier.identifier_value, type:identifier.identifier_type}]]);
        this.iterable = iterable
        this.block = block;
    }

    accept(visitor){
        return visitor.visit_for_of_stmt(this)
    }
}
export class WhileStmt extends AST{
    constructor(condition, block){
        super()
        this.condition = condition;
        this.block = block;
    }

    accept(visitor){
        return visitor.visit_while_stmt(this)
    }
}

export class AssignmentStmt extends AST{
    constructor(identifier, op, value, index){
        super()
        this.identifier = identifier;
        this.op = op;
        this.value = value;
        this.index = index;
    }

    accept(visitor){
        return visitor.visit_identifier_assignment_stmt(this)
    }
}

export class LogStmt extends AST{
    constructor(value){
        super();
        this.value = value;
    }

    accept(visitor){
        return visitor.visit_log_stmt(this)
    }
}