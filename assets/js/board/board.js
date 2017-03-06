/*
 *Slabkiy Andrey
 *Irida board 0.1
 *All rights reserved
 */
var isMouseDown = false,
    isLineMode = false,
    isLineMode = false,
    isCircleMode = false,
    isRectMode = false,
    isFillRectMode = false,
    isMarkerMode = false,
    isDrawing = false,
    lineWidth = 1,
    color = "#000";
    boardScale = 1,
    SCALE_FACTOR = 1.2;

document.getElementsByClassName('instument-panel')[0].style.height = this.innerHeight - document.getElementsByClassName('page-footer')[0].clientHeight + "px";
workspace = document.getElementsByClassName('workspace')[0];
workspace.style.width = this.innerWidth - document.getElementsByClassName('instument-panel')[0].clientWidth + "px";
workspace.style.height = this.innerHeight - document.getElementsByClassName('page-footer')[0].clientHeight + "px";
board_div = document.getElementsByClassName('board')[0];
var board = document.createElement('canvas');
/*устанавливаем высоту и ширину canvas*/
board.height = workspace.clientHeight;
board.width = workspace.clientWidth;
board.id = 'board';
board_div.appendChild(board);
var board = new fabric.Canvas('board');


/**
 * This function return a object by name
 */
fabric.Canvas.prototype.getItemByName = function(name) {
    var object = null,
        objects = this.getObjects();

    for (var i = 0, len = this.size(); i < len; i++) {
        if (objects[i].name && objects[i].name === name) {
            object = objects[i];
            break;
        }
    }

    return object;
};

function boardJSON(){
    return board.toJSON('name')
}
function sendBoard() {
    
    if (TogetherJS.running && board._objects.length !== 0) {
        TogetherJS.send({
            type: "getBoard",
            board: board.toJSON('name')
        });
    }
}


TogetherJS.hub.on('getBoard', function(msg) {
    if (!msg.sameUrl) {
        return;
    }
    getBoard(msg.board);
});

function getBoard(bo) {
    if(board._objects.length > 0) return;
    board.clear();
    board.loadFromJSON(bo);
    board.renderAll();
}
function objectsEvented(status){
    var obj = board.getObjects();
    for (var i = 0; i < obj.length; i++){
        obj[i].evented = status;
        obj[i].selected = status;
    }
}

var items = document.getElementsByClassName('item');
for (var i = 0; i < items.length; i ++){
 items[i].addEventListener('click', function(e){
    activeItem(e);
 });   
}

function activeItem(e){
    for( var i = 0; i < items.length; i++ ){
        items[i].classList = 'item';
    }
    var item = e.target.parentElement;
    item.classList.add('active');

}
function toActivateTheModule(module) {

    switch (module) {
        case 0: //rect module
            isMouseDown = isLineMode = board.isDrawingMode =  isCircleMode = isFillRectMode = isMarkerMode = false;
            isRectMode = !isRectMode;
            objectsEvented(false);
            break;
        case 1: //fillRect module
            isMouseDown = isRectMode = board.isDrawingMode =  isCircleMode = isLineMode = isMarkerMode = false;
            isFillRectMode = !isFillRectMode;
            objectsEvented(false);
            break;
        case 2: //line module
            isMouseDown = isCircleMode  = board.isDrawingMode =  isRectMode = isFillRectMode = isMarkerMode = false;
            isLineMode = !isLineMode;
            objectsEvented(false);
            break;
        case 3: //circle module
            isMouseDown = isLineMode  = board.isDrawingMode = isRectMode  = isFillRectMode = isMarkerMode = false;
            isCircleMode = !isCircleMode;
            objectsEvented(false);
            break;
        case 4: //marker module
            isMouseDown = isLineMode  = board.isDrawingMode = isRectMode  = isFillRectMode = isCircleMode = false;
            isMarkerMode = !isMarkerMode;
            objectsEvented(false);
            break;
        case 5: //free drawing module
            isMouseDown = isLineMode  = isMarkerMode = isRectMode  = isFillRectMode = isCircleMode = false;
            board.isDrawingMode = !board.isDrawingMode;
            objectsEvented(false);
            break;    
        default:

    }

}
/*============z-index +===========*/
function bringToFront(){
    var activeObject = board.getActiveObject(),
        activeGroup = board.getActiveGroup(),
        names = [];
    if( activeObject ){
        names.push(activeObject.name);
        activeObject.bringToFront();
    }
    if(activeGroup){
        var objects = activeGroup._objects;
        for( var i = 0; i < objects.length; i++ ){
            names.push(objects[i].name);
            objects[i].bringToFront();
        }
    }
    if (TogetherJS.running) {
        TogetherJS.send({
            type: "bringToFrontTogether",
            names: names
        }); //TogetherJS send
    } // if TogetherJS running
}
TogetherJS.hub.on('bringToFrontTogether', function(msg) {
    if (!msg.sameUrl) {
        return;
    }
    bringToFrontTogether(msg.names);
});

