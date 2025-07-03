
import styles from './styles/Home.module.css'
import React, { create, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Editor, { useMonaco, loader, } from "@monaco-editor/react";
import { Tree, Directory } from "./tree";
import dirs from "./vdy-files";
import validity_logo from "./static/validity_logo.png";
import { FaPlay, FaCaretDown, FaCircleNotch, FaPauseCircle, FaBan, FaCompressArrowsAlt, FaChevronDown, FaSearchPlus } from "react-icons/fa";
import Shell from "./shell";

const ValidityConfig = {

  keywords: ["define", "!", "force", "load", "print", "eval", "let", "domain", "declare", "match", "check", "assert", "assume", "exists",
    "forall", "chain", "absurd", "pick-witness", "pick-any", "conclude", "by-induction", "holds", "module", "open", "induction", "function", "include", "load"
  ],
  typeKeywords: ["datatype", "structure"],
  operators: [
    ":=", "&", "|", "=", "=>", "==>", "->", "?"
  ],


  symbols: /[:=\->&\?\|]+/,
  declarations: ["module", "extend-module"],
  tokenizer: {
    root: [
      [/[a-zA-Z\-][\w$]*/, {
        cases: {
          '@typeKeywords': 'keyword',
          '@keywords': 'keyword',
          '@default': 'identifier',
          '@declarations': { token: 'keyword.decl', bracket: '@open' },
          '==by-induction': 'keyword'
        }
      }
      ],
      //[/\[([A-Z\s]+)\]/, 'type.identifier'],

      [/[{}()\[\]]/, '@brackets'],
      [/@symbols/, {
        cases: {
          '@operators': 'operator',
          '@default': ''
        }
      }],
      [/#(.*)$/, 'comment'],
      [':=', 'operator'],
      ['=', 'operator'],
      [/\d+/, 'number'],
      //[/[A-Z][\w\$]*/, 'type.identifier' ],  // to show class names nicely
      // whitespace
      //{ include: '@whitespace' },
    ],

  }
}

const ValidityTheme = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'keyword', foreground: '#FFA500' },
    { token: 'symbol', foreground: '#345BEB' },
    { token: 'comment', foreground: '#acadb0' },
    { token: 'identifier', foreground: '#91a6e3' },
    { token: 'type.identifier', foreground: '#7d5bb0' },
    { token: 'operator.validity', foreground: '#FFA500' }
  ],
  colors: {
    "editor.background": "#000000a2",
    "editorGutter.background": "#151a42",

    "minimap.background": "#151a42",
    "scrollbar.background": "#151a42",
    "scrollbarSlider.background": "#151a42",

    "editor.lineHightlightBackground": "#151a42",

    "editor.lineHighlightBorder": "#151a42",
  }
}

