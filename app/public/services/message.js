angular.module('app.messageService', [])
.service('MessageService', function($rootScope,$timeout){
	$rootScope.notifyText = "";
	$rootScope.notifyDanger = false;
	$rootScope.showNotify = false;
	var info_ = ["Registrierung war erfolgreich"]
	var danger_ = ["Fehler"]


	var info = function(messageIndex){
		$rootScope.notifyText = info_[messageIndex];
		$rootScope.notifyDanger = false;
		showMessage();
	}

	var danger = function(messageIndex){
		$rootScope.notifyText = danger_[messageIndex];
		$rootScope.notifyDanger = true;
		showMessage();
	}

	function showMessage(){
		$rootScope.showNotify = true;
	}

	var hideMessage = function (){
		$rootScope.showNotify = false;	
	}

	return{
		info : info,
		danger : danger,
		hideMessage : hideMessage
	}
})