function bringToFrontTogether(names) {
    for ( var i = 0; i < names.length; i++ ){
        var obj = board.getItemByName(names[i]);
        obj.bringToFront();
    }
}
/*============z-index +===========*/
/*============z-index +===========*/
function sendToBack(){
    var activeObject = board.getActiveObject(),
        activeGroup = board.getActiveGroup(),
        names = [];
    if( activeObject ){
        names.push(activeObject.name);
        activeObject.sendToBack();
    }
    if(activeGroup){
        var objects = activeGroup._objects;
        for( var i = 0; i < objects.length; i++ ){
            names.push(objects[i].name);
            objects[i].sendToBack();
        }
    }
    if (TogetherJS.running) {
        TogetherJS.send({
            type: "sendToBackTogether",
            names: names
        }); //TogetherJS send
    } // if TogetherJS running
}
TogetherJS.hub.on('sendToBackTogether', function(msg) {
    if (!msg.sameUrl) {
        return;
    }
    sendToBackTogether(msg.names);
});

function sendToBackTogether(names) {
    for ( var i = 0; i < names.length; i++ ){
        var obj = board.getItemByName(names[i]);
        obj.sendToBack();
    }
}
/*============z-index +===========*/
/*================Set line windth====================*/

var lineWidthRange = document.getElementsByClassName('line-width')[0];
lineWidthRange.style.top = items[items.length-1].offsetTop+"px";
lineWidthRange.style.left = items[items.length-1].offsetLeft+48+"px";
var isSetLineWidth = false;
function selectLineWidth(){
    isSetLineWidth = !isSetLineWidth;
    if(isSetLineWidth){
        lineWidthRange.style.display = "block";
    }else{
        lineWidthRange.style.display = "none";
    }
   
}
document.getElementById('setWidth').oninput = function(e){
    lineWidth = e.target.value;
    lineWidth = parseInt(lineWidth);
}
/*================Set line windth====================*/
/*******************Set Color*************************/
function setColor(picker){
    color = "#"+picker.toString()
    
}
/*******************Set Color*************************/
/*================Desabled modules===================*/

function desabledModules() {
    console.log('desabledModules');
    isMouseDown = false;
    isLineMode = false;
    isLineMode = false;
    isCircleMode = false;
    isRectMode = false;
    isFillRectMode = false;
    isMarkerMode = false;
    isFreeDrawing = false;
    board.isDrawingMode = false;
    board.selection = true;
    objectsEvented(true);
}
/*================Desabled modules===================*/
/*================Remove object======================*/
document.addEventListener('keyup', function(e){
    if (e.key === "Delete") {
        removeObjects();
    }
});
function removeObjects(){
        var activeObject = board.getActiveObject(),
            activeGroup = board.getActiveGroup(),
            name;
        if (activeObject) {
            if (confirm('Are you sure?')) {
                name = activeObject.name;
                board.remove(activeObject);
                board.renderAll();
                if (TogetherJS.running) {
                    TogetherJS.send({
                        type: "removeTogether",
                        name: name
                    }); //TogetherJS send
                } // if TogetherJS running
            }
        } else if (activeGroup) {
            if (confirm('Are you sure?')) {
                var objectsInGroup = activeGroup.getObjects();
                board.discardActiveGroup();
                objectsInGroup.forEach(function(object) {
                    board.remove(object);
                    board.renderAll();
                    if (TogetherJS.running) {
                        TogetherJS.send({
                            type: "removeTogether",
                            name: object.name
                        }); //TogetherJS send
                    } // if TogetherJS running
                });
            }
        }
}
TogetherJS.hub.on('removeTogether', function(msg) {
    if (!msg.sameUrl) {
        return;
    }
    removeTogether(msg.name);
});

function removeTogether(name) {
    var obj = board.getItemByName(name);
    board.remove(obj);
    board.renderAll();

}
/*================Remove object======================*/

