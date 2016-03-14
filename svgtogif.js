var svg = svg2,
    svgData = new XMLSerializer().serializeToString(svg),
    img = document.createElement("img"),
    interval = null,
    first = true,
    gif = new GIF({
        workers: 4,
        quality: 10,
        width: parseInt(svg2.getAttribute('width')),
        height: parseInt(svg2.getAttribute('height'))
    }),
    currentTime,
    sampleRate = 20;

img.setAttribute("src", "data:image/svg+xml;base64," + btoa(svgData));
var max=0, maxElement=null;
$('#svg2 animateMotion, #svg2 animate, #svg animateTransform').each(function(){
    var duration = parseFloat(this.getAttribute('dur'));
    if(duration > max){
        maxElement = this;
        max = duration;
    }
})
maxElement.onrepeat = function(){
    if(first){
        currentTime = new Date().getTime();
        interval = setInterval(draw, sampleRate);
        first = !first;
    }
    else if(interval){
        clearInterval(interval);
        interval = null;
        draw();
        gif.render();
    }
}
gif.on('finished', function(blob) {
  var newGif = new Image();
  newGif.src = URL.createObjectURL(blob);
  document.body.appendChild(newGif);
});
draw = function(){
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext("2d"),
        newTime = new Date().getTime();
    canvas.width = gif.options.width;
    canvas.height = gif.options.height;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    gif.addFrame(ctx, {delay:newTime-currentTime});
    currentTime = newTime;
}