function showSlide(number) {
  document.querySelectorAll('.slidePage2').forEach(function (slide) {
    slide.style.display = 'none'; // Hide all slides
  });

  document.getElementById(`slide${number}`).style.display = 'block'; // Show the selected slide
  document.querySelector('.containerRight').style.visibility = 'visible'; // Make the right container visible
}
