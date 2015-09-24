var should = require('should');
var html2hs = require('html2hs');
var virtualDom = require('virtual-dom');

var h = virtualDom.h;
var sanitize = require('../');

function hs(html) {
    return eval(html2hs(html));
}


it('should return basic hyperscript', function() {
    var hscript = hs('<h1>Hello World</h1>');
    hscript = sanitize(hscript);


    hscript.tagName.should.equal('H1');
    hscript.children.should.have.length(1);
    hscript.children[0].text = 'Hello World';
});