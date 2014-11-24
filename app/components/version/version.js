'use strict';

angular.module('audio-samples.version', [
  'audio-samples.version.interpolate-filter',
  'audio-samples.version.version-directive'
])

.value('version', '0.1');
