<?php
require_once( 'libs/autoload.php' );

spl_autoload_register( function ( $classname ) {
	$dirs = array(
		'rest/', // Well... the Framework?!
		'users/' // User Module
	);
	foreach ( $dirs as $dir ) {
		$originalFile = $dir . $classname . '.php';
		if ( file_exists( $originalFile ) ) {
			$classNameAlias = $dir . $classname . '.php';
			require_once( $originalFile );
			class_alias( $classname, $classNameAlias );

			return true;
		}
	}
	return false;
});

function error_handler() {
	$last_error = error_get_last();
	if ( $last_error ) {
		ob_end_clean(); # try to purge content sent so far
		header( 'HTTP/1.1 500 Internal Server Error' );
		$data['error']  = 'Internal Server Error';
		$data['status'] = 500;
		$view           = new JsonView();
		$view->render( $data );

		return true;
	}
}

register_shutdown_function( 'error_handler' );
set_error_handler( 'error_handler' );
set_exception_handler( 'error_handler' );
ini_set( 'display_errors', 'off' );
error_reporting( E_ALL );

$login = new LoginSystem();
$request = new Request();

$user = $request->getUser();
if (! $user->isLoggedIn()) {
	$username = $user->getName();
	$token = $login->token( $username );
	if (!isset($token)) {
		return $login->login($username, $request->parameters['password']);
	} else {
		return $login->sendToken( $username );
	}
}

function respondTokenIfRequired( $username, $password ) {
	if ( $username && ! isset( $password ) ) {
		$hash = substr(str_shuffle(MD5(microtime())), 0, 10);
		$data = [ 'token' => $hash ];
		$view = new JsonView();
		$view->render( $data );
		return false;
	}
	return true;
}

if ( $request->verb == "POST" ) {
	/*
   * Simple sanitization
   */
	$username = $request->parameters['username'];
	$password = $request->parameters['password'];
	if (!respondTokenIfRequired( $username, $password )) {
		try {

			error_log("got something: '" + $username + "' and '"+$password+"'");
			/*
	   * We will fetch user id and password fields for the given username
	   */
			$rs = $stmt->fetch();

			if ( $rs ) {
				if ( password_verify( $password, $rs['password'] ) ) {
			
					$tokenId    = base64_encode( mcrypt_create_iv( 32 ) );
					$issuedAt   = time();
					$notBefore  = $issuedAt + 10;             //Adding 10 seconds
					$expire     = $notBefore + 120;           // Adding 120 seconds
					$serverName = $config->get( 'serverName' ); // Retrieve the server name from config file

					/*
				   * Create the token as an array
				   */
					$data = [
						'iat'  => $issuedAt,         // Issued at: time when the token was generated
						'jti'  => $tokenId,          // Json Token Id: an unique identifier for the token
						'iss'  => $serverName,       // Issuer
						'nbf'  => $notBefore,        // Not before
						'exp'  => $expire,           // Expire
						'data' => [                  // Data related to the signer user
							'userId'   => $rs['id'], // userid from the users table
							'userName' => $username, // User name
						]
					];

					/*
				 * Extract the key, which is coming from the config file. 
				 * 
				 * Best suggestion is the key to be a binary string and 
				 * store it in encoded in a config file. 
				 *
				 * Can be generated with base64_encode(openssl_random_pseudo_bytes(64));
				 *
				 * keep it secure! You'll need the exact key to verify the 
				 * token later.
				 */
					$secretKey = base64_decode( $config->get( 'jwtKey' ) );

					/*
		   * Extract the algorithm from the config file too
		   */
					$algorithm = $config->get( 'jwt' )->get( 'algorithm' );

					/*
		   * Encode the array to a JWT string.
		   * Second parameter is the key to encode the token.
		   * 
		   * The output string can be validated at http://jwt.io/
		   */
					$jwt = JWT::encode(
						$data,      //Data to be encoded in the JWT
						$secretKey, // The signing key
						$algorithm  // Algorithm used to sign the token
					);

					$unencodedArray = [ 'jwt' => $jwt ];
					echo json_encode( $unencodedArray );
				} else {
					header( 'HTTP/1.0 401 Unauthorized' );
				}
			} else {
				header( 'HTTP/1.0 404 Not Found' );
			}
		} catch ( Exception $e ) {
			header( 'HTTP/1.0 500 Internal Server Error' );
		}
	}
} else {

	if ( ! $request->isLoggedIn() ) {
		header( "Location: /login" );
	}


	// route the request to the right place
	$controller_name = ucfirst( $request->url_elements[1] ) . 'Controller';
	if ( class_exists( $controller_name ) ) {
		try {
			$controller  = new $controller_name();
			$action_name = strtolower( $request->verb ) . 'Action';
			$result      = $controller->$action_name( $request );

			if ( empty( $result ) ) {
				header( 'HTTP/1.0 404 Not Found' );
				exit();
			}
			$view_name = ucfirst( $request->format ) . 'View';
			if ( class_exists( $view_name ) ) {
				$view = new $view_name();
				$view->render( $result );
			}
		} catch ( Exception $e ) {
			header( 'Bad request. Sorry', true, 412 );
			exit();
		}
	} else {
		header( 'HTTP/1.0 404 Not Found' );
		exit();
	}
}


// http://www.lornajane.net/posts/2012/building-a-restful-php-server-understanding-the-request
