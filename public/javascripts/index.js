function watchLoginForm() {
  $( "#login-form" ).on( "submit", ( event ) => {
    event.preventDefault();

    // soon.
    // const email = $('#email').val();
    // const password = $('#password').val();
    window.location = "/notYetProtected.html";
  } );
}

function handleLoginPage() {
  watchLoginForm();
}

$( handleLoginPage );
