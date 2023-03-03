import React from 'react'
import { Buffer } from 'buffer'

export const basicAuth = {
    username:'Tgabjs', 
    password :'password'
}

export const Token = Buffer.from(`${basicAuth.username}:${basicAuth.password}`, 'utf8').toString('base64')