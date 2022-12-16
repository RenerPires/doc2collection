import { middlewareRequest } from "../Request"

export interface middlewareRequestGroup {
    id : string
    name : string
    requests? : middlewareRequest[]
}