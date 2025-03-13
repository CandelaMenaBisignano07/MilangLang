import * as monaco from "monaco-editor"
import { assignments, arithmeticOperators, comparissonOperators, logicOperators, primitiveTypesKeywords, builtInFunctions, statementsKeywords } from "./constants";
import { Lexer } from "./lexer/lexer.js";
import { Parser } from "./parser/parser.js";
import { Interpreter} from "./interpreter/interpreter.js";
import { Logger } from "./Logger.js";
import { LexicalError,SyntaxError } from "./errors.js";

monaco.languages.register({ id: 'esolang' });

const keywords = Array.from(statementsKeywords.keys());
const builtInFunctionsList = Array.from(builtInFunctions.keys());
const primitiveTypes = Array.from(primitiveTypesKeywords.keys());
const operators = [
    ...Array.from(assignments.keys()),
    ...Array.from(arithmeticOperators.keys()),
    ...Array.from(comparissonOperators.keys()),
    ...Array.from(logicOperators.keys())
];

monaco.languages.setMonarchTokensProvider('esolang', {
    keywords: keywords,
    builtinFunctions: builtInFunctionsList,
    primitiveTypes: primitiveTypes,
    operators: operators,
    true:['medialuna'],
    false:['bolaDeFraile'],
    /**[a-zA-Z0-9_]+\(([a-zA-Z0-9_]*|[a-zA-Z0-9_]+(,[a-zA-Z0-9_]+)*)\) */
    /*/(?<=chinchulin )([a-zA-Z0-9_]+)/*/
    /*/[a-zA-Z0-9_]+\(.*\)/ */
    tokenizer: {
        root: [
            [/[a-zA-Z_]\w*/, {
                cases: {
                    '@keywords': 'keyword',
                    '@builtinFunctions': 'builtinFunction',
                    '@true': 'true',
                    '@false': 'false',
                    '@operators': 'operator'
                }
            }],
            [/\d+\.\d+/, 'number.float'],
            [/\d+/, 'number.integer'],
            [/["']([^"'\\]|\\.)*["']/, 'string'],
            [/#.*/, 'comment'],
            { include: '@whitespace' },
        ],

        whitespace: [
            [/[ \t\r\n]+/, 'white'],
            [/^\s*/, 'white']
        ]
    }
});
monaco.editor.defineTheme('esolangTheme', {
    base: 'vs-dark',
    inherit: true,
    rules: [
        { token: 'keyword', foreground: '569CD6' },
        { token: 'true', foreground: '4EC9B0' },
        { token: 'false', foreground: 'FF5733' },
        { token: 'builtinFunction', foreground: '#DCDCAA' },
        { token: 'operator', foreground: 'D4D4D4' },
        { token: 'number.float', foreground: 'B5CEA8' },
        { token: 'number.integer', foreground: 'B5CEA8' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'white', foreground: 'FFFFFF' },
        {token:"comment", foreground:'#6A9955'}
    ],
    colors: {
        'editor.background': '#1E1E1E'
    },
});

const builtInFunctionsCompletion = (range, isFunctionCallCompletion)=>[
    {
        label: '"mantecol"',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "El push de milangLang.\nchinchulin mantecol (arr:any[],...items: any[]): number",
        insertText: isFunctionCallCompletion ? 'mantecol(arr, ...args)' : 'chinchulin mantecol(arr, ...args)',
        insertTextRules:monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range,
    },
    {
        label: '"bizcochuelo"',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "El split de milangLang.\nchinchulin bizcochuelo(arr:any[], sep:string,limit?:number): string[]",
        insertText:  isFunctionCallCompletion ?'bizcochuelo(arr, sep, limit)':'chinchulin bizcochuelo(arr, sep, limit)',
        insertTextRules:monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range,
    },
    {
        label: '"pastafrola"',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "El pop de milangLang.\nchinchulin pastafrola(arr:any[]): any|undefined",
        insertText:  isFunctionCallCompletion ?'pastafrola(arr)':'chinchulin pastafrola(arr)',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range,
    },
    {
        label: '"mateCocido"',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "El console.log de milangLang.\n chinchulin mateCocido(...args:any[])",
        insertText:  isFunctionCallCompletion ?'mateCocido(...args)':'chinchulin mateCocido(...args)',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range,
    },
    {
        label: '"mondongo"',
        kind: monaco.languages.CompletionItemKind.Property,
        documentation: "El length de milangLang.\n chinchulin mondongo(iterable:string|any[]):number",
        insertText:  isFunctionCallCompletion ?'mondongo(iterable)':'chinchulin mondongo(iterable)',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range,
    },
    {
        label: '"pionono"',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "El splice de milangLang.\n chinchulin mondongo(arr:any[], start:number, deleteCount?:number, ...args:any[]):any[]",
        insertText:  isFunctionCallCompletion ?'pionono(arr, start, deleteCount, ...items)': 'chinchulin pionono(arr, start, deleteCount, ...items)',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range,
    }
]

function createDependencyProposals(range, word) {
    if(/.*chinchulin /.test(word)){
            return builtInFunctionsCompletion(range, true)
    }else{
            return [
                ...builtInFunctionsCompletion(range),
                {
                        label: '"empanada"',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        documentation: "Declaración de variable en milangLang",
                        insertText: 'empanada',
                        range: range,
                    },
                    {
                        label: '"dulceDeLeche"',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        documentation: "Declaración de constante en milangLang",
                        insertText: 'dulceDeLeche',
                        range: range,
                    },
                    {
                        label: '"asado"',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        documentation: "Definición de función en milangLang",
                        insertText: 'asado nombreFuncion() {\n\t$0\n}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        range: range,
                    },
                    {
                        label: '"alfajor"',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        documentation: "return en milangLang ",
                        insertText: 'alfajor',
                        range: range,
                    },
                    {
                        label: '"vitelTone"',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        documentation: "Cambia el valor de una variable en en milangLang",
                        insertText: 'vitelTone identificador choripan nuevoValor',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        range: range,
                    },
                    {
                        label: '"provoleta"',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        documentation: "El else en milangLang",
                        insertText: 'provoleta {\n\t$0\n}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        range: range,
                    },
                    {
                        label: '"mate"',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        documentation: "Bucle for de milangLang",
                        insertText: 'mate(empanada variable librito iterable){\n\t$0\n}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        range: range,
                    },
                    {
                        label: '"terere"',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        documentation: "Bucle while de milangLang",
                        insertText: 'terere(condicion){\n\t$0\n}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        range: range,
                    },
                    {
                        label: '"milanesa"',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        documentation: "El if en milangLang",
                        insertText: 'milanesa(condicion){\n\t$0\n}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        range: range,
                    },
                    {
                        label: '"librito"',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        documentation: "El of de un bucle for en milangLang",
                        insertText: 'librito',
                        range: range,
                    },
                    {
                        label: '"chinchulin"',
                        kind: monaco.languages.CompletionItemKind.Function,
                        documentation: "Llamada a cualquier funcion, ya sea built-in o declarada por el usuario.",
                        insertText: 'chinchulin',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        range: range,
                    },
                    {
                        label: '"medialuna"',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        documentation: "Booleano true en milangLang",
                        insertText: 'medialuna',
                        range: range,
                    },
                    {
                        label: '"bolaDeFraile"',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        documentation: "Booleano false en milangLang",
                        insertText: 'bolaDeFraile',
                        range: range,
                    },
                    {
                        label: '"choripan"',
                        kind: monaco.languages.CompletionItemKind.Operator,
                        documentation: "Asignación de valor a una variable en milangLang",
                        insertText: 'choripan',
                        range: range,
                    },
                    {
                        label: '"chimichurri"',
                        kind: monaco.languages.CompletionItemKind.Operator,
                        documentation: "Asignacion y suma de un valor a una variable en milangLang",
                        insertText: 'chimichurri',
                        range: range,
                    },
                    {
                        label: '"rogel"',
                        kind: monaco.languages.CompletionItemKind.Operator,
                        documentation: "Asignacion y resta de un valor a una variable en milangLang",
                        insertText: 'rogel',
                        range: range,
                    },
                    {
                        label: '"locro"',
                        kind: monaco.languages.CompletionItemKind.Operator,
                        documentation: "Asignacion y multiplicacion de un valor a una variable en milangLang",
                        insertText: 'locro',
                        range: range,
                    },
                    {
                        label: '"sanguchitoDeMiga"',
                        kind: monaco.languages.CompletionItemKind.Operator,
                        documentation: "Asignacion y division de un valor a una variable en milangLang",
                        insertText: 'sanguchitoDeMiga',
                        range: range,
                    },
                    {
                        label: '"faina"',
                        kind: monaco.languages.CompletionItemKind.Operator,
                        documentation: "Operador de suma en milangLang",
                        insertText: 'faina',
                        range: range,
                    },
                    {
                        label: '"chocotorta"',
                        kind: monaco.languages.CompletionItemKind.Operator,
                        documentation: "Operador de resta en milangLang",
                        insertText: 'chocotorta',
                        range: range,
                    },
                    {
                        label: '"fugazza"',
                        kind: monaco.languages.CompletionItemKind.Operator,
                        documentation: "Operador de multiplicación en milangLang",
                        insertText: 'fugazza',
                        range: range,
                    },
                    {
                        label: '"vacio"',
                        kind: monaco.languages.CompletionItemKind.Operator,
                        documentation: "Operador de división en milangLang",
                        insertText: 'vacio',
                        range: range,
                    },
                    {
                        label: '"salsaCriolla"',
                        kind: monaco.languages.CompletionItemKind.Operator,
                        documentation: "Operador de módulo en milangLang",
                        insertText: 'salsaCriolla',
                        range: range,
                    },
                    {
                        label: '"fernet"',
                        kind: monaco.languages.CompletionItemKind.Operator,
                        documentation: "Comparación estricta de igualdad en milangLang",
                        insertText: 'fernet',
                        range: range,
                    },
                    {
                        label: '"matambreALaPizza"',
                        kind: monaco.languages.CompletionItemKind.Operator,
                        documentation: "Comparación estricta de desigualdad en milangLang",
                        insertText: 'matambreALaPizza',
                        range: range,
                    },
                    {
                        label: '"tortaFrita"',
                        kind: monaco.languages.CompletionItemKind.Operator,
                        documentation: "Mayor que en milangLang",
                        insertText: 'tortaFrita',
                        range: range,
                    },
                    {
                        label: '"vigilante"',
                        kind: monaco.languages.CompletionItemKind.Operator,
                        documentation: "Menor que en milangLang",
                        insertText: 'vigilante',
                        range: range,
                    },
                    {
                        label: '"balcarce"',
                        kind: monaco.languages.CompletionItemKind.Operator,
                        documentation: "Mayor o igual que en milangLang",
                        insertText: 'balcarce',
                        range: range,
                    },
                    {
                        label: '"cubanitos"',
                        kind: monaco.languages.CompletionItemKind.Operator,
                        documentation: "Menor o igual que en milangLang",
                        insertText: 'cubanitos',
                        range: range,
                    },
                    {
                        label: '"pastelitosCriollos"',
                        kind: monaco.languages.CompletionItemKind.Operator,
                        documentation: "Operador lógico AND en milangLang",
                        insertText: 'pastelitosCriollos',
                        range: range,
                    },
                    {
                        label: '"dulceDeBatata"',
                        kind: monaco.languages.CompletionItemKind.Operator,
                        documentation: "Operador lógico OR en milangLang",
                        insertText: 'dulceDeBatata',
                        range: range,
                    },
                    {
                        label: '"humita"',
                        kind: monaco.languages.CompletionItemKind.Operator,
                        documentation: "Operador lógico NOT en milangLang",
                        insertText: 'humita',
                        range: range,
                    }
                ]
        }
    }

monaco.languages.registerCompletionItemProvider("esolang", {
    triggerCharacters:[' '],
	provideCompletionItems: function (model, position) {
		const {endColumn, startColumn} = model.getWordUntilPosition(position);
        const contentBeforeCurrent = model.getLineContent(position.lineNumber);
		const range = {
			startLineNumber: position.lineNumber,
			endLineNumber: position.lineNumber,
			startColumn: startColumn,
			endColumn: endColumn,
		};
		return {
			suggestions: createDependencyProposals(range, contentBeforeCurrent),
		};
	},
});

const codeSnippets = [
    {
        title:"hola mundo",
        snippet:"chinchulin mateCocido('hola mundo!')"
    },
    {
        title:"fizzbuzz",
        snippet:`empanada count choripan 1\nempanada output choripan ''\nterere(count cubanitos 100){\n  milanesa(count salsaCriolla 3 fernet 0){\n    vitelTone output chimichurri 'Fizz'\n  }\n  milanesa(count salsaCriolla 5 fernet 0){\n    vitelTone output chimichurri 'Buzz'\n  }\n  vitelTone count chimichurri 1\n}\n\nchinchulin mateCocido(output)`
    },
    {
        title:"es primo",
        snippet:`asado esPrimo(n, divisor) {\n\tvitelTone divisor choripan divisor dulceDeBatata 2\n\tmilanesa (n vigilante 2){\n\t\talfajor bolaDeFraile\n\t}\n\tmilanesa (divisor fugazza divisor tortaFrita n){\n\t\talfajor medialuna\n\t}\n\tmilanesa (n salsaCriolla divisor fernet 0){\n\t\talfajor bolaDeFraile\n\t}\n\talfajor chinchulin esPrimo(n, divisor faina 1)\n}\n\nchinchulin mateCocido(chinchulin esPrimo(10))\nchinchulin mateCocido(chinchulin esPrimo(7))`
    },
    {
        title:'es palindromo',
        snippet: `asado esPalindromo(palabra) {\n\tasado largo(str) {\n\t\tempanada i choripan 0\n\t\tterere (str[i]) {\n\t\t\tvitelTone i chimichurri 1\n\t\t}\n\t\talfajor i\n\t}\n\n\tasado verificar(palabra, izq, der) {\n\t\tmilanesa (izq balcarce der){\n\t\t\talfajor medialuna\n\t\t}\n\t\tmilanesa (palabra[izq] matambreALaPizza palabra[der]){\n\t\t\talfajor bolaDeFraile\n\t\t}\n\t\talfajor chinchulin verificar(palabra, izq faina 1, der chocotorta 1)\n\t}\n\n\tempanada len choripan chinchulin largo(palabra)\n\talfajor chinchulin verificar(palabra, 0, len chocotorta 1)\n}\n\nchinchulin mateCocido(chinchulin esPalindromo('reconocer'))\nchinchulin mateCocido(chinchulin esPalindromo('hola'))`
    },
    {
        title:"fibonacci",
        snippet:`asado fibonacci(n) {\n\tmilanesa(n vigilante 2){\n\t\talfajor n\n\t}provoleta{\n\t\talfajor chinchulin fibonacci(n chocotorta 1) faina chinchulin fibonacci(n chocotorta 2)\n\t}\n}\nchinchulin mateCocido(chinchulin fibonacci(5))`
    },
    {
        title:'suma de un array',
        snippet:`asado suma(arr) {\n\tempanada total choripan 0\n\tmate(empanada num librito arr) {\n\t\tvitelTone total chimichurri num\n\t}\n\talfajor total\n}\n\nchinchulin mateCocido(chinchulin suma([1, 2, 3, 4, 5]))`
    },
    {
        title:"bubble sort",
        snippet: `asado bubbleSort (arr) {\n\tempanada i choripan 0\n\tempanada n choripan chinchulin mondongo(arr)\n\tterere(i vigilante n chocotorta 1){\n\t\tempanada j choripan 0\n\t\tterere(j vigilante n chocotorta 1 chocotorta i){\n\t\t\tmilanesa(arr[j] tortaFrita arr[j faina 1]){\n\t\t\t\tempanada temp choripan arr[j]\n\t\t\t\tvitelTone arr[j] choripan arr[j faina 1]\n\t\t\t\tvitelTone arr[j faina 1] choripan temp\n\t\t\t}\n\t\t\tvitelTone j chimichurri 1\n\t\t}\n\t\tvitelTone i chimichurri 1\n\t}\n\talfajor arr\n}\n\nchinchulin mateCocido(chinchulin bubbleSort([2,4,60,1, 22, 3]))`
    },
    {
        title:"selection sort",
        snippet:`asado selectionSort(arr) {\n\tempanada i choripan 0 \n\tempanada length choripan chinchulin mondongo(arr)\n\tterere(i vigilante length) {\n\t\tempanada minIndex choripan i\n\t\tempanada j choripan i faina 1\n\t\tterere(j vigilante length) {\n\t\t\tmilanesa(arr[j] vigilante arr[minIndex]) {\n\t\t\t\tvitelTone minIndex choripan j\n\t\t\t}\n\t\t\tvitelTone j chimichurri 1\n\t\t}\n\t\tempanada temp choripan arr[i]\n\t\tvitelTone arr[i] choripan arr[minIndex]\n\t\tvitelTone arr[minIndex] choripan temp\n\t\tvitelTone i chimichurri 1\n\t}\n\talfajor arr\n}\n\n chinchulin mateCocido(chinchulin selectionSort([5, 3, 8, 2, 1,1122,500,100,200]))`
    },
    {
        title:'Pasaje de peso a dolar',
        snippet: `asado calcularDolar(pesos){\n\tdulceDeLeche dolarValue choripan 1063.69\n\talfajor pesos vacio dolarValue\n}\nchinchulin mateCocido(chinchulin calcularDolar(1000))
        `
    },
    {
        title:'Aja',
        snippet: "empanada frase choripan ''\nmate(empanada curr librito ['aja', 'ajaja', '...', 'aja no', 'aja las pelotas bldo me cague todo']){\n    vitelTone frase chimichurri curr\n}\nchinchulin mateCocido(frase)"
    },
    {
        title:'MUCHAAACHOOSSS',
        snippet: "empanada mundiales choripan 0\nempanada count choripan 1\ndulceDeLeche mundialesGanados choripan 3\nterere(count cubanitos mundialesGanados){\n    vitelTone count chimichurri 1\n    vitelTone mundiales chimichurri 1\n}\nchinchulin mateCocido('MUCHAAACHOSSSS, AHORA NOS VOLVIMO A ILUSIONARRRR\\n QUIERO GANAR LA', mundiales faina 1, 'QUIERO SER CAMPEON MUNDIAAALLL')"
    }
]


const selectCodeSnippet = document.getElementById("codeSnippetsSelect")
codeSnippets.forEach((c, i)=> {
    selectCodeSnippet.innerHTML+=`<option ${i === 0 ? 'selected': ''} value="${c.snippet}">${c.title}</option>`
})
selectCodeSnippet.addEventListener('change', (e)=>{
    editor.setValue(selectCodeSnippet.value)
})

const hasCode = localStorage.getItem('code') 
const editor = monaco.editor.create(document.getElementById('code'), {
    value: hasCode !== null ? `${JSON.parse(hasCode)}` : codeSnippets[0].snippet,
    language: 'esolang',
    theme: 'esolangTheme',
})

window.addEventListener("resize", ()=>editor.layout())
localStorage.setItem("code", JSON.stringify(editor.getValue()))
editor.onDidChangeModelContent((e)=>{
    let hasCode = localStorage.getItem('code')
    const currentValue = editor.getValue()
    hasCode = currentValue
    localStorage.setItem('code', JSON.stringify(hasCode || ""))
})


const docsSections = [
    {
        "title": "Tipos de datos primitivos",
        "headers":["tipo de dato primitivo", "en milangLang"],
        "values": [
            ['TRUE', 'medialuna'],
            ['FALSE', 'bolaDeFraile'],
        ]
    },
        {
            "title": "Operadores lógicos",
            "headers": ["Tipos de operadores lógicos", "en milangLang", "ejemplo"],
            "values": [
                ["&& (AND)", "pastelitosCriollos", "medialuna pastelitosCriollos medialuna"],
                ["|| (OR)", "dulceDeBatata", "bolaDeFraile dulceDeBatata medialuna"],
                ["! (NOT)", "humita", "humita humita medialuna"]
            ]
        },
        {
            "title": "Operadores aritméticos",
            "headers": ["Tipos de operadores aritméticos", "en milangLang", "ejemplo"],
            "values": [
                ["+", "faina", "1 faina 1"],
                ["-", "chocotorta", "2 chocotorta 1"],
                ["*", "fugazza", "2 fugazza 2"],
                ["/", "vacio", "6 vacio 2"],
                ["%", "salsaCriolla", "4 salsaCriolla 2"]
            ]
        },
        {
            "title": "Operadores de comparación",
            "headers": ["Tipos de operadores de comparación", "en milangLang", "ejemplo"],
            "values": [
                ["=== (ESTRICTAMENTE IGUAL)", "fernet", "\"1\" fernet 1"],
                ["!== (ESTRICTAMENTE DESIGUAL)", "matambreALaPizza", "medialuna matambreALaPizza \"true\""],
                ["> (MAYOR QUE)", "tortaFrita", "3 tortaFrita 2"],
                ["< (MENOR QUE)", "vigilante", "2 vigilante 3"],
                [">= (MAYOR IGUAL QUE)", "balcarce", "1 balcarce 1"],
                ["<= (MENOR IGUAL QUE)", "cubanitos", "2 cubanitos 3"]
            ]
        },
        {
            "title": "Operadores de asignación",
            "headers": ["Tipos de operadores de asignación", "en milangLang", "ejemplo"],
            "values": [
                ["=", "choripan", "vitelTone <identifierName> choripan \"hola\""],
                ["+=", "chimichurri", "vitelTone <identifierName> chimichurri 1"],
                ["-=", "rogel", "vitelTone <identifierName> rogel 1"],
                ["*=", "locro", "vitelTone <identifierName> locro 2"],
                ["/=", "sanguchitoDeMiga", "vitelTone <identifierName> sanguchitoDeMiga 2"]
            ]
        },
        {
            "title": "Built-in functions",
            "headers": ["Tipos de built-in functions", "en milangLang", "ejemplo"],
            "values": [
                ["console.log", "mateCocido(...args)", "chinchulin mateCocido(\"hola mundo!\")"],
                ["split", "bizcochuelo(obj: iterable al que le aplicamos el split, sep, limit)", "chinchulin bizcochuelo(\"hola como estas\", \" \")"],
                ["push", "mantecol(obj: array al que le aplicamos el push, ...args)", "chinchulin bizcochuelo([1,2,3],4,5)"],
                ["length", "mondongo(obj: iterable del que queremos recuperar su propiedad length)", "chinchulin mondongo(\"123456\")"],
                ["splice", "pionono(obj: array al que le aplicamos el splice, start,...args)", "chinchulin pionono([1,2,3,4], 1)"]
            ]
        }
    ]
    const codeExamplesDocsSections = [
        {
            "title": "Flujos de control",
            "headers": ["palabra clave", 'en milangLang'],
            "sections":[
                {
                    "subTitle": "1. Operador ternario if-else",
                    "values":[
                    ["IF", "milanesa"],
                    ["ELSE", "provoleta"],
                    ],
                    "codeSnippet":`
                    empanada hayAlgunoConPintaRara choripan medialuna<br/>
                    milanesa(hayAlgunoConPintaRara){<br/>
                        chinchulin mateCocido("GUARDA EL TELEFONO PELOTUDO")<br/>
                    }provoleta{<br/>
                        chinchulin mateCocido("tranqui segui boludeando con el celu")<br/>
                    }<br/>
                    //output: 'GUARDA EL TELEFONO PELOTUDO'
                    `
                },
                {
                    "subTitle": "2. Bucle while",
                    "values":[
                    ["while", "terere"],
                    ],
                    "codeSnippet":`
                    empanada elMateSeQuedoSinAgua choripan bolaDeFraile <br/>
                    empanada ronda choripan 1 <br/>
                    terere(humita elMateSeQuedoSinAgua){ <br/>
                        chinchulin mateCocido("RONDA NRO" faina ronda) <br/>
                        vitelTone ronda chimichurri 1 <br/>
                        milanesa(ronda fernet 3){ <br/>
                            tvitelTone elMateSeQuedoSinAgua choripan medialuna <br/>
                        } <br/>
                    } <br/>
                    //output: 'RONDA NRO 1' 'RONDA NRO 2'
                    `
                },
                {
                    "subTitle": "3. Bucle for of",
                    "values":[
                    ["for", "mate"],
                    ["of", "librito"],
                    ],
                    "codeSnippet":`
                    empanada frase choripan ''<br/>
                    mate(empanada curr librito ['aja', 'ajaja', '...', 'aja no', 'aja las pelotas bldo me cague todo']){<br/>
                        vitelTone frase chimichurri curr<br/>
                    }<br/>
                    chinchulin mateCocido(frase)
                    `
                },
            ]
        },
        {
            "title": "Declaraciones y asignaciones",
            "headers": ["palabra clave", "en milangLang"],
            "sections":[
                {
                    "subTitle": "1. Variables",
                    "values":[
                    ["LET (declaracion de variable)", "empanada"],
                    ["cambio de valor a una variable", "vitelTone"],
                    ],
                    "codeSnippet":`
                    empanada &#60;identificador&#62; choripan "marado"<br/>
                    vitelTone &#60;identificador&#62; chimichurri "marado" <br/>
                    chinchulin mateCocido(&#60;identificador&#62;) //output:"maradomarado"
                    `
                },
                {
                    "subTitle": "2. Constantes",
                    "values":[
                    ["CONST (declaracion de constante)", "dulceDeLeche"],
                    ],
                    "codeSnippet":`
                    dulceDeLeche &#60;identificador&#62; choripan "traelo a bal"<br/>
                    chinchulin mateCocido(&#60;identificador&#62;) //output:"traelo a bal"
                    `
                },
                {
                    "subTitle": "3. Funciones",
                    "values":[
                    ["function (declaracion de funcion)", "asado"],
                    ["caller (llamar a cualquier funcion, ya sea built in o declarada por el usuario)", "chinchulin"],
                    ['return', "alfajor"]
                    ],
                    "codeSnippet":`
                    asado calcularDolar(pesos){ <br/>
                    dulceDeLeche dolarValue = 1063,69 <br/>
                    alfajor pesos vacio dolarValue <br/>
                    }<br/>
                    chinchulin mateCocido(chinchulin calcularDolar(1000)) //output:0,94
                    `
                },
            ]
        }, 

    ]
    const container = document.getElementById("docsContainer")
    docsSections.forEach((section, sectionI)=>{
        container.innerHTML+=`
        <div class="flex flex-col gap-2">
            <h2 class="text-base md:text-lg text-[#0a2440] font-normal dark:text-[#75aadb] ">${section.title}</h2>  
            <div class="w-full max-w-2xl mx-auto dark:bg-gray-800 dark:border-gray-700 bg-white shadow-lg rounded-sm border border-gray-200">
                <div class="p-3">
                    <div class="overflow-x-auto">
                        <table class="table-auto w-full">
                            <thead class="text-xs font-semibold dark:text-gray-300 dark:bg-gray-700 uppercase text-gray-400 bg-gray-50">
                                <tr id="headersRow${sectionI}">
                                </tr>
                            </thead>
                            <tbody id="tableBody${sectionI}" class=" dark:divide-gray-600 dark:text-gray-200 text-sm divide-y divide-gray-100">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
`
                const headersRow = document.getElementById(`headersRow${sectionI}`)
                section.headers.forEach((h)=>{
                    headersRow.innerHTML+=`
                    <th class="p-2 whitespace-nowrap">
                        <div class="font-semibold text-left ">${h}</div>
                    </th>
                    `
                })
                const tableBody = document.getElementById(`tableBody${sectionI}`)
                section.values.forEach((valuesArr, i)=>{
                    tableBody.innerHTML+=`<tr id="row${sectionI}${i}"></tr>`
                    const row = document.getElementById(`row${sectionI}${i}`)
                    valuesArr.forEach((val)=>{
                        row.innerHTML+=`
                        <td class="p-2 whitespace-nowrap">
                            <div class="text-left">${val}</div>
                        </td>
                        `
                    })
                })
    })

    codeExamplesDocsSections.forEach((section, sectionI)=>{
        container.innerHTML+=`
        <div class="flex flex-col gap-2">
            <h2 class="text-lg text-[#0a2440] dark:text-[#75aadb] font-normal">${section.title}</h2> 
            <div id="examplesSection${sectionI}" class="flex flex-col gap-2">
            </div>
        </div>
        `
        const examplesSection = document.getElementById(`examplesSection${sectionI}`)
        section.sections.forEach((subSection, subSectionI)=>{
            console.log(subSection.subTitle)
            examplesSection.innerHTML+=` 
            <h3 class="text-lg dark:text-[#75aadb] text-[#0a2440] font-normal">${subSection.subTitle}</h3>
            <div class="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-sm border dark:bg-gray-800 dark:shadow-gray-900/30 dark:border-gray-700 border-gray-200">
                <div class="p-3">
                    <div class="overflow-x-auto">
                        <table class="table-auto w-full">
                            <thead class="text-xs dark:text-gray-300 dark:bg-gray-700 font-semibold uppercase text-gray-400 bg-gray-50">
                                <tr>
                                    <th class="p-2 whitespace-nowrap">
                                        <div class="font-semibold text-left">palabra clave</div>
                                    </th>
                                    <th class="p-2 whitespace-nowrap">
                                        <div class="font-semibold text-left">en argLang</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody id="tableBodyExamples${subSectionI}${sectionI}" class="text-sm divide-y dark:divide-gray-600 dark:text-gray-200 divide-gray-100">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <code class="block dark:bg-gray-800 dark:text-gray-200 bg-gray-100 py-2 px-10 rounded mt-2 text-sm overflow-y-auto" id="codeSnippet${sectionI}${subSectionI}"></code>
                `
            const tableBodyExamples = document.getElementById(`tableBodyExamples${subSectionI}${sectionI}`)
            const codeSnippet= document.getElementById(`codeSnippet${sectionI}${subSectionI}`)
            codeSnippet.innerHTML+=subSection.codeSnippet
            subSection.values.forEach((valuesArr, valuesArrI)=>{
                console.log(valuesArr)
                tableBodyExamples.innerHTML+=`
                <tr id="rowExamples${sectionI}${subSectionI}${valuesArrI}">
                </tr>
                `
                console.log(tableBodyExamples)
                const row =  document.getElementById(`rowExamples${sectionI}${subSectionI}${valuesArrI}`)
                valuesArr.forEach(val => {
                    row.innerHTML+=`
                    <td class="p-2 whitespace-nowrap">
                        <div class="text-left">${val}</div>
                    </td>
                    `
                });
            })
        })
    })
    const copyCodeButton = document.getElementById("copyCode")
    const successSvg = `
    <svg class="w-4 h-4 text-blue-400 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11.917 9.724 16.5 19 7.5"></path>
    </svg>
    `;

    const copySvg = `
    <svg class="w-4 h-4 text-blue-400 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
    </svg>
    `;
    copyCodeButton.addEventListener("click", ()=>{
        let hasCode = localStorage.getItem("code")
        if(hasCode){
            hasCode = `${JSON.parse(hasCode)}`
        }
        navigator.clipboard.writeText(hasCode || "")
        copyCodeButton.innerHTML=""
        copyCodeButton.innerHTML=successSvg
        setTimeout(()=>{
            copyCodeButton.innerHTML=""
            copyCodeButton.innerHTML=copySvg
        }, 3000)
    })


function run(code){
    const logger = new Logger()
    logger.clear()
    try {
        const lexer = new Lexer(code.split('\n'), logger)
        const newOne= []
        lexer.lex()
        lexer.tokenArray.forEach((c)=> c.forEach((e)=>newOne.push(e)))
        const parser = new Parser(newOne, logger).parse()
        const interpreter = new Interpreter(logger)
        interpreter.interpret(parser)
        return logger.get()
    } catch (error) {
        return logger.get()
    }
}

const logsContainer = document.getElementById("consoleContent")
const runCodeButton = document.getElementById("runCode")
const clearConsole = document.getElementById("clearConsole")
runCodeButton.addEventListener('click', (e)=>{
    logsContainer.innerHTML=''
    const code = editor.getValue();
    const logger = run(code);
    logger.forEach((logArr)=>{
        console.log(logArr)
        if(logArr instanceof SyntaxError || logArr instanceof LexicalError || logArr instanceof Error){
            const message = logArr instanceof Error ? `${logArr.stack}` : logArr.errorMessage()
            logsContainer.innerHTML+=`<li class="consolePills before:bg-red-500">${message}</li>`
        }else{
            let content=''
            logArr.forEach((arg)=>{
                content+=` ${arg}`
            })
            const tag = `<li class="before:bg-blue-400 consolePills">${content}</li>`
            logsContainer.innerHTML+=tag
        }
    })
})
clearConsole.addEventListener('click', (e)=>{
    logsContainer.innerHTML=''
})


const navMobileItems = document.getElementById("mobileNavbar").querySelectorAll("li")
const sections = [document.getElementById("documentationSection"),document.getElementById("codeSection")]
let lastElementToggled = 0;
navMobileItems.forEach((element, i) => {
    element.addEventListener('click', () => {
        if (lastElementToggled === i) return;
        navMobileItems[lastElementToggled].classList.toggle("selected");
        sections[lastElementToggled].classList.toggle("hidden");
        sections[lastElementToggled].classList.toggle("block");
        element.classList.toggle("selected");
        sections[i].classList.toggle("hidden");
        sections[i].classList.toggle("block");
        lastElementToggled = i;
        if (i === 1 && typeof editor !== "undefined") {
            setTimeout(() => {
                editor.layout();
            }, 50);
        }
    });
});
const butonDark = document.getElementById("darkMode");
butonDark.addEventListener("click", (e)=>{
    document.body.classList.toggle("dark")
    document.getElementById("moon").classList.toggle("modeIcon")
    document.getElementById("sun").classList.toggle("modeIcon")
})
