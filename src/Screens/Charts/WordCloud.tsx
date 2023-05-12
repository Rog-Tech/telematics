import { Any } from '@react-spring/types';
import React, { FC } from 'react'
import ReactWordcloud , {Options}from "react-wordcloud";
import { Words } from '../../Utils/words';

type WordCloudProps = {
    words: { text: string; value: number }[];
};

const  WordCloud: FC<WordCloudProps>=({words})=>{
   const options = {
    colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
    enableTooltip: true,
    deterministic: false,
    fontFamily: "impact",
    fontSizes: [5, 60],
    fontStyle: "normal",
    fontWeight: "normal",
    padding: 1,
    rotations: 3,
    rotationAngles: [0, 90],
    scale: "sqrt",
    spiral: "archimedean",
    transitionDuration: 1000
  };
    const wordsTest= [
        {
          text: 'told',
          value: 64,
        },
        {
          text: 'mistake',
          value: 11,
        },
        {
          text: 'thought',
          value: 16,
        },
        {
          text: 'bad',
          value: 17,
        },
      ]
  return (
    <ReactWordcloud
            // options={options}
            words={words}
            size={[250, 250]}
    />
  )
}

export default WordCloud
