import React, {useState} from 'react';
import {Editor} from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector.jsx";
import classes from "./CodeEditor.module.css";


export default function CodeEditor({width, height, languages, task, setTask}) {
   const [language, setLanguage] = useState(languages.find(lang => lang.key === task?.taskLanguage).value);
   return (
       <div >
            <div className={classes.language}>
                <LanguageSelector onChangeKey={setTask} task = {task} onChangeValue={setLanguage} languages={languages}/>
            </div>
           <Editor
               width={width}
               height={height}
               theme={"light"}
               language={language}
               value={task.code}
               onChange={e =>  setTask((task) => ({...task, code:e}))}
           />
       </div>
   )
}
