// Dom7
var $ = Dom7;

// Theme
var theme = 'auto';
if (document.location.search.indexOf('theme=') >= 0) {
  theme = document.location.search.split('theme=')[1].split('&')[0];
};

$('[name="demo-checkbox-movie"]').on('change', function (e) {
  var totalChecked = $('[name="demo-checkbox-movie"]:checked').length;
  if (totalChecked === 0) {
    $('[name="demo-checkbox-movies"]').prop('checked', false);
  } else if (totalChecked === 4) {
    $('[name="demo-checkbox-movies"]').prop('checked', true);
  }
  if (totalChecked === 1) {
    $('[name="demo-checkbox-movies"]').prop('indeterminate', true);
  } else {
    $('[name="demo-checkbox-movies"]').prop('indeterminate', false);
  }
});

// Parent checkbox change
$('[name="demo-checkbox-movies"]').on('change', function (e) {
  if (e.target.checked) {
    $('[name="demo-checkbox-movie"]').prop('checked', true);
  } else {
    $('[name="demo-checkbox-movie"]').prop('checked', false);
  }
});


document.getElementById('loginButton').addEventListener('click', function(){
  bt.blastPlanDropdown();
  app.navbar.show('.navbar');
  bt.goTo('userDetailsScreen');
});

document.getElementById('selectAutoButton').addEventListener('click', function(){
  alert("Coming Soon!");
});
//Change to hole select
document.getElementById('selectManual').addEventListener('click', function(){
  bt.goTo('terminal');
});

document.getElementById('toggleBlastPlan').addEventListener('change', function(){
  var selector = document.getElementById('holeSelector');
  var input = document.getElementById('holeSelectorInput');
  var selector2 = document.getElementById('detonatorSelector');
  var input2 = document.getElementById('detonatorSelectorInput');
  if(bt.usePlan == true){
    selector.style.display = "none";
    input.style.display = 'block';
    selector2.style.display = "none";
    input2.style.display = "block";
    bt.usePlan = false;
  } else {
    selector.style.display = "block";
    input.style.display = "none";
    selector2.style.display = "block";
    input2.style.display = "none";
    bt.usePlan = true;
  }
});

document.getElementById('holeSpecButton').addEventListener('click', function(){
  var holeVal = document.getElementById('holeSelect').value.split(",");
  holeName = bt.jobCard.holesPlanned[holeVal[0]][holeVal[1]]['holeName'];
  var detonator = document.getElementById('detonatorSelector').value;
  bt.jobCard.holes[bt.currentHole]['holeNumber'] = holeName;
  bt.jobCard.holes[bt.currentHole]['detonator'] = detonator;
  bt.goTo('terminal');
  if(bt.demo == false){
    app.methods.startStopToggle();
    bt.saveHole();
  } else {
    app.methods.startStopDemo();
    bt.saveHole();
  }
});

document.getElementById('editBlastDetails').addEventListener('click', function(){
  bt.goTo('editBlastDetailsScreen');
});

document.getElementById('blastDetailsSaveButton').addEventListener('click', function(){
  var mine = document.getElementById('mine-Input').value;
  var location = document.getElementById('location-Input').value;
  var plan = document.getElementById('plan-Input').value;
  var operator = document.getElementById('operator-Input').value;
  var subLocation = document.getElementById('subLocation-Input').value;
  var date = document.getElementById('date-Input').value;
  bt.jobCard.mine = mine;
  bt.jobCard.location = location;
  bt.jobCard.blastPlan = plan;
  bt.jobCard.userName.push(operator);
  bt.jobCard.subLocation = subLocation;
  bt.jobCard.date = date;
  document.getElementById('mine').innerHTML = mine;
  document.getElementById('location').innerHTML = location;
  document.getElementById('plan').innerHTML = plan;
  document.getElementById('operator').innerHTML = operator;
  document.getElementById('jobSubLocation').innerHTML = subLocation;
  document.getElementById('jobDate').innerHTML = date;
  bt.saveHole();
  bt.goTo('pre-blast-Report');
});

document.getElementById('blastDetailsSaveCancel').addEventListener('click', function(){
  bt.goTo('pre-blast-Report');
});

