// when document is ready
$(document).ready(function () {
  //load react logo script
  $('#LogoContainer').load('/views/ReactLogo.html');

  // attach click handler event to 'signup' button
  $('#signup').click(function (e) {
    // prevent default button action
    e.preventDefault();
    // load the 'signupModal.html' content into 'modalPlaceholder'
    $('#modalPlaceholder').load('/views/signupModal.html', function () {
      // show the 'signupModal' as a modal
      $('#signupModal').modal('show');
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

      $('#loginForm').on('submit', async (e) => {
        e.preventDefault();
        const res = await fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'Application/JSON',
          },
          body: JSON.stringify({
            username: e.target.username.value,
            password: e.target.password.value,
          }),
        });
        const alert = $('<div class="alert" role="alert"></div>');
        if (res.ok) {
          alert.addClass('alert-success');
          alert.html('Login Successfully.');
          $('.greeting-text').append(alert);
          location.reload();
        } else {
          const err = await res.json();
          alert.addClass('alert-danger');
          console.log(err);
          alert.html(err);
          $('.greeting-text').append(alert);
          setTimeout(() => alert.remove(), 3000);
          console.log(err);
        }
      });
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

//instructions loop script
document.addEventListener('DOMContentLoaded', () => {
  let currentIndex = 0;
  const instructions = document.querySelectorAll('.instruction');
  const slides = document.querySelectorAll('.slidePage2');
  let loopTimeout;

  // function to show the corresponding slide for an instruction
  const showSlide = (index) => {
    slides.forEach((slide, idx) => {
      slide.style.display = idx === index ? 'block' : 'none'; // Show only the corresponding slide
    });
  };

  // function to activate a specific instruction and its text, and show corresponding slide
  const activateInstructionAndSlide = (index) => {
    instructions.forEach((instruction, idx) => {
      const text = instruction.querySelector('.instructiontext');
      if (idx === index) {
        instruction.classList.add('active');
        text.classList.add('active');
      } else {
        instruction.classList.remove('active');
        text.classList.remove('active');
      }
    });
    currentIndex = index;
    showSlide(currentIndex); // show corresponding slide
  };

  activateInstructionAndSlide(0);

  // loop through descriptions and slides
  const loopDescriptionsAndSlides = () => {
    currentIndex = (currentIndex + 1) % instructions.length;
    activateInstructionAndSlide(currentIndex);
    loopTimeout = setTimeout(loopDescriptionsAndSlides, 3000); // Continue loop every 3 seconds
  };

  // start the looping
  loopTimeout = setTimeout(loopDescriptionsAndSlides, 3000);

  //inject css into elements
  const injectCSS = (css) => {
    let el = document.createElement('style');
    el.innerText = css;
    document.head.appendChild(el);
    return el;
  };

  // add click event to each instruction to synchronize with slides
  instructions.forEach((instruction, index) => {
    instruction.addEventListener('click', () => {
      clearTimeout(loopTimeout); // stop the current loop
      activateInstructionAndSlide(index); // activate the clicked instruction and show its slide
      instruction.classList.add('active');
      instruction.style.transition = 'width 10s ease'; //curr not setting.

      loopTimeout = setTimeout(loopDescriptionsAndSlides, 10000); // Wait 10 seconds before resuming the loop
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  showSlide(1);
});
