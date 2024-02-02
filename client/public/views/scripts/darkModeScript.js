$(document).ready(function () {
  let mode = window.localStorage.getItem('mode');
  if (mode) $('*').addClass('dark');

  $('#switch-base').click((e) => {
    mode = window.localStorage.getItem('mode');
    if (mode) {
      $('*').removeClass('dark');
      $('#modalPlaceholder').removeClass('dark');
      window.localStorage.removeItem('mode');
    } else {
      $('*').addClass('dark');
      $('#modalPlaceholder').addClass('dark');
      window.localStorage.setItem('mode', 'dark');
    }
  });
});

$(document).ready(function () {
  $('#LogoContainer').load('/views/ReactLogo.html');
});
