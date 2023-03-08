import React from 'react'
import { Buffer } from 'buffer'

export const basicAuth = {
    username:'Tgabjs', 
    password :'password'
}

export const Token = Buffer.from(`${basicAuth.username}:${basicAuth.password}`, 'utf8').toString('base64')


export const ExternalLinks = {
    homepage:"https://rog-tech.com/",
    aboutUS: "https://rog-tech.com/about-us/" ,
    contact:"https://rog-tech.com/contact-us/"
}