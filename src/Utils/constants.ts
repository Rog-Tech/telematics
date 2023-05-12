import React from 'react'
import { Buffer } from 'buffer'
import { OptionsTypes } from '../types/Types'

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

export const ReverseGeocodingAPIKey = 'pk.1beab58189d6660720a6ea082dfa0923'


export const SystemOptions:OptionsTypes []= [
    {
      name:"WHATSGPS", value:"WHATSGPS"
    }
]
export const BufferTypeOptions:OptionsTypes[] = [
    {
      name:"CIRCLE", value:"CIRCLE"
    }
]
