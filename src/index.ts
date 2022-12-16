import { apibConvert, openapi2DOT, openapi2Insomnia, openapi2Postman } from './converters';

/* Testes de Conversão */
//OpenApi -> Postman
// openApi2Postman("../examples/imob/openapi.json")
//OpenApi -> Insomnia
// openApi2Insomnia("../examples/openapi.json")
//OpenApi -> DOT
// (async () => { 
//     mkdirSync(p.resolve(__dirname, "../output/"), { recursive: true });
//     writeFileSync(p.resolve(__dirname, "../output/OpenApi-DOT.json"), await openApi2DOT(p.resolve(__dirname, "../examples/openapi.json")))
// })();
//yaml
// (async () => {
//     mkdirSync(p.resolve(__dirname, "../output/"), { recursive: true });
//     writeFileSync(p.resolve(__dirname, "../output/OpenAPI-yaml-DOT.json"), await openApi2DOT(p.resolve(__dirname, "../examples/openapi.yaml")))
// })();

//Swagger -> Postman
// openApi2Postman("../examples/swagger.json")
//Swagger -> Insomnia
// openApi2Insomnia("../examples/swagger.json")
//Swagger -> DOT
// (async () => {
//     mkdirSync(p.resolve(__dirname, "../output/"), { recursive: true });
//     writeFileSync(p.resolve(__dirname, "../output/Swagger-DOT.json"), await openApi2DOT(p.resolve(__dirname, "../examples/swagger.json")))
// })();
// yaml
// (async () => {
//     mkdirSync(p.resolve(__dirname, "../output/"), { recursive: true });
//     writeFileSync(p.resolve(__dirname, "../output/Swagger-yaml-DOT.json"), await openApi2DOT(p.resolve(__dirname, "../examples/swagger.yml")))
// })();

//ApiBluePrint -> Postman
// apibConvert("../examples/apiblueprint.apib")
//ApiBluePrint -> Insomnia
// apibConvert("../examples/apiblueprint.apib", 2)
// ApiBluePrint -> DOT
// (async () => {
//     mkdirSync(p.resolve(__dirname, "../output/"), { recursive: true });
//     writeFileSync(p.resolve(__dirname, "../output/ApiBluePrint-DOT.json"), await apibConvert(p.resolve(__dirname, "../examples/apiblueprint.apib"), 3))
// })();

export async function openApi2Postman(filepath : string) {
    return await openapi2Postman(filepath)
}

export async function swagger2Postman(filepath : string) {
    return await openapi2Postman(filepath)
}

export async function apib2Postman(filepath : string) {
    return await apibConvert(filepath)
}

export async function openApi2Insomnia(filepath : string) {
    return await openapi2Insomnia(filepath)
}

export async function swagger2Insomnia(filepath : string) {
    return await openapi2Insomnia(filepath)
}

export async function apib2Insomnia(filepath : string) {
    return await apibConvert(filepath, 2)
}

export async function openApi2DOT(filepath : string) {
    return await openapi2DOT(filepath)
}

export async function swagger2DOT(filepath : string) {
    return await openapi2DOT(filepath)
}

export async function apib2DOT(filepath : string) {
    return await apibConvert(filepath, 3)
}