/*=========================Object modified========================*/
board.on("object:modified", function(e) {
    var activeObject = board.getActiveObject(),
        activeGroup = board.getActiveGroup(),
        names = [];
    if( activeObject ){
        if (TogetherJS.running) {
            TogetherJS.send({
                type: "modifiedTogether",
                object: e.target,
                name: e.target.name
            }); //TogetherJS send
        } //TogetherJS running  
    }else if( activeGroup ){
        var objectsInGroup = activeGroup.getObjects();
        objectsInGroup.forEach(function(object) {
            names.push(object.name);
        })
        if (TogetherJS.running) {
            console.log(activeGroup)
            TogetherJS.send({
                type: "modifiedObjectGroupTogether",
                objects: activeGroup,
                names: names
            }); //TogetherJS send
        } // if TogetherJS running
    }
    
}); //object modified
TogetherJS.hub.on('modifiedTogether', function(msg) {
    if (!msg.sameUrl) {
        return;
    }
    modifiedTogether(msg.object, msg.name);
});
TogetherJS.hub.on('modifiedObjectGroupTogether', function(msg) {
    if (!msg.sameUrl) {
        return;
    }
    modifiedObjectGroupTogether(msg.objects, msg.names);
});

function modifiedTogether(object, name) {
    console.log(object)
    var obj = board.getItemByName(name);
    if (name.indexOf('text') === 0) {
        //  textModified(name, object)
        obj.set({
            fill: object.fill,
            fontsize: object.fontsize,
            height: object.height,
            left: object.left,
            text: object.text,
            top: object.top,
            width: object.width,
            scaleX: object.scaleX,
            scaleY: object.scaleY,
            angle: object.angle
        }); //obj set
    } else if(name.indexOf('free') === 0) {
        obj.set({
            left: object.left,
            stroke: object.stroke,
            top: object.top,
            strokeWidth: object.strokeWidth,
            fill: object.fill,
            scaleX: object.scaleX,
            scaleY: object.scaleY,
            angle: object.angle,
            pathOffset: object.pathOffset,
            path: object.path

        }); //obj set
    } else {
        obj.set({
            height: object.height,
            left: object.left,
            radius: object.radius,
            stroke: object.stroke,
            top: object.top,
            width: object.width,
            strokeWidth: object.strokeWidth,
            fill: object.fill,
            scaleX: object.scaleX,
            scaleY: object.scaleY,
            angle: object.angle

        }); //obj set
    } //if text
    obj.setCoords();
    board.renderAll();
}
function modifiedObjectGroupTogether(obj, names){
    console.log(obj, names);
    var elements = [];
    for (var i = 0; i < names.length; i++){
        elements.push(board.getItemByName(names[i]));
    }
    var group = new fabric.Group(elements, {
        left: obj.left,
        top: obj.top,
        angle: obj.angle,
        scaleX: obj.scaleX,
        scaleT: obj.scaleY
    });
    for( var i = 0; i < elements.length; i++ ){
        elements[i].remove();
    }
    group.setCoords();
    board.add(group);
    var items = group._objects;
    console.log(items, group);
    group._restoreObjectsState();
    board.remove(group);
    for (var i = 0; i < items.length; i++){
        board.add(items[i]);
        board.item(board.size()-1).hasControls = true;
    }
    
    board.renderAll();
    
}
/*=========================Object modified========================*/
/*=========================free drawing===========================*/
function startDrawingMode() {
    console.log('free drawing mode');
    toActivateTheModule(5);
    board.on("mouse:down", function(){
       if(!isDrawing && board.isDrawingMode){
        isDrawing = true;
        board.selection = false;
        board.freeDrawingBrush.width = parseInt(lineWidth);
        board.freeDrawingBrush.color = color;
        } 
    });
    board.on("mouse:up", function(e) {
        if (board.isDrawingMode && isDrawing) {
            isDrawing = false;
            var date = new Date();
            var name = "free" + date.getTime();
            e.target.name = name;
            e.target.originX = "center";
            e.target.originY = "center";
            if (TogetherJS.running) {
                TogetherJS.send({
                    type: "freeDrawingTogether",
                    object: e.target,
                    name: name
                }); //TogetherJS send
            } // if TogetherJS running
        }
    });
}
TogetherJS.hub.on('freeDrawingTogether', function(msg) {
    if (!msg.sameUrl) {
        return;
    }
    freeDrawingTogether(msg.object, msg.name);
});

function freeDrawingTogether(obj, name) {
    console.log(obj);
    var path = new fabric.Path(obj.path, {
        name: name,
        strokeWidth: obj.strokeWidth,
        stroke: obj.stroke,
        backgroundColor: obj.backgroundColor,
        fill: obj.fill,
        originX: "center",
        originY: "center"
    });
    path.setCoords();
    board.add(path);
    board.renderAll();
}
/*=========================free drawing===========================*/

