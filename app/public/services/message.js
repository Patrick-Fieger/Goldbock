angular.module('app.messageService', [])
.service('MessageService', function($rootScope,$timeout){
	$rootScope.notifyText = "";
	$rootScope.notifyDanger = false;
	$rootScope.showNotify = false;
	var info_ = [
		"Eine Email wurde an sie versendet",
		"Registrierung war erfolgreich",
		"Benutzer erfolgreich angelegt",
		"Passwort erfolgreich zurückgesetzt",
		"Angebot erfolgreich angelegt",
		"Angebot erfolgreich gespeichert",
		"Profil erfolgreich aktuallisiert",
		"Daten erfolgreich aktuallisiert",
		"Anfrage erfolgreich versendet",
		"Werbung erfolgreich geschalten",
		"Ihr Passwort wurde erfolgreich geändert"
	]
	var danger_ = [
		"Fehler",
		"Anfragen können noch nicht gesendet werden",
		"Email oder Passwort inkorrekt",
		"Angebot erfolgreich gelöscht",
		"Es gab einen Fehler bei der Registrierung",
		"Es gab einen Fehler bei der Verifizierung",
		"Sie dürfen nur einmal pro Woche eine Anzeige schalten"
	]

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

	var hideMessage = function (){
		$rootScope.showNotify = false;	
	}

	function showMessage(){
		$rootScope.showNotify = true;
		hideMessageAfterTimeout(3)
	}

	function hideMessageAfterTimeout(seconds){
		$timeout(function(){
			hideMessage()
		}, seconds * 1000)
	}

	return{
		info : info,
		danger : danger,
		hideMessage : hideMessage
	}
})