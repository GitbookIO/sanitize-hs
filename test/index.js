var util = require('util');
var should = require('should');
var html2hs = require('html2hs');
var virtualDom = require('virtual-dom');
var toHTML = require('vdom-to-html');

var h = virtualDom.h;
var sanitize = require('../');

function hs(html) {
    return eval(html2hs(html));
}

function debug(hscript) {
    console.log(util.inspect(hscript, { showHidden: false, depth: null }));
}

function assertSanitize(input, output, opts) {
    output = output || input;
    var hscript = hs(input);

    // Sanitize the hscript
    hscript = sanitize(hscript, opts);

    // Stringify to html
    var result = toHTML(hscript);

    result.should.equal(output);
}


it('should return basic hyperscript', function() {
    assertSanitize('<h1>Hello World</h1>');
});


it('should sanitize scripts', function() {
    assertSanitize(
        '<div><h1>Hello World</h1> <script>alert("hello")</script></div>',
        '<div><h1>Hello World</h1> alert(&quot;hello&quot;)</div>'
    );
});

it('should sanitize attributes', function() {
    assertSanitize(
        '<div><a href="#" onclick="alert(\'test\')">Hello World</a></div>',
        '<div><a href="#">Hello World</a></div>'
    );
});

it('should sanitize javascript schema', function() {
    assertSanitize(
        '<div><a href="javascript:alert(\'test\')">Hello World</a></div>',
        '<div><a>Hello World</a></div>'
    );
});

it('should sanitize http/https schemas', function() {
    assertSanitize(
        '<div><a href="http://google.fr">Hello World</a></div>'
    );
});

it('should allow custom filtering', function() {
    assertSanitize(
        '<div><h1>Hello World</h1> <script type="math/tex">a = b</script></div>',
        '<div><h1>Hello World</h1> <script type="math/tex">a = b</script></div>',
        {
            isTagAllowed: function(tag, el) {
                if (tag == 'script' && el.properties.type == 'math/tex') return true;
            }
        }
    );
});

it('should allow custom escaping', function() {
    assertSanitize(
        '<div><h1>Hello World</h1> <script>alert("hello")</script></div>',

        // stringify doesn't escape VText as virtual-dom does
        '<div><h1>Hello World</h1> &lt;script&gt;alert(&quot;hello&quot;)&lt;/script&gt;</div>',
        {
            replace: toHTML
        }
    );
});

it('should sanitize styles', function() {
    assertSanitize(
        '<style>body { background-image: url(&#1;javascript:alert(\'XSS\')) }</style>',
        'body { background-image: url(&amp;#1;javascript:alert(&#39;XSS&#39;)) }'
    );
});

it('should allow nice css', function() {
    assertSanitize(
        '<DIV STYLE="width: 10px;">',
        '<div style="width: 10px;"></div>'
    );
});

it('should sanitize style atribute (url)', function() {
    assertSanitize(
        '<DIV STYLE="background-image: url(&#1;javascript:alert(\'XSS\'))">',
        '<div style=""></div>'
    );
});

it('should sanitize style atribute (expression)', function() {
    assertSanitize(
        '<DIV STYLE="width: expression(alert(\'XSS\'));">',
        '<div style=""></div>'
    );
});