/*=========================Text drawing===========================*/
function startTextDrawing() {
    isMouseDown = false;
    isLineMode = false;
    isCircleMode = false;
    isRectMode = false;
    isFillRectMode = false;
    isMarkerMode = false;
    board.isDrawingMode = false;
    var date = new Date();
    var name = "text" + date.getTime();
    var text = new fabric.IText('Текст', {
        fill: color,
        left: 50,
        fontsize: 14,
        top: 50,
        name: name
    }); // fabric IText
    board.add(text);
    var send = {
        fill: color,
        left: 50,
        fontsize: 14,
        top: 50,
        name: name
    };
    if (TogetherJS.running) {
        TogetherJS.send({
            type: "textDrawingTogether",
            text: send
        }); //TogetherJS send
    } // if TogetherJS running
}
TogetherJS.hub.on('textDrawingTogether', function(msg) {
    if (!msg.sameUrl) {
        return;
    }
    textDrawingTogether(msg.text);
});

function textDrawingTogether(text) {
    var text_c = new fabric.IText('Текст', {
        top: text.top,
        fill: text.fill,
        left: text.left,
        fontsize: text.fontsize,
        name: text.name
    });
    board.add(text_c);
    board.renderAll();
}
/*=========================Text drawing===========================*/

/*=========================Rect drawing===========================*/

function startRectDrawing() {
    
    toActivateTheModule(0);
    var originY = null,
        originX = null,
        name = null,
        angle = null,
        rect = null;
    board.on("mouse:down", function(o) {
        if (isRectMode && !isDrawing) {
            isDrawing = true;
            board.selection = false;
            isMouseDown = true;
            var date = new Date();
            name = "rect" + date.getTime();
            var pointer = board.getPointer(o.e);
            originX = pointer.x;
            originY = pointer.y;
            rect = new fabric.Rect({
                height: 1,
                width: 1,
                left: pointer.x,
                top: pointer.y,
                strokeWidth: lineWidth,
                fill: "rgba(0,0,0,0)",
                stroke: color,
                name: name,
                evented: true
            }); // fabric rect
            board.add(rect);
        } // if isRectMode == true
    }); // mouse down
    board.on("mouse:move", function(o) {
        if (isMouseDown && isRectMode) {
            if (rect) {
                var width, height;
                var pointer = board.getPointer(o.e);
                if( originX > pointer.x && originY < pointer.y ){
                   width = Math.abs(originY - pointer.y);
                   height = Math.abs(originX - pointer.x);
                   angle = 90;
                }
                if(originX > pointer.x && originY > pointer.y ){
                   width = Math.abs(originX - pointer.x);
                   height = Math.abs(originY - pointer.y);
                   angle = 180;
                }
                if(originX < pointer.x && originY > pointer.y ){
                   width = Math.abs(originY - pointer.y);
                   height = Math.abs(originX - pointer.x);
                   angle = 270;
                }
                if(originX < pointer.x && originY < pointer.y ){
                   width = Math.abs(originX - pointer.x);
                   height = Math.abs(originY - pointer.y);
                   angle = 0;
                }
                rect.set({
                    width: width,
                    height: height,
                    angle: angle
                }); //rect set 
                board.renderAll();
            }
        } // if isMouseDown = true && isRectMode = true
    }); //mouse move
    board.on("mouse:up", function(o) {
        if (isRectMode) {
            isDrawing = false;
            isMouseDown = false;
            board.selection = true;
            var pointer = board.getPointer(o.e);
            if (TogetherJS.running && rect) {
                TogetherJS.send({
                    type: "rectDrawingTogether",
                    rect: rect,
                    name: name
                }); //TogetherJS send
            } // if TogetherJS running
        } //rect mode true
    }); //mouse up
}
TogetherJS.hub.on('rectDrawingTogether', function(msg) {
    if (!msg.sameUrl) {
        return;
    }
    rectDrawingTogether(msg.rect, msg.name);
});

function rectDrawingTogether(rect_obj, name) {
    var rect = new fabric.Rect({
        height: rect_obj.height,
        width: rect_obj.width,
        left: rect_obj.left,
        top: rect_obj.top,
        strokeWidth: rect_obj.strokeWidth,
        fill: rect_obj.fill,
        stroke: rect_obj.stroke,
        angle: rect_obj.angle,
        name: name
    }); // fabric Rect
    board.add(rect);
    board.renderAll();
}

