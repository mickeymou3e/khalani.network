use convert_case::{Case, Casing};
use fut_ret::PinBoxFutRet;
use proc_macro::TokenStream;
use proc_macro2::Span;
use quote::quote;
use syn::{Ident, ItemFn, LitStr, ReturnType, parse_macro_input};

#[allow(clippy::format_push_string)]
pub fn expand_rpc_metrics(attr: TokenStream, func: TokenStream) -> TokenStream {
    let attr = parse_macro_input!(attr as Option<LitStr>);
    let func = parse_macro_input!(func as ItemFn);
    let func_sig = &func.sig;
    let func_ident = attr.map_or_else(
        || {
            let func_name = Ident::new(
                &func.sig.ident.to_string().to_case(Case::Camel),
                Span::call_site(),
            );
            quote! { #func_name }
        },
        |lit| {
            let func_name = &lit.parse::<Ident>().unwrap();
            quote! { #func_name }
        },
    );
    let func_block = &func.block;
    let func_output = &func_sig.output;
    let func_return = PinBoxFutRet::parse(func_output);
    let func_ret_ty = match func_output {
        ReturnType::Default => quote! { () },
        ReturnType::Type(_, ty) => quote! { #ty },
    };
    let ret_ty = func_return.return_type();

    let func_block_wrapper = if func_return.is_ret_pin_box_fut() {
        quote! {
            Box::pin(async move {
                let inst = std::time::Instant::now();
                let ret: #ret_ty = #func_block.await;

                if ret.is_err() {
                    medusa_apm::api_request_result_counter_vec_static()
                        .#func_ident
                        .failure
                        .inc();
                    return ret;
                }

                medusa_apm::api_request_result_counter_vec_static()
                    .#func_ident
                    .success
                    .inc();
                medusa_apm::api_request_time_histogram_static()
                    .#func_ident
                    .observe(medusa_apm::duration_to_sec(inst.elapsed()));

                ret
            })
        }
    } else {
        quote! {
            let inst = common_apm::Instant::now();
            let ret: #func_ret_ty = #func_block;

            if ret.is_err() {
                medusa_apm::api_request_result_counter_vec_static()
                    .#func_ident
                    .failure
                    .inc();
                return ret;
            }

            medusa_apm::api_request_result_counter_vec_static()
                .#func_ident
                .success
                .inc();
            medusa_apm::api_request_time_histogram_static()
                .#func_ident
                .observe(medusa_apm::duration_to_sec(inst.elapsed()));

            ret
        }
    };

    println!("func_block_wrapper: {}", func_block_wrapper);

    quote! {
        #func_sig {
            #func_block_wrapper
        }
    }
    .into()
}
