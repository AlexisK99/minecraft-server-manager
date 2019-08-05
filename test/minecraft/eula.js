const { describe, it, beforeEach, before, after } = require('mocha');
const assert = require('assert').strict;
const mock = require('mock-fs');
const path = require('path');
const Eula = require(path.resolve('minecraft', 'Eula'));

const testUrl = 'http://foo.bar/eula/file';
const testFile = 'aule.txt';
const eulaContents =
`#By changing the setting below to TRUE you are indicating your agreement to our EULA (${testUrl}).
#Thu Jan 01 00:00:00 UTC 1970
eula=false`;

// With full tests, mock-fs can be replaced with Minecraft Server interaction
describe('EULA', function () {
  // Testing internal properties (customUrl, customFile) is discouraged,
  // but necessary for full coverage
  describe('properties', function () {
    beforeEach(function () {
      this.eula = new Eula();
    });
    describe('url', function () {
      it('should be defined', function () {
        assert.equal(this.eula.url, Eula.url);
      });
      it('should store a custom URL', function () {
        this.eula.url = testUrl;
        assert.equal(this.eula.url, testUrl);
      });
      it('should not store an identical URL', function () {
        this.eula.url = Eula.url;
        assert.ok(!this.eula.customUrl);
      });
    });
    describe('file', function () {
      it('should be defined', function () {
        assert.equal(this.eula.file, Eula.file);
      });
      it('should store a custom filename', function () {
        this.eula.file = testFile;
        assert.equal(this.eula.file, testFile);
      });
      it('should not store an identical filename', function () {
        this.eula.file = Eula.file;
        assert.ok(!this.eula.customFile);
      });
    });
  });

  describe('methods', function () {
    before(function () {
      mock({
        [Eula.file]: eulaContents,
      });
    });
    beforeEach(function () {
      this.eula = new Eula();
    });
    describe('getUrl()', function () {
      it('should store and return the URL read from file', async function () {
        assert.equal(await this.eula.getUrl(path.resolve()), testUrl);
        assert.equal(this.eula.url, testUrl);
      });
      it('should reject with an Error if path is invalid', async function () {
        await assert.rejects(this.eula.getUrl('notapath'), { code: 'ENOENT' });
      });
    });
    after(mock.restore);
  });
});