/*=========================Rect drawing===========================*/

/*=========================Fill Rect drawing===========================*/
function startFillRectDrawing() {
    toActivateTheModule(1);
    lastMode = 1;
    var originX,
        originY,
        rect, name, angle;
    console.log("Fill Rect mode");
    board.on('mouse:down', function(o) {
        if (isFillRectMode && !isDrawing) {
            board.selection = false;
            isMouseDown = true;
            isDrawing = true;
            var date = new Date();
            name = "rect" + date.getTime();
            var pointer = board.getPointer(o.e);
            originY = pointer.y;
            originX = pointer.x;
            rect = new fabric.Rect({
                width: 1,
                height: 1,
                left: pointer.x,
                top: pointer.y,
                strokeWidth: lineWidth,
                fill: color,
                stroke: color,
                name: name

            }); // fabric rect
            board.add(rect);
            board.renderAll();
        } //isFillRectMode
    }); //mouse down
    board.on('mouse:move', function(o) {
        if (isMouseDown && isFillRectMode) {
            if (rect) {
                var width, height;
                var pointer = board.getPointer(o.e);
                if( originX > pointer.x && originY < pointer.y ){
                   width = Math.abs(originY - pointer.y);
                   height = Math.abs(originX - pointer.x);
                   angle = 90;
                }
                if(originX > pointer.x && originY > pointer.y ){
                   width = Math.abs(originX - pointer.x);
                   height = Math.abs(originY - pointer.y);
                   angle = 180;
                }
                if(originX < pointer.x && originY > pointer.y ){
                   width = Math.abs(originY - pointer.y);
                   height = Math.abs(originX - pointer.x);
                   angle = 270;
                }
                if(originX < pointer.x && originY < pointer.y ){
                   width = Math.abs(originX - pointer.x);
                   height = Math.abs(originY - pointer.y);
                   angle = 0;
                }
                rect.set({
                    width: width,
                    height: height,
                    angle: angle
                }); //rect set 
                board.renderAll();
            }
        } //isMouseDown
    }); // mouse move
    board.on('mouse:up', function(o) {
        if (isFillRectMode) {
            isMouseDown = false;
            board.selection = true;
            isDrawing = false;
            board.renderAll();
            if (TogetherJS.running && rect) {
                TogetherJS.send({
                    type: "fillRectDrawingTogether",
                    rect: rect,
                    name: name
                }); //TogetherJS send
            } // if TogetherJS running
        } //isFillRectMode
    }); //mouse up
}
TogetherJS.hub.on('fillRectDrawingTogether', function(msg) {
    if (!msg.sameUrl) {
        return;
    }
    fillRectDrawingTogether(msg.rect, msg.name);
});

function fillRectDrawingTogether(rect_obj, name) {
    var rect = new fabric.Rect({
        height: rect_obj.height,
        width: rect_obj.width,
        left: rect_obj.left,
        top: rect_obj.top,
        strokeWidth: rect_obj.strokeWidth,
        fill: rect_obj.fill,
        stroke: rect_obj.stroke,
        name: name,
        angle: rect_obj.angle
    }); // fabric Rect
    board.add(rect);
    board.renderAll();
}
/*=========================Fill Rect drawing===========================*/

/*=========================Circle drawing===========================*/
function startCircleDrawing() {
    toActivateTheModule(3);
    lastMode = 3;
    var orgnX,
        orgnY,
        circle, name;
    console.log('Circle mode');
    board.on('mouse:down', function(e) {
        if (isCircleMode && !isDrawing) {
            isDrawing = true;
            board.selection = false;
            
            var date = new Date();
            name = "circle" + date.getTime();
            isMouseDown = true;
            var pointer = board.getPointer(e.e);
            orgnX = pointer.x;
            orgnY = pointer.y;
            circle = new fabric.Circle({
                left: pointer.x,
                top: pointer.y,
                radius: 1,
                stroke: color,
                strokeWidth: lineWidth,
                fill: "rgba(0,0,0,0)",
                originY: 'center',
                originX: 'center',
                name: name,
                evented: true
            }); // Circle
            board.add(circle);
            board.renderAll();
        } //if isCircleMode
    }); // mouse down
    board.on('mouse:move', function(e) {
        if (isCircleMode && isMouseDown) {
            var pointer = board.getPointer(e.e);
            if (circle) {
                circle.set({
                    radius: Math.abs(orgnX - pointer.x)
                }); //circle set
                board.renderAll();
            }
        } //if isCircleMode
    }); //mouse move
    board.on('mouse:up', function(e) {
        if (isCircleMode) {
            isDrawing = false;
            isMouseDown = false;
            board.selection = true;
            var pointer = board.getPointer(e.e);
            circle_obj = {
                left: orgnX,
                top: orgnY,
                radius: Math.abs(orgnX - pointer.x),
                stroke: circle,
                fill: "rgba(0,0,0,0)",
                strokeWidth: lineWidth,
                originY: 'center',
                originX: 'center',
                name: name,
                evented: true
            }; //circle_obj
            board.renderAll();
            if (TogetherJS.running && circle) {
                TogetherJS.send({
                    type: "circleDrawingTogether",
                    circle: circle_obj
                }); //TogetherJS send
            } // if TogetherJS running
            orgnX = orgnY = 0;
        } // isCircleMode
    }); //mouse up

}
TogetherJS.hub.on('circleDrawingTogether', function(msg) {
    if (!msg.sameUrl) {
        return;
    }
    circleDrawingTogether(msg.circle);
});

