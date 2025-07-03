import React, {useState, useEffect} from 'react';

import styles from './styles/Home.module.css'
import { FaFolderPlus, FaPlusSquare, FaCaretRight, FaCaretDown } from "react-icons/fa";
import validity_logo from "./static/validity_logo.png";
export function Tree(props) {
    
    const [currFile, setCurrFile] = useState("");
    const [expanded, setExpanded] = useState(false);

    const createListing = (files, onFileChange, currDir, currDirName, expanded, currFile) => {
        if (expanded || currDirName == "/") {
            return (Object.keys(files).map((file) => {
                let curr = currFile.substring(1);
                let fname = files[file].fname;
                if (curr == fname) {
                    return (
                        <span className={styles.activeWrapper}>
                            <button className={currDirName == "/" ? styles.rootFileButton : styles.treeButton} onClick={() => onFileChange(fname, currDirName)}>{fname}</button>
                        </span>
                            
                    )
                } else if (files[file] !== "") {
                    return (
                        <span className={styles.inactiveWrapper}>
                            <button className={currDirName == "/" ? styles.rootFileButton : styles.treeButton} onClick={() => onFileChange(fname, currDirName)}>{fname}</button>
                        </span>
                    )
                }
                
            }))
        } 
        
    }
    return (
        <div className={styles.fileListing}>
            {
                props.rootDir != "/" && 
                <h3 className={styles.dirHeader}>{props.rootDir} 
                {(expanded) && 
                    <FaCaretDown 
                        className={styles.folderControlIcon} size={"20"}
                        onClick={() => setExpanded(!expanded)}
                    />
                }
                {(!expanded) && 
                    <FaCaretRight
                        onClick={() => setExpanded(!expanded)}
                        className={styles.folderControlIcon} size={"20"}
                    />
                }
            </h3>
            }
            
            {createListing(props.files, props.onFileChange, props.currDir, props.rootDir, expanded, props.currFile)}
        </div>
    )
}

// Dirs is an object whose keys are dirnames, and whose values are "files" object
export function Directory(props) {
    const [newFileForm, setNewFileForm] = useState()
    const [newFileName, setNewFileName] = useState("")
    const renderTrees = (dirs) => {
        return (Object.keys(dirs).map((dirname) => {
            return (
                <Tree 
                    onFileChange={props.onFileChange}
                    currFile={props.currFile}
                    rootDir={dirname}
                    files={dirs[dirname]}
                    currDir={props.currDir == dirname}
                />
            )
        }))
    }

    const handleNewFile = (fname) => {
        setNewFileName("")
        setNewFileForm(false)
        props.onFileAdd(fname)
    }
    const renderHeading = (showForm) => {
        if (showForm) {
            return  (
                <form onSubmit={() => handleNewFile(newFileName)}>
                    <input type="text" onChange={(e) => setNewFileName(e.target.value)} placeholder="File name" title="Enter file name"/>
                </form>
                
            )
        } else {
            return (<div className={styles.icons}>
               <FaPlusSquare onClick={() => setNewFileForm(true)} className={styles.icon}  size={"30"} title="New file"/>
                </div>)
        }
    }
    return (
        <div className={styles.ideSidebar}>
            {/* <div className={styles.treeHeader}>
                <img className={styles.treeHeaderBg} src={validity_logo}/>
              
                
                
            </div> */}
           
            {renderTrees(props.workspace)}
        </div>
        
    )
}

const createFileListingItems = (files, onClick) => {
    Object.keys(files).map((file) => {
        

        return (
            <FileNameListing fname={file.fname} onClick={onClick} />
        )
    })
}

function FileNameListing(props) {
   

    const handleFileClick = () => {
        onClick(props.fname)
    }

    return (
        <button onClick={props.handleFileClick}>{props.fname}</button>
    )
}