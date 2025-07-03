/// Implement the `From` trait for a module error type to convert it into `MiraxError`.
#[macro_export]
macro_rules! impl_into_mirax_error {
    ($module_error: ty, $kind: ident) => {
        impl From<$module_error> for mirax_error::MiraxError {
            fn from(err: $module_error) -> Self {
                mirax_error::MiraxError::new(mirax_error::ErrorKind::$kind, err)
            }
        }
    };
}