function circleDrawingTogether(circle_obj) {
    var circle = new fabric.Circle({
        left: circle_obj.left,
        top: circle_obj.top,
        radius: circle_obj.radius,
        stroke: circle_obj.stroke,
        strokeWidth: circle_obj.strokeWidth,
        originY: circle_obj.originY,
        originX: circle_obj.left.originX,
        fill: circle_obj.fill,
        name: circle_obj.name
    }); //circle
    board.add(circle);
    board.renderAll();
}
/*=========================Circle drawing===========================*/
/*=========================Line drawing============================*/
function startLineDrawing(e) {
    toActivateTheModule(2);
    lastMode = 2;
    var pointer_start = {};
    var pointer_end = {};
    var line, name;
    console.log('Line mode');
    board.on('mouse:down', function(e) {
        if (isLineMode && !isDrawing) {
            isDrawing = true;
            board.selection = false;
            var date = new Date();
            name = "line" + date.getTime();
            pointer_start = board.getPointer(e.e);
            line = new fabric.Line([pointer_start.x, pointer_start.y, pointer_start.x, pointer_start.y], {
                stroke: color,
                strokeWidth: lineWidth,
                name: name,
                evented: true
            });
            board.add(line);
            board.renderAll();
            isMouseDown = true;
        }
    }); //mouse down

    board.on('mouse:move', function(e) {
        if (isLineMode && isMouseDown) {
            var pointer_move = board.getPointer(e.e);
            if (line) {
                line.set({
                    x2: pointer_move.x,
                    y2: pointer_move.y
                });
                board.renderAll();
            }
        }
    }); //mouse move
    board.on('mouse:up', function(e) {
        if (isLineMode) {
            isMouseDown = false;
            board.selection = true;
            isDrawing = false;
            pointer_end = board.getPointer(e.e);
            var obj ={
                p_s: pointer_start,
                p_e: pointer_end,
                name: name,
                line: line
            };
            if (TogetherJS.running && line) {
                TogetherJS.send({
                    type: "lineDrawingTogether",
                    obj: obj
                });
            }
        }
    }); //mouse up
}
TogetherJS.hub.on('lineDrawingTogether', function(msg) {
    if (!msg.sameUrl) {
        return;
    }
    lineDrawingTogether(msg.obj);
});

function lineDrawingTogether(obj, name) {
    console.log(obj.p_e.x)
    var line = new fabric.Line([obj.p_s.x, obj.p_s.y, obj.p_e.x, obj.p_e.y], {
        stroke: obj.line.stroke,
        strokeWidth: obj.line.strokeWidth,
        name: obj.name
    });
    board.add(line);
    board.renderAll();
}
/*=========================Line drawing============================*/
/*=========================Marker drawing============================*/

