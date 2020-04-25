function clearErrors() {
  $( "#error-msg" ).empty();
}

function watchLoginForm() {
  $( "#login-form" ).on( "submit", ( event ) => {
    event.preventDefault();
    clearErrors();
    const email = $( "#email" ).val();
    const password = $( "#password" ).val();
    fetch( "/api/auth/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify( {
        email,
        password
      } )
    } )

      .then( ( res ) => res.json() )
      .then( ( data ) => {
        if ( data.success ) {
          localStorage.authToken = data.authToken;
          window.location = "profile.html";
        } else {
          $( "#error-msg" ).show();
          $( "#error-msg" ).append( data.message );
        }
      } );
  } );
}

function handleLoginPage() {
  $( "#error-msg" ).hide();
  watchLoginForm();
}

$( handleLoginPage );
