var util = require('util');
var should = require('should');
var html2hs = require('html2hs');
var virtualDom = require('virtual-dom');
var stringify = require('virtual-dom-stringify');

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
    hscript.children.should.have.length(2);
    hscript.children[0].tagName.should.equal('H1');
    hscript.children[1].text.should.equal(' ');
});

it('should sanitize attributes', function() {
    var hscript = hs('<div><a href="#" onclick="alert(\'test\')">Hello World</a></div>');
    hscript = sanitize(hscript);

    hscript.tagName.should.equal('DIV');
    hscript.children.should.have.length(1);
    hscript.children[0].tagName.should.equal('A');
    hscript.children[0].properties.should.have.property('href');
    hscript.children[0].properties.should.not.have.property('onclick');
    hscript.children[0].children[0].text.should.equal('Hello World');
});

it('should allow custom filtering', function() {
    var hscript = hs('<div><h1>Hello World</h1> <script type="math/tex">a = b</script></div>');
    hscript = sanitize(hscript, {
        isTagAllowed: function(tag, el) {
            if (tag == 'script' && el.properties.type == 'math/tex') return true;
        }
    });

    hscript.tagName.should.equal('DIV');
    hscript.children.should.have.length(3);
    hscript.children[0].tagName.should.equal('H1');
    hscript.children[1].text.should.equal(' ');

    hscript.children[2].should.have.property('tagName');
    hscript.children[2].tagName.should.equal('SCRIPT');
    hscript.children[2].children.should.have.length(1);
    hscript.children[2].children[0].text.should.equal('a = b');
});

it('should allow custom escaping', function() {
    var hscript = hs('<div><h1>Hello World</h1> <script>alert("hello")</script></div>');
    hscript = sanitize(hscript, {
        replace: function(el) {
            return {
                text: stringify(el)
            }
        }
    });

    hscript.tagName.should.equal('DIV');
    hscript.children.should.have.length(3);
    hscript.children[0].tagName.should.equal('H1');
    hscript.children[1].text.should.equal(' ');
    hscript.children[2].should.have.property('text');
    hscript.children[2].should.not.have.property('tagName');
    hscript.children[2].text.should.equal('<script>alert("hello")</script>');
});