function startMarkerDrawing(e) {
    var pointer_start = {};
    var pointer_end = {};
    var pointer_move = {};
    lastMode = 4;
    toActivateTheModule(4);
    var name;
    console.log('Marker mode');
    board.on('mouse:down', function(e) {
        if (isMarkerMode && !isDrawing) {
            isDrawing = true;
            board.selection = false;
            var date = new Date();
            name = "marker" + date.getTime();
            pointer_start = board.getPointer(e.e);
            marker = new fabric.Line([pointer_start.x, pointer_start.y, pointer_start.x, pointer_start.y], {
                stroke: color,
                name: name,
                strokeWidth: 15 + lineWidth,
                evented: true
            });
            board.add(marker);
            isMouseDown = true;
        }

    }); //mouse down

    board.on('mouse:move', function(e) {
        if (isMarkerMode && isMouseDown) {
            var pointer_move = board.getPointer(e.e);
            if (marker) {
                marker.set({
                    x2: pointer_move.x,
                    y2: pointer_move.y
                });
                board.renderAll();
            }
        }
    }); //mouse move
    board.on('mouse:up', function(e) {

        if (isMarkerMode) {
            isMouseDown = false;
            board.selection = true;
            isDrawing = false;
            pointer_end = board.getPointer(e.e);
            if (TogetherJS.running && marker) {
                var obj = {
                    pointer_end: pointer_end,
                    pointer_start: pointer_start,
                    stroke: color,
                    strokeWidth: 15 + lineWidth
                };
                TogetherJS.send({
                    type: "markerDrawingTogether",
                    object: obj,
                    name: name
                });
            }
        }
    }); //mouse up
}
TogetherJS.hub.on('markerDrawingTogether', function(msg) {
    if (!msg.sameUrl) {
        return;
    }
    markerDrawingTogether(msg.object, msg.name);
});
function markerDrawingTogether(object, name) {
    var marker = new fabric.Line([object.pointer_start.x, object.pointer_start.y, object.pointer_end.x, object.pointer_end.y], {
        stroke: object.stroke,
        name:  name,
        strokeWidth: object.strokeWidth
    });
    board.add(marker);
    board.renderAll();
}

/*=========================Marker drawing============================*/

/*=========================Upload images=============================*/
var isAddImageUrl = false;
var imageUrl_div = document.getElementsByClassName('image-url')[0];
imageUrl_div.style.top = items[10].offsetTop+"px";
imageUrl_div.style.left = items[10].offsetLeft+48+"px";
function addImagesUrl(){
    isAddImageUrl = !isAddImageUrl;
    if(isAddImageUrl){
        imageUrl_div.style.display = "block";
    }else{
        imageUrl_div.style.display = "none";
    }
}
document.getElementsByClassName('add-btn')[0].addEventListener('click', function(e){
    var url = document.getElementById('image_url');
    console.log(url.value)
    if( url.value == '' ){
        Materialize.toast('Image url is empty', 4000);
        return;
    }
    /*console.log(url.value.indexOf('http://') !== 0 || url.value.indexOf('https://') !== 0)
    if( url.value.indexOf('http://') !== 0 || url.value.indexOf('https://') !== 0 ){
        Materialize.toast('It does not link', 4000);
        return;
    }*/
    /*if( url.value.indexOf('.png') == -1 || url.value.indexOf('.jpg') == -1 || url.value.indexOf('.jpeg') == -1 || url.value.indexOf('.gif') == -1){
        Materialize.toast("so it`s not a picture", 4000);
        return;
    }*/
    uploadImages(url.value);
});
function uploadImages(img_url) {
    var url = img_url;
    addImageOnBoard(url);
    
    board.renderAll();
}

function addImageOnBoard(url) {
    isRectMode = false;
    board.isDrawingMode = false;
    isLineMode = false;
    isCircleMode = false;
    isFillRectMode = false;
    isMarkerMode = false;
    var name = "";
    var date = new Date();
    name = "image" + date.getTime();
    fabric.Image.fromURL(url, function(oImg) {
        oImg.name = name;
        board.add(oImg);
    });
    board.renderAll();
    TogetherJS.send({
        type: "togetherAddImageOnBoard",
        url: url,
        name: name
    });

}
TogetherJS.hub.on('togetherAddImageOnBoard', function(msg) {
    if (!msg.sameUrl) {
        return;
    }
    togetherAddImageOnBoard(msg.url, msg.name);
});

function togetherAddImageOnBoard(url, name) {
    fabric.Image.fromURL(url, function(oImg) {
        oImg.name = name;
        board.add(oImg);
    });
    board.renderAll();
}

/*=========================Upload images=============================*/

