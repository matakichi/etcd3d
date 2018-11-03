(function() {
  'use strict';

angular.module('e3d.app').controller('extensionsService', extensionsService);

function extensionsService($uibModal) {
  var self = this;

  self.showTraefik = showCreateTraefik;

  function showCreateTraefik() {
    console.log('traefik.show()');
    var modalInstance = $uibModal.open({
      templateUrl: '/modal/traefik',
      controller: 'modalCreateTraefik',
      controllerAs: 'modal',
      size: 'lg'
    }).result.catch(angular.noop);;
  };


};
})();
