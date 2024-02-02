//load react logo script
$(document).ready(function () {
  $('#LogoContainer').load('/views/ReactLogo.html');
});

//login/SignUp Script
// when document is ready
$(document).ready(function () {
  // attach click handler event to 'signup' button
  $('#signup').click(function (e) {
    // prevent default button action
    e.preventDefault();
    // load the 'signupModal.html' content into 'modalPlaceholder'
    $('#modalPlaceholder').load('/views/signupModal.html', function () {
      // show the 'signupModal' as a modal
      $('#signupModal').modal('show');
      updateModalDarkMode();
    });
  });

  // attach click event handler to 'login' button
  $('#login').click(function (e) {
    // prevent default button action
    e.preventDefault();
    // load the 'loginModal.html' content into 'modalPlaceholder'
    $('#modalPlaceholder').load('/views/loginModal.html', function () {
      // show the 'loginModa' as a modal
      $('#loginModal').modal('show');
      updateModalDarkMode();
    });
  });

  // attach input event handler to the 'username' field within 'loginModal'
  $(document).on('input', '#user', function () {
    // when the user types in the 'username' field
    let username = $(this).val().trim();
    // check if the 'username' field is not empty
    if (username) {
      // set the text of the element with class 'greeting-text' to 'Hello, username (input)!'
      $('.greeting-text').text('Hello, ' + username + '!');
    } else {
      // set the text of the element with the class 'greeting-text' to 'Hello, Friend!'
      $('.greeting-text').text('Hello, Friend!');
    }
  });

  // when the 'Need an account?' button is clicked within the login modal
  $(document).on('click', '.needAccount', function () {
    // hide the login modal
    $('#loginModal').modal('hide');
    // unbind the previous hidden event handler to avoid stacking event calls
    $('#loginModal').on('hidden.bs.modal', function (e) {
      // load and show the signup modal
      $('#modalPlaceholder').load('/views/signupModal.html', function () {
        $('#signupModal').modal('show');
      });
    });
  });

  // when the 'Have an account?' button is clicked within the signup modal
  $(document).on('click', '.account-button', function (e) {
    // prevent default button action
    e.preventDefault();
    // hide the current modal
    $('#signupModal').modal('hide');
    // load the login modal after the signup modal is hidden
    $('#signupModal').on('hidden.bs.modal', function () {
      $('#modalPlaceholder').load('/views/loginModal.html', function () {
        // show the login modal
        $('#loginModal').modal('show');
      });
    });
  });

  // event listener for tutorial text
  $('#tutorialText').click(function () {
    document.getElementById('tutorialSection').scrollIntoView({
      behavior: 'smooth',
    });
  });

  // event listener for meet the team text
  $('#meetTeamText').click(function () {
    document.getElementById('teamSection').scrollIntoView({
      behavior: 'smooth',
    });
  });
});

//profiles animation script
document.addEventListener('DOMContentLoaded', () => {
  // once the DOM is loaded, event listener will be attached to every '.profile' class by creating an observer through IntersectionObserver
  // IntersectionObserver API asynchronously observes changes in the intersection of a target element
  const observer = new IntersectionObserver(
    (entries, observer) => {
      // loop over each entry - represents one observed element
      entries.forEach((entry) => {
        // check if element is in view
        if (entry.isIntersecting) {
          // add class to trigger the animation
          entry.target.classList.add('animate-bounce-in-top');
          // remove the animation class shortly after it finishes
          setTimeout(() => {
            entry.target.classList.remove('animate-bounce-in-top');
          }, 1500); // timeout should match duration of the animation
        }
      });
    },
    {
      threshold: 0.1, // trigger when at least 10% of the target is visible
    }
  );

  // observe all elements that have the class 'profile'
  document.querySelectorAll('.profile').forEach((element) => {
    // observer is called for each '.profile' element to tell the IntersectionObserver to start watching for these elements when they intersect with the viewport
    observer.observe(element);
  });
});

//darkmode script
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

//slides script
function showSlide(number) {
  document.querySelectorAll('.slidePage2').forEach(function (slide) {
    slide.style.display = 'none'; // Hide all slides
  });

  document.getElementById(`slide${number}`).style.display = 'block'; // Show the selected slide
  document.querySelector('.containerRight').style.visibility = 'visible'; // Make the right container visible
}
