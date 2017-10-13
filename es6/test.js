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

const o={
    name:"Håvard",
    scream() {return "Aaargh";}
};

console.log(o.scream());


const håvard = {name:"Håvard"};
function greet(age, address)
{
    console.log("I am "+this.name+ " aged "+age + " at "+address);
}
greet.call(håvard,47,"Høgåsveien 17A");
greet.apply(håvard, [47,"Høgåsveien 17A"]);

const printHåvard = greet.bind(håvard);

printHåvard(47,"Fortsatt Høgåsveien 17");