document.getElementById('editExcavation').addEventListener('click', function(){
  bt.goTo('editExcavationScreen');
});

document.getElementById('excavationDetailsSaveButton').addEventListener('click', function(){
  var height = document.getElementById('height-Input').value;
  var width = document.getElementById('width-Input').value;
  var profile = document.getElementById('profile-Input').value;
  bt.jobCard.jobHeight = height;
  bt.jobCard.jobWidth = width;
  bt.jobCard.profile = profile;
  document.getElementById('jobHeight').innerHTML = height+ "m";
  document.getElementById('jobWidth').innerHTML = width + "m";
  document.getElementById('jobProfile').innerHTML = profile;
  bt.saveHole();
  bt.goTo('pre-blast-Report');
});

document.getElementById('excavationDetailsSaveCancelButton').addEventListener('click', function(){
  bt.goTo('pre-blast-Report');
});

document.getElementById('editParameters').addEventListener('click', function(){
  bt.goTo('editParametersScreen');
});

document.getElementById('parametersDetailsSaveButton').addEventListener('click', function(){
  var diameter = document.getElementById('diameter-Input').value;
  var depth = document.getElementById('depth-Input').value;
  var rows = document.getElementById('rows-Input').value;
  var columns = document.getElementById('columns-Input').value;
  var v_spacing = document.getElementById('v_spacing-Input').value;
  var h_burdens = document.getElementById('h_burdens-Input').value;
  var perimeterOffset = document.getElementById('perimeterOffset-Input').value;
  bt.jobCard.holeDiameter = diameter;
  bt.jobCard.holeDepth = depth;
  bt.jobCard.rows = rows;
  bt.jobCard.columns = columns;
  bt.jobCard.v_spacing = v_spacing;
  bt.jobCard.h_Burdens = h_burdens;
  bt.jobCard.perimeterOffset = perimeterOffset;
  document.getElementById('jobHoleDiameter').innerHTML = diameter + "mm";
  document.getElementById('jobHoleDepth').innerHTML = depth + "m";
  document.getElementById('jobRows').innerHTML = rows;
  document.getElementById('jobColumns').innerHTML = columns;
  document.getElementById('jobV_Spacing').innerHTML = v_spacing;
  document.getElementById('jobH_Burdens').innerHTML = h_burdens;
  document.getElementById('jobPerimeterOffset').innerHTML = perimeterOffset + "cm";
  bt.saveHole();
  bt.goTo('pre-blast-Report');
});

document.getElementById('parametersDetailsSaveCancelButton').addEventListener('click', function(){
  bt.goTo('pre-blast-Report');
});

document.getElementById('editExplosives').addEventListener('click', function(){
  bt.goTo('editExplosiveScreen');
});

document.getElementById('explosiveDetailsSaveButton').addEventListener('click', function(){
  var holeMass = document.getElementById('holeMassPlanned-Input').value;
  var holeMassActual = document.getElementById('holeMassActual-Input').value;
  var holeFill = document.getElementById('holeFillPlanned-Input').value;
  var holeFillActual = document.getElementById('holeFillActual-Input').value;
  console.log(holeFill);
  bt.jobCard.holeMassPlanned = holeMass;
  bt.jobCard.holeMassActual = holeMassActual;
  bt.jobCard.holeFillPercentage = holeFill;
  bt.jobCard.holeFillActual = holeFillActual;
  document.getElementById('jobHoleMassPlanned').innerHTML = holeMass;
  document.getElementById('jobHoleMassActual').innerHTML = holeMassActual;
  document.getElementById('jobHoleFillPercentage').innerHTML = holeFill + "%";
  document.getElementById('jobHoleFillActual').innerHTML = holeFillActual + "%";
  bt.saveHole();
  bt.goTo('pre-blast-Report');
});

document.getElementById('explosiveDetailsSaveCancelButton').addEventListener('click', function(){
  bt.goTo('pre-blast-Report');
});

document.getElementById('editAccessories').addEventListener('click', function(){
  bt.goTo('editAccessoriesScreen');
});

document.getElementById('accessoriesDetailsSaveCancelButton').addEventListener('click', function(){
  bt.goTo('pre-blast-Report');
});

