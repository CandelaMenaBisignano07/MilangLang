![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
# MilangLang

Un lenguaje de programación hecho en js basado en la gastronomía Argentina🍴.

## Introduccion

En nuestro país, la comida no es solo un placer, sino que también es una tradición que nos hace crear momentos. ¿Quién no se comió un asado con su familia/amigos, tomó unos mates con bizcochitos en grupo, etc.? Este esolang está basado en recordar esos momentos mientras programas, cagarte un rato de risa y enseñarle a tus amigos los mancos a programar. 👾

Podrás encontrar expresiones, flujos de control, funciones, etc., los cuales llevan nombres de comidas típicas de nuestro país. 🍽

# Documentación
### Sintaxis

Antes de empezar a escribir código en MilangLang, necesitas entender su estructura y las reglas básicas que rigen su sintaxis.

### ⚠️ IMPORTANTE ⚠️

-  Los puntos y coma (`;`) no están permitidos al final de cada statement.
- Los comentarios son solo en línea y se abren con un `#`.
-  En los bloques de código dentro de un flujo de control que están dentro de una función, no se puede hacer un `return` vacío; sí o sí se tiene que retornar un valor.

### Tipos de Datos Primitivos

| Tipo de Dato Primitivo | En MilangLang |
|-----------------------|--------------|
| TRUE                 | medialuna    |
| FALSE                | bolaDeFraile |

### Operadores Lógicos

| Tipos de Operadores Lógicos | En MilangLang | Ejemplo |
|----------------------------|--------------|---------|
| && (AND)                   | pastelitosCriollos | medialuna   pastelitosCriollos medialuna |
| \|\| (OR)                    | dulceDeBatata     | bolaDeFraile dulceDeBatata medialuna |
| ! (NOT)                    | humita            | humita humita medialuna |

## Operadores Aritméticos

| Tipos de Operadores Aritméticos | En MilangLang | Ejemplo |
|--------------------------------|--------------|---------|
| +                              | faina        | 1 faina 1 |
| -                              | chocotorta   | 2 chocotorta 1 |
| *                              | fugazza      | 2 fugazza 2 |
| /                              | vacio        | 6 vacio 2 |
| %                              | salsaCriolla | 4 salsaCriolla 2 |

## Operadores de Comparación

| Tipos de Operadores de Comparación | En MilangLang | Ejemplo |
|----------------------------------|--------------|---------|
| === (ESTRICTAMENTE IGUAL)        | fernet       | "1" fernet 1 |
| !== (ESTRICTAMENTE DESIGUAL)     | matambreALaPizza | medialuna matambreALaPizza "true" |
| > (MAYOR QUE)                    | tortaFrita   | 3 tortaFrita 2 |
| < (MENOR QUE)                    | vigilante    | 2 vigilante 3 |
| >= (MAYOR IGUAL QUE)             | balcarce     | 1 balcarce 1 |
| <= (MENOR IGUAL QUE)             | cubanitos    | 2 cubanitos 3 |

## Operadores de Asignación

| Tipos de Operadores de Asignación | En MilangLang | Ejemplo |
|----------------------------------|--------------|---------|
| =                               | choripan     | vitelTone \<identifierName> choripan "hola" |
| +=                              | chimichurri  | vitelTone \<identifierName> chimichurri 1 |
| -=                              | rogel        | vitelTone \<identifierName> rogel 1 |
| *=                              | locro        | vitelTone \<identifierName> locro 2 |
| /=                              | sanguchitoDeMiga | vitelTone \<identifierName> sanguchitoDeMiga 2 |

## Built-in Functions

| Tipos de Built-in Functions | En MilangLang | Ejemplo |
|-----------------------------|--------------|---------|
| console.log                 | mateCocido(...args) | chinchulin mateCocido("hola mundo!") |
| split                       | bizcochuelo(obj, sep, limit) | chinchulin bizcochuelo("hola como estas", " ") |
| push                        | mantecol(obj, ...args) | chinchulin bizcochuelo([1,2,3],4,5) |
| length                      | mondongo(obj) | chinchulin mondongo("123456") |
| splice                      | pionono(obj, start, ...args) | chinchulin pionono([1,2,3,4], 1) |

## Flujos de Control

### Operador Ternario If-Else

| Palabra Clave | En MilangLang |
|--------------|--------------|
| IF          | milanesa |
| ELSE        | provoleta |

```milanglang
empanada hayAlgunoConPintaRara choripan medialuna
milanesa(hayAlgunoConPintaRara){
    chinchulin mateCocido("GUARDA EL TELEFONO PELOTUDO")
}provoleta{
    chinchulin mateCocido("tranqui segui boludeando con el celu")
}
//output: 'GUARDA EL TELEFONO PELOTUDO'
```

### Bucle While

| Palabra Clave | En MilangLang |
|--------------|--------------|
| while       | terere |

```milanglang
empanada elMateSeQuedoSinAgua choripan bolaDeFraile 
empanada ronda choripan 1 
terere(humita elMateSeQuedoSinAgua){ 
    chinchulin mateCocido("RONDA NRO" faina ronda) 
    vitelTone ronda chimichurri 1 
    milanesa(ronda fernet 3){ 
        vitelTone elMateSeQuedoSinAgua choripan medialuna 
    } 
} 
//output: 'RONDA NRO 1' 'RONDA NRO 2'
```

### Bucle For Of

| Palabra Clave | En MilangLang |
|--------------|--------------|
| for         | mate |
| of          | librito |

```milanglang
empanada frase choripan ''
mate(empanada curr librito ['aja', 'ajaja', '...', 'aja no', 'aja las pelotas bldo me cague todo']){
    vitelTone frase chimichurri curr
}
chinchulin mateCocido(frase)
```

## Declaraciones y Asignaciones

### Variables

| Palabra Clave | En MilangLang |
|--------------|--------------|
| LET (declaración de variable) | empanada |
| Cambio de valor a una variable | vitelTone |

```milanglang
empanada <identificador> choripan "marado"
vitelTone <identificador> chimichurri "marado" 
chinchulin mateCocido(<identificador>) //output:"maradomarado"
```

### Constantes

| Palabra Clave | En MilangLang |
|--------------|--------------|
| CONST (declaración de constante) | dulceDeLeche |

```milanglang
dulceDeLeche <identificador> choripan "traelo a bal"
chinchulin mateCocido(<identificador>) //output:"traelo a bal"
```

### Funciones

| Palabra Clave | En MilangLang |
|--------------|--------------|
| function (declaración de función) | asado |
| caller (llamar a función) | chinchulin |
| return | alfajor |

```milanglang
asado calcularDolar(pesos){
dulceDeLeche dolarValue = 1063.69 
alfajor pesos vacio dolarValue 
}
chinchulin mateCocido(chinchulin calcularDolar(1000)) //output:0.94
