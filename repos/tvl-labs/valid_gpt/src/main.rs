use std::{io::{Read, Write}, path::{Path, PathBuf}};

use reasoner::{Mode, WriteTo};
use tokio::io;
use dotenv::dotenv;
mod anthropic;
mod reasoner;
// #[tokio::main]
// async fn main() {
//     let mut client = anthropic::AnthropicClient::default();
//     let req = client.prep_request("Hello, world!", anthropic::Endpoint::Messages);
 
//     println!("REQ: {:?}", req);
//     println!("REQ BODY: {:?}", req.body());
//     let res = client.send_req(req).await.unwrap();
//     println!("RES: {:?}", res);
//     let res = client.create_and_send_req("Yes please. Can you tell me if you can browse the web", anthropic::Endpoint::Messages).await.expect("Failed to send request");
//     println!("RES: {:?}", res);
// }

#[tokio::main]
async fn main() {
    dotenv().ok();
 
    let curr_working_Dir = std::env::current_dir().expect("Failed to get current directory");
    let mut client = anthropic::AnthropicClient::default();
    let api_key = std::env::var("ANTHROPIC_API_KEY").expect("ANTHROPIC_API_KEY must be set as an environment variable");
    
    println!("Welcome to Valid GPT! Type 'exit' to quit.");

    loop {
        println!("What would you like to do? [explain, formalize] ");
        print!("> ");
        std::io::stdout().flush().unwrap();

        let mut user_input = String::new();
        let mut mode = String::new();
        let mut output_kind = String::new();
        let mut file_name = String::new();
        
        std::io::stdin().read_line(&mut mode).expect("Failed to read line");
        println!("Okay, you've chosen {}\nWould you like me to place the results in a file or print them to the screen? [file, stdout]", mode);
        print!("> ");
        std::io::stdout().flush().unwrap();
        std::io::stdin().read_line(&mut output_kind).expect("Failed to read line");
        if (output_kind.trim().to_lowercase() == "file") {
            println!("Okay, I'll write the results to a file. What would you like me to name the file? ");
            print!("> ");
            std::io::stdout().flush().unwrap();
            std::io::stdin().read_line(&mut file_name).expect("Failed to read line");
        } else if output_kind.trim().to_lowercase() == "stdout" {
            println!("Okay, I'll print the results to the screen.");
        } else {
            println!("Invalid output kind. Please choose either 'file' or 'stdout'.");
            std::io::stdin().read_line(&mut output_kind).expect("Failed to read line");
        }
        println!("And finally, what is the path to the file you'd like me to {}? ", mode);
        print!("> ");
        std::io::stdout().flush().unwrap();
        
        std::io::stdin().read_line(&mut user_input).expect("Failed to read line");
        // relative path
        let user_input = user_input.trim();
        let normalized_path = curr_working_Dir.join(PathBuf::from(user_input).canonicalize().unwrap());
        println!("Reading from {}", normalized_path.clone().to_str().unwrap());
        let prompt = std::fs::read_to_string(normalized_path).expect("Failed to read file");

        if user_input.to_lowercase() == "exit" {
            println!("Goodbye!");
            break;
        }
        let mode = Mode::from(mode.to_lowercase().trim()); 
        let write_to = if output_kind.trim().to_lowercase() == "file" {
            let path_to_write_to = Path::new(&curr_working_Dir).join(file_name.trim());
            let path_to_write_to = path_to_write_to.to_str().unwrap();
            println!("Writing results to {}", path_to_write_to);
            WriteTo::from(path_to_write_to)
        } else {
            WriteTo::from(output_kind.as_str())
        };
        let mut reasoner = reasoner::Reasoner::init_with_api_key(&api_key, write_to, mode);
        
        match reasoner.send_req(&prompt).await {
            Ok(_) => {
                println!("Done!");
            },
            Err(e) => println!("Error: {}", e),
        }

        // match client.create_and_send_req(user_input, anthropic::Endpoint::Messages).await {
        //     Ok(response) => {
        //         let res_json: anthropic::AnthropicResponse = serde_json::from_str(&response).expect("Failed to parse response JSON");
        //         if let Some(content) = res_json.content.first() {
        //             println!("\nAI: {}\n", content.text);
        //         } else {
        //             println!("\nAI: No response content\n");
        //         }
        //     },
        //     Err(e) => println!("Error: {}", e),
        // }
    }
}