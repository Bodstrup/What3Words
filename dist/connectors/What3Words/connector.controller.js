"use strict";
/*!
 * Copyright 2021- IBM Inc. All rights reserved
 * SPDX-License-Identifier: MIT
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.What3Words = void 0;
/* Geo Connector */
const i2connect_1 = require("@i2analyze/i2connect");
const config = require("./connector.conf.json");
const geoschema_1 = require("./geoschema");
const axios = require('axios').default;
//const axiosConfig = { headers: {"content-type": "application/json"} };
const axiosConfig = { headers: {} };
const { Location } = geoschema_1.geoschema.entityTypes;
function forceArray(value) {
    if (Array.isArray(value)) {
        // it's already an array
        return value;
    }
    const result = [];
    if (value) {
        // it's just an object so adding to array
        result.push(value);
    }
    return result;
}
// ************************************************************************************
// ** Create Location Entity from lat/long
// ************************************************************************************
class locationClassLatLong {
    constructor(inputData, inputSeed, inputResult) {
        this.resultData = inputData;
        this.outputResult = inputResult;
        this.locationEntity = this.outputResult.addEntityFromSeed(inputSeed);
        this.locationEntity.setProperty('What3Words', inputData.words.toUpperCase());
        this.locationEntity.setProperty('Latitude', inputData.coordinates.lat);
        this.locationEntity.setProperty('Longitude', inputData.coordinates.lng);
        this.locationEntity.setProperty('Description', inputData.nearestPlace);
        this.locationEntity.setProperty('MGRS', MGRSString(inputData.coordinates.lat.replace(".", ","), inputData.coordinates.lng.replace(".", ",")));
        console.log("Nearest Place: ", inputData.nearestPlace);
        console.log("MGRS:", MGRSString(12.5, 55.5));
    }
    getResult() {
        return this.outputResult;
    }
    getLatitude() {
        return this.locationEntity.Latitude;
    }
    getLongitude() {
        return this.locationEntity.Longitude;
    }
    getLocationEntity() {
        return this.locationEntity;
    }
} // End LocationClassLatLong
// ************************************************************************************
// ** Create Location Entity from words
// ************************************************************************************
class locationClassWords {
    constructor(inputData, inputResult) {
        this.outputResult = inputResult;
        console.log("Input: ", inputData);
        this.locationEntity = this.outputResult.addEntity(Location, inputData.words.toUpperCase());
        this.locationEntity.setProperty('What3Words', inputData.words.toUpperCase());
        this.locationEntity.setProperty('Latitude', inputData.coordinates.lat.toString().replace(".", ","));
        this.locationEntity.setProperty('Longitude', inputData.coordinates.lng.toString().replace(".", ","));
        this.locationEntity.setProperty('MGRS', MGRSString(inputData.coordinates.lat, inputData.coordinates.lng));
        this.locationEntity.setProperty('Description', inputData.nearestPlace);
        console.log("Latitude: ", inputData.coordinates.lat.toString());
    }
    getResult() {
        return this.outputResult;
    }
    getLocationEntity() {
        return this.locationEntity;
    }
} // End Company Class
// ***********************************************************************************
// ** Convert Lat/Long to MGRS
// ************************************************************************************
function MGRSString(Lat, Long) {
    if (Lat < -80)
        return 'Too far South';
    if (Lat > 84)
        return 'Too far North';
    var c = 1 + Math.floor((Long + 180) / 6);
    var e = c * 6 - 183;
    var k = Lat * Math.PI / 180;
    var l = Long * Math.PI / 180;
    var m = e * Math.PI / 180;
    var n = Math.cos(k);
    var o = 0.006739496819936062 * Math.pow(n, 2);
    var p = 40680631590769 / (6356752.314 * Math.sqrt(1 + o));
    var q = Math.tan(k);
    var r = q * q;
    var s = (r * r * r) - Math.pow(q, 6);
    var t = l - m;
    var u = 1.0 - r + o;
    var v = 5.0 - r + 9 * o + 4.0 * (o * o);
    var w = 5.0 - 18.0 * r + (r * r) + 14.0 * o - 58.0 * r * o;
    var x = 61.0 - 58.0 * r + (r * r) + 270.0 * o - 330.0 * r * o;
    var y = 61.0 - 479.0 * r + 179.0 * (r * r) - (r * r * r);
    var z = 1385.0 - 3111.0 * r + 543.0 * (r * r) - (r * r * r);
    var aa = p * n * t + (p / 6.0 * Math.pow(n, 3) * u * Math.pow(t, 3)) + (p / 120.0 * Math.pow(n, 5) * w * Math.pow(t, 5)) + (p / 5040.0 * Math.pow(n, 7) * y * Math.pow(t, 7));
    var ab = 6367449.14570093 * (k - (0.00251882794504 * Math.sin(2 * k)) + (0.00000264354112 * Math.sin(4 * k)) - (0.00000000345262 * Math.sin(6 * k)) + (0.000000000004892 * Math.sin(8 * k))) + (q / 2.0 * p * Math.pow(n, 2) * Math.pow(t, 2)) + (q / 24.0 * p * Math.pow(n, 4) * v * Math.pow(t, 4)) + (q / 720.0 * p * Math.pow(n, 6) * x * Math.pow(t, 6)) + (q / 40320.0 * p * Math.pow(n, 8) * z * Math.pow(t, 8));
    aa = aa * 0.9996 + 500000.0;
    ab = ab * 0.9996;
    if (ab < 0.0)
        ab += 10000000.0;
    var ad = 'CDEFGHJKLMNPQRSTUVWXX'.charAt(Math.floor(Lat / 8 + 10));
    var ae = Math.floor(aa / 100000);
    var af = ['ABCDEFGH', 'JKLMNPQR', 'STUVWXYZ'][(c - 1) % 3].charAt(ae - 1);
    var ag = Math.floor(ab / 100000) % 20;
    var ah = ['ABCDEFGHJKLMNPQRSTUV', 'FGHJKLMNPQRSTUVABCDE'][(c - 1) % 2].charAt(ag);
    function pad(val) { if (val < 10) {
        val = '0000' + val;
    }
    else if (val < 100) {
        val = '000' + val;
    }
    else if (val < 1000) {
        val = '00' + val;
    }
    else if (val < 10000) {
        val = '0' + val;
    } ; return val; }
    ;
    aa = Math.floor(aa % 100000);
    aa = pad(aa);
    ab = Math.floor(ab % 100000);
    ab = pad(ab);
    return c + ad + ' ' + af + ah + ' ' + aa + ' ' + ab;
}
;
// ***********************************************************************************
// ** Convert Lat/Long to MGRS
// ************************************************************************************
function LatLongFromMGRSstring(a) {
    var b = a.trim();
    if (b.match(/\S+/g) != null) {
        b = b.match(/\S+/g);
    }
    if (b == null || b.length != 4)
        return [false, null, null];
    var c = parseFloat(((b[0].length < 3) ? b[0][0] : b[0].slice(0, 2)));
    var d = (b[0].length < 3) ? b[0][1] : b[0][2];
    var e = (c * 6 - 183) * Math.PI / 180;
    var f = ["ABCDEFGH", "JKLMNPQR", "STUVWXYZ"][(c - 1) % 3].indexOf(b[1][0]) + 1;
    var g = "CDEFGHJKLMNPQRSTUVWXX".indexOf(d);
    var h = ["ABCDEFGHJKLMNPQRSTUV", "FGHJKLMNPQRSTUVABCDE"][(c - 1) % 2].indexOf(b[1][1]);
    var i = [1.1, 2.0, 2.8, 3.7, 4.6, 5.5, 6.4, 7.3, 8.2, 9.1, 0, 0.8, 1.7, 2.6, 3.5, 4.4, 5.3, 6.2, 7.0, 7.9];
    var j = [0, 2, 2, 2, 4, 4, 6, 6, 8, 8, 0, 0, 0, 2, 2, 4, 4, 6, 6, 6];
    var k = i[g];
    var l = Number(j[g]) + h / 10;
    if (l < k)
        l += 2;
    var m = f * 100000.0 + Number(b[2]);
    var n = l * 1000000 + Number(b[3]);
    m -= 500000.0;
    if (d < 'N')
        n -= 10000000.0;
    m /= 0.9996;
    n /= 0.9996;
    var o = n / 6367449.14570093;
    var p = o + (0.0025188266133249035 * Math.sin(2.0 * o)) + (0.0000037009491206268 * Math.sin(4.0 * o)) + (0.0000000074477705265 * Math.sin(6.0 * o)) + (0.0000000000170359940 * Math.sin(8.0 * o));
    var q = Math.tan(p);
    var r = q * q;
    var s = r * r;
    var t = Math.cos(p);
    var u = 0.006739496819936062 * Math.pow(t, 2);
    var v = 40680631590769 / (6356752.314 * Math.sqrt(1 + u));
    var w = v;
    var x = 1.0 / (w * t);
    w *= v;
    var y = q / (2.0 * w);
    w *= v;
    var z = 1.0 / (6.0 * w * t);
    w *= v;
    var aa = q / (24.0 * w);
    w *= v;
    var ab = 1.0 / (120.0 * w * t);
    w *= v;
    var ac = q / (720.0 * w);
    w *= v;
    var ad = 1.0 / (5040.0 * w * t);
    w *= v;
    var ae = q / (40320.0 * w);
    var af = -1.0 - u;
    var ag = -1.0 - 2 * r - u;
    var ah = 5.0 + 3.0 * r + 6.0 * u - 6.0 * r * u - 3.0 * (u * u) - 9.0 * r * (u * u);
    var ai = 5.0 + 28.0 * r + 24.0 * s + 6.0 * u + 8.0 * r * u;
    var aj = -61.0 - 90.0 * r - 45.0 * s - 107.0 * u + 162.0 * r * u;
    var ak = -61.0 - 662.0 * r - 1320.0 * s - 720.0 * (s * r);
    var al = 1385.0 + 3633.0 * r + 4095.0 * s + 1575 * (s * r);
    var lat = p + y * af * (m * m) + aa * ah * Math.pow(m, 4) + ac * aj * Math.pow(m, 6) + ae * al * Math.pow(m, 8);
    var lng = e + x * m + z * ag * Math.pow(m, 3) + ab * ai * Math.pow(m, 5) + ad * ak * Math.pow(m, 7);
    lat = lat * 180 / Math.PI;
    lng = lng * 180 / Math.PI;
    return [true, lat, lng];
}
let What3Words = class What3Words {
    async authConfig(authToken) {
        return authToken;
    }
    // ***********************************************************************************
    // * Translate lat/long to words & MGRS using seeded entities
    // ***********************************************************************************
    async searchWords(seeds, authToken) {
        let result = new i2connect_1.Result();
        for (let i = 0; i < seeds.entities.length; i++) {
            let seed = seeds.entities[i];
            if (seed.isType(Location) && ((seed.hasProperty('Latitude') && seed.hasProperty('Longitude')))) {
                let latitude = 0;
                let longitude = 0;
                if (seed.hasProperty('Latitude') && seed.hasProperty('Longitude')) {
                    latitude = seed.getProperty('Latitude');
                    longitude = seed.getProperty('Longitude');
                    console.log("lat/long", latitude, longitude);
                }
                const url = `${config.queryUrlRoot1}` + authToken + "&coordinates=" + latitude.toString() + "," + longitude.toString();
                const response = await axios.get(url, axiosConfig);
                const data = response.data;
                const returnedLocation = new locationClassLatLong(data, seed, result);
                const locationEntity = returnedLocation.getLocationEntity();
                result = returnedLocation.getResult();
            }
            else if (seed.isType(Location) && seed.hasProperty('What3Words')) {
                let what3Word = seed.getProperty('What3Words');
                const url = `${config.queryUrlRoot2}` + what3Word;
                const response = await axios.get(url, axiosConfig);
                const data = response.data;
                const returnedLocation = new locationClassLatLong(data, seed, result);
                const locationEntity = returnedLocation.getLocationEntity();
                result = returnedLocation.getResult();
            }
            else if (seed.isType(Location) && seed.hasProperty('MGRS')) {
                let mgrs = seed.getProperty('MGRS');
                console.log("MGRS: ", mgrs);
                let latLongArray = LatLongFromMGRSstring("33U UB 35745 67225");
                console.log("Latitude: ", latLongArray[2], " Longitude: ", latLongArray[1]);
                if (latLongArray[2] && latLongArray[1]) {
                    const url = `${config.queryUrlRoot1}` + latLongArray[1].toString() + "," + latLongArray[2].toString();
                    const response = await axios.get(url, axiosConfig);
                    const data = response.data;
                    const returnedLocation = new locationClassLatLong(data, seed, result);
                    const locationEntity = returnedLocation.getLocationEntity();
                    result = returnedLocation.getResult();
                }
            }
            else {
                {
                    throw new i2connect_1.DetailedError({
                        title: 'No suitable location data found',
                        detail: 'Seed must have one or more of: (lat,long), Coordinates, What3Words'
                    });
                }
            }
        }
        return result;
    }
    // ***********************************************************************************
    // * Translate words to lat/long
    // ***********************************************************************************
    async searchLatLong(seeds, what3Word, authToken) {
        /* if (!what3Word ||  )
         {
           throw new DetailedError({
             title: 'Highly Illegal Conditions',
             detail: 'Enter 3 words separated by a dot (banana.sunscreen.apple'
           });
         }
         */
        let result = new i2connect_1.Result();
        if (what3Word) // Found a word condition (parameter typed)
         {
            const url = `${config.queryUrlRoot2}` + authToken + "&words=" + what3Word;
            const response = await axios.get(url, axiosConfig);
            const data = response.data;
            //console.log("Data: ", data);
            const returnedLocation = new locationClassWords(data, result);
            const locationEntity = returnedLocation.getLocationEntity();
            result = returnedLocation.getResult();
        }
        for (let i = 0; i < seeds.entities.length; i++) {
            let seed = seeds.entities[i];
            if (seed.isType(Location) && seed.hasProperty('What3Words')) {
                let what3Word = seed.getProperty('What3Words');
                const url = `${config.queryUrlRoot2}` + what3Word;
                const response = await axios.get(url, axiosConfig);
                const data = response.data;
                const returnedLocation = new locationClassWords(data, result);
                const locationEntity = returnedLocation.getLocationEntity();
                result = returnedLocation.getResult();
            }
        }
        return result;
    }
};
__decorate([
    (0, i2connect_1.authenticator)({
        description: "Enter API key for What3Words."
    }),
    __param(0, (0, i2connect_1.authenticationField)({ label: "API Key", type: 'password' }))
], What3Words.prototype, "authConfig", null);
__decorate([
    (0, i2connect_1.service)({
        name: 'Enrich Location Entity',
    }),
    __param(0, (0, i2connect_1.seeds)({
        typeConstraints: [Location],
        min: 1,
        max: 32,
    })),
    __param(1, (0, i2connect_1.authenticationToken)())
], What3Words.prototype, "searchWords", null);
__decorate([
    (0, i2connect_1.service)({
        name: 'Lat/Long from What3Words',
    }),
    __param(0, (0, i2connect_1.seeds)({
        typeConstraints: [Location],
        min: 0,
        max: 32,
    })),
    __param(1, (0, i2connect_1.condition)({
        label: 'Words',
        logicalType: 'singleLineString'
    })),
    __param(2, (0, i2connect_1.authenticationToken)())
], What3Words.prototype, "searchLatLong", null);
What3Words = __decorate([
    (0, i2connect_1.connector)({
        schemas: { connector: geoschema_1.geoschema },
    })
], What3Words);
exports.What3Words = What3Words;
//# sourceMappingURL=connector.controller.js.map