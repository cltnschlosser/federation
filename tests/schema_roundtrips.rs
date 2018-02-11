extern crate graphql_parser;
#[cfg(test)] #[macro_use] extern crate pretty_assertions;

use std::io::Read;
use std::fs::File;

use graphql_parser::parse_schema;

fn roundtrip(filename: &str) {
    let mut buf = String::with_capacity(1024);
    let path = format!("tests/schemas/{}.graphql", filename);
    let mut f = File::open(&path).unwrap();
    f.read_to_string(&mut buf).unwrap();
    let ast = parse_schema(&buf).unwrap();
    assert_eq!(ast.to_string(), buf);
}

fn roundtrip2(filename: &str) {
    let mut buf = String::with_capacity(1024);
    let source = format!("tests/schemas/{}.graphql", filename);
    let target = format!("tests/schemas/{}_canonical.graphql", filename);
    let mut f = File::open(&source).unwrap();
    f.read_to_string(&mut buf).unwrap();
    let ast = parse_schema(&buf).unwrap();

    let mut buf = String::with_capacity(1024);
    let mut f = File::open(&target).unwrap();
    f.read_to_string(&mut buf).unwrap();
    assert_eq!(ast.to_string(), buf);
}

#[test] fn minimal() { roundtrip("minimal"); }
#[test] fn scalar_type() { roundtrip("scalar_type"); }
#[test] fn minimal_type() { roundtrip("minimal_type"); }
#[test] fn interfaces() { roundtrip("interfaces"); }
#[test] fn interfaces_amp() { roundtrip2("interfaces_amp"); }
#[test] fn simple_object() { roundtrip("simple_object"); }
#[test] fn extend_object() { roundtrip("extend_object"); }
// Not yet fully supported
//#[test] fn kitchen_sink() { roundtrip2("kitchen-sink"); }
