function watchLoginForm() {
  $( "#login-form" ).on( "submit", ( event ) => {
    event.preventDefault();
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
    } ) // /api/auth/login returns contents of req.user
      .then( ( response ) => response.json() )
      .then( ( data ) => {
        localStorage.email = data.email;
        window.location = "notYetProtected.html";
      } );
  } );
}

function handleLoginPage() {
  watchLoginForm();
}

$( handleLoginPage );
