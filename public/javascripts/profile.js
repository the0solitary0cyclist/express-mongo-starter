function handleCurrentUserData( data ) {
  if ( data.email ) {
      // this is the page where you can update your email or password
    $( "#current-user-email" ).append( `<div>${data.email}</div>` );
  }

  // else {
  //   TBD
  // }
}

function fetchCurrentUser() {
  fetch( `/api/users/${localStorage.userId}`, {
    method: "Get",
    headers: {
      "Content-Type": "application/json",
      authorization: `bearer ${localStorage.authToken}`
    }
  } )
    .then( ( response ) => {
      if ( response.status == 401 ) {
        localStorage.authError = "Unauthorized. Please Log In.";
        window.location = "index.html";
      } else {
        return response.json();
      }
    } )
    .then( ( data ) => handleCurrentUserData( data ) );
}

function handleProfile() {
  fetchCurrentUser();
}

$( handleProfile );
