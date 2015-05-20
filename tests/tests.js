var fs = require('fs'),
    StreamMD5 = require('../md5.js');

function c(c) {
    return c.charCodeAt(0);
}

exports.helloString = function(test) {
    var hash = StreamMD5.hash('hello');
    test.equal(hash, '5d41402abc4b2a76b9719d911017c592');
    test.done();
};

exports.emptyString = function(test) {
    var hash = StreamMD5.hash('');
    test.equal(hash, 'd41d8cd98f00b204e9800998ecf8427e');
    test.done();
};

exports.longString = function(test) {
    var hash = StreamMD5.hash('superDuperLongStringThatIsReallyLongAndWowWhatDoIKeepTypingEvenItsSoLongAlreadyMaybeJustALittleMore');
    test.equal(hash, '1d17b63f166d2bc32e9b21cd8ec3f45b');
    test.done();
};

exports.sixtyFourString = function(test) {
    var hash = StreamMD5.hash('superDuperLongStringThatIsReallyLongAndWowWhatDoIKeepTypingEvenI');
    test.equal(hash, '28042062548fb963b81566e15715d146');
    test.done();
};

exports.helloArray = function(test) {
    var hash = StreamMD5.hash(['h', 'e', 'l', 'l', 'o']);
    test.equal(hash, '5d41402abc4b2a76b9719d911017c592');
    test.done();
};

exports.helloBytesArray = function(test) {
    var hash = StreamMD5.hash([c('h'), c('e'), c('l'), c('l'), c('o')]);
    test.equal(hash, '5d41402abc4b2a76b9719d911017c592');
    test.done();
};

exports.helloUint8Array = function(test) {
    var hash = StreamMD5.hash(new Uint8Array([c('h'), c('e'), c('l'), c('l'), c('o')]));
    test.equal(hash, '5d41402abc4b2a76b9719d911017c592');
    test.done();
};

exports.helloStreaming = function(test) {
    var state = StreamMD5.init(),
        hash;
    StreamMD5.update(state, 'h');
    StreamMD5.update(state, 'ell');
    StreamMD5.update(state, 'o');
    hash = StreamMD5.finalize(state);
    test.equal(hash, '5d41402abc4b2a76b9719d911017c592');
    test.done();
};

exports.mp3Buffer = function(test) {
    fs.readFile('tests/noise.mp3', function(err, buffer) {
        if (err) throw err;
        test.ok((buffer instanceof Buffer));
        test.equal(StreamMD5.hash(buffer), '0377bc7d70c592cc73c5fb2af6af3d7b');
        test.done();
    });
};