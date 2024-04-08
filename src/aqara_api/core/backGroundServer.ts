import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

let callBackFunc: Function

app.get('/', (req: Request, res: Response) => {
    console.log(req.query)
    callBackFunc(req.query["code"])
    res.send()
});


export function startServer(callBack: Function) {
    let server = app.listen(port);
    callBackFunc = callBack
    return server

}

export function stopServer(server) {
    server.close()
}
    







