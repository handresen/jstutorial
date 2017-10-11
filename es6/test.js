"use strict";

const sentences=[
    { subject: "JavaScript", verb: "is", object: "great"},
    { subject: "Elephants", verb: "are", object: "large"}, 
];

function say({subject, verb, object}){
    console.log(`${subject} ${verb} ${object}`);
}

for(let s of sentences) {
    say(s);
}

const obj= {a:7, b:9};
const {a,b}= obj;

console.log("a:"+a+" b:"+b);

