import React, { useEffect, useState } from 'react';
import { useSpeechRecognition } from 'react-speech-kit';
import { useSpeechSynthesis } from 'react-speech-kit';
import useLocalStorage from "./useLocalStorage";

import Example from './Example';

function Example2() {
  const [value, setValue] = useState('');
  const { speak } = useSpeechSynthesis();
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
        if(result==='home' || result==='ho' || result==='HOME' || result==='Home' || result==='home ' || result===
        ' home')
            setValue('Home_appliances');
        else if(result ==='Toys' || result==='toys' || result==='Toy' || result==='toy' ||  result==='tay' || result==='toi')
            setValue('Toys_section');
        else if(result ==='furniture') 
            setValue('Furniture_section');
        else if(result==='garden' || result==='Garden' | result==='gaden' || result==='Gaden')
            setValue("garden_items");    
        else if(result==='MakeUp' || result==='makeup' || result==='make up')
        setValue("cosmetics");
       
    },
  });

  const [destination,setDes] = useLocalStorage("destination",{});

  useEffect(() => {
    listen();
  });

  return (
    <div>
      <textarea
        value={value}
        onChange={(event) => {
          setValue(event.target.value) ;
          setDes({node : value});

        }
        }
      />
      {listening && <div>Go ahead I'm listening to you</div>}
        <Example name={value} />      
      
    </div>
  );
}

export default Example2;