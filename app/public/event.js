$(document).on('click', 'a[href="#"]', function(event) {
	event.preventDefault();
});

$(document).on('click', '.angebote li', function(event) {
	event.preventDefault();
	$('.angebot_loader').addClass('active');
});

$(document).on('click', '.closeangebot', function(event) {
	event.preventDefault();
	$('.angebot_loader').removeClass('active');
});

$(document).on('click', '.large', function(event) {
	event.preventDefault();
	$(this).removeClass('active');
	$('.content,.small').addClass('active');
	$('.description .content_').addClass('large_');
});

$(document).on('click', '.small', function(event) {
	event.preventDefault();
	$(this).removeClass('active');
	$('.large').addClass('active');
	$('.content').removeClass('active')
	$('.description .content_').removeClass('large_');
});

$(document).on('click', '.switch_des li', function(event) {
	event.preventDefault();
	$('.switch_des li').removeClass('active');
	$(this).addClass('active');
	$('.content_').removeClass('active');
	$('.content_[typ="'+$(this).attr('typ')+'"]').addClass('active')
});


$(document).on('click','a[href="/buchung"]', function(event) {
	event.preventDefault();
	$('.overlay,.closeall,.meetingform').addClass('active');
	setTimeout(function(){
		$('.meetingform').find('input').eq(0).trigger('focus')	
	},400)
	
});

$(document).on('click','.closeall', function(event) {
	event.preventDefault();
	$('.overlay,.closeall,.meetingform').removeClass('active');
});

function isEmpty( el ){
	return !$.trim(el.html())
}

$.fn.showNoti = function(text){
	$('.noti p').text(text);
	$('.noti').addClass('active');
	setTimeout(function(){
		$('.noti').removeClass('active');
	},7000);
}

$(document).mouseup(function (e) {
    var container = $(".inbox");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        container.removeClass('active');
        $('.firstnoti').removeClass('active');
    }
});

$(document).on('click', '.opennoti', function(event) {
	event.preventDefault();
	$('.inbox').toggleClass('active');
	$('.firstnoti').addClass('active');
});