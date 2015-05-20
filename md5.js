/*
 * jMd5
 *
 * Based off js implementation at http://www.myersdaily.org/joseph/javascript/md5-text.html
 *
 * To hash a string call StreamMD5.hash("hello")
 * If you wish to "stream" data use state = StreamMD5.init(), StreamMD5.update(state, 'new') and StreamMD5.finalize(state)
 *    It closely relates to how php's hash_init works
 *
 * Modified by James Hartig <fastest963@gmail.com>
 */

(function() {

    var HAS_BUFFERS = (typeof 'Buffer' !== 'undefined'),
        undefined;

    if (HAS_BUFFERS) {
        function bufferCharCodeAt(buf, offset) {
            return buf.readUInt8(offset);
        }
        function bufferSubstring(buf, start, end) {
            return buf.slice(start, end);
        }
        function bufferConcat(buf, buf2) {
            if (buf === null) {
                return buf2;
            }
            return Buffer.concat([buf, buf2]);
        }
    }

    function uint8ArraySubstring(uint8Array, start, end) {
        return uint8Array.subarray(start, end);
    }
    function uint8ArrayConcat(uint8Array1, uint8Array2) {
        if (uint8Array1 === null) {
            return uint8Array2;
        }
        var tmp = new Uint8Array(uint8Array1.length + uint8Array2.length);
        tmp.set(uint8Array1, 0);
        tmp.set(uint8Array2, uint8Array1.length);
        return tmp;
    }

    function stringCharCodeAt(string, offset) {
        return string.charCodeAt(offset);
    }
    function stringSubstring(string, start, end) {
        return string.substring(start, end);
    }

    function stringConcat(string, string2) {
        if (string === null) {
            return string2;
        }
        return string + string2;
    }


    function arrayCharCodeAt(array, offset) {
        return array[offset];
    }
    function arrayStringCharCodeAt(array, offset) {
        return array[offset].charCodeAt(0);
    }
    function arraySubstring(array, start, end) {
        return array.slice(start, end);
    }
    function arrayConcat(array, array2) {
        if (array === null) {
            return array2;
        }
        return array.concat(array2);
    }

    function md5cycle(x, k) {
        var a = x[0], b = x[1], c = x[2], d = x[3];

        a = ff(a, b, c, d, k[0], 7, -680876936);
        d = ff(d, a, b, c, k[1], 12, -389564586);
        c = ff(c, d, a, b, k[2], 17,  606105819);
        b = ff(b, c, d, a, k[3], 22, -1044525330);
        a = ff(a, b, c, d, k[4], 7, -176418897);
        d = ff(d, a, b, c, k[5], 12,  1200080426);
        c = ff(c, d, a, b, k[6], 17, -1473231341);
        b = ff(b, c, d, a, k[7], 22, -45705983);
        a = ff(a, b, c, d, k[8], 7,  1770035416);
        d = ff(d, a, b, c, k[9], 12, -1958414417);
        c = ff(c, d, a, b, k[10], 17, -42063);
        b = ff(b, c, d, a, k[11], 22, -1990404162);
        a = ff(a, b, c, d, k[12], 7,  1804603682);
        d = ff(d, a, b, c, k[13], 12, -40341101);
        c = ff(c, d, a, b, k[14], 17, -1502002290);
        b = ff(b, c, d, a, k[15], 22,  1236535329);

        a = gg(a, b, c, d, k[1], 5, -165796510);
        d = gg(d, a, b, c, k[6], 9, -1069501632);
        c = gg(c, d, a, b, k[11], 14,  643717713);
        b = gg(b, c, d, a, k[0], 20, -373897302);
        a = gg(a, b, c, d, k[5], 5, -701558691);
        d = gg(d, a, b, c, k[10], 9,  38016083);
        c = gg(c, d, a, b, k[15], 14, -660478335);
        b = gg(b, c, d, a, k[4], 20, -405537848);
        a = gg(a, b, c, d, k[9], 5,  568446438);
        d = gg(d, a, b, c, k[14], 9, -1019803690);
        c = gg(c, d, a, b, k[3], 14, -187363961);
        b = gg(b, c, d, a, k[8], 20,  1163531501);
        a = gg(a, b, c, d, k[13], 5, -1444681467);
        d = gg(d, a, b, c, k[2], 9, -51403784);
        c = gg(c, d, a, b, k[7], 14,  1735328473);
        b = gg(b, c, d, a, k[12], 20, -1926607734);

        a = hh(a, b, c, d, k[5], 4, -378558);
        d = hh(d, a, b, c, k[8], 11, -2022574463);
        c = hh(c, d, a, b, k[11], 16,  1839030562);
        b = hh(b, c, d, a, k[14], 23, -35309556);
        a = hh(a, b, c, d, k[1], 4, -1530992060);
        d = hh(d, a, b, c, k[4], 11,  1272893353);
        c = hh(c, d, a, b, k[7], 16, -155497632);
        b = hh(b, c, d, a, k[10], 23, -1094730640);
        a = hh(a, b, c, d, k[13], 4,  681279174);
        d = hh(d, a, b, c, k[0], 11, -358537222);
        c = hh(c, d, a, b, k[3], 16, -722521979);
        b = hh(b, c, d, a, k[6], 23,  76029189);
        a = hh(a, b, c, d, k[9], 4, -640364487);
        d = hh(d, a, b, c, k[12], 11, -421815835);
        c = hh(c, d, a, b, k[15], 16,  530742520);
        b = hh(b, c, d, a, k[2], 23, -995338651);

        a = ii(a, b, c, d, k[0], 6, -198630844);
        d = ii(d, a, b, c, k[7], 10,  1126891415);
        c = ii(c, d, a, b, k[14], 15, -1416354905);
        b = ii(b, c, d, a, k[5], 21, -57434055);
        a = ii(a, b, c, d, k[12], 6,  1700485571);
        d = ii(d, a, b, c, k[3], 10, -1894986606);
        c = ii(c, d, a, b, k[10], 15, -1051523);
        b = ii(b, c, d, a, k[1], 21, -2054922799);
        a = ii(a, b, c, d, k[8], 6,  1873313359);
        d = ii(d, a, b, c, k[15], 10, -30611744);
        c = ii(c, d, a, b, k[6], 15, -1560198380);
        b = ii(b, c, d, a, k[13], 21,  1309151649);
        a = ii(a, b, c, d, k[4], 6, -145523070);
        d = ii(d, a, b, c, k[11], 10, -1120210379);
        c = ii(c, d, a, b, k[2], 15,  718787259);
        b = ii(b, c, d, a, k[9], 21, -343485551);

        x[0] = add32(a, x[0]);
        x[1] = add32(b, x[1]);
        x[2] = add32(c, x[2]);
        x[3] = add32(d, x[3]);
    }

    function cmn(q, a, b, x, s, t) {
        a = add32(add32(a, q), add32(x, t));
        return add32((a << s) | (a >>> (32 - s)), b);
    }

    function ff(a, b, c, d, x, s, t) {
        return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    function gg(a, b, c, d, x, s, t) {
        return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    function hh(a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function ii(a, b, c, d, x, s, t) {
        return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    function init() {
        return [1732584193, -271733879, -1732584194, 271733878, 0, null];
    }

    //progressive md51
    function update(state, s) {
        var len = s.length,
            substring, charCodeAt, concat;
        if (HAS_BUFFERS && (s instanceof Buffer)) {
            substring = bufferSubstring;
            charCodeAt = bufferCharCodeAt;
            concat = bufferConcat;
        } else if (s instanceof Array) {
            substring = arraySubstring;
            if (typeof s[0] === 'string') {
                charCodeAt = arrayStringCharCodeAt;
            } else {
                charCodeAt = arrayCharCodeAt;
            }
            concat = arrayConcat;
        } else if (s instanceof Uint8Array) {
            substring = uint8ArraySubstring;
            charCodeAt = arrayCharCodeAt;
            concat = uint8ArrayConcat;
        } else {
            substring = stringSubstring;
            charCodeAt = stringCharCodeAt;
            concat = stringConcat;
        }
        if (!state) {
            state = init();
        }
        state[4] += len;
        //if we have trailing data
        if (state[5] !== null) {
            s = concat(state[5], s);
            state[5] = null;
            len = s.length;
        }
        for (var i = 64; i <= len; i+=64) {
            md5cycle(state, md5blk(substring(s, i-64, i), charCodeAt));
        }
        state[5] = concat(state[5], substring(s, i-64));
        return state;
    }

    function finalize(state) {
        var n = state[4],
            s = state[5],
            i, l;
        //if we have trailing data
        if (s !== null && s.length >= 64) {
            //clear out last buffer since we're sending it to update
            state[5] = null;
            state = update(state, s);
            s = state[5];
        }
        //todo: clean this up somehow
        var substring, charCodeAt;
        if (HAS_BUFFERS && (s instanceof Buffer)) {
            substring = bufferSubstring;
            charCodeAt = bufferCharCodeAt;
        } else if (s instanceof Array) {
            substring = arraySubstring;
            if (typeof s[0] === 'string') {
                charCodeAt = arrayStringCharCodeAt;
            } else {
                charCodeAt = arrayCharCodeAt;
            }
        } else if (s instanceof Uint8Array) {
            substring = uint8ArraySubstring;
            charCodeAt = arrayCharCodeAt;
        } else {
            substring = stringSubstring;
            charCodeAt = stringCharCodeAt;
        }
        var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        if (s !== null) {
            for (i = 0, l = s.length; i < l; i++) {
                tail[i >> 2] |= charCodeAt(s, i) << ((i % 4) << 3);
            }
        }
        tail[i>>2] |= 0x80 << ((i%4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i=0; i<16; i++) tail[i] = 0;
        }
        tail[14] = n * 8;
        md5cycle(state, tail);

        state.pop(); //get rid of the data count
        state.pop(); //get rid of the cache
        return hex(state);
    }

    function md51(s, substring, charCodeAt) {
        var state = init();
        state[4] = s.length;
        state[5] = s;
        return finalize(state);
    }

    function md5blk(s, charCodeAt) { /* I figured global was faster.   */
        var md5blks = [], i; /* Andy King said do it this way. */
        for (i=0; i<64; i+=4) {
            md5blks[i>>2] = charCodeAt(s, i)
            + (charCodeAt(s, i+1) << 8)
            + (charCodeAt(s, i+2) << 16)
            + (charCodeAt(s, i+3) << 24);
        }
        return md5blks;
    }

    var hex_chr = '0123456789abcdef'.split('');

    function rhex(n) {
        var s='', j=0;
        for(; j<4; j++)
            s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
                + hex_chr[(n >> (j * 8)) & 0x0F];
        return s;
    }

    function hex(x) {
        for (var i=0; i<x.length; i++)
            x[i] = rhex(x[i]);
        return x.join('');
    }

    function add32(a, b) {
        return (a + b) & 0xFFFFFFFF;
    }

    function hash(s) {
        return md51(s);
    }

    //detect if in older IE and fallback to stupid version of add32
    if (hash('hello') != '5d41402abc4b2a76b9719d911017c592') {
        function add32(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF),
                msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }
    }

    var StreamMD5 = {
        init: init,
        update: update,
        finalize: finalize,
        hash: hash
    };

    if (typeof module !== "undefined") {
        module.exports = StreamMD5;
    } else {
        window.StreamMD5 = StreamMD5;
        window.jsMd5 = StreamMD5; //backwards-compatibility

        if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
            define('StreamMD5', function() {
                return StreamMD5;
            });
        }
    }
}());