document.getElementById('rockSaveButton').addEventListener('click', function(){
  bt.addRockType();
  bt.goTo('pre-blast-Report');
});

document.getElementById('rockSaveCancelButton').addEventListener('click', function(){
  bt.goTo('pre-blast-Report');
})

document.getElementById('addExplosiveType').addEventListener('click', function(){
  bt.goTo('addExplosiveTypeScreen');
});

document.getElementById('explosiveSaveButton').addEventListener('click', function(){
  bt.addExplosiveType();
  bt.goTo('pre-blast-Report');
});

document.getElementById('explosiveSaveCancelButton').addEventListener('click', function(){
  bt.goTo('pre-blast-Report');
});

document.getElementById('addDetonatorType').addEventListener('click', function(){
  bt.goTo('addDetonatorTypeScreen');
});

document.getElementById('detonatorSaveButton').addEventListener('click', function(){
  bt.addDetonatorType();
  bt.goTo('pre-blast-Report');
});

document.getElementById('detonatorSaveCancelButton').addEventListener('click', function(){
  bt.goTo('pre-blast-Report');
});

document.getElementById('addAccessories').addEventListener('click', function(){
  bt.goTo('addAccessoriesScreen');
});

document.getElementById('accessoriesSaveButton').addEventListener('click', function(){
  bt.addAccessories();
  bt.goTo('pre-blast-Report');
});

document.getElementById('accessoriesSaveCancelButton').addEventListener('click', function(){
  bt.goTo('pre-blast-Report');
});

document.getElementById('Menu').addEventListener('click', function(){
  return bt.menuUpdate();
});

document.getElementById("completeJob").addEventListener("click", function(){
  return bt.goTo('completeJobPage');
});

document.getElementById("completedJob").addEventListener("click", function(){
  bt.closeJob();
  bt.goTo("userDetailsScreen");
});

document.getElementById("takePhoto").addEventListener("click", function(){
  bt.takePhoto();
});

document.getElementById("getPhoto").addEventListener("click", function(){
  bt.getPhoto(pictureSource.PHOTOLIBRARY);
});

document.getElementById("incompleteJobButton").addEventListener("click", function(){
  document.getElementById('commentInput').setAttribute("minLength", "5");
  bt.incompleteJob();
  return bt.goTo('userDetailsScreen');
});

document.getElementById("homePage").addEventListener("click", function(){
  return bt.goTo("userDetailsScreen");
});

document.getElementById("uploadData").addEventListener("click", function(){
  return bt.sendTransaction();
});

var preBlastCount = 0;
document.getElementById("pre-BlastReport").addEventListener("click", function(){
  if(preBlastCount == 0){
    bt.preBlastList();
    preBlastCount++
    console.log(preBlastCount);
  }
  return bt.goTo('pre-blastReportSelectScreen');
});

document.getElementById("toggleDemo").addEventListener("change", function(){
  return app.methods.toggleDemo();
});

document.getElementById('nextButton').addEventListener("click", function(){
  bt.handleJobCard();
});

document.getElementById("securityEntrance").addEventListener("click", function(){
  return bt.clockingCheck(securityEntrance);
});

document.getElementById("waitingPlaceIn").addEventListener("click", function(){
  return bt.clockingCheck(waitingPlaceIn);
});

document.getElementById("walkIn").addEventListener("click", function(){
  return bt.clockingCheck(walkIn);
});

document.getElementById("arrive").addEventListener("click", function(){
  return bt.clockingCheck(arrive);
});

document.getElementById("startMarking").addEventListener("click", function(){
  return bt.clockingCheck(startMarking);
});

document.getElementById("finishMarking").addEventListener("click", function(){
  return bt.clockingCheck(finishMarking);
});

document.getElementById("startDrilling").addEventListener("click", function(){
  return bt.clockingCheck(startDrilling);
});

document.getElementById("finishDrilling").addEventListener("click", function(){
  return bt.clockingCheck(finishDrilling);
});

document.getElementById("startCharging").addEventListener("click", function(){
  bt.clockingCheck(startCharging);
  bt.goTo("paired-devices");
});

document.getElementById("finishCharging").addEventListener("click", function(){
  bt.clockingCheck(finishCharging);
});

