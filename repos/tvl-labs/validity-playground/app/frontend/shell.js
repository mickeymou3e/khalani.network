
import React, {useState, useEffect} from 'react';

import styles from './styles/Home.module.css'
import { FaFolderPlus, FaPlusSquare, FaCaretRight, FaCaretDown, FaChevronDown, FaBan, FaDatabase } from "react-icons/fa";
// props: clearShell, clearConsole, renderExecResult
export default function Shell(props) {
    const {renderExecResult, execResult, clearShell, clearConsole} = props;
    const [isVisible, setIsVisible] = useState(true);
    const [stateEditorOpen, setStateEditorOpen] = useState(false);
    return (
      <div className={styles.ideShell}>
            <div className={styles.shellHeader}>
           
                <div className={styles.shellControl}>
                    <FaBan size={"15"} title="Clear Output" onClick={clearShell} className={styles.shellControlIcon}/>
                </div>
                {/* <FaChevronDown size={"15"} title="Hide" onClick={() => setIsVisible(!isVisible)} className={styles.shellControl}/> */}
                <div className={styles.shellControl}>

                    <FaDatabase size={"15"} title="State" onClick={() => setStateEditorOpen(!stateEditorOpen)} className={styles.shellControlIcon}/>
                </div>
            
  
            </div>
            {
                isVisible &&  
                <div className={styles.shellContent}>
                    <div className={styles.execResult}>
                        {renderExecResult(execResult)}
                        <div ref={props.bref} />
                    </div>
                </div>
            }
           
        </div>
          
    );
  }