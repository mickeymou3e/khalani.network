use std::time::Duration;

use reqwest::{Client, Error, Method, Request, RequestBuilder, Response};
use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Message {
    role: String,
    content: String,
}
impl Message {
    pub fn mine(content: &str) -> Self {
        Self {
            role: String::from("user"),
            content: String::from(content),
        }
    }

    pub fn received(content: &str) -> Self {
        Self {
            role: String::from("assistant"),
            content: String::from(content),
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AnthropicRequest {
    max_tokens: u32,
    model: String,
    messages: Vec<Message>,
    system: String,
    stream: bool,
}

#[derive(Debug, Serialize, Deserialize, PartialEq)]
pub enum AnthropicRole {
    #[serde(rename = "user")]
    User,
    #[serde(rename = "assistant")]
    Assistant,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AnthropicConfig {
    api_key: String,
    version: String,
    api_endpoint: String,
    model: String,
    max_tokens: u32,
    system: String,
    stream: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Usage {
    input_tokens: u32,
    output_tokens: u32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ClaudeMsg {
    #[serde(rename = "type")]
    type_: String,
    pub text: String,
}

impl From<ClaudeMsg> for Message {
    fn from(msg: ClaudeMsg) -> Self {
        Self {
            role: String::from("assistant"),
            content: String::from(msg.text),
        }
    }
}

impl From<&ClaudeMsg> for Message {
    fn from(msg: &ClaudeMsg) -> Self {
        Self {
            role: String::from("assistant"),
            content: String::from(msg.text.clone()),
        }
    }
}
#[derive(Debug, Serialize, Deserialize)]
pub struct AnthropicResponse {
    id: String,
    pub content: Vec<ClaudeMsg>,
    role: AnthropicRole,
    
    stop_reason: Option<String>,
    stop_sequence: Option<String>,
    usage: Option<Usage>,


}

impl Default for AnthropicConfig {
    fn default() -> Self {
        Self {
            api_key: String::from(""),
            version: String::from("2023-06-01"),
            api_endpoint: String::from("https://api.anthropic.com/v1/"),
            model: String::from("claude-3-5-sonnet-20240620"),
            max_tokens: 1024,
            system: String::from("You are a helpful assistant."),
            stream: false,
        }
    }
}

impl AnthropicConfig {
    pub fn system(&mut self, system: &str) {
        self.system = String::from(system);
    }
}


pub struct AnthropicClient {
    config: AnthropicConfig,
    client: Client,
    messages: Vec<Message>,
}

impl Default for AnthropicClient {
    fn default() -> Self {
        Self {
            config: AnthropicConfig::default(),
            client: Client::new(),
            messages: Vec::new(),
        }
    }
}

pub enum Endpoint {
    Messages
}

impl std::fmt::Display for Endpoint {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Endpoint::Messages => write!(f, "messages"),
        }
    }
}

impl AnthropicClient {
    pub fn new(config: AnthropicConfig) -> Self {
        let client = Client::new();
        Self {
            config,
            client,
            messages: Vec::new(),
        }
    }

    pub fn set_api_key(&mut self, api_key: &str) {
        self.config.api_key = String::from(api_key);
    }

    pub fn set_system(&mut self, system: &str) {
        self.config.system(system);
    }

    pub fn prep_request(&mut self, prompt: &str, endpoint: Endpoint) -> Request {
        self.messages.push(Message::mine(prompt));
      
        let req = AnthropicRequest {
            max_tokens: self.config.max_tokens,
            model: self.config.model.clone(),
            messages: self.messages.clone(),
            system: self.config.system.clone(),
            stream: self.config.stream,
        };
        let req_string = serde_json::to_string(&req).unwrap();
        let mut req_builder = self.client.post( format!("{}{}", self.config.api_endpoint, endpoint)); 
        req_builder = req_builder.header("anthropic-version", self.config.version.clone());
        req_builder = req_builder.header("x-api-key", self.config.api_key.clone());
        req_builder = req_builder.header("Content-Type", "application/json");
        req_builder = req_builder.body(req_string);
        req_builder = req_builder.timeout(Duration::from_millis(600000));
        req_builder.build().unwrap()
        
        

    }

    pub async fn send_req(&mut self, req: Request) -> Result<String, String> {
       let res = self.client
        .execute(req).await;
        match res {
            Ok(res) => {
                let res_text = res.text().await.expect("Failed to get response text");
                let res_json = serde_json::from_str::<AnthropicResponse>(&res_text);
                match res_json {
                    Ok(res_json) => {
                        self.messages.push(Message::from(res_json.content.first().unwrap().clone()));
                        Ok(res_json.content.first().unwrap().text.clone())
                    },
                    Err(e) => {
                        self.messages.pop();
                        println!("Error parsing response JSON: {}", res_text);
                        Err(e.to_string())
                    }
                }
                

            },

            Err(e) => {
                self.messages.pop();
                return Err(e.to_string());
            }
           
        }

    }

    pub async fn create_and_send_req(&mut self, promt: &str, endpoint: Endpoint) -> Result<String, String> {
        let req = self.prep_request(promt, endpoint);
        self.send_req(req).await
    }

    
}