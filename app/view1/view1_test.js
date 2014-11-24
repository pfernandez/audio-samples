'use strict';

describe('audio-samples.view1 module', function() {

  beforeEach(module('audio-samples.view1'));

  describe('view1 controller', function(){
  
    it('should ....', inject(function($controller, $rootScope) {
      //spec body
      var scope = $rootScope.$new();
      var view1Ctrl = $controller('View1Ctrl', { $scope: scope });
      expect(view1Ctrl).toBeDefined();
      expect(scope.message1).toEqual('angular sux');
    }));

  });
});