/*=================ZOOM==============================*/
function onZoomIn(){
    boardScale *= SCALE_FACTOR;
    var obj = board.getObjects();
    for( var i in obj ){
        var scaleX = obj[i].scaleX,
            scaleY = obj[i].scaleY,
            left = obj[i].left,
            top = obj[i].top,
            tempScaleX = scaleX * SCALE_FACTOR,
            tempScaleY = scaleY * SCALE_FACTOR,
            tempLeft = left * SCALE_FACTOR,
            tempTop = top * SCALE_FACTOR;
            obj[i].set({
                scaleX: tempScaleX,
                scaleY: tempScaleY,
                left: tempLeft,
                top: tempTop
            });
            obj[i].setCoords();
    }
    board.renderAll();
    boardScale = 1;
    if (TogetherJS.running) {
        TogetherJS.send({
            type: "togetherOnZoomIn"
        });
    }
}
TogetherJS.hub.on('togetherOnZoomIn', function(msg) {
    if (!msg.sameUrl) {
        return;
    }
    togetherOnZoomIn();
});
function togetherOnZoomIn(){
    boardScale *= SCALE_FACTOR;
    var obj = board.getObjects();
    for( var i in obj ){
        var scaleX = obj[i].scaleX,
            scaleY = obj[i].scaleY,
            left = obj[i].left,
            top = obj[i].top,
            tempScaleX = scaleX * SCALE_FACTOR,
            tempScaleY = scaleY * SCALE_FACTOR,
            tempLeft = left * SCALE_FACTOR,
            tempTop = top * SCALE_FACTOR;
            obj[i].set({
                scaleX: tempScaleX,
                scaleY: tempScaleY,
                left: tempLeft,
                top: tempTop
            });
            obj[i].setCoords();
    }
    board.renderAll();
    boardScale = 1;
}
function onZoomOut(){
    boardScale = boardScale / SCALE_FACTOR;
    var obj = board.getObjects();
    for( var i in obj ){
        var scaleX = obj[i].scaleX,
            scaleY = obj[i].scaleY,
            left = obj[i].left,
            top = obj[i].top,
            tempScaleX = scaleX * (1 / SCALE_FACTOR),
            tempScaleY = scaleY * (1 / SCALE_FACTOR),
            tempLeft = left * (1 / SCALE_FACTOR),
            tempTop = top * (1 / SCALE_FACTOR);
            obj[i].set({
                scaleX: tempScaleX,
                scaleY: tempScaleY,
                left: tempLeft,
                top: tempTop
            });
            obj[i].setCoords();
    }
    board.renderAll();
    boardScale = 1;
    if (TogetherJS.running) {
        TogetherJS.send({
            type: "togetherOnZoomOut"
        });
    }
    
}
TogetherJS.hub.on('togetherOnZoomOut', function(msg) {
    if (!msg.sameUrl) {
        return;
    }
    togetherOnZoomOut();
});
function togetherOnZoomOut(){
    boardScale = boardScale / SCALE_FACTOR;
    var obj = board.getObjects();
    for( var i in obj ){
        var scaleX = obj[i].scaleX,
            scaleY = obj[i].scaleY,
            left = obj[i].left,
            top = obj[i].top,
            tempScaleX = scaleX * (1 / SCALE_FACTOR),
            tempScaleY = scaleY * (1 / SCALE_FACTOR),
            tempLeft = left * (1 / SCALE_FACTOR),
            tempTop = top * (1 / SCALE_FACTOR);
            obj[i].set({
                scaleX: tempScaleX,
                scaleY: tempScaleY,
                left: tempLeft,
                top: tempTop
            });
            obj[i].setCoords();
    }
    board.renderAll();
    boardScale = 1;
}
/*===================ZOOM=========================*/

/*=========================Set line windth===========================

var lineWidth = document.getElementById('line-width'),
    thumb = lineWidth.children[0];
thumb.onmousedown = function(e) {
    var thumbCoords = getCoords(thumb),
        shiftY = e.pageY - thumbCoords.top,
        lineWidthCoords = getCoords(lineWidth);
    isMouseDown = true;
    isSetLineWidth = true;
    document.onmousemove = function(e) {
        if (isSetLineWidth) {
            if (isMouseDown) {
                var newTop = e.pageY - shiftY - sliderCoords.top;

                if (newTop < 0) {
                    newTop = 0;
                }
                var topEdge = lineWidth.offsetHeight - thumb.offsetHeight;
                if (newTop > topEdge) {
                    newTop = topEdge;
                }

                thumb.style.left = newTop + 'px';
            }
        }
    };
    document.onmouseup = function() {
        isMouseDown = false;
        isSetLineWidth = false;
        document.onmousemove = document.onmouseup = null;
    };

    return false; // disable selection start (cursor change)
};

thumb.ondragstart = function() {
    return false;
};

function getCoords(elem) { // кроме IE8-
    var box = elem.getBoundingClientRect();

    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
}


/*=========================Set line windth===========================*/
