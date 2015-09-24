var util = require('util');
var should = require('should');
var html2hs = require('html2hs');
var virtualDom = require('virtual-dom');

var h = virtualDom.h;
var sanitize = require('../');

function hs(html) {
    return eval(html2hs(html));
}

function debug(hscript) {
    console.log(util.inspect(hscript, { showHidden: false, depth: null }));
}

it('should return basic hyperscript', function() {
    var hscript = hs('<h1>Hello World</h1>');
    hscript = sanitize(hscript);

    hscript.tagName.should.equal('H1');
    hscript.children.should.have.length(1);
    hscript.children[0].text = 'Hello World';
});


it('should sanitize scripts', function() {
    var hscript = hs('<div><h1>Hello World</h1> <script>alert("hello")</script></div>');
    hscript = sanitize(hscript);

    hscript.tagName.should.equal('DIV');
    hscript.children.should.have.length(3);
    hscript.children[0].tagName.should.equal('H1');
    hscript.children[1].text.should.equal(' ');
    hscript.children[2].should.have.property('text');
    hscript.children[2].should.not.have.property('tagName');
    hscript.children[2].text.should.equal('<script>alert("hello")</script>');
});
