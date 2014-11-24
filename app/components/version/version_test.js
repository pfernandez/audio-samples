'use strict';

describe('audio-samples.version module', function() {
  beforeEach(module('audio-samples.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
