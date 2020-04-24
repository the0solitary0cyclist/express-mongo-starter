function handleCurrentUserData( data ) {
  $( "#current-user-email" ).append( `<div>${data}</div>` );

  // this is the page where you can update your email or password
}

function fetchCurrentUser() {
  handleCurrentUserData( localStorage.email );
}

function handleProfilePage() {
  fetchCurrentUser();
}

$( handleProfilePage );
