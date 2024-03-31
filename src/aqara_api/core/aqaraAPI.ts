import constants from "./constants.json";
import { Md5 } from 'ts-md5';
import { startServer, stopServer } from "./../core/backGroundServer"
import fetch from 'node-fetch';
import { IncomingMessage, Server, ServerResponse } from "http";

export { AqaraAPI};
class AqaraAPI {
    private api_uri = "https://open-{}.aqara.com/v3.0/open/api"
    private auth_uri = "https://open-{}.aqara.com/v3.0/open/authorize"
    private token_uri = "https://open-{}.aqara.com/v3.0/open/access_token"

    private tokens = { "access_token": null, "refresh_token": null }
    private authTime: Date = new Date(2000, 1, 1)
    private readonly expirationTime: number = 86400

    private server: Server<typeof IncomingMessage, typeof ServerResponse>| null = null

    readonly models = ["lumi.gateway.iragl7",
                   "lumi.gateway.iragl5",
        "lumi.gateway.agl001"]
    private servers = ["usa", "kr", "en", "ru", "ger", "sg", "cn"]

    constructor() {
    }


    private requestCode() {
        let params = {
            "redirect_uri": "http://127.0.0.1:3000",
            "client_id": constants.APP_ID,
            "response_type": "code",
            "Lang": "en-EN"
        }
        fetch(this.auth_uri + '?' + new URLSearchParams(params), {
            method: "GET",
            headers: this.getRequestHeaders()
        }).then(result => result.json()).then(jsonResult => this.showLink(jsonResult.url))
    
        //webbrowser.open(resp.request.url, new= 2, autoraise = True)
    }

    private showLink(link: string) {
        this.server = startServer(this.requestAccesToken)
        //TODO(открыть страницу)
    }

    public authorize(server: string) {
        if (!this.servers.includes(server)) {
            throw Error("no such server")
        }
        this.initUris(server)
        if (this.tokens.access_token == null || this.tokens.refresh_token == null) {
            this.requestCode()

        } else if (this.tokens["refresh_token"] != null) {
            this.refreshTokens()
        } else {
            throw Error()
        }

    }

    async makeApiRequest(post_data: object): Promise<any> {
        let timeGap = new Date().getTime() - this.authTime.getTime()
        if (timeGap*1000 >= this.expirationTime) {
            this.refreshTokens()
        }
        fetch(this.api_uri, {
            method: "POST",
            body: JSON.stringify(post_data),
            headers: this.getRequestHeaders(this.getAccessToken())
        }).then(result => result.json()).then(jsonResult => { return jsonResult["result"] })
    }

    async requestAccesToken(code: string) {
        stopServer(this.server)
        let data = {
            "client_id": constants.APP_ID,
            "client_secret": constants.APP_KEY,
            "redirect_uri": "http://127.0.0.1:3000/",
            "grant_type": "authorization_code",
            "code": code
        }
        fetch(this.auth_uri, {
            method: "POST",
            body: JSON.stringify(data),
            headers: this.getRequestHeaders()
        }).then(result => result.json()).then(jsonResult => this.setTokens(jsonResult))
    }


    async refreshTokens() {
        
        if (this.tokens == null && this.tokens["refresh_token"] == null) {
            throw Error("not authorised")
        }
        let kwargs = { "refreshToken": this.tokens["refresh_token"] }
        let intent = this.makePostData("config.auth.refreshToken",  kwargs)
        this.setTokens(this.makeApiRequest(intent))
    }


    private setTokens(newTokens) {
        this.tokens.access_token = newTokens.access_token
        this.tokens.refresh_token = newTokens.refresh_token
        this.authTime = new Date()
    }
    

    getAccessToken() {
        return this.tokens.access_token
    }


    initUris(server) {
        this.token_uri = this.token_uri.replace("{}", server)
        this.api_uri = this.api_uri.replace("{}", server)
        this.auth_uri = this.auth_uri.replace("{}", server)
    }


    private getRequestHeaders(access_token: string|null=null){
        let nonce = this.getRandomString(16)
        let timestamp: string = Math.round(Date.now() * 1000).toString()
        let sign = this.makeSign(access_token, constants.APP_ID, constants.KEY_ID, nonce, timestamp, constants.APP_KEY)
        let headers = {
             "Content-Type": "application/json",
             "Appid": constants.APP_ID,
             "Keyid": constants.KEY_ID,
             "Nonce": nonce,
             "Time": timestamp,
             "Sign": sign,
             "Lang": "en",
         }
         if (access_token) {
             headers["Accesstoken"] = access_token
         }
         return headers
    }



    makePostData(intent: string, requestData: object) {
        return {
            "intent": intent,
            "data": requestData
        }
    }


    private getRandomString(length: number) {
        let seq = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        let result = String()
        for (let i = 0; i < length; i++) {

            result += seq.charAt(Math.floor(Math.random() * seq.length));

        }
        return result
    }


    private makeSign(access_token: string|null, app_id: string, key_id: string, nonce: string,
        timestamp: string, app_key: string): string {
        let s = `Appid=${app_id}&Keyid=${key_id}&Nonce=${nonce}&Time=${timestamp}${app_key}`
        if (access_token && access_token.length > 0) {
            s = `AccessToken=${access_token}&${s}`
        }
        s = s.toLowerCase()
        let sign = Md5.hashStr(s)
        return sign
    }
}