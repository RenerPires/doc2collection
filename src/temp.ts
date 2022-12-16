import * as apib2openapi from 'apib2openapi';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { convert } from 'insomnia-importers';
import openApiToPostman from 'openapi-to-postmanv2';
import * as p from 'path';
import { DotCollection, DotReqProperties } from '../src/Models/DOT';

export async function apibConvert(filepath : string, option : 1 | 2 | 3 = 1 ){
    if(!existsSync(p.resolve(filepath))) throw new Error(`Arquivo informado não foi encontrado\nPATH: ${p.resolve(__dirname, filepath)}`)
    
    let apib = readFileSync(p.resolve(__dirname, filepath), {encoding: "utf-8"})
    
    let dataValue : string

    let data = await apib2openapi.convert(apib, {})

    writeFileSync(p.resolve(__dirname, "../output/apib.json"), JSON.stringify(data))
    
    switch(option) {
        case 1: dataValue = await openapi2Postman("../output/apib.json")
                break
        case 2: dataValue = await openapi2Insomnia("../output/apib.json")
                break
        case 3: dataValue = await openapi2DOT("../output/apib.json")
                break
        default: throw new Error("Opção inválida")
    }

    rmSync(p.resolve(__dirname, "../output/apib.json"))

    return  dataValue
}

export async function openapi2Insomnia(filepath : string) : Promise<string> {
    if(!existsSync(p.resolve(filepath))) throw new Error(`Arquivo informado não foi encontrado\nPATH: ${p.resolve(__dirname, filepath)}`)
    
    let data = readFileSync(p.resolve(filepath), {encoding: "utf-8"})

    const output = await convert(data)
    
    return JSON.stringify(output.data, null, 4)
}

export async function openapi2Postman(filepath : string) : Promise<string> {
    return new Promise((resolve, reject) => {
        if(!existsSync(p.resolve(filepath))) throw new Error(`Arquivo informado não foi encontrado\nPATH: ${p.resolve(__dirname, filepath)}`)

        openApiToPostman.convert({type: 'file', data: p.resolve(filepath)}, {}, function (err, data : any) {
            if (err) reject(`Não foi possível converter: ${err}`)

            resolve(JSON.stringify(data.output[0].data, null, 4))
        })
    })
}

function json2jsonNode(currentPath = "", data: any, list : DotReqProperties[]) {
    if (Array.isArray(data)) {
        // console.log(`Tratando do Array: ${data}`)
        data.forEach((item, index) => {
            json2jsonNode(`${currentPath}[${index}]`, item, list)
        })
        
    } else if (typeof(data) == "object" && data != null) {
        // console.log(`Tratando do Objeto: ${JSON.stringify(data, null, 4)}`)
        let pathPrefix = (currentPath == "") ? "" : `${currentPath}.`

        Object.keys(data).forEach(item => {
            json2jsonNode(`${pathPrefix}${item}`, data[item], list)
        })
    } else {
        // console.log(`Tratando da Propriedade: ${data}`)
        // Se der erro pode ser por que eu não garanti que se trata de um ValueNode

        list.push({
            nodename: currentPath,
            nodevalue: (data == null) ? "" : data,
            nodetype: (data == null) ? "string" : `${typeof(data)}`
        })
    }
}

function removeKeyDeep(obj: object | any, key: string) {
    if (!obj || (typeof obj === 'string')) {    //  assumes all leaves will be strings
        return obj
    }
    obj = Object.assign({}, obj)                // make a shallow copy
    if (obj[key]) {
        delete obj[key]                         // delete key if found
    }
    Object.keys(obj).forEach(k => {
        obj[k] = removeKeyDeep(obj[k], key)   // do the same for children
    })
    return obj                                // return the new object

    //font: https://stackoverflow.com/questions/52429021/how-to-remove-all-instances-of-a-specific-key-in-an-object
}

function resolveEnumConvert(obj: object | any) {
    if (!obj || (typeof obj !== 'object')) {
        return obj
    }

    if (obj["enum"]) {
        obj["enum"] = Object.values(obj["enum"])
    }
    
    Object.keys(obj).forEach(k => {
        obj[k] = resolveEnumConvert(obj[k])
    })
    
    return obj 
}

import { Resolver } from '@stoplight/json-ref-resolver';
import jsf from 'json-schema-faker';
import { openapiBase } from '../src/Models/OpenApi';

export async function openapi2DOT(filepath: string) : Promise<string> {
    let data: DotCollection = []
    // ...get all requests path and data    
    if(!existsSync(p.resolve(__dirname, filepath))) throw new Error(`Arquivo informado não foi encontrado\nPATH: ${p.resolve(__dirname, filepath)}`)
    
    let content = readFileSync(p.resolve(__dirname, filepath), {encoding: "utf-8"})

    let result = await new Resolver().resolve(JSON.parse(content))

    //remove key required para que o jsf não gere keys aleatórias
    let documentContent : openapiBase = removeKeyDeep(result.result, "required")

    //resolve the enum missConvert
    documentContent = resolveEnumConvert(documentContent)
    // FROM "enum": {
    //     "0": "CPF",
    //     "1": "CNPJ",
    //     "2": "ID_ESTRANGEIRO"
    //   }

    // TO: "enum": [
    //     "CPF",
    //     "CNPJ",
    //     "ID_ESTRANGEIRO"
    // ]

    Object.keys(documentContent.paths).forEach(path => {
        let methods = Object.entries(documentContent.paths[path])

        methods.forEach(([method, content]) => {
            let requestProps : DotReqProperties[] = []

            requestProps.push({
                nodename: "url",
                nodevalue: path,
                nodetype: "url"
            })

            requestProps.push({
                nodename: "método",
                nodevalue: method,
                nodetype: "method"
            })

            //Caso existam parâmetros nesse método
            if(content.parameters?.length) {
                content.parameters.forEach(param => {
                    requestProps.push({
                        nodename: param.name,
                        nodevalue: "",
                        nodetype: param.in
                    })
                })
            }
            // Converter caso exista body nesse método
            if(!!content.requestBody)
            {
                // Change the options on jsf to not allow fake options in the body
                jsf.option({
                    alwaysFakeOptionals: true,
                    fixedProbabilities: true,
                    optionalsProbability: 1,
                    minItems: 1,
                    maxItems: 1, 
                    useExamplesValue: true,
                    resolveJsonPath: true,
                    fillProperties: true,
                    useDefaultValue: true,
                    defaultInvalidTypeProduct: true,
                    defaultRandExpMax: 10
                })

                if(!!content.requestBody.content["application/json"]) {
                    // console.log(JSON.stringify(jsf.generate(content.requestBody.content["application/json"].schema), undefined, 2))
                    json2jsonNode("", jsf.generate(content.requestBody.content["application/json"].schema), requestProps)
                }
            }

            // Computed Keys
            // Usei essa abordagem para poder criar um par key, value que fosse de acordo com o esperado no DOTCollection
            data.push((() => {return {[`${path} - ${method}`]: requestProps}})())
        })                
    })

    return JSON.stringify(data, null, 4)
}
