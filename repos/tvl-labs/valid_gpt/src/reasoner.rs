use std::io::Write;

use crate::anthropic;

pub enum WriteTo {
    Stdout,
    File(String),
}

pub enum Mode {
    Explain,
    Formalize,
}

impl From<&str> for Mode {
    fn from(s: &str) -> Self {
        match s.to_lowercase().as_str() {
            "explain" => Mode::Explain,
            "formalize" => Mode::Formalize,
            _ => panic!("Invalid mode"),
        }
    }
}

impl From<&str> for WriteTo {
    fn from(s: &str) -> Self {
        match s.to_lowercase().as_str() {
            "stdout" => WriteTo::Stdout,
            s => WriteTo::File(String::from(s)),
            _ => panic!("Invalid write to"),
        }
    }
}
pub struct Reasoner {
    pub client: anthropic::AnthropicClient,
    pub write_to: WriteTo,
    pub mode: Mode,
}

impl Default for Reasoner {
    fn default() -> Self {
        let mut client = anthropic::AnthropicClient::default();
        let system = std::fs::read_to_string("../system_prompts/reasoner.txt").expect("Failed to read system prompts");
        client.set_system(&system);
        Self {
            client,
            write_to: WriteTo::Stdout,
            mode: Mode::Explain,
        }
    }
}
impl Reasoner {
    pub fn init(write_to: WriteTo, mode: Mode) -> Self {
        let mut client = anthropic::AnthropicClient::default();
        
        let system = std::fs::read_to_string("./src/system_prompts/reasoner.txt").expect("Failed to read system prompts");
        client.set_system(&system);
        Self {
            client,
            write_to,
            mode
        }
    }

    pub fn init_with_client(client: anthropic::AnthropicClient, write_to: WriteTo, mode: Mode) -> Self {
        let mut selff = Self::init(write_to, mode);
        selff.client = client;
        selff
    }

    pub fn init_with_api_key(api_key: &str, write_to: WriteTo, mode: Mode) -> Self {
        let mut selff = Self::init(write_to, mode);
        selff.client.set_api_key(api_key);
        selff
    }
    
    pub async fn send_req(&mut self, prompt: &str) -> Result<(), String> {
        let res = self.client.create_and_send_req(prompt, anthropic::Endpoint::Messages).await;
        match res {
            Ok(res) => {
                match &self.write_to {
                    WriteTo::Stdout => {
                        println!("{}", res);
                        Ok(())
                    },
                    WriteTo::File(path) => {
                        match self.mode {
                            Mode::Explain => { 
                                let mut file = std::fs::File::create(path).expect("Failed to create file");
                                file.write_all(r#"\documentclass[a4paper]{article}
\usepackage{mathtools}
\begin{document}
                                "#.as_bytes()).expect("Failed to write to file");
                                file.write_all(res.as_bytes()).expect("Failed to write to file");
                                file.write_all(r#"
\end{document}
                                "#.as_bytes()).expect("Failed to write to file");
                            },
                            Mode::Formalize => {
                                let mut file = std::fs::File::create(path).expect("Failed to create file");
                                file.write_all(res.as_bytes()).expect("Failed to write to file");
                            }
                      
                    }
                    Ok(())
                }
              
            }
        }
        Err(e) => Err(e.to_string())
    }
}
}