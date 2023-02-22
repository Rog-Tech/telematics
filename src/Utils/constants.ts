import React from 'react'
import { Buffer } from 'buffer'

const basicAuth = {
    username:'test', 
    password :'password'
}

export const Token = Buffer.from(`${basicAuth.username}:${basicAuth.password}`, 'utf8').toString('base64')