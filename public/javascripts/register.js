function clearErrors() {
  $( "#error-msg" ).empty();
}

function watchRegisterForm() {
  $( "#register-form" ).on( "submit", ( event ) => {
    event.preventDefault();
    clearErrors();
    const email = $( "#email" ).val();
    const password = $( "#password" ).val();
    const confirmPassword = $( "#confirm-password" ).val();
    fetch( "/api/users", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify( {
        email,
        password,
        confirmPassword
      } )
    } )

      .then( ( res ) => res.json() )
      .then( ( data ) => {
        console.log( data );
        if (data.reason == 'ValidationError') {
          $( "#error-msg" ).show();
          $( "#error-msg" ).append( data.message );
        }
        else {
          window.location = '/'
        }
      } );
  } );
}

function handleRegisterPage() {
  $( "#error-msg" ).hide();
  watchRegisterForm();
}

$( handleRegisterPage );
