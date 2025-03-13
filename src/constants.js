export const TokenTypes= {
    "NEW_LINE":"NEW_LINE",
    "EOF":'EOF',
    "BLANK_SPACE":"BLANK_SPACE",
    "INTEGER": "INT",
    "FLOAT":"FLOAT",
    'IDENTIFIER':'IDENTIFIER',
    'QUOTATION_MARK': "QUOTATION_MARK",
    'ILLEGAL': "ILLEGAL",
    'STRING': 'STRING',
    "(": "OPEN_PARENTHESIS",
    ")": "CLOSE_PARENTHESIS",
    "{": "OPEN_CURLY_BRACKETS",
    "}":"CLOSE_CURLY_BRACKETS",
    ';': "SEMICOLON",
    ",":"COMMA",
    "[":"OPEN_BRACKETS",
    "]":"CLOSE_BRACKETS",
    "INDENTATION" : "INDENTATION",
    "DEDENTATION": 'DEDENTATION'
}

export const builtInFunctions = new Map([
    ["mantecol", "PUSH_KEYWORD"],
    ["bizcochuelo", "SPLIT_KEYWORD"],
    ["pastafrola", "POP_KEYWORD"],
    ['mateCocido', "LOG_KEYWORD"],
    ["mondongo", "LENGTH_KEYWORD"],
    ["pionono", "SPLICE_KEYWORD"]
])


export const keywordsWithParenthesis = new Map([
    ['mate',"FOR_KEYWORD"],
    ['terere', "WHILE_KEYWORD"],
    ['milanesa', "IF_KEYWORD"],
    ...builtInFunctions.entries()
    
])
export const keywordsWithOpenCurlyBrackets = new Map([
    ['provoleta', 'ELSE_KEYWORD']
])

export const primitiveTypesKeywords = new Map([
    ['medialuna', {type:'TRUE',value:true}],
    ['bolaDeFraile', {type:'FALSE',value:false}],
])
export const statementsKeywords = new Map([
    ['empanada',"LET_KEYWORD"],
    ['dulceDeLeche',"CONST_KEYWORD"],
    ['asado', 'FUNCTION_KEYWORD'],
    ['yerba', 'CONTINUE_KEYWORD'],
    ['alfajor', "RETURN_KEYWORD"],
    ['vitelTone', "CHANGE_VARIABLE_VALUE_KEYWORD"],
    ['provoleta', 'ELSE_KEYWORD'],
    ['mate',"FOR_KEYWORD"],
    ['terere', "WHILE_KEYWORD"],
    ['milanesa', "IF_KEYWORD"],
    ["librito", "OF_KEYWORD"],
    ['chinchulin', "FUNCTION_CALL_KEYWORD"],
])

export const assignments = new Map([
    ["choripan", "="],
    ["chimichurri", "+="],
    ["rogel", "-="],
    ["locro", "*="],
    ["sanguchitoDeMiga", "/="]
]);

export const arithmeticOperators = new Map([
    ["faina", "+"],
    ["chocotorta", "-"],
    ["fugazza", "*"],
    ["vacio", "/"],
    ["salsaCriolla", "%"]
]);

export const comparissonOperators = new Map([
    ["fernet", "==="],
    ["matambreALaPizza", "!=="],
    ["tortaFrita", ">"],
    ["vigilante", "<"],
    ["balcarce", ">="],
    ["cubanitos", "<="]
]);

export const logicOperators = new Map([
    ["pastelitosCriollos", "&&"],
    ["dulceDeBatata", "||"],
    ["humita", "!"]
]);

export const scopeTypes = {
    "WHILE_STMT": "LOOP_SCOPE",
    "FOR_STMT": "LOOP_SCOPE",
    "IF_STMT":"TERNARY_SCOPE",
    "FUNCTION_DEF_STMT": "FUNCTION_SCOPE"
}