document.getElementById("startConnecting").addEventListener("click", function(){
  bt.clockingCheck(startConnecting);
});

document.getElementById("finishConnecting").addEventListener("click", function(){
  bt.clockingCheck(finishConnecting);
});

document.getElementById("minerConnecting").addEventListener("click", function(){
  bt.clockingCheck(minerConnecting);
});

document.getElementById("blasted").addEventListener("click", function(){
  bt.clockingCheck(blasted);
});

document.getElementById("walkOut").addEventListener("click", function(){
  bt.clockingCheck(walkOut);
});

document.getElementById("securityExit").addEventListener("click", function(){
  bt.clockingCheck(securityExit);
  bt.closeJob();
  bt.goTo("userDetailsScreen");
});

document.getElementById("waitingPlaceOut").addEventListener("click", function(){
  bt.clockingCheck(waitingPlaceOut);
});

document.getElementById('Logout').addEventListener("click", function(){
  app.navbar.hide('.navbar');
  bt.goTo('loginScreen');
});

document.getElementById("progress").addEventListener("click", function(){
  var stop = document.getElementById('progress');
  if(stop.value === "Stop"){
    if(bt.demo = false){
      app.methods.startStopToggle();
    } else {
      app.methods.startStopDemo();
    }
  } else {
    var element = document.getElementById('holeSpecButton');
    if (element.classList) {
      element.classList.toggle("color-green");
    } else {
      // For IE9
      var classes = element.className.split(" ");
      var i = classes.indexOf("color-green");

      if (i >= 0)
      classes.splice(i, 1);
      else
      classes.push("color-green");
      element.className = classes.join(" ");
    }

    if(element.value === "Charge"){
      element.value = "Waiting for Device";
      element.classList.toggle('color-grey');
    }
    bt.goTo('holeDetailsScreen');
  }
});

document.getElementById("holeMassDown").addEventListener("click", function(){
  return app.methods.holeMassDown();
});

document.getElementById("holeMassUp").addEventListener("click", function(){
  return app.methods.holeMassUp();
});

document.getElementById("realTimeClock").addEventListener("click", function(){
  return app.methods.set_RealTimeClock();
});

