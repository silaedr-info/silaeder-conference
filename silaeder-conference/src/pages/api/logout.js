import {deleteCookie} from "cookies-next";


export default async function handler(req, res) {
    deleteCookie('auth_token', {req, res})
}