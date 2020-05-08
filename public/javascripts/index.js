function clearErrors() {
  $( "#error-msg" ).empty();
}

function displayAuthError() {
  if ( localStorage.authError ) {
    $( "#error-msg" ).append( localStorage.authError );
    $( "#error-msg" ).show();
    localStorage.removeItem( "authError" );
  }
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
        console.log(data)
        if ( data.success ) {
          localStorage.authToken = data.authToken;
          localStorage.userId = data.user.id;
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
  clearErrors();
  displayAuthError();
  watchLoginForm();
}

$( handleLoginPage );
