////////////////////
// Const's
////////////////////
const _sliderAutoChangeTime = 4000;
const _slider = document.getElementById("slider");
const _slides = _slider.querySelectorAll("li");
const _sliderCount = _slides.length;
const _nextButton = document.querySelector(".next");
const _previousButton = document.querySelector(".previous");


////////////////////
// Previous Arrow 'click' event
////////////////////
_previousButton.addEventListener("click", function () {
	let currentIndex = currentLiveIndex(),
		previousIndex = currentIndex - 1 < 0 ? _sliderCount - 1 : currentIndex - 1;
	setActiveSliderIndex(previousIndex);
});

////////////////////
// Next Arrow 'click' event
////////////////////
_nextButton.addEventListener("click", function () {
	MoveToNextSlider();
});

////////////////////
// Move to Next Slider
////////////////////
let MoveToNextSlider = () => {
	let currentIndex = currentLiveIndex(),
		nextIndex = currentIndex + 1 > _sliderCount - 1 ? 0 : currentIndex + 1;
	setActiveSliderIndex(nextIndex);
};

////////////////////
// Current Live Slide Index
////////////////////
let currentLiveIndex = () => {
	var response = -1;
	_slides.forEach(function (li, index) {
		if (li.classList.contains("active")) response = index;
	});
	return response;
};

////////////////////
// Set Slider and Dot Nav Active
////////////////////
let setActiveSliderIndex = (activeSliderIndex) => {
    if (currentLiveIndex() !== -1) {
	// Changes Slider
	_slider.querySelector("li.active").classList.remove("active");
	_slides[activeSliderIndex].classList.add("active");
	restartInterval();
    }
};

////////////////////
// Timer
////////////////////
let timer = setInterval(MoveToNextSlider, _sliderAutoChangeTime);

////////////////////
// Reset time between sliders
////////////////////
let restartInterval = () => {
	clearInterval(timer);
	timer = setInterval(MoveToNextSlider, _sliderAutoChangeTime);
};

////////////////////
// Pause on hover
////////////////////

_slider.addEventListener("mouseover", function () {
	clearInterval(timer);
});
_slider.addEventListener("mouseout", function () {
	restartInterval();
});