export default function Home() {
  const monacoRef = useRef()
  const [fileName, setFileName] = useState("/by-contradiction.axi")
  const [dirName, setDirName] = useState("Examples")
  const [code, setCode] = useState(file)
  const [execResult, setExecResult] = useState()
  const [localSave, setLocalSave] = useState(false)
  const [dirsData, setDirsData] = useState(dirs)
  const file = dirsData[dirName][fileName]
  console.log(file, "<< FILE")
  const bottomRef = useRef(null)
  const build_editor = (editor, monaco) => {
    monaco.languages.register({ id: "Validity", filenames: ["by-contradiction.axi", "custom-method.axi"], folder: true })
    monaco.languages.setMonarchTokensProvider("Validity", ValidityConfig)
    monaco.editor.defineTheme('ValidityTheme', ValidityTheme);
    monaco.editor.setTheme('ValidityTheme');
    monacoRef.current = editor
  }
  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    if (execResult != "" && execResult != "Execution in progress...") {

      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

  }, [execResult]);




  useEffect(() => {
    monacoRef.current?.focus()
    setCode(file.value)
  }, [file.fname])


  const handleCodeChange = (content, ev) => {
    setCode(content)
    let new_dirs_data = { ...dirsData };
    new_dirs_data[dirName][fileName] = { value: content, fname: fileName.substring(1) };
    setDirsData(new_dirs_data)
  }

  const openFile = (name) => {
    setFileName(`/${name}`)
  }

  const handleCodeRun = async (athCode, fname) => {

    let root_files = dirsData["/"];

    if (
      Object.keys(root_files).length > 1 &&
      !!root_files[fname]

    ) {
      console.log("Executing dir");
      console.log(`Sending files: ${root_files}`)

      let root_files_to_include = Object.assign({}, root_files)
      if (fname !== "/scratchpad.axi") {
        delete root_files_to_include["/scratchpad.axi"]
      }
      let payload = {
        file_to_run: fname.substring(1),
        files: Object.keys(root_files_to_include).map((name) => {
          let final_name = name.substring(1, name.length - 4)
          return {
            name: final_name,
            ath: root_files_to_include[name].value
          }
        })
      };

      let res = await fetch('/validity/multi-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      let rdr = res.body.getReader();
      let msg = ""
      rdr.read().then(function process({ done, value }) {
        if (done) {
          let execRes = JSON.parse(msg).message
          setExecResult(execRes)
        } else {
          let dcdr = new TextDecoder()
          let val = dcdr.decode(value)
          msg = msg.concat(val)
          return rdr.read().then(process)
        }


      })

    } else {
      let res = await fetch('/validity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ath: athCode })
      });

      let rdr = res.body.getReader();
      let msg = ""
      rdr.read().then(function process({ done, value }) {
        if (done) {
          let execRes = JSON.parse(msg).message
          setExecResult(execRes)
        } else {
          let dcdr = new TextDecoder()
          let val = dcdr.decode(value)
          msg = msg.concat(val)
          return rdr.read().then(process)
        }


      })
    }


  }

  const runCode = () => {
    setExecResult("Execution in progress...")
    //openFile("atp.axi");
    handleCodeRun(code, fileName)
  }

  const renderExecResult = (codeToRender) => {
    if (execResult && execResult != "") {
      return (
        codeToRender.split("\n").map((str) => {
          return (
            <p>{str}</p>
          )
        })
      )
    } else {
      return <p></p>
    }

  }

  // To do: reject all invalid filenames
  // To do: append .axi to filenames that do not have them
  const addFile = (fname, save) => {
    if (fname == "") {
      return;
    } else {
      if (!dirsData["/"][`/${fname}`]) {
        dirsData["/"][`/${fname}`] = {
          fname,
          value: `module RenameMe {

          }`
        }
      }
    }
  }

  const clearConsole = () => {
    handleCodeChange("");

  }
  const clearShell = () => {
    setExecResult("")
  }

  const handleFileDirClick = (fname, dirname) => {
    setDirName(dirname);
    openFile(fname);
  }
  return (
    <div>

      <main className={styles.grid}>
        <div className={styles.ideHeader}>
          <div className={styles.ideHeaderControls}>
            <FaPlay className={styles.runButton} size={"20"} title="Run" onClick={runCode} />
            <FaSearchPlus className={styles.headerControl} size={"20"} title="Run" onClick={runCode} />
          </div>
          <div className={styles.ideHeaderTitleWrapper}>

            <div className={styles.ideHeaderLogo}>

              <img src={validity_logo} />
            </div>
            <h1>Axi Playground</h1>
          </div>
        </div>
        <div className={styles.ideSidebar}>
          <Directory

            currDir={dirName}
            rootDir="/"
            onFileChange={(fname, dirname) => handleFileDirClick(fname, dirname)}
            workspace={dirsData}
            currFile={fileName}
            onFileAdd={(fname) => addFile(fname, localSave)}
          /></div>

        <Editor



          className={styles.ideEditor}

          options={{
            minimap: { enabled: true, side: "right" },
            scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 5, verticalHasArrows: false },

          }}
          language="Validity"

          onMount={build_editor}
          onChange={handleCodeChange}
          path={file.fname}
          defaultValue={file.value}
          value={file.value}


        />
        {/* <div className={styles.ideShell}>
          <div className={styles.shellHeader}>
         
              <FaBan size={"15"} title="Clear Output" onClick={clearShell} className={styles.shellControl}/>
              <FaChevronDown size={"15"} title="Hide" onClick={clearConsole} className={styles.shellControl}/>
            

            
          </div> */}
        <Shell
          clearShell={clearShell}
          clearConsole={clearConsole}
          execResult={execResult}
          renderExecResult={renderExecResult}
          bref={bottomRef}
        />
        {/* <div className={styles.shellContent}>
              <div className={styles.execResult}>
                {renderExecResult(execResult)}
                <div ref={bottomRef} />
              </div>
            </div> */}
        {/* </div> */}

        {/* <div className={styles.ideFooter}>
         
          <button className={styles.runButton} onClick={runCode}>Run</button>
          <button className={styles.stopButton} onClick={clearConsole}>Clear Input</button>
          <button className={`${styles.stopButton} ` } style={{marginLeft: "auto"}} onClick={clearShell}>Clear Output</button>
        </div> */}
      </main>
    </div>
  )
}

