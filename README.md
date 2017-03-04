#SA - Board


##What is it? 0_o

SA - Board  it is the module for you site which allows you to draw on the interactive board together.


##How it`s work? 

Everything just..

[TogetherJS](https://togetherjs.com/ "TogetherJS")
>TogetherJS is a free, open source JavaScript library by Mozilla that adds collaboration features and tools to your website.
>By adding TogetherJS to your site, your users can help each other out on a website in real time! 

[Fabric.js](http://fabricjs.com/ "Fabric.js")
>Fabric provides interactive object model on top of canvas element
>Fabric also has SVG-to-canvas (and canvas-to-SVG) parser.

##Features

###Instruments:

* Zoom In `onZoomIn()`;
* Zoom Out `onZoomOut()`;
* Free drawing `startDrawingMode()`;
* Drawing of simple graphical elements (line, rectangle, circle):
	* Line: `startLineDrawing()`;
	* Circle `startCircleDrawing()`;
    * Rectangle `startRectDrawing()`;
	* Filled rectangle `startFillRectDrawing()`;
* Text `startTextDrawing()`;
* Marker `startMarkerDrawing()`;
* Bring to front `bringToFront()`;
* Send to back `sendToBack()`;
* Pick color;
* Remove object or group objects `removeObjects()`.

Fabric.js allows you to move object on the board, change the size of an object, rotate the drawing object.

TogetherJS allows your do this together. You can see all the changes on the board in real time.

Also you can see some built-in features on the site [TogetherJS](https://togetherjs.com/ "TogetherJS").