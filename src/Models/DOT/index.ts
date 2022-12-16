export interface DotReqProperties {
    nodename : string,
    nodevalue : string,
    nodetype : "url" | "method" | "string" | "number" | "boolean" | any
}

type requestName = string

export type DotRequest = Record<requestName, DotReqProperties[]>

export type DotCollection = DotRequest[]