// Init App
var app = new Framework7({
  id: 'tech.imining.density_bluetooth_terminal',
  root: '#app',
  theme: theme,
  methods: {
    helloWorld: function () {
		  app.dialog.alert('Hello World!');
    },
    getDeviceWidth: function(){
      var width = window.innerWidth;
      return width;
    },
    checkIn: function(target){
      var element = document.getElementById(target);
  		element.classList.toggle("color-orange");
    },
	  holeMassUp: function(){
		  bt.logSendData(bt.requests.set_Mass_Up);
      if(bt.demo == false){
        console.log("Changing actual");
  			bluetoothSerial.write(bt.OnConvertToHex(bt.requests.set_Mass_Up.toString().replace(/,/g , "")), null, bt.showError);
		  	var element = document.getElementById("hole-mass");
			  element.innerHTML = (parseFloat(element.innerHTML)+0.10).toFixed(1);
        var element2 = document.getElementById("hole-mass_2");
			  element2.innerHTML = (parseFloat(element2.innerHTML)+0.10).toFixed(1);
        var data = bt.dataSendLog["0x15"];
        var validFrame = bt.checkSend(data);
        if(validFrame == true){
          bt.requests.set_Mass_Up[3] = "0x01";
          bt.dataSendLog['0x15'] = {};
          return
        } else {
          bt.incrementSanity(bt.requests.set_Mass_Up);
          app.methods.holeMassUp();
        };
      } else {
        console.log("Changing Demo");
        var element = document.getElementById("hole-mass");
			  element.innerHTML = (parseFloat(element.innerHTML)+0.10).toFixed(1);
        var element2 = document.getElementById("hole-mass_2");
			  element2.innerHTML = (parseFloat(element2.innerHTML)+0.10).toFixed(1);
      }
  	},
  	holeMassDown: function(){
		  bt.logSendData(bt.requests.set_Mass_Down);
      if(bt.demo == false){
        console.log("Changing actual");
  			bluetoothSerial.write(bt.OnConvertToHex(bt.requests.set_Mass_Down.toString().replace(/,/g , "")), null, bt.showError);
  			var element = document.getElementById("hole-mass");
  			element.innerHTML = (parseFloat(element.innerHTML)-0.10).toFixed(1);
        var element2 = document.getElementById("hole-mass_2");
			  element2.innerHTML = (parseFloat(element2.innerHTML)-0.10).toFixed(1);
        var data = bt.dataSendLog["0x15"];
        var validFrame = bt.checkSend(data);
        if(validFrame == true){
          bt.requests.set_Mass_Down[3] = "0x01";
          bt.dataSendLog['0x15'] = {};
          return
        } else {
          bt.incrementSanity(bt.requests.set_Mass_Down);
          app.methods.holeMassDown();
        };
      } else {
        console.log("Changing Demo");
        var element = document.getElementById("hole-mass");
  			element.innerHTML = (parseFloat(element.innerHTML)-0.10).toFixed(1);
        var element2 = document.getElementById("hole-mass_2");
			  element2.innerHTML = (parseFloat(element2.innerHTML)-0.10).toFixed(1);
      }
  	},
  	set_RealTimeClock: function(){
      bt.logSendData(bt.requests.set_RealTimeClock);
  		var input_datevalue = document.getElementById('demo-picker-date').value;

  		var d = new Date(input_datevalue);
  		// ["0x55","0x0A","0x13","0x01","0x01","0x01","0x01","0x01","0x01","0x01"]
  		bt.requests.set_RealTimeClock[4] = bt.convertDecToHex(d.getHours());
  		bt.requests.set_RealTimeClock[5] = bt.convertDecToHex(d.getMinutes());
  		bt.requests.set_RealTimeClock[6] = bt.convertDecToHex(d.getSeconds());
  		bt.requests.set_RealTimeClock[7] = bt.convertDecToHex(parseInt(d.getFullYear().toString().substr(-2))); // Implied 20 before the number so substring to get the end.
  		bt.requests.set_RealTimeClock[8] = bt.convertDecToHex(d.getMonth());
  		bt.requests.set_RealTimeClock[9] = bt.convertDecToHex(d.getDate());

      if(bt.demo == false){
    		bluetoothSerial.write(bt.OnConvertToHex(bt.requests.set_RealTimeClock.toString().replace(/,/g , "")), null, bt.showError);
        var data = bt.dataSendLog["0x13"];
        var validFrame = bt.checkSend(data);
        if(validFrame == true){
          bt.requests.set_RealTimeClock[3] = "0x01";
          bt.dataSendLog['0x13'] = {};
          return
        } else {
          bt.incrementSanity(bt.requests.set_RealTimeClock);
          app.methods.set_RealTimeClock();
        };
      }
  	},
  	startStopToggle: function(){
  		var element = document.getElementById("progress");
  		if (element.classList) {
  		  element.classList.toggle("color-green");
  		} else {
  		  // For IE9
  		  var classes = element.className.split(" ");
  		  var i = classes.indexOf("color-green");

  		  if (i >= 0)
  			classes.splice(i, 1);
  		  else
  			classes.push("color-green");
  			element.className = classes.join(" ");
  		}
  		if (element.value === "Ready to Charge") {
        element.value = "Stop";
        if(bt.demo == false){
          bt.logSendData(bt.requests.set_Mass_Fixed);
          // bt.previousPassiveResponse[14] = "1";
          console.log(bt.previousPassiveResponse);
          bluetoothSerial.write(bt.OnConvertToHex(bt.requests.set_Mass_Fixed.toString().replace(/,/g , "")), null, bt.showError);
          bt.jobCard.holes[bt.currentHole].holeMass = document.getElementById("hole-mass").innerHTML;
          bt.jobCard.holes[bt.currentHole].startTime = bt.setTime();
          bt.currentHole++;
          var holeObject = {
            holeMass: "0",                                                      //To be read from device
            startTime: bt.setTime(),                                            //To be initiated at start of pump
            endTime: bt.setTime(),                                               //To be initiated at end of pump
            detonator: '',
            holeNumber: '',
          }
          bt.jobCard.holes.push(holeObject);
          var data = bt.dataSendLog["0x15"];
          var validFrame = bt.checkSend(data);
          if(validFrame == true){
            bt.requests.set_Mass_Fixed[3] = "0x01";
            bt.dataSendLog['0x15'] = {};
            return
          } else {
            bt.incrementSanity(bt.requests.set_Mass_Fixed);
            app.methods.startStopToggle();
          };
        }
  		} else {
  			element.value = "Ready to Charge";
        if(bt.demo == false){
          bt.logSendData(bt.requests.set_Mass_Stop);
          bt.previousPassiveResponse[14] = "0";
          bluetoothSerial.write(bt.OnConvertToHex(bt.requests.set_Mass_Stop.toString().replace(/,/g , "")), null, bt.showError);
          bt.jobCard.holes[bt.currentHole].endTime = bt.setTime();
          var data = bt.dataSendLog["0x15"];
          var validFrame = bt.checkSend(data);
          if(validFrame == true){
            bt.requests.set_Mass_Stop[3] = "0x01";
            bt.dataSendLog['0x15'] = {};
            return
          } else {
            bt.incrementSanity(bt.requests.set_Mass_Stop);
            app.methods.startStopToggle();
          };
        }
  		}
  	},
  	toggleTerminal: function(){
  		if (bt.terminal == false){
  			bt.goTo('paired-devices');
  		}
  		else{
      		bt.goTo('terminal');
      }
  	},
    toggleDemo: function(){
      if (bt.demo == false){
        bt.demo = true;
        app.methods.toggleTerminal();
      }
      else {
        bt.demo = false;
      }
    },
    startStopDemo: function(){

      var pumpingStatus;
      var sample;
      var emulsion;
      var sensitizerPressure;
      var sensitizerFlow;
      var pumpValue;
      var system = [0, 0, 0, 0, 0];

      var element = document.getElementById("progress");
  		if (element.classList) {
  		  element.classList.toggle("color-green");
  		} else {
  		  // For IE9
  		  var classes = element.className.split(" ");
  		  var i = classes.indexOf("color-green");

  		  if (i >= 0)
  			classes.splice(i, 1);
  		  else
  			classes.push("color-green");
  			element.className = classes.join(" ");
  		}

      if (element.value === "Ready to Charge") {
        clearInterval(pumpingStatus);
        element.value = "Stop";
        bt.jobCard.holes[bt.currentHole].holeMass = document.getElementById("hole-mass").innerHTML;
        bt.jobCard.holes[bt.currentHole].startTime = bt.setTime();
        bt.currentHole++;
        var holeObject = {
          holeMass: "0",                                                      //To be read from device
          startTime: bt.setTime(),                                            //To be initiated at start of pump
          endTime: bt.setTime(),                                               //To be initiated at end of pump
          detonator: '',
          holeNumber: ''
        }
        bt.jobCard.holes.push(holeObject);
        pumpingStatus = setInterval(function(){
          if (element.value === "Ready to Charge") {
            clearInterval(pumpingStatus);
          }
          if(sample < 1.25){
            sample = sample + 0.05;
            system[0] = sample;
          } else if(sample = 0.85){
            sample = sample - 0.05;
            system[0] = sample;
          }

          if(emulsion < 1.25){
            emulsion = emulsion + 0.05;
            system[1] = emulsion;
          } else if(emulsion = 0.85){
            emulsion = emulsion - 0.05;
            system[1] = emulsion;
          }

          if(sensitizerPressure < 53){
            sensitizerPressure = sensitizerPressure + 1;
            system[2] = sensitizerPressure;
          } else if(sensitizerPressure = 47){
            sensitizerPressure = sensitizerPressure - 1;
            system[2] = sensitizerPressure;
          }

          if(sensitizerFlow < 13){
            sensitizerFlow = sensitizerFlow + 1;
            system[3] = sensitizerFlow;
          } else if(sensitizerFlow = 8){
            sensitizerFlow = sensitizerFlow - 1;
            system[3] = sensitizerFlow;
          }

          if(pumpValue < 100){
            pumpValue = pumpValue + 5;
            system[4] = pumpValue;
          } else {
            pumpValue = 0;
            system[4] = pumpValue;
          };

          if(system[4] == 100){
            clearInterval(pumpingStatus);
            element.value = "Ready to Charge";
            element.classList.toggle("color-green");
          }

          app.methods.setGaugeValue('.demo-gauge', system[4], "Filling");
          document.getElementById("tempValueTop").innerHTML = "45"; // Header Temp
          document.getElementById("tempValue").innerHTML = "45";
          app.methods.setProgressBar('#Temperature',"45");
          app.methods.setGaugeValue('.demo-gauge2', "65",'Pressure'); // PRESSURE
          document.getElementById("pressureValueTop").innerHTML = "65";
        }, 250);
  		} else {
  			element.value = "Ready to Charge";
        clearInterval(pumpingStatus);
        bt.jobCard.holes[bt.currentHole].endTime = bt.setTime();
        app.methods.setGaugeValue('.demo-gauge', "0", "Filling");
        document.getElementById("tempValueTop").innerHTML = "0"; // Header Temp
    		document.getElementById("tempValue").innerHTML = "0";
        app.methods.setProgressBar('#Temperature',"0");
        app.methods.setGaugeValue('.demo-gauge2', "0",'Pressure'); // PRESSURE
    		document.getElementById("pressureValueTop").innerHTML = "0";
  		}
    },
  	setGaugeValue: function(obj, valueProgress, labelText) {
  		// var self = this;

  		var valueText = '';

  		if(obj == ".demo-gauge"){
  			valueText = valueProgress + ' %';
  			labelText = bt.pumpStatus[labelText];

  			self.demoGauge.update({
  				el: obj,
  				value: valueProgress / 100,
  				valueText: valueText,
  				labelText: labelText,
  			});
  		}
  		else if(obj == ".demo-gauge2"){
  			valueText = valueProgress + ' Bar';
  			labelText = 'Pressure';

  			self.pressureGauge.update({
  				el: obj,
  				value: valueProgress / 100,
  				valueText: valueText,
  				labelText: labelText,
  			});
  		}
  	},
  	setProgressBar: function (obj, value) {
  		// var self = this;
  		// var app = self.$app;
  		var element;
  		if(obj == '#Temperature'){
  			element = document.getElementById("tempValue");
  			element.innerHTML = value;
  		}
  		app.progressbar.set(obj, value);      //Confirm progress bar functionality with Justin
  	},
  	passiveFrame: function(data){
      var element = document.getElementById("progress");
      if(data[15] == 100){
        if(element.value == "Stop"){
    		  element.classList.toggle("color-green");
          element.value = "Charge Hole"
        }
      }

  		app.methods.setProgressBar('#Temperature',data[4]);  // Temp
  		document.getElementById("tempValueTop").innerHTML = data[4]; // Header Temp
  		document.getElementById("tempValue").innerHTML = data[4]; // Temp Deg C
  		app.methods.setGaugeValue('.demo-gauge2', data[5],'Pressure'); // PRESSURE
  		document.getElementById("pressureValueTop").innerHTML = data[5]; // Header PRESSURE
  		app.methods.setProgressBar('#Density',data[6]); // Density
  		app.methods.setGaugeValue('.demo-gauge', data[15],data[14]); // PUMP PROGRESS
  		document.getElementById("headStatus").innerHTML = bt.systemStatus[data[22]]; // SYSTEM STATUS
  		var holeMass = parseInt(256*data[16])+parseInt(data[17]); // Hole Mass High * 256 to get to the correct integer Number
  		var faceMass = parseInt(256*data[18])+parseInt(data[19]); // Face Mass High * 256 to get to the correct integer Number
  		document.getElementById("hole-mass").innerHTML = (holeMass/10); // HOLE MASS / by 10 to get decimal
  		var holeCount = parseInt(256*data[20])+parseInt(data[21]); // Hole Mass High * 256 to get to the correct integer Number
  		document.getElementById("hole-count").innerHTML = (holeCount); // Number of Holes Already Pumped

      if(bt.demo == false){
    		if(data[23] > 0){ // Status High (if set to 1, read the transactionData)
    			bluetoothSerial.write(bt.OnConvertToHex(bt.requests.get_Single_Transaction_Frame.toString().replace(/,/g , "")), null, bt.showError);
        }
      }
  	}
  },
  routes: routes,
  vi: {
    placementId: 'pltd4o7ibb9rc653x14',
  },
});
