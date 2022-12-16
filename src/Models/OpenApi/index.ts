export interface tag {
    name : string
    description? : string
}

export interface params {
    name : string,
    in : string,
    description : string,
    required : boolean
    type : string
    default? : any,
    format? : string
    schema? : {
        items?: any
        properties?: any
        $ref? : string
}
}

interface pathContent {
    tags : string[]
    summary : string
    operationId : string
    produces : string[]
    parameters? : params[]
    requestBody? : {
        description : string
        content: any
    }
    responses : object
    security : object[]
    deprecated : boolean
}

export type path = Record<method , pathContent>

type method = "get" | "post" | "put" | "patch" | "delete" | "options" | "head"

export interface openapiBase {
    openapi : string
    info : {
        description? : string
        version? : string
        title : string
    }
    host : string
    basePath : string
    tags : tag[]
    paths : Record<string , path >
    components : any
}