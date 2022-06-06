// 자동 이미지 슬라이드쇼 처리
let slideIndex = 0;
carousel();

function carousel() {
    let i;
    const x = document.getElementsByClassName("mySlides");
    if(x.length !== 0) {
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        slideIndex++;
        if (slideIndex > x.length) {
            slideIndex = 1
        }
        x[slideIndex-1].style.display = "block";
        setTimeout(carousel, 2000); // Change image every 2 seconds
    }
}


// 여행지 아이콘 처리
const locationIcons = document.querySelectorAll('img.location-icon');
locationIcons.forEach(icon => {
    icon.src = `/images/${icon.dataset.location}/1.jpg`;
});