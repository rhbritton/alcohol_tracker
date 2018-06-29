$(function() {

	$('.toggle').click(function() {
		$('.main_section').attr('data-show', 'false');

		if ($(this).attr('data-type') == 'alarm') {
			$(this).attr('data-type', 'settings');
			$('.alarm').attr('data-show', 'true');
		} else {
			$(this).attr('data-type', 'alarm');
			$('.settings').attr('data-show', 'true');
		}
	});

	// $('[name="tolerance"]').change(function() {
	// 	var low = 0.08
	// 	  , lowmid = 0.12
	// 	  , highmid = 0.16
	// 	  , high = 0.2
	// 	  , tolerance = (parseInt($(this).val())+10)/15;

	// 	console.log('test')

	// 	$('.low').text((tolerance*low).toFixed(2))
	// 	$('.lowmid').text((tolerance*lowmid).toFixed(2))
	// 	$('.highmid').text((tolerance*highmid).toFixed(2))
	// 	$('.high').text((tolerance*high).toFixed(2))
	// })

	$('.add_half_drink').click(function() {
		$('.drinks_had').text(parseFloat($('.drinks_had').text())+0.5);
	});

	$('.minus_half_drink').click(function() {
		if (parseFloat($('.drinks_had').text())-0.5 > 0)
			$('.drinks_had').text(parseFloat($('.drinks_had').text())-0.5);
		else
			$('.drinks_had').text('0');
	});

	$('.add_drink').click(function() {
		$('.drinks_had').text(parseFloat($('.drinks_had').text())+1);
	});

	$('.minus_drink').click(function() {
		if (parseFloat($('.drinks_had').text())-1 > 0)
			$('.drinks_had').text(parseFloat($('.drinks_had').text())-1);
		else
			$('.drinks_had').text('0');
	});

	function toHours(timerObj) {
		var hours = 0;
		hours += timerObj.days*24;
		hours += timerObj.hours;
		hours += timerObj.minutes/60;
		hours += timerObj.seconds/(60*60);

		return hours;
	}

	//height = parseInt($('[name="feet"]').val() * 12) + parseInt($('[name="inches"]').val())
	var weight = parseInt($('[name="weight"]').val())
	  , gender = $('[name="gender"]').val()
	  , tolerance = parseInt($('[name="tolerance"]').val())
	  // , metabolism = parseInt($('[name="metabolism"]').val())
	  , bac = parseFloat($('[name="bac"]').val());

	$('[name="weight"]').change(function() {
		weight = parseInt($('[name="weight"]').val())
	});

	$('[name="gender"]').change(function() {
		gender = $('[name="gender"]').val()
	});

	$('[name="tolerance"]').change(function() {
		tolerance = parseInt($('[name="tolerance"]').val())

		var low = 0.05
		  , lowmid = 0.1
		  , mid = 0.14
		  , highmid = 0.18
		  , high = 0.22
		  , adjustedTolerance = calcAdjustedTolerance(tolerance);

		console.log('adjustedTolerance')

		$('option[value="0.05"]').text(('Stay Sober (~'+(adjustedTolerance*low).toFixed(2)+'%)'))
		$('option[value="0.1"]').text(('Tipsy (~'+(adjustedTolerance*lowmid).toFixed(2)+'%)'))
		$('option[value="0.14"]').text(('Drunk (~'+(adjustedTolerance*mid).toFixed(2)+'%)'))
		$('option[value="0.18"]').text(('Hammered (~'+(adjustedTolerance*highmid).toFixed(2)+'%)'))
		$('option[value="0.22"]').text(('Don\'t Do This (~'+(adjustedTolerance*high).toFixed(2)+'%)'))
	});

	$('[name="bac"]').change(function() {
		bac = parseFloat($('[name="bac"]').val())
	});

	var timer = new Timer();
	$('.start').click(function() {
		timer.start();

		timer.addEventListener('secondsUpdated', function(e) {
		    $('.timer').html(timer.getTimeValues().toString());
		    
		    var hours = toHours(timer.getTimeValues());
		    var drinksTillGoal = calcDrinksNeeded(parseFloat($('.drinks_had').text()), hours, weight, gender, tolerance, bac);
		    var currentBAC = calcCurrentBAC(parseFloat($('.drinks_had').text()), hours, weight, gender, tolerance);

		    $('.drinks_till_goal').text(drinksTillGoal.toFixed(4));
		    $('.current_bac').text(currentBAC.toFixed(2)+'%');


		    //calcDrinks(height, weight, gender, tolerance, metabolism, bac)
		});

		$(this).attr('disabled', true);
	});

	$('.reset').click(function() {
		$('.timer').html('00:00:00');
		$('.drinks_till_goal').text('0');
		$('.drinks_had').text('0');
		$('.current_bac').text('0.00%');
		timer.reset();
		timer.stop();

		$('.start').removeAttr('disabled');
	});

	function calcAdjustedTolerance(tolerance) {
		return (tolerance+10)/15; //((((tolerance+10)/15)-1)*2)+1;
	}

	function calcDrinksNeeded(drinksHad, hours, weight, gender, tolerance, bac) {
		var toleranceMultiplier = calcAdjustedTolerance(tolerance);

		console.log(toleranceMultiplier)

		var drinksTillGoal = 0;

		// bac = (((numDrinks/2)*5.14)/(weight*0.66))-(0.015*hours)

		if (gender == 'female') {
			drinksTillGoal = (((bac+(0.015*hours))*(weight*0.66))/5.14)*2;
		} else if (gender == 'male') {
			drinksTillGoal = (((bac+(0.015*hours))*(weight*0.73))/5.14)*2;
		}

		drinksTillGoal *= toleranceMultiplier;

		return (drinksTillGoal-drinksHad);
	}

	function calcCurrentBAC(drinksHad, hours, weight, gender, tolerance) {
		var currentBAC = 0;
		if (gender == 'female') {
			currentBAC = ((drinksHad/2)/((weight*0.66)/5.14))-(0.015*hours);
		} else if (gender == 'male') {
			currentBAC = ((drinksHad/2)/((weight*0.73)/5.14))-(0.015*hours);
		}

		if (currentBAC < 0)
			currentBAC = 0;

		return currentBAC;
	}

})