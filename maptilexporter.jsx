﻿var doc,    parentArtboard,    width,    height,    zoomLevels = 0,    destFolder,    tileSize = 256,    options = new ExportOptionsPNG24();options.antiAliasing = false;options.transparency = false;options.artBoardClipping = true;options.horizontalScale = options.verticalScale = 100;function getRect(x, y, width, height) {    var rect = [];    rect[0] = x;    rect[1] = -y;    rect[2] = width + x;    rect[3] = -(height - rect[1]);    return rect;}function newArtboard(rect, name) {    var newArtBoard = doc.artboards.add(rect);    newArtBoard.name = name;}function exportZoomLevel(scale) {    var numberOfTiles = Math.pow(2, scale) * Math.pow(2, scale);    options.horizontalScale = options.verticalScale = Math.pow(2, scale) * (tileSize / (width / 100));    var cols = Math.sqrt(numberOfTiles);    var size = width / cols;    var x = parentArtboard.artboardRect[0];    var y = parentArtboard.artboardRect[0];    for (var i = 0; i < numberOfTiles; i++) {        if (i > 0) {            x += size;            if (i % cols === 0) {                x = parentArtboard.artboardRect[0]                y += size;            }        }        var name = scale + '-' + ((x + parentArtboard.artboardRect[1]) / size) + '-' + ((y + parentArtboard.artboardRect[1]) / size);        newArtboard(getRect(x, y, size, size), name);        doc.artboards.setActiveArtboardIndex(1);        var newFileName = destFolder + '/' + name + '.png';        var newFile = new File(newFileName);        doc.exportFile(newFile, ExportType.PNG24, options);        doc.artboards.remove(1);    }}function beginExport() {    for (var i = 0; i <= zoomLevels; i++) {        exportZoomLevel(i);    }}function showZoomOptions() {    var zoom = new Window('dialog', "Options");    zoom.add('statictext', undefined, "Enter number of zoom levels");    var zoomInput = zoom.add('edittext', undefined, "2");    zoom.add('statictext', undefined, "(higher than 5 will be likely to crash your computer)");    zoom.confirmBtn = zoom.add('button', undefined, "Generate", {        name: 'confirm'    }).onClick = function() {        zoomLevels = Math.ceil(parseInt(zoomInput.text, 10)) || 2;        zoom.close();        destFolder = Folder.selectDialog('Select the folder to save the output');        if (destFolder) beginExport();    }    zoom.add('button', undefined, "Cancel", {        name: 'cancel'    }).onClick = function() {        zoom.close();    }    zoom.show()}function go() {    parentArtboard = doc.artboards[0];    width = parentArtboard.artboardRect[1] - parentArtboard.artboardRect[0];    height = parentArtboard.artboardRect[2] - parentArtboard.artboardRect[1];    showZoomOptions();}if (app.documents.length > 0) {    doc = app.activeDocument;    if (!doc.saved) {        Window.alert("You should probably save your work first ;)");    } else {        go();    }} else {    Window.alert("You must open at least one document. Doh");}