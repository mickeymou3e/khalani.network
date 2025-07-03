mod expand;

use proc_macro::TokenStream;

/// This macro is used to add metrics to **medusa** JSON-RPC method.
/// If the apm metrics name is different from the method name, you can specify the name as an argument.
/// Otherwise, the method name will be converted to camel case and used as the apm metrics name.
///
/// # Example
/// ```ignore
/// #[rpc(server)]
/// pub trait MedusaRpc {
///     #[method(name = "getSolutionForIntent")]
///     async fn get_solution(&self, intent_id: B256) -> RpcResult<Option<SignedSolution>>;
///
///     #[method(name = "getConnectedSolvers")]
///     async fn get_connected_solvers(&self) -> RpcResult<Vec<Address>>;
/// }
///
/// pub struct MedusaRpcImpl;
///
/// #[async_trait]
/// impl MedusaRpcServer for MedusaRpcImpl {
///     #[metrics("getSolutionForIntent")]
///     async fn get_solution(&self, _intent_id: B256) -> RpcResult<Option<SignedSolution>> {
///         Ok(None)
///     }
///
///     #[metrics]
///     async fn get_connected_solvers(&self) -> RpcResult<Vec<Address>> {
///         Ok(vec![])
///     }
/// }
/// ```
/// The expand macro will add the following code to the method:
/// ```ignore
/// impl MedusaRpcServer for MedusaRpcImpl {
///     fn get_solution<'life0, 'async_trait>(
///         &'life0 self,
///         _intent_id: B256,
///     ) -> ::core::pin::Pin<
///         Box<
///             dyn ::core::future::Future<
///                 Output = RpcResult<Option<SignedSolution>>,
///             > + ::core::marker::Send + 'async_trait,
///         >,
///     >
///     where
///         'life0: 'async_trait,
///         Self: 'async_trait,
///     {
///         Box::pin(async move {
///             let inst = std::time::Instant::now();
///             let ret: RpcResult<Option<SignedSolution>> = {
///                 Box::pin(async move {
///                     if let ::core::option::Option::Some(__ret) = ::core::option::Option::None::<
///                         RpcResult<Option<SignedSolution>>,
///                     > {
///                         #[allow(unreachable_code)] return __ret;
///                     }
///                     let __self = self;
///                     let _intent_id = _intent_id;
///                     let __ret: RpcResult<Option<SignedSolution>> = { Ok(None) };
///                     #[allow(unreachable_code)] __ret
///                 })
///             }
///                 .await;
///             if ret.is_err() {
///                 medusa_apm::api_request_result_counter_vec_static()
///                     .getSolutionForIntent
///                     .failure
///                     .inc();
///                 return ret;
///             }
///             medusa_apm::api_request_result_counter_vec_static()
///                 .getSolutionForIntent
///                 .success
///                 .inc();
///             medusa_apm::api_request_time_histogram_static()
///                 .getSolutionForIntent
///                 .observe(medusa_apm::duration_to_sec(inst.elapsed()));
///             ret
///         })
///     }
///     fn get_connected_solvers<'life0, 'async_trait>(
///         &'life0 self,
///     ) -> ::core::pin::Pin<
///         Box<
///             dyn ::core::future::Future<
///                 Output = RpcResult<Vec<Address>>,
///             > + ::core::marker::Send + 'async_trait,
///         >,
///     >
///     where
///         'life0: 'async_trait,
///         Self: 'async_trait,
///     {
///         Box::pin(async move {
///             let inst = std::time::Instant::now();
///             let ret: RpcResult<Vec<Address>> = {
///                 Box::pin(async move {
///                     if let ::core::option::Option::Some(__ret) = ::core::option::Option::None::<
///                         RpcResult<Vec<Address>>,
///                     > {
///                         #[allow(unreachable_code)] return __ret;
///                     }
///                     let __self = self;
///                     let __ret: RpcResult<Vec<Address>> = {
///                         Ok(::alloc::vec::Vec::new())
///                     };
///                     #[allow(unreachable_code)] __ret
///                 })
///             }
///                 .await;
///             if ret.is_err() {
///                 medusa_apm::api_request_result_counter_vec_static()
///                     .getConnectedSolvers
///                     .failure
///                     .inc();
///                 return ret;
///             }
///             medusa_apm::api_request_result_counter_vec_static()
///                 .getConnectedSolvers
///                 .success
///                 .inc();
///             medusa_apm::api_request_time_histogram_static()
///                 .getConnectedSolvers
///                 .observe(medusa_apm::duration_to_sec(inst.elapsed()));
///             ret
///         })
///     }
/// }
/// ```
#[proc_macro_attribute]
pub fn metrics(attr: TokenStream, func: TokenStream) -> TokenStream {
    expand::expand_rpc_metrics(attr, func)
}
