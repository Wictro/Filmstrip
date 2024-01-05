let slider = document.getElementById('slider');
let knob = document.getElementById('slider-knob');
let progress = document.getElementById('slider-progress');
let filmstrip = document.getElementById('filmstrip');
let currentPercentage;

//dragging
knob.onmousedown = dragInit;

knob.ontouchstart = function(e) {
    e.preventDefault();
    dragInit(e.touches[0], true);
}
        
//clicking
slider.onclick = (e) => {
    e.preventDefault();
    updateProgress(e.clientX, false)
};

//hovering
slider.onmousemove = (e) => {
    let targetProgress = getProgressWidth(e.clientX) / slider.getBoundingClientRect().width * 100;
    updateFilmstrip(targetProgress);
}

slider.onmouseout = () => {
    hideFilmstrip();
}

function dragInit(e, touch = false){
    if(!touch){
        document.onmouseup = dragStop;
        document.onmousemove = dragMove;
    }
    else{
        document.ontouchend = function(e){
            dragStop(e.touches[0])
        };
        document.ontouchmove = function(e){
            dragMove(e.touches[0]);
        };
    }
}

function dragMove(e){
    updateProgress(e.clientX);
}

function dragStop(e){
    hideFilmstrip();
    document.onmousemove = null;
    document.onmouseup = null;
    document.ontouchend = null;
    document.ontouchmove = null;
}

function updateProgress(mouseX, showFilmstrip = true){
    currentPercentage = getProgressWidth(mouseX) / slider.getBoundingClientRect().width * 100;

    updateKnobPosition(currentPercentage);
    updateProgressPosition(currentPercentage);
    
    if(showFilmstrip)
        updateFilmstrip(currentPercentage);
}

function updateKnobPosition(percentage){
    knob.style.left = `calc(${percentage}% - ${knob.getBoundingClientRect().width / 2}px)`;
}

function updateProgressPosition(percentage){
    progress.style.width = `${percentage}%`;
}

function updateFilmstrip(percentage){
    let progressWidth = percentage * slider.getBoundingClientRect().width / 100;

    //position filmstrip responsively
    if(progressWidth <= filmstrip.getBoundingClientRect().width / 2){
        filmstrip.style.left = `calc(${percentage}% - ${progressWidth}px)`;
    }
    else if(slider.getBoundingClientRect().width - progressWidth <= filmstrip.getBoundingClientRect().width / 2){
        filmstrip.style.left = `calc(${percentage}% - ${progressWidth + filmstrip.getBoundingClientRect().width - slider.getBoundingClientRect().width}px)`;
    }
    else{
        filmstrip.style.left = `calc(${percentage}% - ${filmstrip.getBoundingClientRect().width / 2}px)`;
    }
    
    //fixing the background
    filmstrip.style.backgroundSize = filmstrip.getBoundingClientRect().width * 10 + 'px';
    filmstrip.style.backgroundPositionY = Math.floor(Math.floor(percentage) / 10) * filmstrip.getBoundingClientRect().height * -1 + 'px';
    filmstrip.style.backgroundPositionX = (Math.floor(percentage) % 10) * filmstrip.getBoundingClientRect().width * -1 + 'px';

    filmstrip.classList.add('show');
}

function hideFilmstrip(){
    setTimeout(() => filmstrip.classList.remove('show'), 0);
}

function getProgressWidth(mouseX){
    if(mouseX < slider.getBoundingClientRect().left)
        mouseX = slider.getBoundingClientRect().left;
    else if(mouseX > slider.getBoundingClientRect().right)
        mouseX = slider.getBoundingClientRect().right;

    return mouseX - slider.getBoundingClientRect().left;
}