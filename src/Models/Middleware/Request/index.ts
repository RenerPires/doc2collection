export interface middlewareRequestAttributes {
    name : string
    value : any
}

export interface middlewareRequestHeaders {
    name : 'A-IM' | 'Accept' | 'Accept-Charset' | 'Accept-Encoding' | 'Accept-Language' | 'Accept-Datetime' | 'Access-Control-Request-Method' | 'Access-Control-Request-Headers' | 'Authorization' | 'Cache-Control' | 'Connection' | 'Content-Length' | 'Content-Type' | 'Cookie' | 'Date' | 'Expect' | 'Forwarded' | 'From' | 'Host' | 'If-Match' | 'If-Modified-Since' | 'If-None-Match' | 'If-Range' | 'If-Unmodified-Since' | 'Max-Forwards' | 'Origin' | 'Pragma' | 'Proxy-Authorization' | 'Range' | 'Referer' | 'TE' | 'User-Agent' | 'Upgrade' | 'Via' | 'Warning' | 'Dnt' | 'X-Requested-With' | 'X-CSRF-Token'
    value : any
}

export interface middlewareRequestBodyParameter {
    name: string;
    value: string;
    description?: string;
    disabled?: boolean;
    multiline?: string;
    id?: string;
    fileName?: string;
    type?: string;
}

export interface middlewareRequestBody {
    mimeType?: string | null;
    text?: string;
    fileName?: string;
    params?: middlewareRequestBodyParameter[];
}

export interface middlewareRequest {
    id : string
    name : string
    description? : string
    attribute? : middlewareRequestAttributes[]
    header? : middlewareRequestHeaders[]
    route : string
    method : "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD" | string
    body : middlewareRequestBody
}  