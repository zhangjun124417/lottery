var a = {a:1};
var b = {b:a};
var c = {c:a};
b.b.a=2;
console.info(c)
