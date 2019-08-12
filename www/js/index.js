/**
 * Created by Danila Loginov, December 23, 2016
 * https://github.com/1oginov/Cordova-Bluetooth-Terminal
 */

'use strict';
var mySensors = {};
var pictureSource;
var DeviceHoleMass = 0;
var checkSetToCurrent = true;
var destinationType;
var bt = {
  deviceName:"",
	deviceAddress:"",
	dbPOST_URL:"http://blastit.scratchpad.biz/AWSPUT/",
	dbURL:"https://oufp5fu809.execute-api.us-east-2.amazonaws.com/Prod/SasolReport",
	dbAPIKEY:"WmRQo2afV39NrzKd9MAZOafct8uhtomr2cko53yg",
  userLogged: false,
	logging:false,
	terminal:false,
  demo: false,
  isConnected: false,
  currentHole: 0,
  usePlan: false,
  dataSendLog: {
    "0x11": {},
    "0x13": {},
    "0x15": {},
    "0x17": {},
    "0x19": {},
    "0x1A": {},
    "0x1C": {},
    "0x2C": {},
    "0x3C": {},
    "0x3D": {},
    "0x1E": {},
    "0xAA": {},                                                                //Confirm validation HEX
    // 0x??: {}
  },
  requests:{
    "Startup": ["0x55","0x04","0x11","0x01"],
		"get_Sensor_Temperature":  ["0x55","0x06","0x17","0x01", "0x80","0x00"],
		"get_Sensor_Pressure":  ["0x55","0x06","0x17","0x01", "0x40", "0x00"],
		"get_Sensor_Density":  ["0x55","0x06","0x17","0x01", "0x20", "0x00"],
		"get_Sensor_Sensor4":  ["0x55","0x06","0x17","0x01", "0x10", "0x00"],
		"get_Sensor_Sensor5":  ["0x55","0x06","0x17","0x01", "0x08", "0x00"],
		"get_Sensor_Sensor6":  ["0x55","0x06","0x17","0x01", "0x04", "0x00"],
		"get_Sensor_Sensor7":  ["0x55","0x06","0x17","0x01", "0x02", "0x00"],
		"get_Sensor_Sensor8":  ["0x55","0x06","0x17","0x01", "0x01", "0x00"],
		"get_Sensor_Sensor9":  ["0x55","0x06","0x17","0x01", "0x00", "0x80"],
		"get_Sensor_Sensor10": ["0x55","0x06","0x17","0x01", "0x00", "0x40"],
		"get_Sensors_All":  ["0x55","0x06","0x17","0x01", "0xFF", "0xD0"],
		"set_RealTimeClock": ["0x55","0x0A","0x13","0x01","0x01","0x01","0x01","0x01","0x01","0x01"],
		"set_Mass_Fixed":  ["0x55","0x06","0x15","0x01", "0xB1", "0x01"],
		"set_Mass_Stop":  ["0x55","0x06","0x15","0x01", "0xB1", "0x02"],
		"set_Mass_Up":  ["0x55","0x06","0x15","0x01", "0xB1", "0x04"],
		"set_Mass_Down":  ["0x55","0x06","0x15","0x01", "0xB1", "0x08"],
		"get_Single_Transaction_Frame":  ["0x55","0x04","0x1A", "0x01"],            //Confirm validation HEX
  },
	decComands:[17,23,19,21,170], // used to validate the response.
	pumpStatus:[
		"stopped",
		"pumping"
	],
	systemStatus:[
		"SAFE",
		"TRIP_TEMP",
		"TRIP_FLOW",
		"TRIP_PRES",
		"TANK_EMPTY",
		"RESET_SYSTEM",
		"PUMP_ERROR",
		"SD_ERROR",
		"STOPPED",
		"PARTICLE_ERR"
	],
	previousPassiveResponse:[
    "0",    // 0 Header
    "0",    // 1 data.length
    "0",    // 2 Action
    "0",    // 3 Sanity
    "0",    // 4 Sensor 1
    "0",    // 5 sensor 2
    "0",    // 6 sensor 3
    "0",    // 7 sensor 4
    "0",    // 8 sensor 5
    "0",    // 9 sensor 6
    "0",    // 10 sensor6
    "0",    // 11 sensor 7
    "0",    // 12 sensor 8
    "0",    // 13 sensor 10
    "0",    // 14 Pump status
    "0",    // 15 Pump progress
    "0",    // 16 Hole mass H
    "0",    // 17 Hole mass L
    "0",    // 18 Face mass H
    "0",    // 19 Face mass L
    "0",    // 20 No of holes H
    "0",    // 21 No of holes L
    "0",    // 22 System status
    "0",    // 23 Status High
    "0",    // 24 Status Low
    "0",    // 25 Trip status
    "0"     // 26 Trip value
  ],
	response:{
		resArray:[],
		succArray:[],
		unsuccArray:[]
	},
  setTime: function(){
    var date = new Date();
    var year = date.getFullYear();
    var numberCalc = function(number){
      if(number < 10){
        number = "0" + number;
        return number;
      } else {
        return number;
      }
    }
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var monthNumber = date.getMonth();
    var month = months[monthNumber];
    var day = numberCalc(date.getDate());
    var hour = numberCalc(date.getHours());
    var minute = numberCalc(date.getMinutes());
    var second = numberCalc(date.getSeconds());
    var dateFormat = year + " " + month + " " + day + " " + hour + ":" + minute + ":" + second;
    return dateFormat;
  },
  jobCard: {
    additionalHoles: '',
    blastPlan: {},
    checkIn: {
      securityEntrance: "",
      waitingPlaceIn: "",
      walkIn: "",
      arrive: "",
      startMarking: "",
      finishMarking: "",
      startDrilling: "",
      finishDrilling: "",
      startCharging: "",
      finishCharging: "",
      startConnecting: "",
      finishConnecting: "",
      minerConnecting: "",
      blasted: "",
      walkOut: "",
      waitingPlaceOut: "",
      securityExit: ""
    },
    columns: '',
    couplingRatio: '',
    date: "",
    detonatorSeries: [],
    explosiveDensity: '',
    explosiveManufacturer: '',
    explosivePrice: '',
    explosiveStrength: '',
    explosiveType: '',
    h_Burdens: '',
    holes: [],
    holeDepth: '',
    holeDiameter: '',
    holeFillActual: "",
    holeFillPercentage: '',
    holeMassActual : "",
    holeMassPlanned: '',
    holesPlanned: [],
    jobHeight: '',
    jobID: '',
    jobStatus: "",
    jobWidth: '',
    location: '',
    mine: '',
    perimeterOffset: '',
    photos: [],
    profile: '',
    rock: '',
    rockDensityAdd: '',
    rockDensityPlanned: '',
    rockHardnessAdd: '',
    rockHardnessPlanned: '',
    rockNameAdd: '',
    rows: '',
    samples: [
      {
        density: 1.15,
        startTime: "bt.setTime()",
        endTime: "bt.endTime()"
      },
      {
        density: 1.15,
        startTime: "bt.setTime()",
        endTime:"bt.setTime()"
      },
      {
        density: 1.15,
        startTime: "bt.setTime()",
        endTime: "bt.setTime()"
      }
    ],
    subLocation: '',
    userName: [],
    v_Spacing: '',
  },
  blastPlanArr: [
    {
      "Columns": 4,
      "Rows": 4,
      "ColumnGridSpacing": "0.83",
      "RowGridSpacing": "0.83",
      "ColPerimeterSpacing": 0,
      "RowPerimeterSpacing": 0,
      "Height": "2.5",
      "Width": "2.5",
      "RatioWidth": 0.0033967391304347825,
      "RatioHeight": 0.0033967391304347825,
      "CanvasWidth": 736,
      "CanvasHeight": 736,
      "CanvasColumnGridSpacing": 245.33333333333334,
      "CanvasRowGridSpacing": 245.33333333333334,
      "CanvasColPerimeterSpacing": 0,
      "CanvasRowPerimeterSpacing": 0,
      "DefaultColour": "#c82124",
      "Mine":"GoldOne",
      "Location":"Modder East, Springs",
      "Plan":"Section 4B north",
      "positions": {
        "0": {
          "0": {
            "holeNumber": 16,
            "holeName": "Hole_16",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 0,
            "pixelY": 0,
            "realWorldX": 0,
            "realWorldY": 0,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          },
          "1": {
            "holeNumber": 15,
            "holeName": "Hole_15",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 245.33333333333334,
            "pixelY": 0,
            "realWorldX": 0.83,
            "realWorldY": 0,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          },
          "2": {
            "holeNumber": 14,
            "holeName": "Hole_14",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 490.6666666666667,
            "pixelY": 0,
            "realWorldX": 1.66,
            "realWorldY": 0,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          },
          "3": {
            "holeNumber": 13,
            "holeName": "Hole_13",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 736,
            "pixelY": 0,
            "realWorldX": 2.4899999999999998,
            "realWorldY": 0,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          }
        },
        "1": {
          "0": {
            "holeNumber": 12,
            "holeName": "Hole_12",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 0,
            "pixelY": 245.33333333333334,
            "realWorldX": 0,
            "realWorldY": 0.83,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          },
          "1": {
            "holeNumber": 11,
            "holeName": "Hole_11",
            "Colour": "#01112b",
            "ColourRGB": {
              "r": 1,
              "g": 17,
              "b": 43
            },
            "pixelX": 245.33333333333334,
            "pixelY": 245.33333333333334,
            "realWorldX": 0.83,
            "realWorldY": 0.83,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 5",
            "Delay": 500,
            "Price": 18
          },
          "2": {
            "holeNumber": 10,
            "holeName": "Hole_10",
            "Colour": "#01112b",
            "ColourRGB": {
              "r": 1,
              "g": 17,
              "b": 43
            },
            "pixelX": 490.6666666666667,
            "pixelY": 245.33333333333334,
            "realWorldX": 1.66,
            "realWorldY": 0.83,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 5",
            "Delay": 500,
            "Price": 18
          },
          "3": {
            "holeNumber": 9,
            "holeName": "Hole_9",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 736,
            "pixelY": 245.33333333333334,
            "realWorldX": 2.4899999999999998,
            "realWorldY": 0.83,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          }
        },
        "2": {
          "0": {
            "holeNumber": 8,
            "holeName": "Hole_8",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 0,
            "pixelY": 490.6666666666667,
            "realWorldX": 0,
            "realWorldY": 1.66,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          },
          "1": {
            "holeNumber": 7,
            "holeName": "Hole_7",
            "Colour": "#01112b",
            "ColourRGB": {
              "r": 1,
              "g": 17,
              "b": 43
            },
            "pixelX": 245.33333333333334,
            "pixelY": 490.6666666666667,
            "realWorldX": 0.83,
            "realWorldY": 1.66,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 5",
            "Delay": 500,
            "Price": 18
          },
          "2": {
            "holeNumber": 6,
            "holeName": "Hole_6",
            "Colour": "#01112b",
            "ColourRGB": {
              "r": 1,
              "g": 17,
              "b": 43
            },
            "pixelX": 490.6666666666667,
            "pixelY": 490.6666666666667,
            "realWorldX": 1.66,
            "realWorldY": 1.66,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 5",
            "Delay": 500,
            "Price": 18
          },
          "3": {
            "holeNumber": 5,
            "holeName": "Hole_5",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 736,
            "pixelY": 490.6666666666667,
            "realWorldX": 2.4899999999999998,
            "realWorldY": 1.66,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          }
        },
        "3": {
          "0": {
            "holeNumber": 4,
            "holeName": "Hole_4",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 0,
            "pixelY": 736,
            "realWorldX": 0,
            "realWorldY": 2.4899999999999998,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          },
          "1": {
            "holeNumber": 3,
            "holeName": "Hole_3",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 245.33333333333334,
            "pixelY": 736,
            "realWorldX": 0.83,
            "realWorldY": 2.4899999999999998,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          },
          "2": {
            "holeNumber": 2,
            "holeName": "Hole_2",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 490.6666666666667,
            "pixelY": 736,
            "realWorldX": 1.66,
            "realWorldY": 2.4899999999999998,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          },
          "3": {
            "holeNumber": 1,
            "holeName": "Hole_1",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 736,
            "pixelY": 736,
            "realWorldX": 2.4899999999999998,
            "realWorldY": 2.4899999999999998,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          }
        }
      },
      "Inner": 3,
      "Outer": 6,
      "HoleDiameter": "45",
      "HoleFillPercentage": 0.75,
      "HoleMass": 4.115240939276568
    },
    {
      "Columns": 4,
      "Rows": 4,
      "ColumnGridSpacing": "0.83",
      "RowGridSpacing": "0.83",
      "ColPerimeterSpacing": 0,
      "RowPerimeterSpacing": 0,
      "Height": "2.5",
      "Width": "2.5",
      "RatioWidth": 0.0033967391304347825,
      "RatioHeight": 0.0033967391304347825,
      "CanvasWidth": 736,
      "CanvasHeight": 736,
      "CanvasColumnGridSpacing": 245.33333333333334,
      "CanvasRowGridSpacing": 245.33333333333334,
      "CanvasColPerimeterSpacing": 0,
      "CanvasRowPerimeterSpacing": 0,
      "DefaultColour": "#c82124",
      "Mine":"GoldOne",
      "Location":"Modder East, Springs",
      "Plan":"Section 4A north",
      "positions": {
        "0": {
          "0": {
            "holeNumber": 16,
            "holeName": "Hole_16",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 0,
            "pixelY": 0,
            "realWorldX": 0,
            "realWorldY": 0,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          },
          "1": {
            "holeNumber": 15,
            "holeName": "Hole_15",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 245.33333333333334,
            "pixelY": 0,
            "realWorldX": 0.83,
            "realWorldY": 0,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          },
          "2": {
            "holeNumber": 14,
            "holeName": "Hole_14",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 490.6666666666667,
            "pixelY": 0,
            "realWorldX": 1.66,
            "realWorldY": 0,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          },
          "3": {
            "holeNumber": 13,
            "holeName": "Hole_13",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 736,
            "pixelY": 0,
            "realWorldX": 2.4899999999999998,
            "realWorldY": 0,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          }
        },
        "1": {
          "0": {
            "holeNumber": 12,
            "holeName": "Hole_12",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 0,
            "pixelY": 245.33333333333334,
            "realWorldX": 0,
            "realWorldY": 0.83,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          },
          "1": {
            "holeNumber": 11,
            "holeName": "Hole_11",
            "Colour": "#01112b",
            "ColourRGB": {
              "r": 1,
              "g": 17,
              "b": 43
            },
            "pixelX": 245.33333333333334,
            "pixelY": 245.33333333333334,
            "realWorldX": 0.83,
            "realWorldY": 0.83,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 5",
            "Delay": 500,
            "Price": 18
          },
          "2": {
            "holeNumber": 10,
            "holeName": "Hole_10",
            "Colour": "#01112b",
            "ColourRGB": {
              "r": 1,
              "g": 17,
              "b": 43
            },
            "pixelX": 490.6666666666667,
            "pixelY": 245.33333333333334,
            "realWorldX": 1.66,
            "realWorldY": 0.83,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 5",
            "Delay": 500,
            "Price": 18
          },
          "3": {
            "holeNumber": 9,
            "holeName": "Hole_9",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 736,
            "pixelY": 245.33333333333334,
            "realWorldX": 2.4899999999999998,
            "realWorldY": 0.83,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          }
        },
        "2": {
          "0": {
            "holeNumber": 8,
            "holeName": "Hole_8",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 0,
            "pixelY": 490.6666666666667,
            "realWorldX": 0,
            "realWorldY": 1.66,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          },
          "1": {
            "holeNumber": 7,
            "holeName": "Hole_7",
            "Colour": "#01112b",
            "ColourRGB": {
              "r": 1,
              "g": 17,
              "b": 43
            },
            "pixelX": 245.33333333333334,
            "pixelY": 490.6666666666667,
            "realWorldX": 0.83,
            "realWorldY": 1.66,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 5",
            "Delay": 500,
            "Price": 18
          },
          "2": {
            "holeNumber": 6,
            "holeName": "Hole_6",
            "Colour": "#01112b",
            "ColourRGB": {
              "r": 1,
              "g": 17,
              "b": 43
            },
            "pixelX": 490.6666666666667,
            "pixelY": 490.6666666666667,
            "realWorldX": 1.66,
            "realWorldY": 1.66,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 5",
            "Delay": 500,
            "Price": 18
          },
          "3": {
            "holeNumber": 5,
            "holeName": "Hole_5",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 736,
            "pixelY": 490.6666666666667,
            "realWorldX": 2.4899999999999998,
            "realWorldY": 1.66,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          }
        },
        "3": {
          "0": {
            "holeNumber": 4,
            "holeName": "Hole_4",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 0,
            "pixelY": 736,
            "realWorldX": 0,
            "realWorldY": 2.4899999999999998,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          },
          "1": {
            "holeNumber": 3,
            "holeName": "Hole_3",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 245.33333333333334,
            "pixelY": 736,
            "realWorldX": 0.83,
            "realWorldY": 2.4899999999999998,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          },
          "2": {
            "holeNumber": 2,
            "holeName": "Hole_2",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 490.6666666666667,
            "pixelY": 736,
            "realWorldX": 1.66,
            "realWorldY": 2.4899999999999998,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          },
          "3": {
            "holeNumber": 1,
            "holeName": "Hole_1",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 736,
            "pixelY": 736,
            "realWorldX": 2.4899999999999998,
            "realWorldY": 2.4899999999999998,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          }
        }
      },
      "Inner": 3,
      "Outer": 6,
      "HoleDiameter": "45",
      "HoleFillPercentage": 0.75,
      "HoleMass": 4.115240939276568
    },
    {
      "Columns": 4,
      "Rows": 4,
      "ColumnGridSpacing": "0.83",
      "RowGridSpacing": "0.83",
      "ColPerimeterSpacing": 0,
      "RowPerimeterSpacing": 0,
      "Height": "2.5",
      "Width": "2.5",
      "RatioWidth": 0.0033967391304347825,
      "RatioHeight": 0.0033967391304347825,
      "CanvasWidth": 736,
      "CanvasHeight": 736,
      "CanvasColumnGridSpacing": 245.33333333333334,
      "CanvasRowGridSpacing": 245.33333333333334,
      "CanvasColPerimeterSpacing": 0,
      "CanvasRowPerimeterSpacing": 0,
      "DefaultColour": "#c82124",
      "Mine":"GoldOne",
      "Location":"Modder East, Springs",
      "Plan":"Section 4A South",
      "positions": {
        "0": {
          "0": {
            "holeNumber": 16,
            "holeName": "Hole_16",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 0,
            "pixelY": 0,
            "realWorldX": 0,
            "realWorldY": 0,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          },
          "1": {
            "holeNumber": 15,
            "holeName": "Hole_15",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 245.33333333333334,
            "pixelY": 0,
            "realWorldX": 0.83,
            "realWorldY": 0,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          },
          "2": {
            "holeNumber": 14,
            "holeName": "Hole_14",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 490.6666666666667,
            "pixelY": 0,
            "realWorldX": 1.66,
            "realWorldY": 0,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          },
          "3": {
            "holeNumber": 13,
            "holeName": "Hole_13",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 736,
            "pixelY": 0,
            "realWorldX": 2.4899999999999998,
            "realWorldY": 0,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          }
        },
        "1": {
          "0": {
            "holeNumber": 12,
            "holeName": "Hole_12",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 0,
            "pixelY": 245.33333333333334,
            "realWorldX": 0,
            "realWorldY": 0.83,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          },
          "1": {
            "holeNumber": 11,
            "holeName": "Hole_11",
            "Colour": "#01112b",
            "ColourRGB": {
              "r": 1,
              "g": 17,
              "b": 43
            },
            "pixelX": 245.33333333333334,
            "pixelY": 245.33333333333334,
            "realWorldX": 0.83,
            "realWorldY": 0.83,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 5",
            "Delay": 500,
            "Price": 18
          },
          "2": {
            "holeNumber": 10,
            "holeName": "Hole_10",
            "Colour": "#01112b",
            "ColourRGB": {
              "r": 1,
              "g": 17,
              "b": 43
            },
            "pixelX": 490.6666666666667,
            "pixelY": 245.33333333333334,
            "realWorldX": 1.66,
            "realWorldY": 0.83,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 5",
            "Delay": 500,
            "Price": 18
          },
          "3": {
            "holeNumber": 9,
            "holeName": "Hole_9",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 736,
            "pixelY": 245.33333333333334,
            "realWorldX": 2.4899999999999998,
            "realWorldY": 0.83,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          }
        },
        "2": {
          "0": {
            "holeNumber": 8,
            "holeName": "Hole_8",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 0,
            "pixelY": 490.6666666666667,
            "realWorldX": 0,
            "realWorldY": 1.66,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          },
          "1": {
            "holeNumber": 7,
            "holeName": "Hole_7",
            "Colour": "#01112b",
            "ColourRGB": {
              "r": 1,
              "g": 17,
              "b": 43
            },
            "pixelX": 245.33333333333334,
            "pixelY": 490.6666666666667,
            "realWorldX": 0.83,
            "realWorldY": 1.66,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 5",
            "Delay": 500,
            "Price": 18
          },
          "2": {
            "holeNumber": 6,
            "holeName": "Hole_6",
            "Colour": "#01112b",
            "ColourRGB": {
              "r": 1,
              "g": 17,
              "b": 43
            },
            "pixelX": 490.6666666666667,
            "pixelY": 490.6666666666667,
            "realWorldX": 1.66,
            "realWorldY": 1.66,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 5",
            "Delay": 500,
            "Price": 18
          },
          "3": {
            "holeNumber": 5,
            "holeName": "Hole_5",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 736,
            "pixelY": 490.6666666666667,
            "realWorldX": 2.4899999999999998,
            "realWorldY": 1.66,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          }
        },
        "3": {
          "0": {
            "holeNumber": 4,
            "holeName": "Hole_4",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 0,
            "pixelY": 736,
            "realWorldX": 0,
            "realWorldY": 2.4899999999999998,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          },
          "1": {
            "holeNumber": 3,
            "holeName": "Hole_3",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 245.33333333333334,
            "pixelY": 736,
            "realWorldX": 0.83,
            "realWorldY": 2.4899999999999998,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          },
          "2": {
            "holeNumber": 2,
            "holeName": "Hole_2",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 490.6666666666667,
            "pixelY": 736,
            "realWorldX": 1.66,
            "realWorldY": 2.4899999999999998,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          },
          "3": {
            "holeNumber": 1,
            "holeName": "Hole_1",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "pixelX": 736,
            "pixelY": 736,
            "realWorldX": 2.4899999999999998,
            "realWorldY": 2.4899999999999998,
            "HoleMass": 4.115240939276568,
            "ExplosiveName": "LP 10",
            "Delay": 1800,
            "Price": 18
          }
        }
      },
      "Inner": 3,
      "Outer": 6,
      "HoleDiameter": "45",
      "HoleFillPercentage": 0.75,
      "HoleMass": 4.115240939276568
    },
    {
      "Columns": 4,
      "Rows": 4,
      "ColumnGridSpacing": "0.83",
      "RowGridSpacing": "0.83",
      "ColPerimeterSpacing": 0,
      "RowPerimeterSpacing": 0,
      "Height": "2.5",
      "Width": "2.5",
      "RatioWidth": 0.0033967391304347825,
      "RatioHeight": 0.0033967391304347825,
      "CanvasWidth": 736,
      "CanvasHeight": 736,
      "CanvasColumnGridSpacing": 245.33333333333334,
      "CanvasRowGridSpacing": 245.33333333333334,
      "CanvasColPerimeterSpacing": 0,
      "CanvasRowPerimeterSpacing": 0,
      "DefaultColour": "#c82124",
      "Mine":"Tumela",
      "Location":"Thabazimbi",
      "Plan":"1 Shaft, 7 South",
      "positions": {
        "0": {
          "0": {
            "holeNumber": 49,
            "holeName": "Hole_49",
            "Type": "Explosive",
            "Colour": "#607179",
            "ColourRGB": {
              "r": 96,
              "g": 113,
              "b": 121
            },
            "Delay": 6400,
            "pixelX": 0,
            "pixelY": 0,
            "realWorldX": 0,
            "realWorldY": 0,
            "ExplosiveName": "LP 16",
            "Price": 18
          },
          "1": {
            "holeNumber": 48,
            "holeName": "Hole_48",
            "Type": "Explosive",
            "Colour": "#607179",
            "ColourRGB": {
              "r": 96,
              "g": 113,
              "b": 121
            },
            "Delay": 6400,
            "pixelX": 98.83333333333333,
            "pixelY": 0,
            "realWorldX": 0.5,
            "realWorldY": 0,
            "ExplosiveName": "LP 16",
            "Price": 18
          },
          "2": {
            "holeNumber": 47,
            "holeName": "Hole_47",
            "Type": "Explosive",
            "Colour": "#607179",
            "ColourRGB": {
              "r": 96,
              "g": 113,
              "b": 121
            },
            "Delay": 6400,
            "pixelX": 197.66666666666666,
            "pixelY": 0,
            "realWorldX": 1,
            "realWorldY": 0,
            "ExplosiveName": "LP 16",
            "Price": 18
          },
          "3": {
            "holeNumber": 46,
            "holeName": "Hole_46",
            "Type": "Explosive",
            "Colour": "#607179",
            "ColourRGB": {
              "r": 96,
              "g": 113,
              "b": 121
            },
            "Delay": 6400,
            "pixelX": 296.5,
            "pixelY": 0,
            "realWorldX": 1.5,
            "realWorldY": 0,
            "ExplosiveName": "LP 16",
            "Price": 18
          },
          "4": {
            "holeNumber": 45,
            "holeName": "Hole_45",
            "Type": "Explosive",
            "Colour": "#607179",
            "ColourRGB": {
              "r": 96,
              "g": 113,
              "b": 121
            },
            "Delay": 6400,
            "pixelX": 395.3333333333333,
            "pixelY": 0,
            "realWorldX": 2,
            "realWorldY": 0,
            "ExplosiveName": "LP 16",
            "Price": 18
          },
          "5": {
            "holeNumber": 44,
            "holeName": "Hole_44",
            "Type": "Explosive",
            "Colour": "#607179",
            "ColourRGB": {
              "r": 96,
              "g": 113,
              "b": 121
            },
            "Delay": 6400,
            "pixelX": 494.16666666666663,
            "pixelY": 0,
            "realWorldX": 2.5,
            "realWorldY": 0,
            "ExplosiveName": "LP 16",
            "Price": 18
          },
          "6": {
            "holeNumber": 43,
            "holeName": "Hole_43",
            "Type": "Explosive",
            "Colour": "#607179",
            "ColourRGB": {
              "r": 96,
              "g": 113,
              "b": 121
            },
            "Delay": 6400,
            "pixelX": 593,
            "pixelY": 0,
            "realWorldX": 3,
            "realWorldY": 0,
            "ExplosiveName": "LP 16",
            "Price": 18
          }
        },
        "1": {
          "0": {
            "holeNumber": 42,
            "holeName": "Hole_42",
            "Type": "Explosive",
            "Colour": "#05799e",
            "ColourRGB": {
              "r": 5,
              "g": 121,
              "b": 158
            },
            "Delay": 4600,
            "pixelX": 0,
            "pixelY": 98.83333333333333,
            "realWorldX": 0,
            "realWorldY": 0.5,
            "ExplosiveName": "LP 14",
            "Price": 18
          },
          "1": {
            "holeNumber": 41,
            "holeName": "Hole_41",
            "Type": "Explosive",
            "Colour": "#05799e",
            "ColourRGB": {
              "r": 5,
              "g": 121,
              "b": 158
            },
            "Delay": 4600,
            "pixelX": 98.83333333333333,
            "pixelY": 98.83333333333333,
            "realWorldX": 0.5,
            "realWorldY": 0.5,
            "ExplosiveName": "LP 14",
            "Price": 18
          },
          "2": {
            "holeNumber": 40,
            "holeName": "Hole_40",
            "Type": "Explosive",
            "Colour": "#05799e",
            "ColourRGB": {
              "r": 5,
              "g": 121,
              "b": 158
            },
            "Delay": 4600,
            "pixelX": 197.66666666666666,
            "pixelY": 98.83333333333333,
            "realWorldX": 1,
            "realWorldY": 0.5,
            "ExplosiveName": "LP 14",
            "Price": 18
          },
          "3": {
            "holeNumber": 39,
            "holeName": "Hole_39",
            "Type": "Explosive",
            "Colour": "#05799e",
            "ColourRGB": {
              "r": 5,
              "g": 121,
              "b": 158
            },
            "Delay": 4600,
            "pixelX": 296.5,
            "pixelY": 98.83333333333333,
            "realWorldX": 1.5,
            "realWorldY": 0.5,
            "ExplosiveName": "LP 14",
            "Price": 18
          },
          "4": {
            "holeNumber": 38,
            "holeName": "Hole_38",
            "Type": "Explosive",
            "Colour": "#05799e",
            "ColourRGB": {
              "r": 5,
              "g": 121,
              "b": 158
            },
            "Delay": 4600,
            "pixelX": 395.3333333333333,
            "pixelY": 98.83333333333333,
            "realWorldX": 2,
            "realWorldY": 0.5,
            "ExplosiveName": "LP 14",
            "Price": 18
          },
          "5": {
            "holeNumber": 37,
            "holeName": "Hole_37",
            "Type": "Explosive",
            "Colour": "#05799e",
            "ColourRGB": {
              "r": 5,
              "g": 121,
              "b": 158
            },
            "Delay": 4600,
            "pixelX": 494.16666666666663,
            "pixelY": 98.83333333333333,
            "realWorldX": 2.5,
            "realWorldY": 0.5,
            "ExplosiveName": "LP 14",
            "Price": 18
          },
          "6": {
            "holeNumber": 36,
            "holeName": "Hole_36",
            "Type": "Explosive",
            "Colour": "#05799e",
            "ColourRGB": {
              "r": 5,
              "g": 121,
              "b": 158
            },
            "Delay": 4600,
            "pixelX": 593,
            "pixelY": 98.83333333333333,
            "realWorldX": 3,
            "realWorldY": 0.5,
            "ExplosiveName": "LP 14",
            "Price": 18
          }
        },
        "2": {
          "0": {
            "holeNumber": 35,
            "holeName": "Hole_35",
            "Type": "Explosive",
            "Colour": "#7c3cb4",
            "ColourRGB": {
              "r": 124,
              "g": 60,
              "b": 180
            },
            "Delay": 3000,
            "pixelX": 0,
            "pixelY": 197.66666666666666,
            "realWorldX": 0,
            "realWorldY": 1,
            "ExplosiveName": "LP 12",
            "Price": 18
          },
          "1": {
            "holeNumber": 34,
            "holeName": "Hole_34",
            "Type": "Explosive",
            "Colour": "#0c0a0f",
            "ColourRGB": {
              "r": 12,
              "g": 10,
              "b": 15
            },
            "Delay": 2400,
            "pixelX": 98.83333333333333,
            "pixelY": 197.66666666666666,
            "realWorldX": 0.5,
            "realWorldY": 1,
            "ExplosiveName": "LP 11",
            "Price": 18
          },
          "2": {
            "holeNumber": 33,
            "holeName": "Hole_33",
            "Type": "Explosive",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "Delay": 1800,
            "pixelX": 197.66666666666666,
            "pixelY": 197.66666666666666,
            "realWorldX": 1,
            "realWorldY": 1,
            "ExplosiveName": "LP 10",
            "Price": 18
          },
          "3": {
            "holeNumber": 32,
            "holeName": "Hole_32",
            "Type": "Explosive",
            "Colour": "#f2a6aa",
            "ColourRGB": {
              "r": 242,
              "g": 166,
              "b": 170
            },
            "Delay": 1400,
            "pixelX": 296.5,
            "pixelY": 197.66666666666666,
            "realWorldX": 1.5,
            "realWorldY": 1,
            "ExplosiveName": "LP 9",
            "Price": 18
          },
          "4": {
            "holeNumber": 31,
            "holeName": "Hole_31",
            "Type": "Explosive",
            "Colour": "#fb0601",
            "ColourRGB": {
              "r": 251,
              "g": 6,
              "b": 1
            },
            "Delay": 1000,
            "pixelX": 395.3333333333333,
            "pixelY": 197.66666666666666,
            "realWorldX": 2,
            "realWorldY": 1,
            "ExplosiveName": "LP 8",
            "Price": 18
          },
          "5": {
            "holeNumber": 30,
            "holeName": "Hole_30",
            "Type": "Explosive",
            "Colour": "#f2a6aa",
            "ColourRGB": {
              "r": 242,
              "g": 166,
              "b": 170
            },
            "Delay": 1400,
            "pixelX": 494.16666666666663,
            "pixelY": 197.66666666666666,
            "realWorldX": 2.5,
            "realWorldY": 1,
            "ExplosiveName": "LP 9",
            "Price": 18
          },
          "6": {
            "holeNumber": 29,
            "holeName": "Hole_29",
            "Type": "Explosive",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "Delay": 1800,
            "pixelX": 593,
            "pixelY": 197.66666666666666,
            "realWorldX": 3,
            "realWorldY": 1,
            "ExplosiveName": "LP 10",
            "Price": 18
          }
        },
        "3": {
          "0": {
            "holeNumber": 28,
            "holeName": "Hole_28",
            "Type": "Explosive",
            "Colour": "#7c3cb4",
            "ColourRGB": {
              "r": 124,
              "g": 60,
              "b": 180
            },
            "Delay": 3000,
            "pixelX": 0,
            "pixelY": 296.5,
            "realWorldX": 0,
            "realWorldY": 1.5,
            "ExplosiveName": "LP 12",
            "Price": 18
          },
          "1": {
            "holeNumber": 27,
            "holeName": "Hole_27",
            "Type": "Explosive",
            "Colour": "#0c0a0f",
            "ColourRGB": {
              "r": 12,
              "g": 10,
              "b": 15
            },
            "Delay": 2400,
            "pixelX": 98.83333333333333,
            "pixelY": 296.5,
            "realWorldX": 0.5,
            "realWorldY": 1.5,
            "ExplosiveName": "LP 11",
            "Price": 18
          },
          "2": {
            "holeNumber": 26,
            "holeName": "Hole_26",
            "Type": "Explosive",
            "Colour": "#f2a6aa",
            "ColourRGB": {
              "r": 242,
              "g": 166,
              "b": 170
            },
            "Delay": 1400,
            "pixelX": 197.66666666666666,
            "pixelY": 296.5,
            "realWorldX": 1,
            "realWorldY": 1.5,
            "ExplosiveName": "LP 9",
            "Price": 18
          },
          "3": {
            "holeNumber": 25,
            "holeName": "Hole_25",
            "Type": "Explosive",
            "Colour": "#c12868",
            "ColourRGB": {
              "r": 193,
              "g": 40,
              "b": 104
            },
            "Delay": 800,
            "pixelX": 296.5,
            "pixelY": 296.5,
            "realWorldX": 1.5,
            "realWorldY": 1.5,
            "ExplosiveName": "LP 7",
            "Price": 18
          },
          "4": {
            "holeNumber": 24,
            "holeName": "Hole_24",
            "Type": "Explosive",
            "Colour": "#035bc9",
            "ColourRGB": {
              "r": 3,
              "g": 91,
              "b": 201
            },
            "Delay": 600,
            "pixelX": 395.3333333333333,
            "pixelY": 296.5,
            "realWorldX": 2,
            "realWorldY": 1.5,
            "ExplosiveName": "LP 6",
            "Price": 18
          },
          "5": {
            "holeNumber": 23,
            "holeName": "Hole_23",
            "Type": "Explosive",
            "Colour": "#c12868",
            "ColourRGB": {
              "r": 193,
              "g": 40,
              "b": 104
            },
            "Delay": 800,
            "pixelX": 494.16666666666663,
            "pixelY": 296.5,
            "realWorldX": 2.5,
            "realWorldY": 1.5,
            "ExplosiveName": "LP 7",
            "Price": 18
          },
          "6": {
            "holeNumber": 22,
            "holeName": "Hole_22",
            "Type": "Explosive",
            "Colour": "#f2a6aa",
            "ColourRGB": {
              "r": 242,
              "g": 166,
              "b": 170
            },
            "Delay": 1400,
            "pixelX": 593,
            "pixelY": 296.5,
            "realWorldX": 3,
            "realWorldY": 1.5,
            "ExplosiveName": "LP 9",
            "Price": 18
          }
        },
        "4": {
          "0": {
            "holeNumber": 21,
            "holeName": "Hole_21",
            "Type": "Explosive",
            "Colour": "#7c3cb4",
            "ColourRGB": {
              "r": 124,
              "g": 60,
              "b": 180
            },
            "Delay": 3000,
            "pixelX": 0,
            "pixelY": 395.3333333333333,
            "realWorldX": 0,
            "realWorldY": 2,
            "ExplosiveName": "LP 12",
            "Price": 18
          },
          "1": {
            "holeNumber": 20,
            "holeName": "Hole_20",
            "Type": "Explosive",
            "Colour": "#0c0a0f",
            "ColourRGB": {
              "r": 12,
              "g": 10,
              "b": 15
            },
            "Delay": 2400,
            "pixelX": 98.83333333333333,
            "pixelY": 395.3333333333333,
            "realWorldX": 0.5,
            "realWorldY": 2,
            "ExplosiveName": "LP 11",
            "Price": 18
          },
          "2": {
            "holeNumber": 19,
            "holeName": "Hole_19",
            "Type": "Explosive",
            "Colour": "#fb0601",
            "ColourRGB": {
              "r": 251,
              "g": 6,
              "b": 1
            },
            "Delay": 1000,
            "pixelX": 197.66666666666666,
            "pixelY": 395.3333333333333,
            "realWorldX": 1,
            "realWorldY": 2,
            "ExplosiveName": "LP 8",
            "Price": 18
          },
          "3": {
            "holeNumber": 18,
            "holeName": "Hole_18",
            "Type": "Explosive",
            "Colour": "#01112b",
            "ColourRGB": {
              "r": 1,
              "g": 17,
              "b": 43
            },
            "Delay": 500,
            "pixelX": 296.5,
            "pixelY": 395.3333333333333,
            "realWorldX": 1.5,
            "realWorldY": 2,
            "ExplosiveName": "LP 5",
            "Price": 18
          },
          "4": {
            "holeNumber": 17,
            "holeName": "Hole_17",
            "Type": "Explosive",
            "Colour": "#be7202",
            "ColourRGB": {
              "r": 190,
              "g": 114,
              "b": 2
            },
            "Delay": 9,
            "pixelX": 395.3333333333333,
            "pixelY": 395.3333333333333,
            "realWorldX": 2,
            "realWorldY": 2,
            "ExplosiveName": "LP 0",
            "Price": 18
          },
          "5": {
            "holeNumber": 16,
            "holeName": "Hole_16",
            "Type": "Explosive",
            "Colour": "#01112b",
            "ColourRGB": {
              "r": 1,
              "g": 17,
              "b": 43
            },
            "Delay": 500,
            "pixelX": 494.16666666666663,
            "pixelY": 395.3333333333333,
            "realWorldX": 2.5,
            "realWorldY": 2,
            "ExplosiveName": "LP 5",
            "Price": 18
          },
          "6": {
            "holeNumber": 15,
            "holeName": "Hole_15",
            "Type": "Explosive",
            "Colour": "#fb0601",
            "ColourRGB": {
              "r": 251,
              "g": 6,
              "b": 1
            },
            "Delay": 1000,
            "pixelX": 593,
            "pixelY": 395.3333333333333,
            "realWorldX": 3,
            "realWorldY": 2,
            "ExplosiveName": "LP 8",
            "Price": 18
          }
        },
        "5": {
          "0": {
            "holeNumber": 14,
            "holeName": "Hole_14",
            "Type": "Explosive",
            "Colour": "#7c3cb4",
            "ColourRGB": {
              "r": 124,
              "g": 60,
              "b": 180
            },
            "Delay": 3000,
            "pixelX": 0,
            "pixelY": 494.16666666666663,
            "realWorldX": 0,
            "realWorldY": 2.5,
            "ExplosiveName": "LP 12",
            "Price": 18
          },
          "1": {
            "holeNumber": 13,
            "holeName": "Hole_13",
            "Type": "Explosive",
            "Colour": "#0c0a0f",
            "ColourRGB": {
              "r": 12,
              "g": 10,
              "b": 15
            },
            "Delay": 2400,
            "pixelX": 98.83333333333333,
            "pixelY": 494.16666666666663,
            "realWorldX": 0.5,
            "realWorldY": 2.5,
            "ExplosiveName": "LP 11",
            "Price": 18
          },
          "2": {
            "holeNumber": 12,
            "holeName": "Hole_12",
            "Type": "Explosive",
            "Colour": "#f2a6aa",
            "ColourRGB": {
              "r": 242,
              "g": 166,
              "b": 170
            },
            "Delay": 1400,
            "pixelX": 197.66666666666666,
            "pixelY": 494.16666666666663,
            "realWorldX": 1,
            "realWorldY": 2.5,
            "ExplosiveName": "LP 9",
            "Price": 18
          },
          "3": {
            "holeNumber": 11,
            "holeName": "Hole_11",
            "Type": "Explosive",
            "Colour": "#c12868",
            "ColourRGB": {
              "r": 193,
              "g": 40,
              "b": 104
            },
            "Delay": 800,
            "pixelX": 296.5,
            "pixelY": 494.16666666666663,
            "realWorldX": 1.5,
            "realWorldY": 2.5,
            "ExplosiveName": "LP 7",
            "Price": 18
          },
          "4": {
            "holeNumber": 10,
            "holeName": "Hole_10",
            "Type": "Explosive",
            "Colour": "#035bc9",
            "ColourRGB": {
              "r": 3,
              "g": 91,
              "b": 201
            },
            "Delay": 600,
            "pixelX": 395.3333333333333,
            "pixelY": 494.16666666666663,
            "realWorldX": 2,
            "realWorldY": 2.5,
            "ExplosiveName": "LP 6",
            "Price": 18
          },
          "5": {
            "holeNumber": 9,
            "holeName": "Hole_9",
            "Type": "Explosive",
            "Colour": "#c12868",
            "ColourRGB": {
              "r": 193,
              "g": 40,
              "b": 104
            },
            "Delay": 800,
            "pixelX": 494.16666666666663,
            "pixelY": 494.16666666666663,
            "realWorldX": 2.5,
            "realWorldY": 2.5,
            "ExplosiveName": "LP 7",
            "Price": 18
          },
          "6": {
            "holeNumber": 8,
            "holeName": "Hole_8",
            "Type": "Explosive",
            "Colour": "#f2a6aa",
            "ColourRGB": {
              "r": 242,
              "g": 166,
              "b": 170
            },
            "Delay": 1400,
            "pixelX": 593,
            "pixelY": 494.16666666666663,
            "realWorldX": 3,
            "realWorldY": 2.5,
            "ExplosiveName": "LP 9",
            "Price": 18
          }
        },
        "6": {
          "0": {
            "holeNumber": 7,
            "holeName": "Hole_7",
            "Type": "Explosive",
            "Colour": "#7c3cb4",
            "ColourRGB": {
              "r": 124,
              "g": 60,
              "b": 180
            },
            "Delay": 3000,
            "pixelX": 0,
            "pixelY": 593,
            "realWorldX": 0,
            "realWorldY": 3,
            "ExplosiveName": "LP 12",
            "Price": 18
          },
          "1": {
            "holeNumber": 6,
            "holeName": "Hole_6",
            "Type": "Explosive",
            "Colour": "#0c0a0f",
            "ColourRGB": {
              "r": 12,
              "g": 10,
              "b": 15
            },
            "Delay": 2400,
            "pixelX": 98.83333333333333,
            "pixelY": 593,
            "realWorldX": 0.5,
            "realWorldY": 3,
            "ExplosiveName": "LP 11",
            "Price": 18
          },
          "2": {
            "holeNumber": 5,
            "holeName": "Hole_5",
            "Type": "Explosive",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "Delay": 1800,
            "pixelX": 197.66666666666666,
            "pixelY": 593,
            "realWorldX": 1,
            "realWorldY": 3,
            "ExplosiveName": "LP 10",
            "Price": 18
          },
          "3": {
            "holeNumber": 4,
            "holeName": "Hole_4",
            "Type": "Explosive",
            "Colour": "#f2a6aa",
            "ColourRGB": {
              "r": 242,
              "g": 166,
              "b": 170
            },
            "Delay": 1400,
            "pixelX": 296.5,
            "pixelY": 593,
            "realWorldX": 1.5,
            "realWorldY": 3,
            "ExplosiveName": "LP 9",
            "Price": 18
          },
          "4": {
            "holeNumber": 3,
            "holeName": "Hole_3",
            "Type": "Explosive",
            "Colour": "#fb0601",
            "ColourRGB": {
              "r": 251,
              "g": 6,
              "b": 1
            },
            "Delay": 1000,
            "pixelX": 395.3333333333333,
            "pixelY": 593,
            "realWorldX": 2,
            "realWorldY": 3,
            "ExplosiveName": "LP 8",
            "Price": 18
          },
          "5": {
            "holeNumber": 2,
            "holeName": "Hole_2",
            "Type": "Explosive",
            "Colour": "#f2a6aa",
            "ColourRGB": {
              "r": 242,
              "g": 166,
              "b": 170
            },
            "Delay": 1400,
            "pixelX": 494.16666666666663,
            "pixelY": 593,
            "realWorldX": 2.5,
            "realWorldY": 3,
            "ExplosiveName": "LP 9",
            "Price": 18
          },
          "6": {
            "holeNumber": 1,
            "holeName": "Hole_1",
            "Type": "Explosive",
            "Colour": "#da0136",
            "ColourRGB": {
              "r": 218,
              "g": 1,
              "b": 54
            },
            "Delay": 1800,
            "pixelX": 593,
            "pixelY": 593,
            "realWorldX": 3,
            "realWorldY": 3,
            "ExplosiveName": "LP 10",
            "Price": 18
          }
        },
      "7": {
        "0": {
          "holeNumber": 1,
          "holeName": "CutHole_1",
          "Type": "Explosive",
          "Colour": "#028e35",
          "ColourRGB": {
            "r": 2,
            "g": 142,
            "b": 53
          },
          "Delay": 200,
          "pixelX": 345.91666666666663,
          "pixelY": 345.91666666666663,
          "realWorldX": 1.7499999999999998,
          "realWorldY": 1.7499999999999998,
          "ExplosiveName": "LP 2",
          "Price": 18
        },
        "1": {
          "holeNumber": 2,
          "holeName": "CutHole_2",
          "Type": "Relief",
          "Colour": "#F5911E",
          "ColourRGB": {
            "r": 245,
            "g": 145,
            "b": 30
          },
          "Delay": 1,
          "pixelX": 395.3333333333333,
          "pixelY": 345.91666666666663,
          "realWorldX": 1.9999999999999998,
          "realWorldY": 1.7499999999999998
        },
        "2": {
          "holeNumber": 3,
          "holeName": "CutHole_3",
          "Type": "Explosive",
          "Colour": "#b75107",
          "ColourRGB": {
            "r": 183,
            "g": 81,
            "b": 7
          },
          "Delay": 100,
          "pixelX": 444.74999999999994,
          "pixelY": 345.91666666666663,
          "realWorldX": 2.25,
          "realWorldY": 1.7499999999999998,
          "ExplosiveName": "LP 1",
          "Price": 18
        }
      },
      "8": {
        "0": {
          "holeNumber": 4,
          "holeName": "CutHole_4",
          "Type": "Relief",
          "Colour": "#F5911E",
          "ColourRGB": {
            "r": 245,
            "g": 145,
            "b": 30
          },
          "Delay": 1,
          "pixelX": 345.91666666666663,
          "pixelY": 395.3333333333333,
          "realWorldX": 1.7499999999999998,
          "realWorldY": 1.9999999999999998
        },
        "1": {
          "holeNumber": 5,
          "holeName": "CutHole_5",
          "Type": "Explosive",
          "Colour": "#be7202",
          "ColourRGB": {
            "r": 190,
            "g": 114,
            "b": 2
          },
          "Delay": 9,
          "pixelX": 395.3333333333333,
          "pixelY": 395.3333333333333,
          "realWorldX": 1.9999999999999998,
          "realWorldY": 1.9999999999999998,
          "ExplosiveName": "LP 0",
          "Price": 18
        },
        "2": {
          "holeNumber": 6,
          "holeName": "CutHole_6",
          "Type": "Relief",
          "Colour": "#F5911E",
          "ColourRGB": {
            "r": 245,
            "g": 145,
            "b": 30
          },
          "Delay": 1,
          "pixelX": 444.74999999999994,
          "pixelY": 395.3333333333333,
          "realWorldX": 2.25,
          "realWorldY": 1.9999999999999998
        }
      },
      "9": {
        "0": {
          "holeNumber": 7,
          "holeName": "CutHole_7",
          "Type": "Explosive",
          "Colour": "#85d004",
          "ColourRGB": {
            "r": 133,
            "g": 208,
            "b": 4
          },
          "Delay": 300,
          "pixelX": 345.91666666666663,
          "pixelY": 444.74999999999994,
          "realWorldX": 1.7499999999999998,
          "realWorldY": 2.25,
          "ExplosiveName": "LP 3",
          "Price": 18
        },
        "1": {
          "holeNumber": 8,
          "holeName": "CutHole_8",
          "Type": "Relief",
          "Colour": "#F5911E",
          "ColourRGB": {
            "r": 245,
            "g": 145,
            "b": 30
          },
          "Delay": 1,
          "pixelX": 395.3333333333333,
          "pixelY": 444.74999999999994,
          "realWorldX": 1.9999999999999998,
          "realWorldY": 2.25
        },
        "2": {
          "holeNumber": 9,
          "holeName": "CutHole_9",
          "Type": "Explosive",
          "Colour": "#00b149",
          "ColourRGB": {
            "r": 0,
            "g": 177,
            "b": 73
          },
          "Delay": 400,
          "pixelX": 444.74999999999994,
          "pixelY": 444.74999999999994,
          "realWorldX": 2.25,
          "realWorldY": 2.25,
          "ExplosiveName": "LP 4",
          "Price": 18
        }
      }
      },
      "Inner": 3,
      "Outer": 6,
      "HoleDiameter": "45",
      "HoleFillPercentage": 0.75,
      "HoleMass": 4.115240939276568
    }
  ],
  RockTypesArr: [
		{"Name":"Basalt", "Density":2.9, "Hardness":"Hard"},
		{"Name":"Coal-Anthracite", "Density":1.55, "Hardness":"Soft"},
		{"Name":"Coal-Bituminous", "Density":1.3, "Hardness":"Soft"},
		{"Name":"Diabase", "Density":1.3, "Hardness":"Medium"},
		{"Name":"Diorite", "Density":2.9, "Hardness":"Hard"},
		{"Name":"Dolomite", "Density":2.85, "Hardness":"Hard"},
		{"Name":"Gneiss", "Density":2.75, "Hardness":"Hard"},
		{"Name":"Granite", "Density":2.75, "Hardness":"Medium"},
		{"Name":"Gypsum", "Density":2.8, "Hardness":"Medium"},
		{"Name":"Haematite", "Density":4.9, "Hardness":"Hard"},
		{"Name":"Limestone", "Density":2.75, "Hardness":"Medium"},
		{"Name":"Magnetite", "Density":5.05, "Hardness":"Hard"},
		{"Name":"Marble", "Density":2.5, "Hardness":"Hard"},
		{"Name":"Quartzite", "Density":2.4, "Hardness":"Soft"},
		{"Name":"Sandstone", "Density":2.4, "Hardness":"Soft"},
		{"Name":"Shale", "Density":2.6, "Hardness":"Soft"},
		{"Name":"Slate", "Density":2.65, "Hardness":"Medium"}
	],
  ExplosiveTypesArr: [
    {
      "Name":"DDS Emulsion",
      "Group":"Sasol",
      "Price":9,
      "Coupling":1,
      "Density":1.15,
    }
  ],
  AdditionalsArr: [
    {"Name":"Boosters", "Price":5, "Quantity":"Unit", "Per":"Hole"},
    {"Name":"Priming Cartridge", "Price":3, "Quantity":"Unit", "Per":"Hole"},
    {"Name":"Stemming", "Price":2, "Quantity":"Unit", "Per":"Hole"},
    {"Name":"Detonator Clip", "Price":1.5, "Quantity":"Unit", "Per":"Hole"},
    {"Name":"Starter", "Price":30, "Quantity":"Unit", "Per":"Face"},
    {"Name":"Detonating Cord", "Price":3, "Quantity":"m", "Per":"Face"}
  ],
  DetonatorArr: [
    {"Name":"LP 0", "Group":"Sasol-Primadet", "Coupling":1, "Density":1.15, "Colour":"#be7202", "Price":18, "Strength":0.5, "Delay":9,},
    {"Name":"LP 1", "Group":"Sasol-Primadet", "Coupling":1, "Density":1.15, "Colour":"#b75107", "Price":18, "Strength":1, "Delay":100,},
    {"Name":"LP 2", "Group":"Sasol-Primadet", "Coupling":1, "Density":1.15, "Colour":"#028e35", "Price":18, "Strength":1.5, "Delay":200,},
    {"Name":"LP 3", "Group":"Sasol-Primadet", "Coupling":1, "Density":1.15, "Colour":"#85d004", "Price":18, "Strength":2, "Delay":300,},
    {"Name":"LP 4", "Group":"Sasol-Primadet", "Coupling":1, "Density":1.15, "Colour":"#00b149", "Price":18, "Strength":2.5, "Delay":400,},
    {"Name":"LP 5", "Group":"Sasol-Primadet", "Coupling":1, "Density":1.15, "Colour":"#01112b", "Price":18, "Strength":3, "Delay":500,},
    {"Name":"LP 6", "Group":"Sasol-Primadet", "Coupling":1, "Density":1.15, "Colour":"#035bc9", "Price":18, "Strength":3.5, "Delay":600,},
    {"Name":"LP 7", "Group":"Sasol-Primadet", "Coupling":1, "Density":1.15, "Colour":"#c12868", "Price":18, "Strength":4, "Delay":800,},
    {"Name":"LP 8", "Group":"Sasol-Primadet", "Coupling":1, "Density":1.15, "Colour":"#fb0601", "Price":18, "Strength":4.5, "Delay":1000,},
    {"Name":"LP 9", "Group":"Sasol-Primadet", "Coupling":1, "Density":1.15, "Colour":"#f2a6aa", "Price":18, "Strength":5, "Delay":1400,},
    {"Name":"LP 10", "Group":"Sasol-Primadet", "Coupling":1, "Density":1.15, "Colour":"#da0136","Price":18, "Strength":5.5, "Delay":1800,},
    {"Name":"LP 11", "Group":"Sasol-Primadet", "Coupling":1, "Density":1.15, "Colour":"#0c0a0f", "Price":18, "Strength":6, "Delay":2400,},
    {"Name":"LP 12", "Group":"Sasol-Primadet", "Coupling":1, "Density":1.15, "Colour":"#7c3cb4", "Price":18, "Strength":6.5, "Delay":3000,},
    {"Name":"LP 13", "Group":"Sasol-Primadet", "Coupling":1, "Density":1.15, "Colour":"#c4c46e", "Price":18, "Strength":7, "Delay":3800,},
    {"Name":"LP 14", "Group":"Sasol-Primadet", "Coupling":1, "Density":1.15, "Colour":"#05799e", "Price":18, "Strength":7.5, "Delay":4600,},
    {"Name":"LP 15", "Group":"Sasol-Primadet", "Coupling":1, "Density":1.15, "Colour":"#f3b919", "Price":18, "Strength":8, "Delay":5500,},
    {"Name":"LP 16", "Group":"Sasol-Primadet", "Coupling":1, "Density":1.15, "Colour":"#607179", "Price":18, "Strength":8.5, "Delay":6400,},
    {"Name":"LP 17", "Group":"Sasol-Primadet", "Coupling":1, "Density":1.15, "Colour":"#d4d5d7", "Price":18, "Strength":9, "Delay":7400,},
    {"Name":"LP 18", "Group":"Sasol-Primadet", "Coupling":1, "Density":1.15, "Colour":"#077d89", "Price":18, "Strength":9.5, "Delay":8500,},
    {"Name":"LP 19", "Group":"Sasol-Primadet", "Coupling":1, "Density":1.15, "Colour":"#fb4700", "Price":18, "Strength":10, "Delay":9600,},
  ],
  DetonatorTypeArr: [],
	transactionDelimitor:"124",
	transactionFriendlyNames:[
		"UntID",
		"Date",
		"Time",
		"UsrID",
		"Event",
		"Flag",
		"Loca",
		"SubLoca",
		"Temp",
		"Pres",
		"HleMas",
		"FillPerc",
		"FceMas",
		"NoHoles",
    "Lat",
    "Lon"
	],
	transactionFriendlyNameFunction:[
		"",//"UntID",
		"processDate",//"Date",
		"processTime",//"Time",
		"",//"UsrID",
		"",//"Event",
		"",//"Flag",
		"",//"Loca",
		"",//"SubLoca",
		"",//"Temp",
		"",//"Pres",
		"",//"HleMas",
		"",//"FillPerc",
		"",//"FceMas",
		""//"NoHoles"
	],
	processDate: function(val){
		return String(val);
	},
	processTime: function(val){
		return String(val);
	},
	processString: function(val){
		return String(val);
	},
	processNumber: function(val){
		return parseFloat(val);
	},
  initialize: function () {
      this.bindEvents();
  },
	isEmpty: function(val){
		return (val === undefined || val == null || val.length <= 0) ? true : false;
	},
  bindEvents: function(){
    document.addEventListener('deviceready', this.onDeviceReady, false);

    $('#refresh-paired-devices').click(bt.listPairedDevices);
    $('#paired-devices form').submit(bt.selectDevice);
    $('#toggle-connection').click(bt.toggleConnection);
    $('#clear-data').click(bt.clearData);
    $('#terminal form').submit(bt.sendData);
    bt.showUnclosedJobs();
    bt.showUploadFiles();
  },
	pad: function (num, size) {
		var s = "000000000" + num;
		return s.substr(s.length-size);
	},
	GUID: function() {
	  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	  });
	},
	setLocalStorage: function(key, val){
		localStorage.setItem(key, JSON.stringify(val));
	},
	getLocalStorage: function(key){
		var localStorageVal = localStorage.getItem(key);
		try {
			if(!bt.isEmpty(JSON.parse(localStorageVal))){
				return this.data = JSON.parse(localStorageVal);
			}
		}
		catch(err) {
			if(!bt.isEmpty(JSON.parse(localStorageVal))){
				return this.data[key] = localStorageVal;
			}
			else{
				return err;
			}
		}
	},
  onDeviceReady: function () {
    bt.goTo('loginScreen');
    bluetoothSerial.isEnabled(bt.listPairedDevices, function () {
        bt.showError('Enable bluetooth');
    });
  },
  handleJobCard: function(){
    bt.jobCard["date"] = bt.setTime();
    bt.jobCard["jobID"] = bt.GUID();
    bt.jobCard["userName"].push(document.getElementById("name-Input").value);
    bt.jobCard["subLocation"] = document.getElementById("sub-Location-Input").value;
    if(bt.handleHistory()){
      var localHistory = bt.getLocalStorage('jobHistory');
      for(var i = 0; i < localHistory.length; i++){
        if(localHistory[i]['jobStatus'] == 'Active'){
          if(localHistory[i]['subLocation'] == bt.jobCard['subLocation']){
            bt.jobCard = localHistory[i]
            bt.jobCard["userName"].push(document.getElementById("name-Input").value);
            localHistory.splice(i, 1, bt.jobCard);
            bt.setLocalStorage('jobHistory', localHistory);
          }
        }
      }
    } else {
      bt.createNewJob();
    }
    bt.setHoleDetails();
    bt.setDetonatorDetails();
    bt.goTo('paired-devices');
    app.methods.checkIn("securityEntrance");
    bt.listPairedDevices();
  },
  handleHistory: function(){
    var localHistory = bt.getLocalStorage("jobHistory");
    if(bt.isEmpty(localHistory)){
      localHistory = [];
    }
    var activeJob = false;
    for(var i = 0; i < localHistory.length; i++){
      if(localHistory[i]["jobStatus"] == "Active"){
        if(localHistory[i]["subLocation"] == bt.jobCard['subLocation']){
          if(confirm('Do you wish to proceed with job no: ' + localHistory[i]['jobID'])){
            activeJob = true;
            return activeJob;
          }
        }
      }
    }
  },
  createNewJob: function(){
    var localHistory = bt.getLocalStorage('jobHistory');
    if(bt.isEmpty(localHistory)){
      localHistory = [];
    }
    var holeObject = {
      holeMass: "0",                                                      //To be read from device
      startTime: bt.setTime(),                                            //To be initiated at start of pump
      endTime: bt.setTime(),                                               //To be initiated at end of pump
      detonator: '',
      holeNumber: ''
    }
    bt.jobCard.jobID = bt.GUID();
    var ell = document.getElementById('blastPlan').value;
    bt.blastPlanArr.forEach(function(element){
      if(element['Plan'] == ell){
        bt.jobCard.blastPlan = element;
      }
    })

    bt.jobCard.mine = bt.jobCard.blastPlan['Mine'];
    bt.jobCard.location = bt.jobCard.blastPlan['Location'];
    bt.jobCard.rows = bt.jobCard.blastPlan['Rows'];
    bt.jobCard.columns = bt.jobCard.blastPlan['Columns'];
    bt.jobCard.jobHeight = bt.jobCard.blastPlan['Height'];
    bt.jobCard.jobWidth = bt.jobCard.blastPlan['Width'];
    bt.jobCard.holesPlanned = bt.jobCard.blastPlan['positions'];
    bt.jobCard.holeMassPlanned = bt.jobCard.blastPlan['HoleMass'];
    bt.jobCard.holeFillPercentage = bt.jobCard.blastPlan['HoleFillPercentage'];
    bt.jobCard.holeDiameter = bt.jobCard.blastPlan['HoleDiameter'];
    bt.jobCard.holes = [];
    bt.jobCard.holes.push(holeObject);
    bt.jobCard.date = bt.setTime();
    bt.jobCard.jobStatus = "Active";
    localHistory.push(bt.jobCard);
    bt.setLocalStorage('jobHistory', localHistory);
    return
  },
  showUnclosedJobs: function(){
    var localStorage = bt.getLocalStorage("jobHistory");
    var openJobs = [];
    var element = document.getElementById("openJobCardsTotal");
    if(localStorage == undefined){
      return
    } else {
      localStorage.forEach(function(localIndex){
        if(localIndex['jobStatus'] == 'Active'){
          openJobs.push(localIndex);
        }
      });
    }
    if(openJobs.length == 0 || openJobs == undefined){
      element.classList.add("badge");
      element.innerHTML = 0;
    } else {
      element.classList.add("color-red");
      element.classList.add("badge");
      element.innerHTML = openJobs.length;
    }
  },
  showUploadFiles: function(){
    var localHistory = bt.getLocalStorage('TransactionData');
    var element = document.getElementById('uploadJobCardsTotal');
    if(bt.isEmpty(localHistory)){
      element.classList.add("badge");
      element.innerHTML = "0";
    } else {
      element.classList.add("color-red");
      element.classList.add("badge");
      var total = 0;
      for(var i = 0; i < localHistory.length; i++){
        if(localHistory[i].dataSentToDB == false){
          total++;
        }
      }
      element.innerHTML = total;
    }
  },
  noOfHoles: function(jobCard){
    if(bt.isEmpty(jobCard)){
      return "0"
    } else {
      return jobCard.length;
    }
  },
  totalMass: function(jobCard){
    var total = 0;
    for(var i = 0; i < jobCard.length; i++){
      var holeDetail = jobCard[i].holeMass;
      var amount = total + JSON.parse(holeDetail);
      total = amount;
    }
    if(bt.isEmpty(total)){
      return "0";
    } else {
      return total.toFixed(1);
    }
  },
  noOfSamples: function(){
    return bt.jobCard.samples.length;
  },
  avgOfSamples: function(samples){

    var sampleTotal = 0;
    for(var sample in samples){
      sampleTotal = sampleTotal + samples[sample].density;
    }
    var avg = sampleTotal / samples.length;
    if(bt.isEmpty(avg)){
      return "0"
    } else {
      return avg;
    }
  },
  pullBlastGridPlan: function(){
    async function getData(){
      try {
        const response = await fetch('https://blastit.scratchpad.biz/plan/DemoFaces.json');
        if (response.ok){
          const jsonResponse = await response.json();
          console.log("Success: ", jsonResponse);
        }
        throw new Error('Request failed');
      } catch(error) {
        console.log("Error: ", error);
      }
    }

    getData();
  },
  setHoleDetails: function(){
    var divident = document.getElementById('holeSelector');
    var selector = document.createElement('SELECT');
    selector.setAttribute('id', 'holeSelect');
    // selector.setAttribute('class', 'holeSelect');
    var noHoleCell = document.createElement('OPTION');
    var noHole = document.createTextNode('No Hole');
    noHoleCell.appendChild(noHole);
    selector.appendChild(noHoleCell);

    for(var i = 0; i < bt.jobCard.rows; i++){
      for(var j = 0; j < bt.jobCard.columns; j++){
        var option = document.createElement('OPTION');
        var data = document.createTextNode(bt.jobCard.blastPlan.positions[i][j]['holeName']);
        option.setAttribute('id', bt.jobCard.blastPlan.positions[i][j]['holeName']);
        option.setAttribute('value', i + "," + j);
        option.appendChild(data);
        selector.appendChild(option);
      }
    }

    divident.appendChild(selector);
  },
  setDetonatorDetails: function(){
    var element = document.getElementById('holeSpecButton');
    var selector = document.getElementById('holeSelect').addEventListener('change', function(){
      var SetToCurrent = setCorrectingInterval(function(){
		if(checkSetToCurrent){
			  var holeVal = document.getElementById('holeSelect').value.split(",");
			  document.getElementById('detonatorSelector').innerHTML = bt.jobCard.holesPlanned[holeVal[0]][holeVal[1]]['ExplosiveName'];
			  document.getElementById('detonatorSelector').value = bt.jobCard.holesPlanned[holeVal[0]][holeVal[1]]['ExplosiveName'];
			  var currentMass = bt.jobCard.holesPlanned[holeVal[0]][holeVal[1]]['HoleMass'];
			  var fixedMass = currentMass.toFixed(1);
			  document.getElementById('hole-mass').innerHTML = fixedMass;
			  
			  if(bt.demo == true){
				  bt.previousPassiveResponse[16] = String(fixedMass*10).substring(0, 2);
				  bt.previousPassiveResponse[17] = String(fixedMass*10).substring(2, 4);
			  }
			  
			  var setVal = parseFloat(fixedMass);
			  var holeMass = parseInt(256*bt.previousPassiveResponse[16])+parseInt(bt.previousPassiveResponse[17]);
			  var currentVal = parseFloat((holeMass/10).toFixed(1));
			  
			  if(setVal > currentVal){
				  app.methods.holeMassUp();
			  } else if (setVal < currentVal) {
				  app.methods.holeMassDown();
			  } else {
				checkSetToCurrent = false;
			  }

			  if (element.classList) {
				  element.classList.toggle("color-grey");
				}

			  if(element.value === "Waiting for Device"){
				element.value = "Charge";
				element.classList.toggle('color-green');
			  }
		}else{
			clearCorrectingInterval(SetToCurrent);
		}
	  }, 1500);
	  
    })
  },
  saveHole: function(){
    var localHistory = bt.getLocalStorage('jobHistory');
    for(var i  = 0; i < localHistory.length; i++){
      if(localHistory[i]['jobID'] == bt.jobCard.jobID){
        localHistory.splice(i, 1, bt.jobCard);
        bt.setLocalStorage('jobHistory', localHistory);
      }
    }
  },
  activateCamera: function(){
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
  },
  takePhoto: function(){
    navigator.camera.getPicture(bt.onPhotoDataSuccess, bt.onCameraError, {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL
    });
  },
  getPhoto: function(source){
    navigator.camera.getPicture(bt.onPhotoDataSuccess, bt.onCameraError, { quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });
  },
  onPhotoDataSuccess: function(imageData){
    var count = 0;

    var image = document.createElement("IMG");
    image.setAttribute('id', 'preReportImage' + count);
    document.getElementById('photoContainer').appendChild(image);

    var dataImage = document.getElementById('preReportImage'+ count);
    dataImage.style.display = "block";
    dataImage.src = "data:image/jpeg;base64," + imageData;
    var photoObject = {
      name: image.id,
      data: "data:image/jpeg;base64," + imageData
    }
    bt.jobCard.photos.push(photoObject);
    count++;
  },
  onPhotoURISuccess: function(imageURI){
    var uriImage = document.getElementById('uriImage');
    uriImage.style.display = "block";
    uriImage.src = imageURI;
  },
  onCameraError: function(error){
    alert("Device Error: ", error);
  },
  blastPlanDropdown: function(){
    var blastPlanList = document.createElement('SELECT');
    blastPlanList.setAttribute('id', "blastPlan");

    bt.blastPlanArr.forEach(function(element){
      var option = document.createElement('OPTION');
      option.setAttribute('id', element['Plan'])
      var data = document.createTextNode(element['Plan']);

      option.appendChild(data);
      blastPlanList.appendChild(option);
    });

    document.getElementById('blastPlanSelect').appendChild(blastPlanList);
  },
  preBlastCount: 0,
  preBlastList: function(){
    var localHistory = bt.getLocalStorage('jobHistory');
    var devider = document.createElement('div');

    localHistory.forEach(function(element){
      var preBlastTableNode = document.createElement("TABLE");
      preBlastTableNode.setAttribute("id", element['jobID']);
      preBlastTableNode.setAttribute("class", 'preBlastListTable');
      var preBlastTableRowNode1 = document.createElement("tr");
      preBlastTableRowNode1.setAttribute('class', "preBlastListHeaderRow");
      var preBlastTableRowNode2 = document.createElement("tr");
      preBlastTableRowNode2.setAttribute('class', "preBlastListDataRow");
      var preBlastTableRowNode3 = document.createElement('tr');
      preBlastTableRowNode3.setAttribute('class', "preBlastListHeaderRow");
      var preBlastTableRowNode4 = document.createElement('tr');
      preBlastTableRowNode4.setAttribute('class', "preBlastListDataRow");
      var preBlastTableRowNode5 = document.createElement('tr');
      preBlastTableRowNode5.setAttribute('class', "preBlastListHeaderRow");
      var preBlastTableRowNode6 = document.createElement('tr');
      preBlastTableRowNode6.setAttribute('class', "preBlastListDataRow");
      var preBlastTableRowNode7 = document.createElement('tr');
      preBlastTableRowNode7.setAttribute('class', "preBlastListHeaderRow");
      var preBlastTableRowNode8 = document.createElement('tr');
      preBlastTableRowNode8.setAttribute('class', "preBlastListDataRow");

      var preBlastHeaderNode1 = document.createElement('th');
      preBlastHeaderNode1.setAttribute('colspan', '3');
      preBlastHeaderNode1.setAttribute('class', 'preBlastListHeaderCell');
      var preBlastHeaderNode2 = document.createElement('th');
      preBlastHeaderNode2.setAttribute('colspan', '3');
      preBlastHeaderNode2.setAttribute('class', 'preBlastListHeaderCell');
      var preBlastHeaderNode3 = document.createElement('th');
      preBlastHeaderNode3.setAttribute('class', 'preBlastListHeaderCell');
      var preBlastHeaderNode4 = document.createElement('th');
      preBlastHeaderNode4.setAttribute('class', 'preBlastListHeaderCell');
      var preBlastHeaderNode5 = document.createElement('th');
      preBlastHeaderNode5.setAttribute('class', 'preBlastListHeaderCell');
      var preBlastHeaderNode6 = document.createElement('th');
      preBlastHeaderNode6.setAttribute('class', 'preBlastListHeaderCell');
      var preBlastHeaderNode7 = document.createElement('th');
      preBlastHeaderNode7.setAttribute('class', 'preBlastListHeaderCell');

      var preBlastHeaderText1 = document.createTextNode("Job Card");
      var preBlastHeaderText2 = document.createTextNode('Job Status');
      var preBlastHeaderText3 = document.createTextNode("Mine");
      var preBlastHeaderText4 = document.createTextNode("Location");
      var preBlastHeaderText5 = document.createTextNode("Sub-Location");
      var preBlastHeaderText6 = document.createTextNode("Date");
      var preBlastHeaderText7 = document.createTextNode('Operator');

      var preBlastData1 = document.createElement('td');
      preBlastData1.setAttribute('colspan', '3');
      preBlastData1.setAttribute('class', 'blastListData');
      var preBlastData2 = document.createElement('td');
      preBlastData2.setAttribute('class', 'blastListData');
      var preBlastData3 = document.createElement('td');
      preBlastData3.setAttribute('class', 'blastListData');
      var preBlastData4 = document.createElement('td');
      preBlastData4.setAttribute('class', 'blastListData');
      var preBlastData5 = document.createElement('td');
      preBlastData5.setAttribute('class', 'blastListData');
      var preBlastData6 = document.createElement('td');
      preBlastData6.setAttribute('class', 'blastListData');
      var preBlastData7 = document.createElement('td');
      preBlastData7.setAttribute('class', 'blastListData');

      var preBlastDataText1 = document.createTextNode(element['jobID']);
      var preBlastDataText2 = document.createTextNode(element['jobStatus']);
      var preBlastDataText3 = document.createTextNode(element['mine']);
      var preBlastDataText4 = document.createTextNode(element['location']);
      var preBlastDataText5 = document.createTextNode(element['subLocation']);
      var preBlastDataText6 = document.createTextNode(element['date']);
      var preBlastDataText7 = document.createTextNode(element['userName']);

      //create table
      preBlastTableNode.appendChild(preBlastTableRowNode1);
      preBlastTableNode.appendChild(preBlastTableRowNode2);
      preBlastTableNode.appendChild(preBlastTableRowNode3);
      preBlastTableNode.appendChild(preBlastTableRowNode4);
      preBlastTableNode.appendChild(preBlastTableRowNode5);
      preBlastTableNode.appendChild(preBlastTableRowNode6);
      preBlastTableNode.appendChild(preBlastTableRowNode7);
      preBlastTableNode.appendChild(preBlastTableRowNode8);

      //assign header cells to Rows
      preBlastTableRowNode1.appendChild(preBlastHeaderNode1);
      preBlastTableRowNode3.appendChild(preBlastHeaderNode2);
      preBlastTableRowNode5.appendChild(preBlastHeaderNode3);
      preBlastTableRowNode5.appendChild(preBlastHeaderNode4);
      preBlastTableRowNode5.appendChild(preBlastHeaderNode5);
      preBlastTableRowNode7.appendChild(preBlastHeaderNode6);
      preBlastTableRowNode7.appendChild(preBlastHeaderNode7);

      //add header text to header cells
      preBlastHeaderNode1.appendChild(preBlastHeaderText1);
      preBlastHeaderNode2.appendChild(preBlastHeaderText2);
      preBlastHeaderNode3.appendChild(preBlastHeaderText3);
      preBlastHeaderNode4.appendChild(preBlastHeaderText4);
      preBlastHeaderNode5.appendChild(preBlastHeaderText5);
      preBlastHeaderNode6.appendChild(preBlastHeaderText6);
      preBlastHeaderNode7.appendChild(preBlastHeaderText7);

      //assign data cells to Rows
      preBlastTableRowNode2.appendChild(preBlastData1);
      preBlastTableRowNode4.appendChild(preBlastData2);
      preBlastTableRowNode6.appendChild(preBlastData3);
      preBlastTableRowNode6.appendChild(preBlastData4);
      preBlastTableRowNode6.appendChild(preBlastData5);
      preBlastTableRowNode8.appendChild(preBlastData6);
      preBlastTableRowNode8.appendChild(preBlastData7);

      //add data text to data cells
      preBlastData1.appendChild(preBlastDataText1);
      preBlastData2.appendChild(preBlastDataText2);
      preBlastData3.appendChild(preBlastDataText3);
      preBlastData4.appendChild(preBlastDataText4);
      preBlastData5.appendChild(preBlastDataText5);
      preBlastData6.appendChild(preBlastDataText6);
      preBlastData7.appendChild(preBlastDataText7);

      //add table to div
      devider.appendChild(preBlastTableNode);
    });

    document.getElementById("pre-blastReportList").appendChild(devider);              //Table to dom

    setTimeout(function(){
      localHistory.forEach(function(item){
        document.getElementById(item['jobID']).addEventListener('click', function(){
          var index = localHistory.findIndex(x => x.jobID === item['jobID']);
          bt.preblastReport(index);
          bt.detonatorSeries(index);

          //Check to see if index is required
          if(bt.preBlastCount == 0){
            bt.detonatorTypeDropdown();
            bt.rockTypeDropdown();
            bt.explosiveTypeDropdown();
            bt.preBlastCount = 1;
          }
          // bt.activateCamera();
          bt.goTo('pre-blast-Report');
        });
      }, 100);
    });
  },
  preblastReport: function(jobCard){
    var localHistory = bt.getLocalStorage('jobHistory');
    localHistory[jobCard]['holes'].pop();
    var numberOfHolesCharged = bt.noOfHoles(localHistory[jobCard]['holes']);
    var totalMassPumped = bt.totalMass(localHistory[jobCard]['holes']);
    var avgOfSamples = bt.avgOfSamples(localHistory[jobCard]['samples']);
    document.getElementById("mine").innerHTML = localHistory[jobCard].mine;
    document.getElementById("location").innerHTML = localHistory[jobCard].location;
    document.getElementById("operator").innerHTML = localHistory[jobCard].userName;
    document.getElementById("jobSubLocation").innerHTML = localHistory[jobCard].subLocation;
    document.getElementById("jobHeight").innerHTML = localHistory[jobCard].jobHeight + "m";
    document.getElementById("jobWidth").innerHTML = localHistory[jobCard].jobWidth + "m";
    document.getElementById("jobProfile").innerHTML = localHistory[jobCard].profile;
    // document.getElementById("jobRock").innerHTML = localHistory[jobCard].rock;
    document.getElementById("jobRockDensityPlanned").innerHTML = localHistory[jobCard].rockDensityPlanned;
    document.getElementById("jobRockHardnessPlanned").innerHTML = localHistory[jobCard].rockHardnessPlanned;
    document.getElementById("jobHoleDiameter").innerHTML = localHistory[jobCard].holeDiameter + "mm";
    document.getElementById("jobHoleDepth").innerHTML = localHistory[jobCard].holeDepth + "m";
    document.getElementById("jobRows").innerHTML = localHistory[jobCard].rows;
    document.getElementById("jobColumns").innerHTML = localHistory[jobCard].columns;
    document.getElementById("jobV_Spacing").innerHTML = localHistory[jobCard]['blastPlan'].RowGridSpacing;
    document.getElementById("jobH_Burdens").innerHTML = localHistory[jobCard]["blastPlan"].ColumnGridSpacing;
    document.getElementById("jobPerimeterOffset").innerHTML = localHistory[jobCard].perimeterOffset + "cm";
    document.getElementById("jobHoleMassPlanned").innerHTML = localHistory[jobCard].holeMassPlanned;
    document.getElementById("jobHoleFillPercentage").innerHTML = localHistory[jobCard].holeFillPercentage;
    document.getElementById("explosiveManufacturer-Input").innerHTML = localHistory[jobCard].explosiveManufacturer;
    document.getElementById("explosiveType-Input").innerHTML = localHistory[jobCard].explosiveType;
    document.getElementById("jobCouplingRatio-Input").innerHTML = localHistory[jobCard].couplingRatio;
    document.getElementById("jobExplosiveDensity-Input").innerHTML = localHistory[jobCard].explosiveDensity;
    document.getElementById("jobExplosivePrice-Input").innerHTML = localHistory[jobCard].explosivePrice;
    document.getElementById("jobExplosiveStrength-Input").innerHTML = localHistory[jobCard].explosiveStrength;
    document.getElementById("noOfHolesCharged").innerHTML = numberOfHolesCharged;
    document.getElementById("totalMassPumped").innerHTML = totalMassPumped;
    document.getElementById("jobDate").innerHTML = localHistory[jobCard].date;
    document.getElementById("avgSampleDensity").innerHTML = avgOfSamples;
    // bt.blastMap();
    bt.holeDetailsDropdown(localHistory[jobCard]['holes']);
    bt.sampleDetailsDropdown(localHistory[jobCard]['samples']);

    // Clear last hole which is empty
    // var localHistory = jobCard.holes;
    // localHistory.pop();
  },
  rockTypeDropdown: function(){
    var rockTypeList = document.createElement('SELECT');
    rockTypeList.setAttribute('class', 'pre-blast_5');

    bt.RockTypesArr.forEach(function(element){
      var option = document.createElement('OPTION');
      var description = document.createTextNode(element['Name']);
      option.appendChild(description);
      option.setAttribute('id', element['Name']);
      rockTypeList.appendChild(option);
    });

    document.getElementById("rockMenu").appendChild(rockTypeList);

    setTimeout(function(){
      bt.RockTypesArr.forEach(function(item){
        document.getElementById(item['Name']).addEventListener('click', function(){
          bt.jobCard.rock = item['Name'];
          bt.jobCard.rockDensityPlanned = item['Density'];
          bt.jobCard.rockHardnessPlanned = item['Hardness'];
          document.getElementById('jobRockDensityPlanned').innerHTML = item['Density'];
          document.getElementById('jobRockHardnessPlanned').innerHTML = item['Hardness'];
        })
      })
    }, 1000);
  },
  explosiveTypeDropdown: function(){
    var explosiveTypeList = document.createElement('SELECT');
    explosiveTypeList.setAttribute('class', 'pre-blast_5');

    bt.ExplosiveTypesArr.forEach(function(element){
      var option = document.createElement('OPTION');
      var item = document.createTextNode(element['Name']);
      option.appendChild(item);
      explosiveTypeList.appendChild(option);
    });

    document.getElementById("jobExplosiveType").appendChild(explosiveTypeList);              //Table to dom

    // setTimeout(function(){
    //   bt.ExplosiveTypesArr.forEach(function(item){
    //     document.getElementById(item["Name"]).addEventListener('click', function(){
    //       bt.jobCard.explosiveType = item['Name'];
    //       bt.jobCard.explosiveManufacturer = item['Group'];
    //       bt.jobCard.couplingRatio = item["Coupling"];
    //       bt.jobCard.explosiveDensity = item["Density"];
    //       bt.jobCard.explosivePrice = item['Price'];
    //       document.getElementById('jobExplosiveType').innerHTML = item['Group'] + " " + item['Name'];
    //     })
    //   })
    // }, 1000);
  },
  detonatorTypeDropdown: function(){
    var table = document.createElement('TABLE');
    var row = document.createElement('tr');
    var nameHeader = document.createElement('th');
    nameHeader.setAttribute('class', 'detonatorTableSpace1');
    var delayHeader = document.createElement('th');
    delayHeader.setAttribute('class', 'detonatorTableSpace2');
    var qtyHeader = document.createElement('th');
    var nameHeaderText = document.createTextNode('Name');
    var delayHeaderText = document.createTextNode('Delay');
    var qtyHeaderText = document.createTextNode('QTY');

    nameHeader.appendChild(nameHeaderText);
    delayHeader.appendChild(delayHeaderText);
    qtyHeader.appendChild(qtyHeaderText);
    row.appendChild(nameHeader);
    row.appendChild(delayHeader);
    row.appendChild(qtyHeader);
    table.appendChild(row);

    for(var i = 0; i < bt.jobCard.detonatorSeries.length; i++){
      var dataRow = document.createElement('tr');
      var nameCell = document.createElement('td');
      var delayCell = document.createElement('td');
      var qtyCell = document.createElement('td');

      var nameData = document.createTextNode(bt.jobCard.detonatorSeries[i]['name']);
      var delayData = document.createTextNode(bt.jobCard.detonatorSeries[i]['delay']);
      var qtyData = document.createTextNode(bt.jobCard.detonatorSeries[i]['amount']);

      qtyCell.appendChild(qtyData);
      delayCell.appendChild(delayData);
      nameCell.appendChild(nameData);
      dataRow.appendChild(nameCell);
      dataRow.appendChild(delayCell);
      dataRow.appendChild(qtyCell);
      table.appendChild(dataRow);
    }
    document.getElementById('detonatorList').appendChild(table);
  },
  detonatorSeries: function(jobCard){
    var localHistory = bt.getLocalStorage('jobHistory');
    var index = localHistory[jobCard];
    for(var i = 0; i < index.holes.length; i++){
      bt.DetonatorTypeArr.push(index.holes[i]['detonator']);
    }
    bt.DetonatorTypeArr.pop();
    var count = 0;

    bt.DetonatorTypeArr.forEach(function(element){
      for(var j = 0; j < bt.DetonatorTypeArr.length - 1; j++){
        if(element == bt.DetonatorTypeArr[j]){
          var matched = element + " Matched with: " + bt.DetonatorTypeArr[j];
          count++;
          bt.DetonatorTypeArr.splice(j, 1);
        }
      }
      var detonator = {
        name: element,
        amount: count,
        delay: ""
      }
      bt.jobCard.detonatorSeries.push(detonator);
      count = 0;
    });

    bt.jobCard.detonatorSeries.forEach(function(item){
      for(var k = 0; k < bt.DetonatorArr.length; k++){
        if(item['name'] == bt.DetonatorArr[k]['Name']){
          item['delay'] = bt.DetonatorArr[k]['Delay'];
        }
      }
    })
  },
  holeDetailsDropdown: function(localHistory){
    var holeTableNode = document.createElement("TABLE");
    var holeRowNode1 = document.createElement("tr");
    var holeHeaderNode1 = document.createElement('th');
    holeHeaderNode1.setAttribute("class", "holeDetails");
    var holeHeaderText1 = document.createTextNode("Name");
    var holeHeaderNode2 = document.createElement('th');
    holeHeaderNode2.setAttribute("class", "holeDetails");
    var holeHeaderText2 = document.createTextNode("Mass");
    var holeHeaderNode3 = document.createElement('th');
    holeHeaderNode3.setAttribute("class", "holeDetails");
    var holeHeaderText3 = document.createTextNode("Start");
    var holeHeaderNode4 = document.createElement('th');
    holeHeaderNode4.setAttribute("class", "holeDetails");
    var holeHeaderText4 = document.createTextNode("End");


    holeHeaderNode1.appendChild(holeHeaderText1);                                //Header to cells
    holeHeaderNode2.appendChild(holeHeaderText2);
    holeHeaderNode3.appendChild(holeHeaderText3);
    holeHeaderNode4.appendChild(holeHeaderText4);
    holeRowNode1.appendChild(holeHeaderNode1);                                 //Header to rows
    holeRowNode1.appendChild(holeHeaderNode2);
    holeRowNode1.appendChild(holeHeaderNode3);
    holeRowNode1.appendChild(holeHeaderNode4);
    holeTableNode.appendChild(holeRowNode1);

    localHistory.forEach(function(element){
      var holeRowNode2 = document.createElement("tr");
      var holeDataNode1 = document.createElement('td');
      holeDataNode1.setAttribute("class", 'holeDetails');
      var holeTextNode1 = document.createTextNode(element.holeNumber);
      var holeDataNode2 = document.createElement("td");
      holeDataNode2.setAttribute("class", 'holeDetails');
      var holeTextNode2 = document.createTextNode(element.holeMass + "kg");
      var holeDataNode3 = document.createElement("td");
      holeDataNode3.setAttribute("class", 'holeDetails');
      var holeTextNode3 = document.createTextNode(element.startTime);
      var holeDataNode4 = document.createElement("td");
      holeDataNode4.setAttribute("class", 'holeDetails');
      var holeTextNode4 = document.createTextNode(element.endTime);

      holeDataNode1.appendChild(holeTextNode1);
      holeDataNode2.appendChild(holeTextNode2);
      holeDataNode3.appendChild(holeTextNode3);
      holeDataNode4.appendChild(holeTextNode4);
      holeRowNode2.appendChild(holeDataNode1);
      holeRowNode2.appendChild(holeDataNode2);
      holeRowNode2.appendChild(holeDataNode3);
      holeRowNode2.appendChild(holeDataNode4);
      holeTableNode.appendChild(holeRowNode2);
    });
    document.getElementById("holeDetails").appendChild(holeTableNode);              //Table to dom
  },
  sampleDetailsDropdown: function(localHistory){
    var sampleTableNode = document.createElement("TABLE");
    var sampleTableRowNode = document.createElement("tr");
    var sampleTableHeaderNode = document.createElement('th');
    sampleTableHeaderNode.setAttribute("class", "holeDetails");
    var sampleHeaderText = document.createTextNode("Density");
    var sampleTableHeaderNode2 = document.createElement('th');
    sampleTableHeaderNode2.setAttribute("class", "holeDetails");
    var sampleStartHeaderText = document.createTextNode("Sample Start");
    var sampleTableHeaderNode3 = document.createElement('th');
    sampleTableHeaderNode3.setAttribute("class", "holeDetails");
    var sampleEndHeaderText = document.createTextNode("Sample End");

    sampleTableHeaderNode.appendChild(sampleHeaderText);                                //Header to cells
    sampleTableHeaderNode2.appendChild(sampleStartHeaderText);
    sampleTableHeaderNode3.appendChild(sampleEndHeaderText);
    sampleTableRowNode.appendChild(sampleTableHeaderNode);                                 //Header to rows
    sampleTableRowNode.appendChild(sampleTableHeaderNode2);
    sampleTableRowNode.appendChild(sampleTableHeaderNode3);
    sampleTableNode.appendChild(sampleTableRowNode);

  localHistory.forEach(function(element){
      var sampleTableRowNode2 = document.createElement("tr");
      var sampleTableDataNode = document.createElement("td");
      sampleTableDataNode.setAttribute("class", 'sampleDetails td');
      var sampleTextNode = document.createTextNode(element.density);
      var sampleTableDataNode2 = document.createElement("td");
      sampleTableDataNode2.setAttribute("class", 'sampleDetails td');
      var sampleStartTextNode = document.createTextNode(element.startTime);
      var sampleTableDataNode3 = document.createElement("td");
      sampleTableDataNode3.setAttribute("class", 'sampleDetails td');
      var sampleEndTextNode = document.createTextNode(element.endTime);

      sampleTableDataNode.appendChild(sampleTextNode);
      sampleTableDataNode2.appendChild(sampleStartTextNode);
      sampleTableDataNode3.appendChild(sampleEndTextNode);
      sampleTableRowNode2.appendChild(sampleTableDataNode);
      sampleTableRowNode2.appendChild(sampleTableDataNode2);
      sampleTableRowNode2.appendChild(sampleTableDataNode3);
      sampleTableNode.appendChild(sampleTableRowNode2);
    });
    document.getElementById("sampleDetails").appendChild(sampleTableNode);              //Table to dom
  },
  menuUpdate: function() {
    var totalMass = bt.totalMass(bt.jobCard.holes);
    document.getElementById('totalHoleMass').innerHTML = totalMass;
    var noOfHoles = bt.noOfHoles(bt.jobCard.holes);
    document.getElementById('noOfHoles').innerHTML = noOfHoles;
    bt.showUnclosedJobs();
    bt.showUploadFiles();
  },
  addRockType: function(){
    var rockName = document.getElementById('addRockName-Input').value;
    var rockDensity = JSON.parse(document.getElementById('addRockDensity-Input').value);
    var rockHardness = document.getElementById('addRockHardness-Input').value;
    var rockObject = {
      "Name": rockName,
      "Density": rockDensity,
      "Hardness": rockHardness
    };
    bt.RockTypesArr.push(rockObject);
    bt.preblastReport();
  },
  addExplosiveType: function(){
    var explosiveName = document.getElementById('explosiveManufacturer-Input').value;
    var explosiveType = document.getElementById('explosiveType-Input').value;
    var couplingRatio = document.getElementById('jobCouplingRatio-Input').value;
    var explosiveDensity = JSON.parse(document.getElementById('jobExplosiveDensity-Input').value);
    var price = JSON.parse(document.getElementById('jobExplosivePrice-Input').value);
    // var strength = JSON.parse(document.getElementById('jobExplosiveStrength-Input').value);
    var explosiveObject = {
      "Name": explosiveType,
      "Group": explosiveName,
      "Price": price,
      "Coupling": couplingRatio,
      "Density": explosiveDensity,
      // "Strength": strength
    }
    bt.ExplosiveTypesArr.push(explosiveObject);
    bt.preblastReport();
  },
  addDetonatorType: function(){
    var detonatorName = document.getElementById('detonatorManufacturer-Input').value;
    var detonatorSeries = document.getElementById('detonatorSeries_2-Input').value;
    var detonatorDelayNo = document.getElementById('detonatorDelayNo-Input').value;
    var explosiveColor = document.getElementById('explosiveColor-Input').value;
    var detonatorPrice = document.getElementById('detonatorPrice-Input').value;
    var detonatorDelayTime = document.getElementById('detonatorDelayTime-Input').value;
    var detonatorObject = {
      "Name": detonatorName,
      "Group":detonatorSeries,
      "Coupling":1,
      "Density":1.15,
      "Colour": explosiveColor,
      "Price": detonatorPrice,
      "Strength":0.5,
      "Delay": detonatorDelayTime,
    };
    bt.DetonatorArr.push(detonatorObject);
    bt.preblastReport();
  },
  addAccessories: function(){
    var accessoryName = document.getElementById('accessoriesName-Input').value;
    var accessoryPrice = document.getElementById('accessoriesPrice-Input').value;
    var accessoryQuantity = document.getElementById('accessoriesQuantity-Input').value;
    var accessoryPer = document.getElementById('accessoriesPer-Input').value;

    var accessoryObject = {
      "Name": accessoryName,
      "Price": accessoryPrice,
      "Quantity": accessoryQuantity,
      "Per": accessoryPer
    };
    bt.AdditionalsArr.push(accessoryObject);
    bt.preblastReport();
  },
  blastMap: function(){
    var element = document.getElementById('blastMap');
    var width = element.width;
    var h_split = width / (bt.jobCard.rows - 1);
    var height = element.height;
    var v_split = height / (bt.jobCard.columns - 1);
    var currentVSplit = 0;
    var currentHSplit = 0;
    var hCoordinates = [];
    var vCoordinates = [];

    var ctx = element.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.lineWidth = 0.5;

    for(var i = 0; i <= width; i = i + h_split){
      ctx.setLineDash([5, 15]);
      ctx.moveTo(currentHSplit, 0);
      ctx.lineTo(currentHSplit, height);
      ctx.stroke();
      hCoordinates.push(currentHSplit);
      currentHSplit = currentHSplit + h_split
    };

    for(var j = 0; j <= height; j = j + v_split){
      ctx.setLineDash([5, 15]);
      ctx.moveTo(0, currentVSplit);
      ctx.lineTo(width, currentVSplit);
      ctx.stroke();
      vCoordinates.push(currentVSplit);
      currentVSplit = currentVSplit + v_split
    };

    hCoordinates.forEach(function(hDot){
      vCoordinates.forEach(function(vDot){
        ctx.fillStyle = "#002841";
        var grd = ctx.createRadialGradient(hDot, vDot , 0, hDot + bt.jobCard.holeDiameter, vDot + bt.jobCard.holeDiameter, bt.jobCard.holeDiameter);
        grd.addColorStop(0, "red");
        grd.addColorStop(1, "white");
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(hDot, vDot, bt.jobCard.holeDiameter, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = grd;
        ctx.fillRect(hDot, vDot, hDot + bt.jobCard.holeDiameter, vDot + bt.jobCard.holeDiameter);
      });
    });
  },
  editMine: function(name){
    bt.jobCard.mine = name;
    document.getElementById('mine').innerHTML = name;
  },
  editlocation: function(name){
    bt.jobCard.location = name;
    document.getElementById('location').innerHTML = name;
  },
  editOperator: function(name){
    bt.jobCard.userName.push(name);
    document.getElementById('operator').innerHTML = name;
  },
  editSubLocation: function(place){
    bt.jobCard.subLocation = place;
    document.getElementById('jobSubLocation').innerHTML = place;
  },
  editDate: function(date){
    bt.jobCard.date = date;
    document.getElementById('jobDate').innerHTML = date;
  },
  editHeight: function(height){
    bt.jobCard.jobHeight = height;
    document.getElementById('jobHeight').innerHTML = height;
  },
  editWidth: function(width){
    bt.jobCard.jobWidth = width;
    document.getElementById('jobWidth').innerHTML = width;
  },
  editProfile: function(profile){
    bt.jobCard.profile = profile;
    document.getElementById('jobProfile').innerHTML = profile;
  },
  editHoleDiameter: function(diameter){
    bt.jobCard.holeDiameter = diameter;
    document.getElementById('jobHoleDiameter').innerHTML = diameter;
  },
  editHoleDepth: function(depth){
    bt.jobCard.holeDepth = depth;
    document.getElementById('jobHoleDepth').innerHTML = depth;
  },
  editHoleRows: function(rows){
    bt.jobCard.rows = rows;
    document.getElementById('jobRows').innerHTML = rows;
    bt.blastMap();
  },
  editHoleColumns: function(columns){
    bt.jobCard.columns = columns;
    document.getElementById('jobColumns').innerHTML = columns;
    bt.blastMap();
  },
  editV_Spacing: function(v_Spacing){
    bt.jobCard.v_Spacing = v_Spacing;
    document.getElementById('jobV_Spacing').innerHTML = v_Spacing;
  },
  editH_Burdens: function(h_Burdens){
    bt.jobCard.h_Burdens = h_Burdens;
    document.getElementById('jobH_Burdens').innerHTML = h_Burdens;
  },
  editPerimeterOffset: function(perimeterOffset){
    bt.jobCard.perimeterOffset = perimeterOffset;
    document.getElementById('jobPerimeterOffset').innerHTML = perimeterOffset;
  },
  editHoleMassPlanned: function(holeMass){
    bt.jobCard.holeMassPlanned = holeMass;
    document.getElementById('jobHoleMassPlanned').innerHTML = holeMass;
  },
  editHoleFillPlanned: function(holeFill){
    bt.jobCard.holeFillPercentage = holeFill;
    document.getElementById('jobHoleFillPercentage').innerHTML = holeFill;
  },
  clockingCheck: function(data){
    var time = bt.setTime();
    bt.jobCard.checkIn[data.id] = time;

    var elementIDs = [
      securityEntrance,
      waitingPlaceIn,
      walkIn,
      arrive,
      startMarking,
      finishMarking,
      startDrilling,
      finishDrilling,
      startCharging,
      finishCharging,
      startConnecting,
      finishConnecting,
      minerConnecting,
      blasted,
      walkOut,
      waitingPlaceOut,
      securityExit
    ];
    // elementIDs[3].classList.toggle("color-green");
    for(var i = 0; i < elementIDs.length; i++){
      if(i + 1 == elementIDs.length){
        return
      } else if(data == elementIDs[i]){
        elementIDs[i].classList.toggle("color-orange");
        elementIDs[i].setAttribute("disabled", "");
        elementIDs[i + 1].classList.toggle("color-orange");
        elementIDs[i + 1].removeAttribute("disabled");
      }
    }
  },
  closeJob: function() {
    var localHistory = bt.getLocalStorage("jobHistory");
    if(bt.isEmpty(localHistory)){
      return;
    } else {
      for(var i = 0; i < localHistory.length; i++){
        if(localHistory[i]['jobStatus'] == "Active"){
          if(localHistory[i]['jobID'] == bt.jobCard['jobID']){
              bt.jobCard["jobStatus"] = "Inactive";
              bt.currentHole = 0;
              localHistory[i] = bt.jobCard;
              bt.setLocalStorage('jobHistory', localHistory);
              document.getElementById('securityEntrance').removeAttribute("disabled");
              document.getElementById('securityEntrance').classList.toggle("color-orange");
              document.getElementById('securityExit').setAttribute("disabled", "");
              document.getElementById('securityExit').classList.toggle("color-orange");
              // var newID = bt.GUID();
              // bt.jobCard.jobID = newID;
              bt.goTo('loginScreen');
          }
        }
      }
    }
  },
  incompleteJob: function(){
    var localHistory = bt.getLocalStorage('jobHistory');
    for(var i = 0; i < localHistory.length; i ++){
      if(localHistory[i].jobID == bt.jobCard.jobID){
        localHistory[i] = bt.jobCard;
      }
      bt.setLocalStorage('jobHistory', localHistory);
    }
  },
  listPairedDevices: function () {
      event.preventDefault();
      bluetoothSerial.list(function (devices) {
          var $list = $('#paired-devices .list ul');

          if (!devices.length) {
              $list.text('Not found');
              return;
          }

          $list.text('');
          // devices.forEach(function (device) {
              // $list.append('<li><label class="item-radio item-content"><input type="radio" name="device" value="' + device.address +
                  // '"/><i class="icon icon-radio"></i><div class="item-inner"><div class="item-title-row"><div class="item-title"><span class="name">' + device.name + '</span></div></div></label></li>');
          // });
          devices.forEach(function (device) {
              $list.append('<li><label class="item-radio item-content"><input type="radio" name="device" value="' + device.address +
                  '"/><i class="icon icon-radio"><span class="name" style="margin-left:25px !important; margin-top:-5px !important;">' + device.name + '</span></i></label></li>');
          });
      }, bt.showError);
  },
  selectDevice: function (event) {
      event.preventDefault();

      var $label = $('#paired-devices .list ul li label input[name=device]:checked').parent();
      var name = $label.find('.name').text();
      var address = $label.find('input').val();

      if (!address) {
          bt.showError('Select paired device to connect');
          return;
      }

      bt.goTo('auto_ManualToggleScreen');

      var $selectedDevice = $('#selected-device');
      $selectedDevice.find('.name').text(name);
      $selectedDevice.find('.address').text(address);

      bt.connect(address,name);
  },
  toggleConnection: function () {
      bluetoothSerial.isConnected(function () {                                 // Disconnect if connected
        bt.isConnected = false;
        bluetoothSerial.disconnect(bt.deviceDisconnected, bt.showError);
  			bt.goTo('paired-devices');
      },

      function () {                                                             // Reconnect to selected device if disconnected
        var address = $('#selected-device .address').text();
        if (!address) {
          bt.showError('Select paired device to connect');
          bt.goTo('paired-devices');
          return;
        }
        bt.connect(address);
      }
    );
  },
  connect: function (address, name) {
    $('#selected-device .status').text('Connecting...');
  	bt.deviceAddress = address;
  	bt.deviceName = name;
  	// Attempt to connect device with specified address, call bt.deviceConnected if success
    bluetoothSerial.connect(address, bt.deviceConnected, function (error) {
        $('#selected-device .status').text('Disconnected');
        bt.showError(error);
    });
  },
  deviceConnected: function () {
    // Subscribe to data receiving as soon as the delimiter is read
    // bluetoothSerial.subscribe('\n', bt.handleData, bt.showError);
  	// clearInterval(mySensors);
  	clearCorrectingInterval(mySensors);
  	self.pickerInline = app.picker.create({
		  containerEl: '#demo-picker-date-container',
		  inputEl: '#demo-picker-date',
		  toolbar: false,
		  rotateEffect: true,
		  value: [
  			today.getMonth(),
  			today.getDate(),
  			today.getFullYear(),
  			today.getHours(),
  			today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()
		  ],
		  formatValue: function (values, displayValues) {
			return displayValues[0] + ' ' + values[1] + ', ' + values[2] + ' ' + values[3] + ':' + values[4];
		  },
		  cols: [
				// Months
				{
				  values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
				  displayValues: ('Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec').split(' '),
				  textAlign: 'left'
				},
				// Days
				{
				  values: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
				},
				// Years
				{
				  values: (function () {
					var arr = [];
					for (var i = 1950; i <= 2030; i++) { arr.push(i); }
					  return arr;
				  })(),
				},
				// Space divider
				{
				  divider: true,
				  content: '&nbsp;&nbsp;'
				},
				// Hours
				{
				  values: (function () {
					var arr = [];
					for (var i = 0; i <= 23; i++) { arr.push(i); }
					  return arr;
				  })(),
				},
				// Divider
				{
				  divider: true,
				  content: ':'
				},
				// Minutes
				{
				  values: (function () {
					var arr = [];
					for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
					  return arr;
				  })(),
				}
		  ],
		  on: {
				change: function (picker, values, displayValues) {
				  var daysInMonth = new Date(picker.value[2], picker.value[0]*1 + 1, 0).getDate();
				  if (values[1] > daysInMonth) {
					picker.cols[1].setValue(daysInMonth);
				  }
				},
		  }
		});
    bluetoothSerial.subscribeRawData(bt.handleData, bt.showError);

  	mySensors = setCorrectingInterval(function(){
  		bluetoothSerial.write(bt.OnConvertToHex(bt.requests.get_Sensors_All.toString().replace(/,/g , "")), null, bt.showError);
  	}, 1250);
    bt.isConnected = true;
    // setTimeout(bt.passiveFrameSend(), 2000);
    $('#selected-device .status').text('Connected');
    $('#toggle-connection').text('Disconnect');
  },
  // passiveFrameSend: function() {
  //   if(bt.isConnected){
  //     mySensors = bluetoothSerial.write(bt.OnConvertToHex(bt.requests.get_Sensors_All.toString().replace(/,/g , "")), null, bt.showError);
  //     setTimeout(bt.passiveFrameSend(), 500);
  //   } else {
  //     return;
  //   }
  // },
  deviceDisconnected: function () {
    // Unsubscribe from data receiving
    // bluetoothSerial.unsubscribe(bt.handleData, bt.showError);
  	// clearInterval(mySensors);
  	clearCorrectingInterval(mySensors);

    self.pickerInline.destroy();
  	document.getElementById("demo-picker-date-container").innerHTML = '';
    bt.isConnected = false;

    bluetoothSerial.unsubscribeRawData(bt.handleData, bt.showError);
    $('#selected-device .status').text('Disconnected');
    $('#toggle-connection').text('Connect');
  },
  handleData: function (data) {
  	var bytes = new Uint8Array(data);
  	bt.response.resArray = Array.from(bytes);
  	var verify = bt.processResponse(bt.response.resArray);
    if (bt.logging == true){
  		var loggingData = bt.getLocalStorage('loggingData');
  		var capturedDate = new Date();
  		if(bt.isEmpty(data)){
  			loggingData = {}
  		}
  		loggingData[capturedDate] = {
  			rawdata:data,
  			arrData:bt.response.succArray //resArray?
  		};
  		bt.setLocalStorage('loggingData',loggingData);
  	}
    if(verify){
    	if(bt.response.succArray.length > 0){
    		if(bt.response.succArray.length == 2){ // When Requesting the Passive frame return is normally 2 arrays (accept and passive frame)
    			if(bt.response.succArray[1][2] == 26){
    				bt.prepareTransaction(bt.response.succArray[1]);
    			}
    			if(bt.response.succArray[1][2] == 23){
    				app.methods.passiveFrame(bt.response.succArray[1]);
    				bt.previousPassiveResponse = bt.response.succArray[1];
    			}
      	}
      } else {
        return;
      }
    }
  },
  logSendData: function (data, ActionPosition = 2, SanityPosition = 3) {
    //Create action Log
    if(bt.isEmpty(bt.dataSendLog[data[ActionPosition]])){
      bt.dataSendLog[data[ActionPosition]]={};
    }
	  bt.dataSendLog[data[ActionPosition]][data[SanityPosition]]=data;
  },
	incrementSanity: function(data,SanityPosition = 3){
		var newSanityNumber = parseInt(bt.convertHextoDec(data[SanityPosition]))+1;
		data[SanityPosition] = bt.convertDecToHex(newSanityNumber);
	},
  checkSend: function(data){
    var DataValid = false;
    for(var ell in data){
      if(!bt.isEmpty(ell)){
        DataValid = true;
        return DataValid;
      }
    }
    return DataValid;
  },
	processResponse: function(data, serialIndex = "85,"){
		var dataStr = data.join(',').replace(/\s/g,'');
    var arr = [];
    var mainArr = [];
		while(dataStr.length > 0 && dataStr.indexOf(serialIndex) >= 0){
			var s_idx = dataStr.indexOf(serialIndex);
			dataStr = dataStr.substring(s_idx, dataStr.length);
			var s_idx = dataStr.indexOf(serialIndex);
			var n_dataStr = dataStr.substring(s_idx + 3, dataStr.length);
			var e_idx = n_dataStr.indexOf(',');
			var noOfElements = parseInt(n_dataStr.substring(0 ,e_idx));
			var dataArray = dataStr.split(",");
			arr = []
			for(var i = 0; i < noOfElements; i++){
				arr.push(dataArray[i]);
				var s = String(dataArray[i]);
				dataStr = dataStr.substring(s.length+1, dataStr.length);
			}
			mainArr.push(arr);
    }
		bt.response.resArray = mainArr;
		return bt.veryifyResponse(bt.response.resArray);
	},
	veryifyResponse: function(data, validIndex = 2, actionIndex = 3, sanityIndex = 4, validHex = "0xAA"){    //Confirm validHEX
    bt.response.succArray = [];
	  bt.response.unsuccArray = [];
    var verify = true;

    if(bt.isEmpty(data)){
      verify = false;
      bt.response.unsuccArray.push(data[i]);
      return verify;
    }

    for(var i = 0; i < data.length; i++){
      for(var j = 0; j < data[i].length; j++){
        if(bt.isEmpty(data[i][j])){
          verify = false;
          bt.response.unsuccArray.push(data[i]);
          return verify;
        }
      }

      if(data[i].length != data[i][1]){
        verify = false;
        bt.response.unsuccArray.push(data[i]);
        return verify;
      }

      if(bt.isEmpty(data[i][actionIndex])){
        verify = false;
        bt.response.unsuccArray.push(data[i]);
        return verify;
      }

      if(bt.isEmpty(data[i][sanityIndex])){
        verify = false;
        bt.response.unsuccArray.push(data[i]);
        return verify;
      }

      var validCheck = bt.convertDecToHex(data[0][validIndex]);
      if(validHex != validCheck){
        verify = false;
        bt.response.unsuccArray.push(data[i]);
        return verify;
      }
      if(verify){
        bt.response.succArray.push(data[i]);
        bt.dataSendLog[actionIndex] = {};
      } else {
        bt.response.unsuccArray.push(data[i]);
      }
    }

    return verify;
	},
	convertDecToHex: function(dec){
		try {
			var x = new BigNumber(dec, 10);
		}
		catch(err) {
			// alert(err);
			return "0x00";
		}
		var hexNumber = x.toString(16).toUpperCase();
		return "0x"+ bt.pad(hexNumber,2);
	},
	OnConvertToHex: function(str){
		var hex = str;
		hex = hex.match(/[0-9A-Fa-f]{2}/g);
		if( bt.isEmpty(hex) ) return ' ';
		var len = hex.length;
		if( len==0 ) return ' ';
		var txt='';
		for(var i=0; i<len; i++)
		{
			var h = hex[i];
			var code = parseInt(h,16);
			var t = String.fromCharCode(code);
			txt += t;
		}
		return txt;
	},
  convertHextoDec: function(hex) {
  	hex = hex.replace("0x","");
  	hex = hex.replace("0X","");
  	try {
  		var x = new BigNumber(hex, 16);
  	}
  	catch(err) {
  		return;
  	}
  	var xx=x.toString(10);
  	return xx;
  },
	OnConvertToASCII: function (str){
		var hex = str;
		hex = hex.match(/[0-9A-Fa-f]{2}/g);
		if( bt.isEmpty(hex) ) return ' ';
		var len = hex.length;
		if( len==0 ) return ' ';
		var txt='';
		for(var i=0; i<len; i++)
		{
			var h = hex[i];
			var code = parseInt(h,16);
			var t = String.fromCharCode(code);
			txt += t;
		}
		return txt;
	},
  onObjectSize: function(Myobj) {
    var osize = 0, key;
    for (key in Myobj) {
      if (Myobj.hasOwnProperty(key)) osize++;
    }
    return osize;
  },
  sendData: function (event) {
      event.preventDefault();

      var $input = $('#terminal form input[name=data]');
      var data = $input.val();
      var originalData = data;
      $input.val('');
  		data = bt.OnConvertToHex(data);
      // data += '\n';

      bt.displayInTerminal(originalData, false);

      bluetoothSerial.write(data, null, bt.showError);
  },
  displayInTerminal: function (data, isIncoming) {
      var $dataContainer = $('#data');

      if (isIncoming) {
          data = '<span class="in">' + data + '</span>';
      }
      else {
          data = '<span class="out">' + data + '</span>';
      }

      $dataContainer.append(data);

      if ($('#terminal input[name=autoscroll]').is(':checked')) {
          $dataContainer.scrollTop($dataContainer[0].scrollHeight - $dataContainer.height());
      }
  },
  clearData: function () {
      $('#data').text('');
  },
	sendTransaction: function(){
		var  data = bt.getLocalStorage('TransactionData');
		for(var obj in data){
			if(bt.isEmpty(data[obj]['DataSentToDB']) || data[obj]['DataSentToDB'] == false ){
				data[obj].transactionFriendlyData["GUID"] = obj;
				var dateNow = new Date();
				// var published_at = dateNow.getTime();
        var published_at = dateNow.getFullYear() + '-' + dateNow.getMonth() + '-' + dateNow.getDay() + "T" + dateNow.getHours() + ':' + dateNow.getMinutes() + ":" + dateNow.getSeconds() + '.' + dateNow.getMilliseconds() + "Z";
				data[obj].transactionFriendlyData["published_at"] = published_at;
				var transferData = data[obj].transactionFriendlyData;
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						var  data = bt.getLocalStorage('TransactionData');
						data[this.responseText]['DataSentToDB'] = true;
						bt.setLocalStorage('TransactionData',data);
					}
				};
				xhttp.onerror = function(err) {
          return;
				};
				xhttp.open("POST", bt.dbPOST_URL, true);
				xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				var SendString = 'dbURL=https://oufp5fu809.execute-api.us-east-2.amazonaws.com/Prod/SasolReport&dbAPIKEY=WmRQo2afV39NrzKd9MAZOafct8uhtomr2cko53yg&transferData=' + JSON.stringify(transferData);
				xhttp.send(SendString);
				//bt.setLocalStorage('TransactionData',data);
			}
		}
	},
	prepareTransaction: function(dataFrame){
		var capturedDate = new Date();
		var controller = {
				  deviceAddress: bt.deviceAddress,
				  deviceName: bt.deviceName
			   };
		var device = window.top.navigator.userAgent;
		var GUID = bt.jobCard.jobID;
		var data = bt.getLocalStorage('TransactionData');
		if(bt.isEmpty(data)){
			data = {};
		}
		var arrDataFrame = dataFrame.toString().split(bt.transactionDelimitor);
		for(var arr in arrDataFrame){
			var prepData = [];
			prepData = arrDataFrame[arr].replace(/^,/,'').replace(/,$/,'').split(",");
			for(var pArray in prepData){
				prepData[pArray] = prepData[pArray];
			}
			arrDataFrame[arr] = prepData;
		}
    arrDataFrame.splice(0,1);
		var transactionFriendlyData = {};

		for(var i in bt.transactionFriendlyNames){
			var transactionFriendlyValue = "";
			// if(i == 0){
			// 	arrDataFrame[i].splice(0, 5);
			// }
			for(var j in arrDataFrame[i]){
				transactionFriendlyValue +=  bt.OnConvertToASCII(bt.convertDecToHex(arrDataFrame[i][j]));
			}
      if(bt.transactionFriendlyNames[i] == "Lon"){
        transactionFriendlyData[bt.transactionFriendlyNames[i]] = null;
      } else if (bt.transactionFriendlyNames[i] == "Lat") {
        transactionFriendlyData[bt.transactionFriendlyNames[i]] = null;
      } else {
  			transactionFriendlyData[bt.transactionFriendlyNames[i]] = transactionFriendlyValue;
      }
		}

		data[GUID] = {
			capturedDate: capturedDate,
			controllerInformation: controller,
			deviceInformation: device,
			transactionRawData: dataFrame,
			transactionFriendlyData: transactionFriendlyData,
			transactionFriendlyNames: bt.transactionFriendlyNames,
			DataSentToDB: false,
      userName: bt.jobCard['userName'],
      subLocation: bt.jobCard['subLocation'],
      jobID: bt.jobCard['jobID'],
      jobStatus: bt.jobCard['jobStatus'],
      noOfHoles: bt.noOfHoles(bt.jobCard.holes),
      totalMass: bt.totalMass(bt.jobCard.holes)
		}

		bt.setLocalStorage('TransactionData',data);
	},
  goTo: function (state) {
		if (bt.terminal == false){
			bt.terminal = true;
		}
		else{
			bt.terminal = false;
		}

    $('.bt-state').hide();
    $('#' + state + '.bt-state').show();
  },
  showError: function (error) {
    alert(error);
  }
};

bt.initialize();

app.navbar.hide('.navbar');
bt.goTo('loginScreen');
